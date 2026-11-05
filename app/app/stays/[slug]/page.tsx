import Link from "next/link";
import { notFound } from "next/navigation";
import { stays, stayBySlug, commonsById, TIER_LABEL } from "@/lib/seed";
import { SiteHeader, SiteFooter, Stars, VerifiedMark, eur } from "@/components/ui";

export function generateStaticParams() {
  return stays.map((s) => ({ slug: s.slug }));
}

export default async function StayPage({ params }: PageProps<"/stays/[slug]">) {
  const { slug } = await params;
  const stay = stayBySlug(slug);
  if (!stay) notFound();

  const funded = stay.fundedCommons.map((id) => commonsById(id)).filter(Boolean);
  const homes = funded.reduce((n, c) => n + (c?.homes ?? 0), 0);
  const sqm = funded.reduce((n, c) => n + (c?.squareMetres ?? 0), 0);

  return (
    <>
      <SiteHeader />

      <article className="mx-auto max-w-4xl px-6 py-14">
        <Link href="/" className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft hover:text-ink">
          ← The Guide
        </Link>

        <div className="mt-6 flex items-center justify-between gap-4">
          <Stars tier={stay.tier} className="text-2xl" />
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
            {TIER_LABEL[stay.tier]}
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-6xl mt-2 leading-[0.95] tracking-tight">{stay.name}</h1>
        <p className="font-mono text-[0.78rem] uppercase tracking-wider text-ink-soft mt-3">
          {stay.kind} · {stay.neighbourhood}, {stay.city}
        </p>

        <div
          className="plate mt-8 h-56 rounded-[3px]"
          style={{ ["--plate-tint" as string]: stay.tint }}
        />

        <p className="text-xl text-ink-soft mt-8 leading-relaxed max-w-2xl">{stay.blurb}</p>

        {/* The impact ledger for this stay */}
        <div className="mt-10 grid grid-cols-3 gap-6 border-y rule py-6">
          <Figure value={String(homes)} label="homes funded" />
          <Figure value={`${sqm} m²`} label="commons built" />
          <Figure value={eur(stay.contributedEUR)} label="contributed" />
        </div>

        <h2 className="font-display text-2xl mt-12 mb-4">What your stay has built</h2>
        <ul className="space-y-4">
          {funded.map((c) => (
            <li key={c!.id} className="flex gap-4 items-center border rule rounded-[3px] p-4 bg-paper-deep/40">
              <div
                className="plate shrink-0 w-16 h-16 rounded-[2px]"
                style={{ ["--plate-tint" as string]: c!.tint }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl">{c!.name}</span>
                  <StatusPill status={c!.status} />
                </div>
                <p className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-soft mt-0.5">
                  {c!.neighbourhood}, {c!.city} · {c!.homes} homes · {c!.squareMetres} m²
                </p>
                <p className="font-mono text-[0.7rem] text-ink-soft mt-1">{c!.legalWrapper}</p>
              </div>
              <VerifiedMark label="" />
            </li>
          ))}
        </ul>

        {/* Verify + book */}
        <div className="mt-12 flex flex-wrap gap-4 items-center">
          <button className="font-mono text-[0.78rem] uppercase tracking-[0.12em] bg-ink text-paper px-6 py-3 rounded-[2px] hover:bg-rust transition-colors">
            Book this stay
          </button>
          <Link
            href="/ledger"
            className="font-mono text-[0.78rem] uppercase tracking-[0.12em] border border-ink px-6 py-3 rounded-[2px] hover:bg-paper-deep transition-colors"
          >
            How the stars are verified →
          </Link>
        </div>
      </article>

      <SiteFooter />
    </>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl leading-none">{value}</div>
      <div className="font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft mt-2">{label}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tint = status === "Delivered" ? "var(--olive)" : status === "Funded" ? "var(--teal)" : "var(--ink-soft)";
  return (
    <span
      className="font-mono text-[0.6rem] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full text-paper"
      style={{ backgroundColor: tint }}
    >
      {status}
    </span>
  );
}
