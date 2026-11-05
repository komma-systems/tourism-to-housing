# ENS integration plan (P0.3)

Goal: real, live-resolving ENS names for the fund, hosts and commons, so each
carries its verified impact as records. Prize wants ENSv2 on Sepolia, resolving
live (not hard-coded). ENS lives on **Sepolia**, separate from Arc.

## Structure (one project, one pool, many names)

- `retorn.eth` — the fund / project (parent name), points at the pool contract.
- `<host>.retorn.eth` — a host (e.g. `gracia.retorn.eth`), resolves to the
  operator address + impact text records.
- `<place>.retorn.eth` — a commons (e.g. `poblenou.retorn.eth`), resolves to its
  registry data as records.

Flat, 3 levels. No per-commons pools; names are labels over the single fund.

## Records set on each name (ENSIP-5 custom keys, see app/lib/ens.ts ENS_KEYS)

- `impact.star`, `impact.homes`, `impact.sqm`, `impact.share`, `impact.city`,
  `impact.status`. The UI reads these via ENS; the Arc read is the source of truth.

## Dependencies (needed before registration)

1. **Sepolia test ETH** to the deployer `0x87EcF29aE7655244D728C9D48832E331fFE596B3`
   (e.g. a Sepolia faucet). A small amount covers registration + subnames.
2. The parent name **`retorn.eth` on Sepolia** (free to register on the testnet).

## Approach

Two ways, pick at registration:

- **Offchain subnames (preferred):** issue gasless subnames under `retorn.eth`
  via an offchain-subname service (NameStone / Namespace) or a CCIP-Read resolver,
  setting the impact records from our Arc state. Gasless, live, records easy to
  update. Needs a free service account or a small gateway.
- **On-chain subnames (fallback):** register `retorn.eth`, wrap it with the ENS
  Name Wrapper, `setSubnodeRecord` for each subname, set address + text records.
  Standard ENS, more gas, static records.

## UI (already scaffolded)

`app/lib/ens.ts` resolves names on Sepolia (`resolveName`, `reverseName`,
`textRecord`). The live adapter can show `ensName` and prefer the ENS impact
records, falling back to the Arc read. Nothing is hard-coded: resolution goes
through ENS.

## Steps once Sepolia ETH lands

1. Register `retorn.eth` on Sepolia (deployer wallet).
2. Issue `gracia.retorn.eth` (host), `poblenou/sants/roquetes.retorn.eth` (commons).
3. Set each name's address + `impact.*` text records from the Arc state.
4. Verify `resolveName("poblenou.retorn.eth")` returns the expected address in the
   UI; show the name + records on the Guide/Ledger.
