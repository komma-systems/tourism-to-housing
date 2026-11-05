// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title RetornResolver
/// @notice ENS resolver for retorn.eth and every name under it (poblenou.retorn.eth,
///         gracia.retorn.eth, ...). Implements ENSIP-10 wildcard resolution, so the
///         ENSv2 Universal Resolver can resolve any subname through this one
///         contract without a subregistry. Records are keyed by the full name's
///         namehash and mirror the impact state of the fund on Arc
///         (impact.star, impact.homes, ...), synced by the fund's operator.
contract RetornResolver is Ownable {
    mapping(bytes32 => address) private _addr; // coinType 60 (EVM default)
    mapping(bytes32 => mapping(uint256 => bytes)) private _coinAddr; // ENSIP-9/11
    mapping(bytes32 => mapping(string => string)) private _text; // ENSIP-5

    event AddrChanged(bytes32 indexed node, address a);
    event AddressChanged(bytes32 indexed node, uint256 coinType, bytes newAddress);
    event TextChanged(bytes32 indexed node, string indexed indexedKey, string key, string value);

    constructor(address initialOwner) Ownable(initialOwner) {}

    // --- writes (fund operator) ---

    function setAddr(bytes32 node, address a) public onlyOwner {
        _addr[node] = a;
        emit AddrChanged(node, a);
    }

    function setAddr(bytes32 node, uint256 coinType, bytes calldata a) external onlyOwner {
        _coinAddr[node][coinType] = a;
        emit AddressChanged(node, coinType, a);
    }

    function setText(bytes32 node, string calldata key, string calldata value) external onlyOwner {
        _text[node][key] = value;
        emit TextChanged(node, key, key, value);
    }

    /// @notice Set many records in one transaction (encoded calls to this contract).
    function setRecords(bytes[] calldata calls) external onlyOwner {
        for (uint256 i; i < calls.length; i++) {
            (bool ok, ) = address(this).delegatecall(calls[i]);
            require(ok, "record failed");
        }
    }

    // --- reads ---

    function addr(bytes32 node) public view returns (address payable) {
        return payable(_addr[node]);
    }

    function addr(bytes32 node, uint256 coinType) public view returns (bytes memory) {
        if (coinType == 60) {
            address a = _addr[node];
            return a == address(0) ? bytes("") : abi.encodePacked(a);
        }
        return _coinAddr[node][coinType];
    }

    function text(bytes32 node, string calldata key) public view returns (string memory) {
        return _text[node][key];
    }

    /// @notice ENSIP-10: answer any resolver call for any name under retorn.eth.
    ///         `data` is the encoded inner call (addr / text / multicall) carrying
    ///         the full name's node, so we answer it against our own storage.
    function resolve(bytes calldata, bytes calldata data) external view returns (bytes memory) {
        (bool ok, bytes memory result) = address(this).staticcall(data);
        require(ok, "unsupported");
        return result;
    }

    function multicall(bytes[] calldata data) external view returns (bytes[] memory results) {
        results = new bytes[](data.length);
        for (uint256 i; i < data.length; i++) {
            (bool ok, bytes memory r) = address(this).staticcall(data[i]);
            require(ok, "unsupported");
            results[i] = r;
        }
    }

    function supportsInterface(bytes4 id) external pure returns (bool) {
        return
            id == 0x01ffc9a7 || // ERC-165
            id == 0x9061b923 || // IExtendedResolver (ENSIP-10)
            id == 0x3b3b57de || // addr(bytes32)
            id == 0xf1cb7e06 || // addr(bytes32,uint256)
            id == 0x59d1d43c; // text(bytes32,string)
    }
}
