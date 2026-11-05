// Off-chain host metadata, keyed by operator address. The live adapter joins this
// display data with the on-chain facts (star, contribution share, homes funded).
// On-chain has no host enumeration, so the set of hosts lives here.

export type HostMeta = {
  id: string; // operator address (lowercase)
  name: string;
  ensName?: string;
  city: string;
  territory: string;
  genre: string;
  photos: string[];
  story: string;
  pricePerNight?: number;
  fundedCommons: string[]; // registry ids this host has funded
  stamps?: string[];
};

// The demo's real on-chain host is the deployer; its star/homes/contribution are
// read live from Arc. Richer consumer imagery is added here as metadata.
export const HOST_METADATA: HostMeta[] = [
  {
    id: "0x87ecf29ae7655244d728c9d48832e331ffe596b3",
    name: "Pensió Cooperativa Gràcia",
    ensName: "gracia.barcelona.retorn.eth",
    city: "Barcelona",
    territory: "Barcelona",
    genre: "Cooperative",
    photos: [],
    story:
      "A cooperative guesthouse in Gràcia that puts a high share of its takings into the fund, so it ranks among the guide's most generous hosts regardless of its size.",
    fundedCommons: ["1", "2"],
    stamps: ["Cooperative", "Km0"],
  },
];
