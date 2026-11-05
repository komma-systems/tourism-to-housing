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
/// @notice A single-rate lending vault, the on-chain bank for housing commons.
///         Hosts deposit EURC and earn the pool's rate; the pool lends that EURC
///         to registered housing commons at the SAME rate, and the commons repay
///         principal plus interest from their use-fees (the rate a co-op would pay
///         an ethical bank, now from aligned capital). The depositor's yield is
///         real borrower interest, not an external subsidy.
/// @dev One pool per star tier: 2.5% = ★★★, 3% = ★★, 3.5% = ★ (a lower accepted
///      return earns a higher star, since it lends cheaper to housing). ERC-4626
///      with receivable accounting: lending is value-neutral, interest accrues to
///      share value. Pattern follows Morpho/own.casa (yield from borrower interest).
contract TourismImpactPool is ERC4626, Ownable {
    ImpactCertificate public immutable certificate;
    HousingCommonsRegistry public immutable registry;
    ProofOfImpact public immutable proof;

    uint16 public immutable rateBps; // lend rate = depositor rate (250 / 300 / 350)
    uint8 public immutable star; // 3 / 2 / 1

    struct Loan {
        uint256 principal;
        uint64 since;
    }
    mapping(uint256 => Loan) public loanOf; // commonsId => loan
    uint256[] public activeLoans;
    uint256 public principalOutstanding;

    event Contributed(address indexed host, uint256 assets);
    event CreditDisbursed(uint256 indexed commonsId, address indexed to, uint256 amount);
    event LoanRepaid(uint256 indexed commonsId, uint256 principal, uint256 interest);

    constructor(
        IERC20 eurc,
        ImpactCertificate _certificate,
        HousingCommonsRegistry _registry,
        ProofOfImpact _proof,
        address initialOwner,
        uint16 _rateBps,
        uint8 _star
    ) ERC20(_name(_star), _symbol(_star)) ERC4626(eurc) Ownable(initialOwner) {
        certificate = _certificate;
        registry = _registry;
        proof = _proof;
        rateBps = _rateBps;
        star = _star;
    }

    function _name(uint8 s) private pure returns (string memory) {
        return s == 3 ? "Retorn Pool 2.5%" : s == 2 ? "Retorn Pool 3%" : "Retorn Pool 3.5%";
    }
    function _symbol(uint8) private pure returns (string memory) {
        return "rEURC";
    }

    // --- Yield accounting: loans are receivables, interest accrues to share value ---

    function _accrued(Loan memory l) internal view returns (uint256) {
        if (l.principal == 0) return 0;
        uint256 elapsed = block.timestamp - l.since;
        return (l.principal * rateBps * elapsed) / (10000 * 365 days);
    }

    /// @notice Interest accrued but not yet repaid, across all outstanding loans.
    function accruedInterest() public view returns (uint256 total) {
        for (uint256 i; i < activeLoans.length; i++) total += _accrued(loanOf[activeLoans[i]]);
    }

    /// @dev Vault value = idle cash + principal lent out + interest accrued. So
    ///      lending is value-neutral (cash becomes a receivable) and interest lifts
    ///      the share price. This is the fix a lending vault needs.
    function totalAssets() public view override returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) + principalOutstanding + accruedInterest();
    }

    /// @dev You can only withdraw idle cash, not capital that is lent out.
    function maxWithdraw(address owner_) public view override returns (uint256) {
        uint256 shareValue = super.maxWithdraw(owner_);
        uint256 cash = IERC20(asset()).balanceOf(address(this));
        return shareValue < cash ? shareValue : cash;
    }

    function maxRedeem(address owner_) public view override returns (uint256) {
        uint256 shares = super.maxRedeem(owner_);
        uint256 cash = IERC20(asset()).balanceOf(address(this));
        uint256 redeemableByCash = convertToShares(cash);
        return shares < redeemableByCash ? shares : redeemableByCash;
    }

    /// @dev On deposit, set the host's star to this pool's tier.
    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override {
        super._deposit(caller, receiver, assets, shares);
        certificate.setStar(receiver, star);
        emit Contributed(receiver, assets);
    }

    // --- Lending to commons ---

    /// @notice Lend idle pool capital to a registered commons at the pool rate.
    ///         Governor-only (the LVC/UG recusal is minuted off-chain).
    function disburseCredit(uint256 commonsId, address to, uint256 amount) external onlyOwner {
        require(registry.ownerOf(commonsId) != address(0), "unknown commons");
        require(amount <= IERC20(asset()).balanceOf(address(this)), "insufficient cash");
        Loan storage l = loanOf[commonsId];
        if (l.principal == 0) activeLoans.push(commonsId);
        else l.principal += _accrued(l); // capitalise accrued before adding
        l.principal += amount;
        l.since = uint64(block.timestamp);
        principalOutstanding += amount;
        registry.setStatus(commonsId, HousingCommonsRegistry.Status.Funded);
        require(IERC20(asset()).transfer(to, amount), "transfer failed");
        emit CreditDisbursed(commonsId, to, amount);
    }

    /// @notice Repay a commons' loan in full (principal + accrued interest). The
    ///         interest stays in the pool as yield, lifting every depositor's share.
    function repayInFull(uint256 commonsId) external {
        Loan memory l = loanOf[commonsId];
        require(l.principal > 0, "no loan");
        uint256 interest = _accrued(l);
        uint256 due = l.principal + interest;
        require(IERC20(asset()).transferFrom(msg.sender, address(this), due), "transfer failed");
        principalOutstanding -= l.principal;
        delete loanOf[commonsId];
        _removeActive(commonsId);
        if (proof.isDelivered(commonsId)) {
            registry.setStatus(commonsId, HousingCommonsRegistry.Status.Delivered);
        }
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

    function activeLoanCount() external view returns (uint256) {
        return activeLoans.length;
    }
}
