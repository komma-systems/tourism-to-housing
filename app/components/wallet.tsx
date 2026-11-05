"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { arcTestnet } from "@/lib/arc";

export function ConnectButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const injected = connectors[0];

  const btn =
    "font-mono text-[0.72rem] uppercase tracking-[0.12em] px-4 py-2 rounded-[2px] transition-colors";

  if (!isConnected) {
    return (
      <button className={`${btn} bg-ink text-paper hover:bg-rust`} onClick={() => connect({ connector: injected })} disabled={isPending}>
        {isPending ? "Connecting…" : "Connect wallet"}
      </button>
    );
  }

  const wrongChain = chainId !== arcTestnet.id;
  return (
    <div className="flex items-center gap-2">
      {wrongChain && (
        <button className={`${btn} bg-rust text-paper`} onClick={() => switchChain({ chainId: arcTestnet.id })}>
          Switch to Arc
        </button>
      )}
      <span className="font-mono text-[0.72rem] text-ink-soft">
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </span>
      <button className={`${btn} border border-ink hover:bg-paper-deep`} onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
