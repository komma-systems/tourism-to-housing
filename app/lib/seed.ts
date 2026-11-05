// Demo data for the Guide. On testnet this is replaced by live reads from the
// contracts. Stays are original (not real businesses); imagery is freely licensed.

export type Grade = "Gold" | "Silver" | "Copper";

export const GRADE_SHARE: Record<Grade, string> = {
  Gold: "3.5%",
  Silver: "2.5%",
  Copper: "2%",
};

export const GRADE_COLOR: Record<Grade, string> = {
  Gold: "#B8860B",
  Silver: "#8A8F98",
  Copper: "#A6572F",
};

export type Stay = {
  slug: string;
  name: string;
  kind: string;
  place: string;
  grade: Grade;
  contributedEUR: number; // cumulative into the local pool
  homes: number; // permanently affordable homes funded locally
  families: number; // families kept in place
  oneLine: string; // the wow
  story: string[]; // why you want to be here, then the impact
  funds: string; // what your stay funds, in one line
  image: string; // hero photo
  tint: string; // fallback colour
};

// Freely-licensed Unsplash photos (stable file URLs); SmartImage falls back to
// the tint if any fail to load.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=70`;

export const stays: Stay[] = [
  {
    slug: "qasr-al-nakhla",
    name: "Qasr al-Nakhla",
    kind: "Desert eco-lodge",
    place: "Siwa Oasis, Egypt",
    grade: "Gold",
    contributedEUR: 38000,
    homes: 11,
    families: 11,
    oneLine: "A salt-and-clay palace at the edge of the Great Sand Sea, lit only by candle.",
    story: [
      "Built entirely of kershef, the salt-crusted clay of the oasis, Qasr al-Nakhla has no electricity and no need of it. You eat by firelight under a sky with no competing glow, swim in a Roman spring at dawn, and wake to the silence of dunes that run unbroken to Libya.",
      "Every room you book sends 3.5% of its price into a community land trust in the oasis, so the Siwi families who build and run the lodge can buy and hold their own homes before resort money prices them out.",
    ],
    funds: "A community land trust keeping Siwi families on their own land",
    image: img("1509316785289-025f5b846b35"),
    tint: "#A6572F",
  },
  {
    slug: "the-saffron-house",
    name: "The Saffron House",
    kind: "Medina riad",
    place: "Marrakech, Morocco",
    grade: "Gold",
    contributedEUR: 31000,
    homes: 9,
    families: 9,
    oneLine: "A hidden riad of zellige and orange trees, minutes from the Jemaa el-Fnaa.",
    story: [
      "Behind an unmarked door in the old medina, five rooms open onto a courtyard of tadelakt walls, a cold plunge, and a rooftop where the call to prayer arrives from every direction at dusk. The breakfast is the best argument for staying a week.",
      "The house routes 3.5% of every booking into a housing co-op in the medina, so the artisan families who keep these walls alive are not pushed out to the city's edge by short-let speculation.",
    ],
    funds: "A medina housing co-op for artisan families",
    image: img("1539020140153-e479b8c22e70"),
    tint: "#B8860B",
  },
  {
    slug: "neela-backwaters",
    name: "Neela Backwaters",
    kind: "Backwater villa",
    place: "Kerala, India",
    grade: "Silver",
    contributedEUR: 22000,
    homes: 7,
    families: 7,
    oneLine: "A teak-and-thatch house on stilts, reachable only by the morning boat.",
    story: [
      "The backwaters open the moment you leave the jetty: still green water, kingfishers, the smell of cardamom off the banks. The house is all shade and slow fans and fish caught an hour before it reaches your plate.",
      "Two and a half percent of every stay funds a fishing-village land trust, so the families who pole the boats and cook the meals keep title to the waterfront their grandparents worked.",
    ],
    funds: "A fishing-village land trust on the waterfront",
    image: img("1600596542815-ffad4c1539a9"),
    tint: "#3F6670",
  },
  {
    slug: "mas-de-les-oliveres",
    name: "Mas de les Oliveres",
    kind: "Stone masia",
    place: "Costa Brava, Catalonia",
    grade: "Silver",
    contributedEUR: 19000,
    homes: 6,
    families: 6,
    oneLine: "An 11th-century farmhouse above the Garrotxa, with a cold pool cut into rock.",
    story: [
      "Thick stone, a single long table, olive terraces falling toward the sea. You cook with what the garden gives, walk volcanic hills at golden hour, and drive forty minutes to coves most people never find.",
      "The masia gives 2.5% of its takings to a Catalan housing cooperative on the cessió d'ús model, so local families priced out of the coast can live near the work and the sea.",
    ],
    funds: "A Catalan housing cooperative (cessió d'ús)",
    image: img("1512917774080-9991f1c4c750"),
    tint: "#5B6B3A",
  },
  {
    slug: "casa-tierra",
    name: "Casa Tierra",
    kind: "Courtyard house",
    place: "Oaxaca, Mexico",
    grade: "Copper",
    contributedEUR: 12000,
    homes: 4,
    families: 4,
    oneLine: "Rammed-earth rooms around a jacaranda, a ten-minute walk from the zócalo.",
    story: [
      "Warm earthen walls, a courtyard loud with birds, mezcal poured by the family who built the place by hand. You are close enough to walk to the markets and far enough to sleep to silence.",
      "Two percent of every night funds a neighbourhood land trust in the centro, holding homes for the families whose stalls and kitchens make Oaxaca what you came for.",
    ],
    funds: "A centro neighbourhood land trust",
    image: img("1518638150340-f706e86654de"),
    tint: "#8A5A2B",
  },
  {
    slug: "la-rambla-roja",
    name: "La Rambla Roja",
    kind: "Boutique townhouse",
    place: "Barcelona, Catalonia",
    grade: "Gold",
    contributedEUR: 40000,
    homes: 12,
    families: 12,
    oneLine: "A restored 1880s townhouse in the Raval, roof terrace over the rooftops.",
    story: [
      "High ceilings, hydraulic-tile floors, a terrace where the city softens at dusk. The Raval at your door: bars, galleries, the Boqueria a few streets up.",
      "It gives 3.5% of revenue to La Borda and Can Batlló, the cooperatives holding homes off the speculative market a few streets from where you sleep. More than any other house in the guide.",
    ],
    funds: "La Borda & Can Batlló housing cooperatives",
    image: img("1467269204594-9661b134dd2b"),
    tint: "#B4471F",
  },
];

export function stayBySlug(slug: string): Stay | undefined {
  return stays.find((s) => s.slug === slug);
}

export const poolState = {
  contributedEUR: stays.reduce((n, s) => n + s.contributedEUR, 0),
  homes: stays.reduce((n, s) => n + s.homes, 0),
  families: stays.reduce((n, s) => n + s.families, 0),
  places: new Set(stays.map((s) => s.place.split(",").pop()?.trim())).size,
};
