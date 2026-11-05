"use client";

import { useState } from "react";
import Link from "next/link";
import { stays, poolState, Grade } from "@/lib/seed";
import { SiteHeader, SiteFooter, VerifiedMark } from "@/components/ui";
import { SmartImage, GradeBadge, GradeChip } from "@/components/media";

function eur(n: number): string {
  return n >= 1000 ? `€${(n / 1000).toFixed(0)}k` : `€${n}`;
}

export default function GuideHome() {
  const [filter, setFilter] = useState<Grade | "All">("All");
  const shown = filter === "All" ? stays : stays.filter((s) => s.grade === filter);

  return (
    <>
      <SiteHeader />

      {/* Masthead */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-8">
        <p className="rise font-mono text-[0.72rem] uppercase tracking-[0.24em] text-rust">
          The impact guide
        </p>
        <h1 className="rise font-display text-5xl md:text-7xl leading-[0.92] mt-4 max-w-4xl tracking-tight">
          Places you&apos;d cross the world for, that quietly keep locals in their homes.
        </h1>
        <p className="rise text-lg md:text-xl text-ink-soft mt-6 max-w-2xl leading-relaxed">
          A short list of extraordinary stays. Each one sends a fixed share of what you pay into
          permanently affordable housing for the people who live where you&apos;re visiting. Graded
          Gold, Silver or Copper by how much, and every euro verified on-chain.
        </p>
        <div className="rise mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="font-display text-xl">
            {poolState.homes} homes funded · {eur(poolState.contributedEUR)} from guests · {poolState.places} countries
          </span>
          <VerifiedMark label="Verified on-chain" />
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap gap-3 items-center border-y rule">
        <span className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft mr-2">Filter by local impact</span>
        {(["All", "Gold", "Silver", "Copper"] as const).map((g) => (
          <GradeChip key={g} grade={g} active={filter === g} onClick={() => setFilter(g)} />
        ))}
      </section>

      {/* The stays */}
      <section className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-2 gap-x-8 gap-y-14">
        {shown.map((s, i) => (
          <Link
            key={s.slug}
            href={`/stays/${s.slug}`}
            className="rise group block"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="relative">
              <SmartImage
                src={s.image}
                alt={s.name}
                tint={s.tint}
                className="aspect-[4/5] rounded-[4px] transition-transform duration-500 group-hover:scale-[1.012]"
              />
              <div className="absolute top-3 left-3">
                <GradeBadge grade={s.grade} eur={`${eur(s.contributedEUR)} to local housing`} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-b-[4px]">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/80">{s.place}</p>
                <h3 className="font-display text-3xl text-white leading-tight mt-0.5">{s.name}</h3>
              </div>
            </div>
            <p className="text-[1.05rem] text-ink mt-4 leading-snug max-w-xl">{s.oneLine}</p>
            <p className="text-sm text-ink-soft mt-2">
              {s.kind} · funds {s.funds.toLowerCase()} ·{" "}
              <span className="text-ink font-semibold">{s.families} families kept in place</span>
            </p>
          </Link>
        ))}
      </section>

      <SiteFooter />
    </>
  );
}
