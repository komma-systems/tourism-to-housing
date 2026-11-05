// LIVE adapter: reads the data-contract shape straight from the Arc contracts.
// Same shape as the mock adapter, so the UI swaps with no field changes. Writes
// go through the Studio (wagmi), so they throw here.
import { publicClient } from "./arc";
import { addresses, poolAbi, registryAbi, certificateAbi, proofAbi, erc20Abi } from "./contracts";
import { HOST_METADATA } from "./hosts";
import type { Adapter, Host, Commons, Ledger, Star } from "./adapter";
import { TAGLINE_BY_STAR } from "./adapter";

const EURC = 1_000_000; // 6 decimals
const n = (v: bigint) => Number(v) / EURC;

async function readHost(meta: (typeof HOST_METADATA)[number]): Promise<Host | null> {
  const addr = meta.id as `0x${string}`;
  const [starRaw, bps, homes] = await Promise.all([
    publicClient.readContract({ address: addresses.certificate, abi: certificateAbi, functionName: "starOf", args: [addr] }),
    publicClient.readContract({ address: addresses.pool, abi: poolAbi, functionName: "contributionBps", args: [addr] }),
    publicClient.readContract({ address: addresses.pool, abi: poolAbi, functionName: "homesFundedBy", args: [addr] }),
  ]);
  const star = Number(starRaw) as Star;
  if (star < 1) return null; // only list hosts that have earned a star
  return {
    id: meta.id,
    name: meta.name,
    ensName: meta.ensName,
    city: meta.city,
    territory: meta.territory,
    genre: meta.genre,
    photos: meta.photos,
    story: meta.story,
    pricePerNight: meta.pricePerNight,
    star,
    tagline: TAGLINE_BY_STAR[star],
    returnRate: 3, // flat
    homesFunded: Number(homes),
    capitalCommittedEURC: 0, // filled below from the pool position if needed
    fundedCommons: meta.fundedCommons,
    stamps: meta.stamps,
    // contribution share (bps) is available via the pool for the UI if wanted
    ...(bps !== undefined ? {} : {}),
  };
}

async function readCommons(id: number): Promise<Commons | null> {
  const c = (await publicClient.readContract({
    address: addresses.registry,
    abi: registryAbi,
    functionName: "commons",
    args: [BigInt(id)],
  })) as readonly [string, string, string, number, number, number, string];
  if (!c[0]) return null;
  const att = (await publicClient.readContract({
    address: addresses.proof,
    abi: proofAbi,
    functionName: "attestationOf",
    args: [BigInt(id)],
  })) as readonly [number, number, bigint, string, boolean];
  const status = Number(c[5]) === 2 ? "Delivered" : "Registered";
  return {
    id: String(id),
    name: c[0],
    city: "Barcelona",
    territory: "Barcelona",
    geohash: c[1],
    homes: Number(c[3]),
    sqm: Number(c[4]),
    steward: c[6],
    legalWrapperURI: c[2],
    status,
    attestedHomes: Number(att[0]),
    attestedSqm: Number(att[1]),
  };
}

export const liveAdapter: Adapter = {
  async listHosts() {
    const hosts = await Promise.all(HOST_METADATA.map(readHost));
    return hosts.filter((h): h is Host => h !== null);
  },
  async getHost(id) {
    const meta = HOST_METADATA.find((h) => h.id.toLowerCase() === id.toLowerCase());
    if (!meta) throw new Error(`unknown host ${id}`);
    const h = await readHost(meta);
    if (!h) throw new Error(`host ${id} has no star yet`);
    return h;
  },
  async getCommons(id) {
    const c = await readCommons(Number(id));
    if (!c) throw new Error(`unknown commons ${id}`);
    return c;
  },
  async getLedger(): Promise<Ledger> {
    const [totalAssets, credit, idle, nextId] = await Promise.all([
      publicClient.readContract({ address: addresses.pool, abi: poolAbi, functionName: "totalAssets" }),
      publicClient.readContract({ address: addresses.pool, abi: poolAbi, functionName: "creditExtended" }),
      publicClient.readContract({ address: addresses.eurc, abi: erc20Abi, functionName: "balanceOf", args: [addresses.pool] }),
      publicClient.readContract({ address: addresses.registry, abi: registryAbi, functionName: "nextId" }),
    ]);
    const count = Number(nextId) - 1;
    const commons = (await Promise.all(Array.from({ length: count }, (_, i) => readCommons(i + 1)))).filter(
      (c): c is Commons => c !== null
    );
    const hosts = await this.listHosts();
    return {
      poolValueEURC: n(totalAssets as bigint),
      creditExtendedEURC: n(credit as bigint),
      returnRateByTier: { 3: 2.5, 2: 3, 1: 3.5 }, // retained field; return is a flat 3%
      commonsCount: commons.length,
      homesInCommonsTotal: commons.filter((c) => c.status === "Delivered").reduce((a, c) => a + c.homes, 0),
      tierDistribution: {
        1: hosts.filter((h) => h.star === 1).length,
        2: hosts.filter((h) => h.star === 2).length,
        3: hosts.filter((h) => h.star === 3).length,
      },
      contracts: [
        { label: "TourismImpactPool", address: addresses.pool, arcscanUrl: `https://testnet.arcscan.app/address/${addresses.pool}` },
        { label: "ImpactCertificate", address: addresses.certificate, arcscanUrl: `https://testnet.arcscan.app/address/${addresses.certificate}` },
        { label: "HousingCommonsRegistry", address: addresses.registry, arcscanUrl: `https://testnet.arcscan.app/address/${addresses.registry}` },
        { label: "ProofOfImpact", address: addresses.proof, arcscanUrl: `https://testnet.arcscan.app/address/${addresses.proof}` },
      ],
    };
  },
  async contribute() {
    throw new Error("writes go through the Studio (wagmi)");
  },
  async lend() {
    throw new Error("writes go through the Studio (wagmi)");
  },
  async attest() {
    throw new Error("writes go through the Studio (wagmi)");
  },
};
