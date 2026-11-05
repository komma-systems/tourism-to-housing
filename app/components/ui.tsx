import Link from "next/link";

export function Stars({ tier, className = "" }: { tier: 1 | 2 | 3; className?: string }) {
  return (
    <span className={`stars ${className}`} aria-label={`${tier} star${tier > 1 ? "s" : ""}`}>
      {"★".repeat(tier)}
      <span className="opacity-20">{"★".repeat(3 - tier)}</span>
    </span>
  );
}

export function VerifiedMark({ label = "Verified on-chain" }: { label?: string }) {
  return (
    <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-olive inline-flex items-center gap-1.5">
      <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
        <path
          d="M2 6.2l2.6 2.6L10 3.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

export function Plate({
  tint,
  label,
  sub,
  className = "",
}: {
  tint: string;
  label: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div
      className={`plate flex flex-col justify-end p-4 ${className}`}
      style={{ ["--plate-tint" as string]: tint }}
    >
      <div className="relative z-10 text-paper">
        <div className="font-display text-xl leading-none">{label}</div>
        {sub && <div className="font-mono text-[0.68rem] uppercase tracking-wider opacity-80 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b rule">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-baseline justify-between">
        <Link href="/" className="font-display text-xl tracking-tight">
          The&nbsp;Guide
        </Link>
        <nav className="flex gap-6 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-soft">
          <Link href="/" className="hover:text-ink">Stays</Link>
          <Link href="/ledger" className="hover:text-ink">Ledger</Link>
          <Link href="/join" className="hover:text-ink">Join</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t rule">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap gap-4 justify-between items-center font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-soft">
        <span>Tourism-to-Housing Impact Pool · KOMMA</span>
        <span>Barcelona · Costa Brava</span>
        <VerifiedMark label="Every star settled in EURC on Arc" />
      </div>
    </footer>
  );
}

export function eur(n: number): string {
  if (n >= 1000) return `€${(n / 1000).toFixed(0)}k`;
  return `€${n}`;
}
