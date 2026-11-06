"use client";

import { useEffect, useState } from "react";
import { resolveName, textRecord, ENS_KEYS } from "@/lib/ens";

type Row = { name: string; address: string | null; detail: string };

// Resolves retorn.eth names live through the ENSv2 Universal Resolver on Sepolia,
// in the browser. Nothing here is hard-coded: if a record changes on ENS, this
// section shows the change on the next load.
export function EnsNames({ commonsNames }: { commonsNames: string[] }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const key = commonsNames.join(",");

  useEffect(() => {
    const commons = key ? key.split(",") : [];
    let cancelled = false;
    const names = [
      { name: "retorn.eth", keys: ["impact.rate", "impact.value"], label: ["rate", "pool"] },
      { name: "gracia.retorn.eth", keys: [ENS_KEYS.star, ENS_KEYS.homes], label: ["star", "homes funded"] },
      ...commons.map((n) => ({
        name: `${n.toLowerCase()}.retorn.eth`,
        keys: [ENS_KEYS.homes, ENS_KEYS.status],
        label: ["homes", "status"],
      })),
    ];
    (async () => {
      const out: Row[] = [];
      for (const n of names) {
        const address = await resolveName(n.name);
        const values = await Promise.all(n.keys.map((k) => textRecord(n.name, k)));
        const detail = values
          .map((v, i) => (v ? `${n.label[i]} ${n.label[i] === "star" ? "★".repeat(Number(v)) : v}` : null))
          .filter(Boolean)
          .join(" · ");
        out.push({ name: n.name, address, detail });
      }
      if (!cancelled) setRows(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 mb-6">
        <h2 className="font-display text-2xl">Names on ENS</h2>
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-soft">
          resolved live · ENSv2 Sepolia
        </span>
      </div>
      {!rows ? (
        <p className="font-mono text-xs text-ink-soft">Resolving names through ENS...</p>
      ) : (
        <ul className="divide-y rule">
          {rows.map((r) => (
            <li key={r.name} className="py-3 flex flex-wrap items-center gap-x-6 gap-y-1">
              <span className="font-mono text-sm min-w-56">{r.name}</span>
              <span className="font-mono text-xs text-ink-soft">
                {r.address ? `${r.address.slice(0, 8)}…${r.address.slice(-6)}` : "not resolved"}
              </span>
              <span className="text-sm ml-auto">{r.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
