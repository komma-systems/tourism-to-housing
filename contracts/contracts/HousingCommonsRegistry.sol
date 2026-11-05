// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title HousingCommonsRegistry
/// @notice On-chain registry of the housing and land commons the pool funds.
/// @dev Pattern forked from the GALT Project's SPACE / Private Property Registry
///      (galtproject): an ERC-721 where each token carries geographic data and a
///      pointer to the legal wrapper that locks the home out of the speculative
///      market. Ported to modern Solidity and trimmed to what the demonstrator needs.
contract HousingCommonsRegistry is ERC721, Ownable {
    enum Status {
        Proposed, // registered, not yet funded
        Funded, // pool has lent against it
        Delivered // homes verified delivered by stewards
    }

    struct Commons {
        string name; // e.g. "La Borda, Barcelona"
        string geohash; // location, GALT-style geographic anchor
        string legalWrapper; // ref/URI to the legal entity (CLT, co-op); see OtoCo pattern
        uint32 homes; // number of permanently affordable homes
        uint32 squareMetres; // area of housing-and-land commons
        Status status;
        address steward; // who may attest delivery
    }

    uint256 public nextId = 1;
    mapping(uint256 => Commons) public commons;

    /// @dev Authorised pools may move a commons' status (Funded/Delivered); the
    ///      owner (governor) registers commons. Several pools (one per rate tier)
    ///      are authorised, so lending from any of them reflects on the registry.
    mapping(address => bool) public isPool;

    event CommonsRegistered(uint256 indexed id, string name, address steward);
    event StatusChanged(uint256 indexed id, Status status);
    event PoolSet(address pool, bool allowed);

    constructor(address initialOwner) ERC721("Housing Commons", "COMMONS") Ownable(initialOwner) {}

    function setPool(address pool, bool allowed) external onlyOwner {
        isPool[pool] = allowed;
        emit PoolSet(pool, allowed);
    }

    /// @notice Register a housing/land commons. Owner is the pool operator/DAO.
    function register(
        address holder,
        string calldata name,
        string calldata geohash,
        string calldata legalWrapper,
        uint32 homes,
        uint32 squareMetres,
        address steward
    ) external onlyOwner returns (uint256 id) {
        id = nextId++;
        commons[id] = Commons({
            name: name,
            geohash: geohash,
            legalWrapper: legalWrapper,
            homes: homes,
            squareMetres: squareMetres,
            status: Status.Proposed,
            steward: steward
        });
        _safeMint(holder, id);
        emit CommonsRegistered(id, name, steward);
    }

    function setStatus(uint256 id, Status status) external {
        require(msg.sender == owner() || isPool[msg.sender], "not authorised");
        require(_ownerOf(id) != address(0), "unknown commons");
        commons[id].status = status;
        emit StatusChanged(id, status);
    }

    function stewardOf(uint256 id) external view returns (address) {
        return commons[id].steward;
    }
}
