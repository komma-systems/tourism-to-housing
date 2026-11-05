// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {HousingCommonsRegistry} from "./HousingCommonsRegistry.sol";

/// @title ProofOfImpact
/// @notice The proof step: stewards attest the homes and square metres actually
///         delivered for a funded commons. Attestations are the only thing that
///         moves a commons to Delivered, and the pool reads them to recycle the
///         use-fee return. Success is counted in homes and square metres, nothing else.
contract ProofOfImpact {
    HousingCommonsRegistry public immutable registry;

    struct Attestation {
        uint32 homesDelivered;
        uint32 squareMetresDelivered;
        uint64 timestamp;
        string evidenceURI; // off-chain evidence (photos, occupancy, legal lock)
        bool exists;
    }

    mapping(uint256 => Attestation) public attestationOf; // commonsId => attestation

    event ImpactAttested(
        uint256 indexed commonsId,
        address indexed steward,
        uint32 homesDelivered,
        uint32 squareMetresDelivered
    );

    constructor(HousingCommonsRegistry _registry) {
        registry = _registry;
    }

    /// @notice Only the steward recorded for a commons may attest its delivery.
    function attest(
        uint256 commonsId,
        uint32 homesDelivered,
        uint32 squareMetresDelivered,
        string calldata evidenceURI
    ) external {
        require(msg.sender == registry.stewardOf(commonsId), "not the steward");
        attestationOf[commonsId] = Attestation({
            homesDelivered: homesDelivered,
            squareMetresDelivered: squareMetresDelivered,
            timestamp: uint64(block.timestamp),
            evidenceURI: evidenceURI,
            exists: true
        });
        emit ImpactAttested(commonsId, msg.sender, homesDelivered, squareMetresDelivered);
    }

    function isDelivered(uint256 commonsId) external view returns (bool) {
        return attestationOf[commonsId].exists;
    }
}
