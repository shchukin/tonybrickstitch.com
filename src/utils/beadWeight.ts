/**
 * Utility for calculating approximate bead weight in grams.
 * Standard ratio for Miyuki Delica 11/0 (cylinder beads used for loom weaving):
 * ~200 beads per gram (approx. 0.005 g per bead).
 */

export const DEFAULT_BEADS_PER_GRAM = 200;

export function getBeadWeightInGrams(beadCount: number, beadsPerGram: number = DEFAULT_BEADS_PER_GRAM): number {
  return beadCount / beadsPerGram;
}

export function formatBeadWeight(beadCount: number, beadsPerGram: number = DEFAULT_BEADS_PER_GRAM): string {
  const grams = getBeadWeightInGrams(beadCount, beadsPerGram);
  if (grams === 0) return "0 г";
  return `~${grams.toFixed(1)} г`;
}
