"use client";

import { useState } from "react";
import { parseUnits } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { addresses, flagshipPool, poolAbi, registryAbi, proofAbi, erc20Abi, certificateAbi, EURC_DECIMALS } from "@/lib/contracts";
import { arcTestnet } from "@/lib/arc";
import { SiteHeader, SiteFooter, Stars } from "@/components/ui";
import { ConnectButton } from "@/components/wallet";

const card = "border rule rounded-[3px] p-5 bg-paper-deep/40";
const input =
  "w-full mt-1 px-3 py-2 rounded-[2px] border rule bg-paper font-mono text-sm focus:outline-none focus:border-ink";
const label = "font-mono text-[0.68rem] uppercase tracking-wider text-ink-soft";
const action =
  "mt-4 font-mono text-[0.72rem] uppercase tracking-[0.12em] bg-ink text-paper px-5 py-2.5 rounded-[2px] hover:bg-rust transition-colors disabled:opacity-40";

function TxNote({ hash, error }: { hash?: string; error?: string }) {
  if (error) return <p className="mt-3 font-mono text-xs text-rust break-words">{error}</p>;
  if (hash)
    return (
      <a
        href={`https://testnet.arcscan.app/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block font-mono text-xs text-teal hover:text-rust break-all"
      >
        Confirmed ↗ {hash.slice(0, 18)}…
      </a>
    );
  return null;
}

export default function Studio() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 pt-14 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-rust">The Studio · back of house</p>
            <h1 className="font-display text-5xl md:text-6xl leading-[0.95] mt-3 tracking-tight">
              Where the stars are earned.
            </h1>
            <p className="text-lg text-ink-soft mt-4 max-w-2xl leading-relaxed">
              The machinery behind the guide. Operators contribute, the pool lends to a commons, and
              stewards attest delivery, each a real transaction on Arc.
            </p>
          </div>
          <ConnectButton />
        </div>
      </section>

      {!isConnected ? (
        <section className="mx-auto max-w-5xl px-6 pb-20">
          <div className={`${card} text-center py-12`}>
            <p className="text-ink-soft">Connect a wallet on Arc testnet to act.</p>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-6 pb-20 grid md:grid-cols-3 gap-5">
          <Contribute operator={address!} />
          <Lend />
          <Attest />
        </section>
      )}

      <SiteFooter />
    </>
  );
}

function Contribute({ operator }: { operator: string }) {
  const [amount, setAmount] = useState("5");
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<string>();
  const [error, setError] = useState<string>();

  const { data: tier, refetch } = useReadContract({
    address: addresses.certificate,
    abi: certificateAbi,
    functionName: "starOf",
    args: [operator as `0x${string}`],
  });

  async function go() {
    setError(undefined);
    setHash(undefined);
    try {
      const value = parseUnits(amount || "0", EURC_DECIMALS);
      await writeContractAsync({
        address: addresses.eurc,
        abi: erc20Abi,
        functionName: "approve",
        args: [flagshipPool, value],
        chainId: arcTestnet.id,
      });
      const h = await writeContractAsync({
        address: flagshipPool,
        abi: poolAbi,
        functionName: "deposit",
        args: [value, operator as `0x${string}`],
        chainId: arcTestnet.id,
      });
      setHash(h);
      setTimeout(() => refetch(), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message.split("\n")[0] : "Transaction failed");
    }
  }

  const t = Number(tier ?? 0);

  return (
    <div className={card}>
      <h2 className="font-display text-xl">Contribute</h2>
      <p className="text-sm text-ink-soft mt-1 mb-3">Operator deposits EURC, earns a star.</p>
      <div className="mb-2 flex items-center gap-2">
        <span className={label}>Your rating</span>
        {t > 0 ? <Stars tier={t as 1 | 2 | 3} /> : <span className="text-sm text-ink-soft">—</span>}
      </div>
      <label className={label}>Amount (EURC)</label>
      <input className={input} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
      <button className={action} onClick={go} disabled={isPending}>
        {isPending ? "Confirm in wallet…" : "Contribute"}
      </button>
      <TxNote hash={hash} error={error} />
    </div>
  );
}

function Lend() {
  const { address } = useAccount();
  const [id, setId] = useState("4");
  const [to, setTo] = useState(address ?? "");
  const [amount, setAmount] = useState("0.5");
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<string>();
  const [error, setError] = useState<string>();

  async function go() {
    setError(undefined);
    setHash(undefined);
    try {
      const h = await writeContractAsync({
        address: flagshipPool,
        abi: poolAbi,
        functionName: "disburseCredit",
        args: [BigInt(id), (to || address) as `0x${string}`, parseUnits(amount || "0", EURC_DECIMALS), (address) as `0x${string}`],
        chainId: arcTestnet.id,
      });
      setHash(h);
    } catch (e) {
      setError(e instanceof Error ? e.message.split("\n")[0] : "Transaction failed");
    }
  }

  return (
    <div className={card}>
      <h2 className="font-display text-xl">Lend</h2>
      <p className="text-sm text-ink-soft mt-1 mb-3">Governor disburses pool credit to a commons.</p>
      <label className={label}>Commons id</label>
      <input className={input} value={id} onChange={(e) => setId(e.target.value)} inputMode="numeric" />
      <label className={`${label} block mt-3`}>Recipient (co-op)</label>
      <input className={input} value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x…" />
      <label className={`${label} block mt-3`}>Amount (EURC)</label>
      <input className={input} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
      <button className={action} onClick={go} disabled={isPending}>
        {isPending ? "Confirm in wallet…" : "Disburse credit"}
      </button>
      <p className="mt-2 font-mono text-[0.6rem] text-ink-soft">Governor only (pool owner).</p>
      <TxNote hash={hash} error={error} />
    </div>
  );
}

function Attest() {
  const [id, setId] = useState("4");
  const [homes, setHomes] = useState("16");
  const [sqm, setSqm] = useState("1050");
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<string>();
  const [error, setError] = useState<string>();

  async function go() {
    setError(undefined);
    setHash(undefined);
    try {
      const h = await writeContractAsync({
        address: addresses.proof,
        abi: proofAbi,
        functionName: "attest",
        args: [BigInt(id), Number(homes), Number(sqm), `ipfs://evidence-${id}`],
        chainId: arcTestnet.id,
      });
      setHash(h);
    } catch (e) {
      setError(e instanceof Error ? e.message.split("\n")[0] : "Transaction failed");
    }
  }

  // Governor step: mark the attested commons Delivered and credit the funding host's homes.
  async function recognise() {
    setError(undefined);
    setHash(undefined);
    try {
      const h = await writeContractAsync({
        address: flagshipPool,
        abi: poolAbi,
        functionName: "recognizeDelivery",
        args: [BigInt(id)],
        chainId: arcTestnet.id,
      });
      setHash(h);
    } catch (e) {
      setError(e instanceof Error ? e.message.split("\n")[0] : "Transaction failed");
    }
  }

  return (
    <div className={card}>
      <h2 className="font-display text-xl">Attest</h2>
      <p className="text-sm text-ink-soft mt-1 mb-3">Steward verifies homes delivered.</p>
      <label className={label}>Commons id</label>
      <input className={input} value={id} onChange={(e) => setId(e.target.value)} inputMode="numeric" />
      <label className={`${label} block mt-3`}>Homes</label>
      <input className={input} value={homes} onChange={(e) => setHomes(e.target.value)} inputMode="numeric" />
      <label className={`${label} block mt-3`}>Square metres</label>
      <input className={input} value={sqm} onChange={(e) => setSqm(e.target.value)} inputMode="numeric" />
      <button className={action} onClick={go} disabled={isPending}>
        {isPending ? "Confirm in wallet…" : "Attest delivery"}
      </button>
      <p className="mt-2 font-mono text-[0.6rem] text-ink-soft">Steward of that commons only.</p>
      <button className={action} onClick={recognise} disabled={isPending}>
        {isPending ? "Confirm in wallet…" : "Recognise delivery"}
      </button>
      <p className="mt-2 font-mono text-[0.6rem] text-ink-soft">Governor, after the attestation.</p>
      <TxNote hash={hash} error={error} />
    </div>
  );
}
