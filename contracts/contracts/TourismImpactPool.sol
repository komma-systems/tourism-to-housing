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
/// @notice The ring-fenced Tourism Impact Pool. Operators contribute EURC and
///         receive vault shares (principal stays redeemable). The pool acts as a
///         first-loss guarantee and lends to registered housing commons; use fees
///         recycle back; and every contribution sets the operator's tiered
///         Impact Certificate.
/// @dev ERC-4626 vault, structured on the Octant v2 principal/yield pattern
///      (golemfoundation/octant-v2-core). EURC is the vault asset. The certificate
///      and registry links make the "transparent treasury anyone can verify" literal.
contract TourismImpactPool is ERC4626, Ownable {
    ImpactCertificate public immutable certificate;
    HousingCommonsRegistry public immutable registry;
    ProofOfImpact public immutable proof;

    /// @dev Cumulative EURC contributed per operator, drives certificate tier.
    mapping(address => uint256) public contributed;

    /// @dev Tier thresholds in EURC base units (asset decimals). Owner-tunable.
    uint256 public tier1Threshold;
    uint256 public tier2Threshold;
    uint256 public tier3Threshold;

    /// @dev Operator coupon in basis points (250 = 2.5%). Sits just above the
    ///      Spanish 1-year deposit average (~1.9%) and matches the best retail
    ///      deposits: attractive but clearly concessionary. Funded from pool yield,
    ///      never from residents' use fees: the capital earns, residents pay only an
    ///      affordable fee. Shown to operators as their modest return on principal.
    uint16 public couponBps = 250;

    /// @dev EURC currently lent out against commons (credit extended).
    uint256 public creditExtended;
    mapping(uint256 => uint256) public loanOf; // commonsId => principal outstanding

    event Contributed(address indexed operator, uint256 amount, uint256 cumulative);
    event CreditDisbursed(uint256 indexed commonsId, address indexed to, uint256 amount);
    event UseFeeRepaid(uint256 indexed commonsId, uint256 amount);

    constructor(
        IERC20 eurc,
        ImpactCertificate _certificate,
        HousingCommonsRegistry _registry,
        ProofOfImpact _proof,
        address initialOwner,
        uint256 _t1,
        uint256 _t2,
        uint256 _t3
    ) ERC20("Tourism Impact Pool Share", "tiEURC") ERC4626(eurc) Ownable(initialOwner) {
        certificate = _certificate;
        registry = _registry;
        proof = _proof;
        tier1Threshold = _t1;
        tier2Threshold = _t2;
        tier3Threshold = _t3;
    }

    /// @dev Record the contribution and refresh the certificate tier on every deposit/mint.
    function _deposit(address caller, address receiver, uint256 assets, uint256 shares)
        internal
        override
    {
        super._deposit(caller, receiver, assets, shares);
        uint256 total = contributed[receiver] + assets;
        contributed[receiver] = total;
        certificate.setTier(receiver, _tierFor(total));
        emit Contributed(receiver, assets, total);
    }

    function _tierFor(uint256 total) internal view returns (uint8) {
        if (total >= tier3Threshold) return certificate.TIER_THREE();
        if (total >= tier2Threshold) return certificate.TIER_TWO();
        if (total >= tier1Threshold) return certificate.TIER_ONE();
        return certificate.TIER_NONE();
    }

    /// @notice Lend pool capital to a registered commons. Governor-only (recusal-minuted off-chain).
    function disburseCredit(uint256 commonsId, address to, uint256 amount) external onlyOwner {
        require(registry.ownerOf(commonsId) != address(0), "unknown commons");
        require(amount <= IERC20(asset()).balanceOf(address(this)), "insufficient pool");
        loanOf[commonsId] += amount;
        creditExtended += amount;
        registry.setStatus(commonsId, HousingCommonsRegistry.Status.Funded);
        require(IERC20(asset()).transfer(to, amount), "transfer failed");
        emit CreditDisbursed(commonsId, to, amount);
    }

    /// @notice Repay use fees against a commons' loan. Anyone (typically the steward/co-op) may pay in.
    function repayUseFee(uint256 commonsId, uint256 amount) external {
        require(loanOf[commonsId] >= amount, "overpay");
        require(IERC20(asset()).transferFrom(msg.sender, address(this), amount), "transfer failed");
        loanOf[commonsId] -= amount;
        creditExtended -= amount;
        if (loanOf[commonsId] == 0 && proof.isDelivered(commonsId)) {
            registry.setStatus(commonsId, HousingCommonsRegistry.Status.Delivered);
        }
        emit UseFeeRepaid(commonsId, amount);
    }

    function setThresholds(uint256 t1, uint256 t2, uint256 t3) external onlyOwner {
        tier1Threshold = t1;
        tier2Threshold = t2;
        tier3Threshold = t3;
    }

    /// @notice Total pool value the dashboard reads: idle EURC plus credit extended.
    function totalPoolValue() external view returns (uint256) {
        return IERC20(asset()).balanceOf(address(this)) + creditExtended;
    }
}
