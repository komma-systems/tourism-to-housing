// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ImpactCertificate
/// @notice The verified, tiered credential operators earn by contributing to the
///         pool: a star in a credible guide to impact-positive stays. Non-transferable
///         (soulbound) so the reputation can't be traded away, and revocable.
/// @dev One certificate per operator; tier is set by the pool from cumulative
///      contribution. ★ worth a stay / ★★ worth a detour / ★★★ worth the journey.
contract ImpactCertificate is ERC721, Ownable {
    uint8 public constant TIER_NONE = 0;
    uint8 public constant TIER_ONE = 1; // worth a stay
    uint8 public constant TIER_TWO = 2; // worth a detour
    uint8 public constant TIER_THREE = 3; // worth the journey

    mapping(address => uint256) public tokenOf; // operator => tokenId (0 = none)
    mapping(uint256 => uint8) public tier;
    uint256 public nextId = 1;

    event CertificateIssued(address indexed operator, uint256 indexed tokenId, uint8 tier);
    event TierChanged(uint256 indexed tokenId, uint8 tier);
    event CertificateRevoked(uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("Tourism Impact Certificate", "STAY") Ownable(initialOwner) {}

    /// @notice Issue or upgrade an operator's certificate. Called by the pool (owner).
    function setTier(address operator, uint8 newTier) external onlyOwner {
        require(newTier <= TIER_THREE, "bad tier");
        uint256 id = tokenOf[operator];
        if (id == 0) {
            id = nextId++;
            tokenOf[operator] = id;
            _safeMint(operator, id);
            emit CertificateIssued(operator, id, newTier);
        }
        tier[id] = newTier;
        emit TierChanged(id, newTier);
    }

    function revoke(address operator) external onlyOwner {
        uint256 id = tokenOf[operator];
        require(id != 0, "no certificate");
        _burn(id);
        delete tokenOf[operator];
        delete tier[id];
        emit CertificateRevoked(id);
    }

    function tierOf(address operator) external view returns (uint8) {
        return tier[tokenOf[operator]];
    }

    /// @dev Soulbound: block all transfers, allow only mint and burn.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }
}
