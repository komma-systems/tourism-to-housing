import Link from "next/link";
import { stays, commons, poolState, TIER_LABEL } from "@/lib/seed";
import { SiteHeader, SiteFooter, Stars, VerifiedMark, eur } from "@/components/ui";

export default function GuideHome() {
  const ranked = [...stays].sort((a, b) => b.tier - a.tier || b.contributedEUR - a.contributedEUR);

  return (
    <>
      <SiteHeader />

      {/* Masthead */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <p className="rise font-mono text-[0.72rem] uppercase tracking-[0.2em] text-rust">
          A curated guide · Barcelona &amp; the Costa Brava
        </p>
        <h1 className="rise font-display text-5xl md:text-7xl leading-[0.95] mt-4 max-w-4xl tracking-tight">
          Stay somewhere that builds the housing it stands on.
        </h1>
        <p className="rise text-lg md:text-xl text-ink-soft mt-6 max-w-2xl leading-relaxed">
          Every stay in the guide routes a share of what you pay into permanently
          affordable homes for the people who live here. The more a place gives,
          the higher its rating. The rating is not a promise: it is settled
          on-chain, in euros, and anyone can check it.
        </p>
        <div className="rise mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="font-mono text-sm text-ink-soft">
            ★ {TIER_LABEL[1]} &nbsp;·&nbsp; ★★ {TIER_LABEL[2]} &nbsp;·&nbsp; ★★★ {TIER_LABEL[3]}
          </span>
          <VerifiedMark />
        </div>
      </section>

      {/* Impact ticker */}
      <section className="border-y rule bg-paper-deep/60">
        <div className="mx-auto max-w-6xl px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            [String(poolState.homesDelivered), "homes delivered"],
            [`${(poolState.squareMetresDelivered / 1000).toFixed(1)}k m²`, "housing commons"],
            [eur(poolState.contributedEUR), "contributed by stays"],
            [String(poolState.operators), "stays in the guide"],
          ].map(([v, l], i) => (
            <div key={i}>
              <div className="font-display text-3xl md:text-4xl leading-none">{v}</div>
              <div className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft mt-1.5">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The listings */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-2 mb-8">
          <h2 className="font-display text-2xl">The stays</h2>
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-soft">
            Ranked by homes funded
          </span>
        </div>

        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-12">
          {ranked.map((s, i) => {
            const funded = s.fundedCommons
              .map((id) => commons.find((c) => c.id === id))
              .filter(Boolean);
            const homes = funded.reduce((n, c) => n + (c?.homes ?? 0), 0);
            return (
              <li key={s.slug} className="rise" style={{ animationDelay: `${i * 80}ms` }}>
                <Link href={`/stays/${s.slug}`} className="group block">
                  <div className="flex gap-5">
                    <div
                      className="plate shrink-0 w-28 h-36 rounded-[2px]"
                      style={{ ["--plate-tint" as string]: s.tint }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <Stars tier={s.tier} className="text-lg" />
                        <span className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft">
                          {TIER_LABEL[s.tier]}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl mt-1.5 leading-tight group-hover:text-rust transition-colors">
                        {s.name}
                      </h3>
                      <p className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft mt-0.5">
                        {s.kind} · {s.neighbourhood}, {s.city}
                      </p>
                      <p className="text-[0.95rem] text-ink-soft mt-3 leading-relaxed">{s.blurb}</p>
                      <div className="mt-3 pt-3 border-t rule flex items-center justify-between">
                        <span className="text-sm">
                          <span className="font-semibold text-ink">{homes}</span>
                          <span className="text-ink-soft"> homes funded · {eur(s.contributedEUR)} in</span>
                        </span>
                        <VerifiedMark label="Verified" />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <SiteFooter />
    </>
  );
}
