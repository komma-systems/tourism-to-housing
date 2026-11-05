// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockEURC
/// @notice 6-decimal euro stablecoin stand-in for local tests and testnet demos
///         where canonical EURC is not deployed. On Arc, use the native EURC instead.
contract MockEURC is ERC20 {
    constructor() ERC20("Euro Coin (mock)", "EURC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
