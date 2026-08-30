/**
 * Utility for calculating approximate bead weight in grams.
 * Standard ratio for Miyuki Delica 11/0:
 * 10g = 1850 beads (185 beads per gram).
 */

export const DEFAULT_BEADS_PER_GRAM = 185; // 1850 beads = 10 grams

export function getBeadWeightInGrams(beadCount: number, beadsPerGram: number = DEFAULT_BEADS_PER_GRAM): number {
  return beadCount / beadsPerGram;
}

export function formatBeadWeight(beadCount: number, beadsPerGram: number = DEFAULT_BEADS_PER_GRAM): string {
  const grams = getBeadWeightInGrams(beadCount, beadsPerGram);
  if (grams === 0) return "0 г";
  const rounded = Math.round(grams * 10) / 10;
  return `~${rounded} г`;
}
