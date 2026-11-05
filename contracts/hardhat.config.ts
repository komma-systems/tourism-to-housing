import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// RPC URLs and the deployer key come from the environment; never commit secrets.
const DEPLOYER_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    // Arc (Circle) testnet — anchor chain, EURC-native. Set ARC_RPC_URL.
    arcTestnet: {
      url: process.env.ARC_RPC_URL ?? "",
      accounts: DEPLOYER_KEY ? [DEPLOYER_KEY] : [],
    },
    // Whitechain Sepolia — for the Tokenize / Real-World Finance track.
    whitechainSepolia: {
      url: process.env.WHITECHAIN_RPC_URL ?? "",
      accounts: DEPLOYER_KEY ? [DEPLOYER_KEY] : [],
    },
  },
};

export default config;
