// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ImpactCertificate} from "./ImpactCertificate.sol";
import {HousingCommonsRegistry} from "./HousingCommonsRegistry.sol";
import {ProofOfImpact} from "./ProofOfImpact.sol";

/// @title TourismImpactPool
/// @notice The on-chain bank for housing commons. Hosts deposit EURC and earn a
///         flat, fair 3% (below the 4 to 8% DeFi market, above a bank deposit, and
///         what a co-op already pays an ethical bank). The pool lends that EURC to
///         registered housing commons at the same 3%; the commons repay principal
///         plus interest from their use-fees. The depositor's yield is real
///         borrower interest, not a subsidy.
/// @dev The STAR is PROPORTIONAL: a host's contribution measured against its own
///      yearly base (revenue or profit), so it is size-neutral, a small host that
///      gives a high share of its takings ranks as highly as a large one. The base
///      is set by the governor from the host's accounts (automatable in production)
///      and re-assessed yearly, like a Michelin guide. Homes funded are tracked for
///      display as the verified impact. ERC-4626 with receivable accounting:
///      lending is value-neutral, interest accrues to share value (own.casa / Morpho).
contract TourismImpactPool is ERC4626, Ownable {
    ImpactCertificate public immutable certificate;
    HousingCommonsRegistry public immutable registry;
    ProofOfImpact public immutable proof;

    uint16 public immutable rateBps; // flat lend = deposit rate (300 = 3%)

    // Star thresholds as a share of the host's yearly base, in basis points.
    // Defaults: ★ = 10%, ★★ = 20%, ★★★ = 35%.
    uint16 public tier1Bps = 1000;
    uint16 public tier2Bps = 2000;
    uint16 public tier3Bps = 3500;

    mapping(address => uint256) public contributedThisYear; // host => EURC contributed this year
    mapping(address => uint256) public yearlyBase; // host => yearly revenue/profit (set by governor)
    mapping(address => uint32) public homesFundedBy; // host => delivered homes funded (display)
    mapping(uint256 => address) public fundingHost; // commonsId => funding host

    struct Loan {
        uint256 principal;
        uint64 since;
    }
    mapping(uint256 => Loan) public loanOf;
    uint256[] public activeLoans;
    uint256 public principalOutstanding;

    event Contributed(address indexed host, uint256 assets, uint8 star);
    event BaseSet(address indexed host, uint256 yearlyBase, uint8 star);
    event YearRolled(address indexed host);
    event CreditDisbursed(uint256 indexed commonsId, address indexed to, address indexed host, uint256 amount);
    event DeliveryRecognised(uint256 indexed commonsId, address indexed host, uint32 homes);
    event LoanRepaid(uint256 indexed commonsId, uint256 principal, uint256 interest);

    constructor(
        IERC20 eurc,
        ImpactCertificate _certificate,
        HousingCommonsRegistry _registry,
        ProofOfImpact _proof,
        address initialOwner,
        uint16 _rateBps
    ) ERC20("Retorn Housing Fund", "rEURC") ERC4626(eurc) Ownable(initialOwner) {
        certificate = _certificate;
        registry = _registry;
        proof = _proof;
        rateBps = _rateBps;
    }

    // --- Proportional star ---

    /// @notice A host's contribution as a share of its yearly base, in bps.
    function contributionBps(address host) public view returns (uint256) {
        uint256 base = yearlyBase[host];
        if (base == 0) return 0;
        return (contributedThisYear[host] * 10000) / base;
    }

    function starFor(address host) public view returns (uint8) {
        uint256 bps = contributionBps(host);
        if (bps >= tier3Bps) return 3;
        if (bps >= tier2Bps) return 2;
        if (bps >= tier1Bps) return 1;
        return 0;
    }

    function _refreshStar(address host) internal returns (uint8 s) {
        s = starFor(host);
        certificate.setStar(host, s);
    }

    /// @notice Set a host's yearly base (revenue or profit) from its accounts, and
    ///         re-rate its star. In production this is automated from the host's books.
    function setYearlyBase(address host, uint256 base) external onlyOwner {
        yearlyBase[host] = base;
        emit BaseSet(host, base, _refreshStar(host));
    }

    function setThresholds(uint16 t1, uint16 t2, uint16 t3) external onlyOwner {
        tier1Bps = t1;
        tier2Bps = t2;
        tier3Bps = t3;
    }

    /// @notice Roll a host into a new year: archive the rating period and reset the
    ///         running contribution, so the star is re-earned yearly (Michelin-style).
    function rollYear(address host) external onlyOwner {
        contributedThisYear[host] = 0;
        certificate.setStar(host, 0);
        emit YearRolled(host);
    }

    // --- Yield accounting ---

    function _accrued(Loan memory l) internal view returns (uint256) {
        if (l.principal == 0) return 0;
        uint256 elapsed = block.timestamp - l.since;
        return (l.principal * rateBps * elapsed) / (10000 * 365 days);
    }

    function accruedInterest() public view returns (uint256 total) {
        for (uint256 i; i < activeLoans.length; i++) total += _accrued(loanOf[activeLoans[i]]);
    }

    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) + principalOutstanding + accruedInterest();
    }

    function maxWithdraw(address owner_) public view override returns (uint256) {
        uint256 v = super.maxWithdraw(owner_);
        uint256 cash = IERC20(asset()).balanceOf(address(this));
        return v < cash ? v : cash;
    }

    function maxRedeem(address owner_) public view override returns (uint256) {
        uint256 s = super.maxRedeem(owner_);
        uint256 byCash = convertToShares(IERC20(asset()).balanceOf(address(this)));
        return s < byCash ? s : byCash;
    }

    /// @dev On deposit, record the contribution and re-rate the host's star.
    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override {
        super._deposit(caller, receiver, assets, shares);
        contributedThisYear[receiver] += assets;
        emit Contributed(receiver, assets, _refreshStar(receiver));
    }

    // --- Lending to commons, attributed to a funding host (impact display) ---

    function disburseCredit(uint256 commonsId, address to, uint256 amount, address host) external onlyOwner {
        require(registry.ownerOf(commonsId) != address(0), "unknown commons");
        require(amount <= IERC20(asset()).balanceOf(address(this)), "insufficient cash");
        Loan storage l = loanOf[commonsId];
        if (l.principal == 0) {
            activeLoans.push(commonsId);
            fundingHost[commonsId] = host;
        } else {
            l.principal += _accrued(l);
        }
        l.principal += amount;
        l.since = uint64(block.timestamp);
        principalOutstanding += amount;
        registry.setStatus(commonsId, HousingCommonsRegistry.Status.Funded);
        require(IERC20(asset()).transfer(to, amount), "transfer failed");
        emit CreditDisbursed(commonsId, to, host, amount);
    }

    function recognizeDelivery(uint256 commonsId) external onlyOwner {
        require(proof.isDelivered(commonsId), "not attested");
        address h = fundingHost[commonsId];
        require(h != address(0), "no funding host");
        (, , , uint32 homes, , , ) = registry.commons(commonsId);
        homesFundedBy[h] += homes;
        registry.setStatus(commonsId, HousingCommonsRegistry.Status.Delivered);
        emit DeliveryRecognised(commonsId, h, homes);
    }

    function repayInFull(uint256 commonsId) external {
        Loan memory l = loanOf[commonsId];
        require(l.principal > 0, "no loan");
        uint256 interest = _accrued(l);
        uint256 due = l.principal + interest;
        require(IERC20(asset()).transferFrom(msg.sender, address(this), due), "transfer failed");
        principalOutstanding -= l.principal;
        delete loanOf[commonsId];
        _removeActive(commonsId);
        emit LoanRepaid(commonsId, l.principal, interest);
    }

    function amountDue(uint256 commonsId) external view returns (uint256) {
        Loan memory l = loanOf[commonsId];
        return l.principal + _accrued(l);
    }

    function _removeActive(uint256 commonsId) private {
        uint256 n = activeLoans.length;
        for (uint256 i; i < n; i++) {
            if (activeLoans[i] == commonsId) {
                activeLoans[i] = activeLoans[n - 1];
                activeLoans.pop();
                return;
            }
        }
    }

    function creditExtended() external view returns (uint256) {
        return principalOutstanding;
    }
}
