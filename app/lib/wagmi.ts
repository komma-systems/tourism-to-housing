import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { arcTestnet } from "./arc";

// Client-only wallet config for Arc. Static export, so ssr is off.
export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [injected()],
  transports: { [arcTestnet.id]: http() },
  ssr: false,
});
