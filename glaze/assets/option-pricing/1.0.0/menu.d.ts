// Structural contract only. Each client keeps its own menu, labels and prices.
export type OrderableItem = {
  name: string;
  options: { name: string; multi: boolean; required: boolean; choices: { name: string; priceCents: number }[] }[];
};
