/**
 * Generates pseudo-random clasp rows for top/bottom of loom beadwork.
 * These rows use vibrant, completely random leftover/culled bead colors.
 * They are hidden inside the clasp hardware and are not part of the pattern design.
 */

export const DIVERSE_CLASP_COLORS = [
  "#e63946", "#a8dadc", "#457b9d", "#2a9d8f", "#e76f51", 
  "#f4a261", "#e9c46a", "#d62828", "#669bbc", "#f28482",
  "#9b5de5", "#f15bb5", "#fee440", "#00bbf9", "#00f5d4",
  "#7209b7", "#4361ee", "#4cc9f0", "#ffb703", "#fb8500"
];

export function getClaspColor(colIndex: number, seedStr: string = "top"): string {
  const x = Math.sin((colIndex + 1) * 12.9898 + (seedStr === "top" ? 78.233 : 45.123)) * 43758.5453;
  const rand = x - Math.floor(x);
  const colorIdx = Math.floor(rand * DIVERSE_CLASP_COLORS.length);
  return DIVERSE_CLASP_COLORS[colorIdx];
}

export function generateClaspRow(cols: number, seedStr: string = "top"): string[] {
  return Array(cols).fill("x");
}

export interface PatternWithClasp {
  extendedMatrix: string[][];
  numPatternRows: number;
  numCols: number;
  totalRows: number;
  isClaspRow: (rIdx: number) => boolean;
  getRowLabel: (rIdx: number, padZeroes?: boolean) => string;
  getBeadFill: (rIdx: number, cIdx: number, defaultFill?: string) => string;
}

export function wrapMatrixWithClasp(matrix: string[][]): PatternWithClasp {
  const numPatternRows = matrix.length;
  const numCols = matrix[0]?.length || 18;

  const topClasp = generateClaspRow(numCols, "top");
  const bottomClasp = generateClaspRow(numCols, "bottom");

  const extendedMatrix = [topClasp, ...matrix, bottomClasp];
  const totalRows = extendedMatrix.length;

  const isClaspRow = (rIdx: number) => rIdx === 0 || rIdx === totalRows - 1;

  const getRowLabel = (rIdx: number, padZeroes: boolean = true) => {
    if (rIdx === 0 || rIdx === totalRows - 1) {
      return "clasp";
    }
    // Pattern row index: 1-indexed (1 to numPatternRows)
    const patternRowNumber = rIdx;
    return padZeroes ? String(patternRowNumber).padStart(3, "0") : String(patternRowNumber);
  };

  const getBeadFill = (rIdx: number, cIdx: number, defaultFill?: string) => {
    if (rIdx === 0) {
      return getClaspColor(cIdx, "top");
    }
    if (rIdx === totalRows - 1) {
      return getClaspColor(cIdx, "bottom");
    }
    return defaultFill || "#ffffff";
  };

  return {
    extendedMatrix,
    numPatternRows,
    numCols,
    totalRows,
    isClaspRow,
    getRowLabel,
    getBeadFill,
  };
}
