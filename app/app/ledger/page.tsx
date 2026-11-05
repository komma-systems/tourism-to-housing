"use client";

import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { publicClient, explorerAddress } from "@/lib/arc";
import {
  addresses,
  poolAbi,
  registryAbi,
  proofAbi,
  erc20Abi,
  EURC_DECIMALS,
  STATUS_LABEL,
} from "@/lib/contracts";
import { SiteHeader, SiteFooter, VerifiedMark } from "@/components/ui";

type CommonsRow = {
  id: number;
  name: string;
  geohash: string;
  legalWrapper: string;
  homes: number;
  squareMetres: number;
  status: number;
  delivered: boolean;
  homesDelivered: number;
};

type LiveState = {
  poolValue: bigint;
  creditExtended: bigint;
  couponBps: number;
  poolEurc: bigint;
  commons: CommonsRow[];
};

function eur(v: bigint): string {
  const n = Number(formatUnits(v, EURC_DECIMALS));
  if (n >= 1000) return `€${(n / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
  return `€${n.toLocaleString()}`;
}

export default function LedgerPage() {
  const [state, setState] = useState<LiveState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [poolValue, creditExtended, couponBps, poolEurc, nextId] = await Promise.all([
          publicClient.readContract({ address: addresses.pool, abi: poolAbi, functionName: "totalPoolValue" }),
          publicClient.readContract({ address: addresses.pool, abi: poolAbi, functionName: "creditExtended" }),
          publicClient.readContract({ address: addresses.pool, abi: poolAbi, functionName: "couponBps" }),
          publicClient.readContract({ address: addresses.eurc, abi: erc20Abi, functionName: "balanceOf", args: [addresses.pool] }),
          publicClient.readContract({ address: addresses.registry, abi: registryAbi, functionName: "nextId" }),
        ]);

        const count = Number(nextId) - 1;
        const commons: CommonsRow[] = [];
        for (let id = 1; id <= count; id++) {
          const c = (await publicClient.readContract({
            address: addresses.registry,
            abi: registryAbi,
            functionName: "commons",
            args: [BigInt(id)],
          })) as readonly [string, string, string, number, number, number, string];
          const att = (await publicClient.readContract({
            address: addresses.proof,
            abi: proofAbi,
            functionName: "attestationOf",
            args: [BigInt(id)],
          })) as readonly [number, number, bigint, string, boolean];
          commons.push({
            id,
            name: c[0],
            geohash: c[1],
            legalWrapper: c[2],
            homes: Number(c[3]),
            squareMetres: Number(c[4]),
            status: Number(c[5]),
            delivered: att[4],
            homesDelivered: Number(att[0]),
          });
        }

        if (!cancelled)
          setState({
            poolValue: poolValue as bigint,
            creditExtended: creditExtended as bigint,
            couponBps: Number(couponBps),
            poolEurc: poolEurc as bigint,
            commons,
          });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to read chain");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-rust">
          The Ledger · read live from Arc
        </p>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mt-4 max-w-3xl tracking-tight">
          Everything the stars are built on, in the open.
        </h1>
        <p className="text-lg text-ink-soft mt-5 max-w-2xl leading-relaxed">
          Every figure below is read directly from the contracts on Arc testnet, in your browser,
          with no server in between. This is what "verified" means: the guide cannot show a star the
          chain does not back.
        </p>
        <div className="mt-4">
          {state ? (
            <VerifiedMark label="Live from Arc testnet" />
          ) : error ? (
            <span className="font-mono text-xs text-rust">Chain read failed: {error}</span>
          ) : (
            <span className="font-mono text-xs text-ink-soft">Reading the chain…</span>
          )}
        </div>
      </section>

      {/* Live pool figures */}
      <section className="border-y rule bg-paper-deep/60">
        <div className="mx-auto max-w-6xl px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            [state ? eur(state.poolValue) : "—", "pool value (EURC)"],
            [state ? eur(state.creditExtended) : "—", "credit extended"],
            [state ? eur(state.poolEurc) : "—", "idle in pool"],
            [state ? `${(state.couponBps / 100).toFixed(2)}%` : "—", "operator coupon"],
          ].map(([v, l], i) => (
            <div key={i}>
              <div className="font-display text-3xl md:text-4xl leading-none">{v}</div>
              <div className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft mt-1.5">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Commons from the registry */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 mb-6">
          <h2 className="font-display text-2xl">Housing commons on-chain</h2>
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-soft">
            from HousingCommonsRegistry
          </span>
        </div>
        {state && state.commons.length === 0 && (
          <p className="text-ink-soft">
            No commons registered yet. Once the registry is seeded, each funded commons appears here
            with its delivered homes verified by its steward.
          </p>
        )}
        <ul className="divide-y rule">
          {state?.commons.map((c) => (
            <li key={c.id} className="py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="font-display text-xl min-w-48">{c.name}</span>
              <span className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">
                {c.geohash} · {c.legalWrapper}
              </span>
              <span className="text-sm ml-auto">
                <span className="font-semibold">{c.homes}</span>
                <span className="text-ink-soft"> homes · {c.squareMetres} m²</span>
              </span>
              <span
                className="font-mono text-[0.6rem] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full text-paper"
                style={{ backgroundColor: c.status === 2 ? "var(--olive)" : c.status === 1 ? "var(--teal)" : "var(--ink-soft)" }}
              >
                {STATUS_LABEL[c.status] ?? "—"}
              </span>
              {c.delivered && <VerifiedMark label={`${c.homesDelivered} delivered`} />}
            </li>
          ))}
        </ul>
      </section>

      {/* Contract addresses */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="border-b-2 border-ink pb-2 mb-6">
          <h2 className="font-display text-2xl">The contracts</h2>
        </div>
        <ul className="grid md:grid-cols-2 gap-4">
          {[
            ["TourismImpactPool", addresses.pool],
            ["ImpactCertificate", addresses.certificate],
            ["HousingCommonsRegistry", addresses.registry],
            ["ProofOfImpact", addresses.proof],
            ["EURC (Circle)", addresses.eurc],
          ].map(([name, addr]) => (
            <li key={addr} className="flex items-center justify-between gap-4 border rule rounded-[3px] p-3 bg-paper-deep/40">
              <span className="font-mono text-sm">{name}</span>
              <a
                href={explorerAddress(addr)}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-teal hover:text-rust truncate max-w-[14rem]"
              >
                {addr.slice(0, 10)}…{addr.slice(-6)} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </>
  );
}
