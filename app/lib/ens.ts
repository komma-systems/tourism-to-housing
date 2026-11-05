// ENS resolution layer. Names live on Sepolia (retorn.eth and its subnames).
// The UI resolves a name to its address and reads its impact as ENS text records,
// so names are resolved live through ENS, not hard-coded.
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export const ensClient = createPublicClient({
  chain: sepolia,
  transport: http("https://ethereum-sepolia-rpc.publicnode.com"),
});

/// Resolve e.g. "poblenou.retorn.eth" or "gracia.retorn.eth" to its address.
export async function resolveName(name: string): Promise<`0x${string}` | null> {
  try {
    return await ensClient.getEnsAddress({ name });
  } catch {
    return null;
  }
}

/// Reverse: an address to its primary ENS name, if set.
export async function reverseName(address: `0x${string}`): Promise<string | null> {
  try {
    return await ensClient.getEnsName({ address });
  } catch {
    return null;
  }
}

/// Read an impact text record off a name, e.g. key "impact.star" or "impact.homes".
export async function textRecord(name: string, key: string): Promise<string | null> {
  try {
    return await ensClient.getEnsText({ name, key });
  } catch {
    return null;
  }
}

// The text-record keys we set on each name (ENSIP-5 custom keys namespaced under
// "impact."). The live adapter can prefer these, falling back to the Arc read.
export const ENS_KEYS = {
  star: "impact.star",
  homes: "impact.homes",
  sqm: "impact.sqm",
  share: "impact.share", // contribution share, bps
  city: "impact.city",
  status: "impact.status",
} as const;
