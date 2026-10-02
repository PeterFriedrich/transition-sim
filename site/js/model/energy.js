// The energy profile of a reaction: concept 0.1 of
// docs/CONCEPTS_science10_unitA.md ("favourable is not the same as fast").
//
// A teaching model in arbitrary energy units, with the reactants at 0. The
// barrier is the activation energy: the height of the peak above the
// reactants. It can never sit below the products, so it is raised to clear
// them. FAST is where this page draws the line between "fast" and "slow"; it
// is not a measured value.

export const FAST = 20;
const CLEAR = 5;

export function profile(productEnergy, barrier, catalyst = false) {
  const wanted = catalyst ? barrier / 2 : barrier;
  const activation = Math.max(wanted, productEnergy + CLEAR, CLEAR);
  const change = productEnergy === 0 ? 0 : productEnergy;
  return {
    change,
    activation,
    peak: activation,
    reverseActivation: activation - change,
    releases: change < 0,
    fast: activation <= FAST,
    raised: activation > wanted,
  };
}

// Energy along the path, x from 0 (reactants) to 1 (products): flat, over the peak, flat.
export function curve(x, productEnergy, peak) {
  const s = Math.min(1, Math.max(0, (x - 0.2) / 0.6));
  if (s <= 0.5) return (peak * (1 - Math.cos(2 * Math.PI * s))) / 2;
  return productEnergy + ((peak - productEnergy) * (1 + Math.cos(2 * Math.PI * (s - 0.5)))) / 2;
}
