// Seed data for the demo guide. On testnet this is replaced by live reads from
// the HousingCommonsRegistry, ImpactCertificate and ProofOfImpact contracts.
// Everything here is illustrative, matching the Barcelona/Costa Brava anchor case.

export type CommonsStatus = "Proposed" | "Funded" | "Delivered";

export type Commons = {
  id: number;
  name: string;
  neighbourhood: string;
  city: string;
  geohash: string;
  homes: number;
  squareMetres: number;
  status: CommonsStatus;
  legalWrapper: string; // on-chain pointer to the real legal entity
  tint: string; // field-guide plate colour
};

export type Stay = {
  slug: string;
  name: string;
  kind: string;
  neighbourhood: string;
  city: string;
  tier: 1 | 2 | 3; // ★ worth a stay · ★★ worth a detour · ★★★ worth the journey
  contributedEUR: number; // cumulative contribution into the pool
  blurb: string;
  fundedCommons: number[]; // commons ids this operator's guests helped fund
  tint: string;
};

export const TIER_LABEL: Record<1 | 2 | 3, string> = {
  1: "Worth a stay",
  2: "Worth a detour",
  3: "Worth the journey",
};

export const commons: Commons[] = [
  {
    id: 1,
    name: "La Borda",
    neighbourhood: "Sants",
    city: "Barcelona",
    geohash: "sp3e2r",
    homes: 28,
    squareMetres: 2100,
    status: "Delivered",
    legalWrapper: "coop:la-borda · cessió d'ús",
    tint: "#5B6B3A",
  },
  {
    id: 2,
    name: "Can Batlló",
    neighbourhood: "La Bordeta",
    city: "Barcelona",
    geohash: "sp3e2p",
    homes: 12,
    squareMetres: 900,
    status: "Delivered",
    legalWrapper: "coop:can-batllo · cessió d'ús",
    tint: "#8A5A2B",
  },
  {
    id: 3,
    name: "Cal Ganxo",
    neighbourhood: "Begur",
    city: "Costa Brava",
    geohash: "sp9k4m",
    homes: 6,
    squareMetres: 480,
    status: "Funded",
    legalWrapper: "clt:cal-ganxo · community land trust",
    tint: "#3F6670",
  },
];

export const stays: Stay[] = [
  {
    slug: "casa-bonay",
    name: "Casa Bonay",
    kind: "Boutique hotel",
    neighbourhood: "Dreta de l'Eixample",
    city: "Barcelona",
    tier: 3,
    contributedEUR: 280000,
    blurb:
      "A restored 1869 building whose guests have funded more permanently affordable homes than any other member of the guide.",
    fundedCommons: [1, 2],
    tint: "#B4471F",
  },
  {
    slug: "hostal-grau",
    name: "Hostal Grau",
    kind: "Family guesthouse",
    neighbourhood: "El Raval",
    city: "Barcelona",
    tier: 2,
    contributedEUR: 120000,
    blurb:
      "A century-old family house in the Raval, routing a fixed share of every booking into the pool.",
    fundedCommons: [1],
    tint: "#5B6B3A",
  },
  {
    slug: "mas-salvanera",
    name: "Mas Salvanera",
    kind: "Country masia",
    neighbourhood: "Beuda",
    city: "Costa Brava",
    tier: 2,
    contributedEUR: 95000,
    blurb:
      "An 11th-century stone masia in the Garrotxa, anchoring the guide's first Costa Brava commons.",
    fundedCommons: [3],
    tint: "#3F6670",
  },
  {
    slug: "pensio-2000",
    name: "Pensió 2000",
    kind: "Small pensió",
    neighbourhood: "Sant Pere",
    city: "Barcelona",
    tier: 1,
    contributedEUR: 35000,
    blurb:
      "A six-room pensió opposite the Palau de la Música, newly joined and climbing the guide.",
    fundedCommons: [2],
    tint: "#8A5A2B",
  },
];

export function commonsById(id: number): Commons | undefined {
  return commons.find((c) => c.id === id);
}

export function stayBySlug(slug: string): Stay | undefined {
  return stays.find((s) => s.slug === slug);
}

// Pool-level figures the dashboard surfaces (illustrative demo state).
export const poolState = {
  contributedEUR: stays.reduce((n, s) => n + s.contributedEUR, 0),
  creditExtendedEUR: 320000,
  homesDelivered: commons
    .filter((c) => c.status === "Delivered")
    .reduce((n, c) => n + c.homes, 0),
  squareMetresDelivered: commons
    .filter((c) => c.status === "Delivered")
    .reduce((n, c) => n + c.squareMetres, 0),
  operators: stays.length,
};
