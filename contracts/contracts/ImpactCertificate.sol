// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ImpactCertificate
/// @notice The verified star a host earns: ★ / ★★ / ★★★. The star is set by the
///         lending pool the host deposits into (a lower accepted return earns a
///         higher star). Non-transferable (soulbound) so the reputation can't be
///         traded, and revocable.
/// @dev One certificate per host. Each pool is an authorised minter and sets its
///      own star. ★ worth a stay / ★★ worth a detour / ★★★ worth the journey.
contract ImpactCertificate is ERC721, Ownable {
    uint8 public constant STAR_NONE = 0;
    uint8 public constant STAR_ONE = 1; // 3.5% pool, worth a stay
    uint8 public constant STAR_TWO = 2; // 3% pool, worth a detour
    uint8 public constant STAR_THREE = 3; // 2.5% pool, worth the journey

    mapping(address => uint256) public tokenOf; // host => tokenId (0 = none)
    mapping(uint256 => uint8) public star;
    mapping(address => bool) public isMinter; // the pools
    uint256 public nextId = 1;

    event MinterSet(address indexed minter, bool allowed);
    event CertificateIssued(address indexed host, uint256 indexed tokenId, uint8 star);
    event StarChanged(uint256 indexed tokenId, uint8 star);
    event CertificateRevoked(uint256 indexed tokenId);

    constructor(address initialOwner) ERC721("Retorn Impact Certificate", "STAY") Ownable(initialOwner) {}

    function setMinter(address minter, bool allowed) external onlyOwner {
        isMinter[minter] = allowed;
        emit MinterSet(minter, allowed);
    }

    /// @notice Issue or raise a host's star. Called by a pool on deposit. A host
    ///         keeps the highest star across the pools it has joined.
    function setStar(address host, uint8 newStar) external {
        require(isMinter[msg.sender], "not a pool");
        require(newStar <= STAR_THREE, "bad star");
        uint256 id = tokenOf[host];
        if (id == 0) {
            id = nextId++;
            tokenOf[host] = id;
            _safeMint(host, id);
            emit CertificateIssued(host, id, newStar);
        }
        if (newStar > star[id]) {
            star[id] = newStar;
            emit StarChanged(id, newStar);
        }
    }

    function revoke(address host) external onlyOwner {
        uint256 id = tokenOf[host];
        require(id != 0, "no certificate");
        _burn(id);
        delete tokenOf[host];
        delete star[id];
        emit CertificateRevoked(id);
    }

    function starOf(address host) external view returns (uint8) {
        return star[tokenOf[host]];
    }

    /// @dev Soulbound: block all transfers, allow only mint and burn.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }
}
