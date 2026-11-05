import Link from "next/link";
import { notFound } from "next/navigation";
import { stays, stayBySlug, GRADE_SHARE } from "@/lib/seed";
import { SiteHeader, SiteFooter, VerifiedMark } from "@/components/ui";
import { SmartImage, GradeBadge } from "@/components/media";

export function generateStaticParams() {
  return stays.map((s) => ({ slug: s.slug }));
}

function eur(n: number): string {
  return n >= 1000 ? `€${(n / 1000).toFixed(0)}k` : `€${n}`;
}

export default async function StayPage({ params }: PageProps<"/stays/[slug]">) {
  const { slug } = await params;
  const stay = stayBySlug(slug);
  if (!stay) notFound();

  return (
    <>
      <SiteHeader />

      {/* Full-bleed hero */}
      <section className="relative">
        <SmartImage src={stay.image} alt={stay.name} tint={stay.tint} className="h-[62vh] min-h-[420px] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-5xl px-6 pb-8">
            <GradeBadge grade={stay.grade} eur={`${eur(stay.contributedEUR)} to local housing`} />
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-white/80 mt-4">{stay.place}</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[0.92] tracking-tight mt-1">
              {stay.name}
            </h1>
          </div>
        </div>
        <div className="absolute top-5 left-6">
          <Link href="/" className="font-mono text-[0.72rem] uppercase tracking-wider text-white/90 hover:text-white">
            ← The Guide
          </Link>
        </div>
      </section>

      {/* Story, big */}
      <article className="mx-auto max-w-3xl px-6 py-14">
        <p className="font-display text-3xl md:text-4xl leading-[1.15] tracking-tight text-ink">
          {stay.oneLine}
        </p>
        {stay.story.map((p, i) => (
          <p key={i} className="text-xl text-ink-soft mt-7 leading-relaxed">
            {p}
          </p>
        ))}
      </article>

      {/* Impact band */}
      <section className="border-y rule bg-paper-deep/60">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-rust mb-5">
            What your stay has built
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Figure value={eur(stay.contributedEUR)} label="contributed so far" />
            <Figure value={GRADE_SHARE[stay.grade]} label="of every booking" />
            <Figure value={String(stay.homes)} label="affordable homes funded" />
            <Figure value={String(stay.families)} label="families kept in place" />
          </div>
          <p className="text-lg text-ink mt-8 max-w-2xl leading-relaxed">
            Every euro goes to <span className="font-semibold">{stay.funds}</span>, locked out of the
            speculative market for good. <VerifiedMark label="Settled in EURC on Arc" />
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-12 flex flex-wrap gap-4 items-center">
        <button className="font-mono text-[0.78rem] uppercase tracking-[0.12em] bg-ink text-paper px-7 py-3.5 rounded-[2px] hover:bg-rust transition-colors">
          Book this stay
        </button>
        <Link
          href="/ledger"
          className="font-mono text-[0.78rem] uppercase tracking-[0.12em] border border-ink px-7 py-3.5 rounded-[2px] hover:bg-paper-deep transition-colors"
        >
          See it on-chain →
        </Link>
      </section>

      <SiteFooter />
    </>
  );
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl md:text-5xl leading-none">{value}</div>
      <div className="font-mono text-[0.66rem] uppercase tracking-wider text-ink-soft mt-2">{label}</div>
    </div>
  );
}
