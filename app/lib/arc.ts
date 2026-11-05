import { createPublicClient, defineChain, http } from "viem";

// Circle Arc testnet. Gas is native USDC (18 decimals at the protocol level).
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.io"] } },
  blockExplorers: { default: { name: "Arcscan", url: "https://testnet.arcscan.app" } },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

export function explorerAddress(addr: string): string {
  return `https://testnet.arcscan.app/address/${addr}`;
}
