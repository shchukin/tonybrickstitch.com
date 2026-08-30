import { COLOR_PALETTE, type ColorDefinition } from "../data/studioPattern";
import { wrapMatrixWithClasp } from "./claspUtils";
import { formatBeadWeight } from "./beadWeight";

export interface ColorRun {
  color: string;
  count: number;
  isClasp?: boolean;
}

export interface WordChartRow {
  rowNumber: number;
  rowLabel: string;
  isClasp: boolean;
  runs: ColorRun[];
  rawText: string;
  htmlText: string;
  mdText: string;
}

export interface WordChartData {
  totalRows: number;
  totalCols: number;
  totalBeads: number;
  numPatternRows: number;
  rows: WordChartRow[];
}

export function generateWordChart(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE,
  bottomToTop: boolean = false
): WordChartData {
  const claspData = wrapMatrixWithClasp(matrix);
  const { extendedMatrix, numCols, totalRows, isClaspRow, getRowLabel } = claspData;
  const totalBeads = totalRows * numCols;

  const rowsData: WordChartRow[] = [];

  const rowIndices = Array.from({ length: totalRows }, (_, i) => i);
  if (bottomToTop) {
    rowIndices.reverse();
  }

  rowIndices.forEach((rIdx) => {
    const isClasp = isClaspRow(rIdx);
    const rowLabel = getRowLabel(rIdx, true);
    const row = extendedMatrix[rIdx];

    if (isClasp) {
      rowsData.push({
        rowNumber: rIdx,
        rowLabel,
        isClasp: true,
        runs: [{ color: "X", count: numCols, isClasp: true }],
        rawText: `(${numCols})Any / Culled beads`,
        htmlText: `<strong style="font-weight: 700;">(${numCols})</strong>Any / Culled beads`,
        mdText: `**(${numCols})**Any / Culled beads`,
      });
    } else {
      const runs: ColorRun[] = [];
      if (row && row.length > 0) {
        let currentColor = row[0];
        let currentCount = 1;

        for (let c = 1; c < row.length; c++) {
          if (row[c] === currentColor) {
            currentCount++;
          } else {
            runs.push({ color: currentColor, count: currentCount });
            currentColor = row[c];
            currentCount = 1;
          }
        }
        runs.push({ color: currentColor, count: currentCount });
      }

      // Plain text format: (18)G
      const rawText = runs
        .map((run) => `(${run.count})${run.color.toUpperCase()}`)
        .join(", ");

      // HTML format with bold quantity: <b>(18)</b>G
      const htmlText = runs
        .map((run) => `<strong style="font-weight: 700;">(${run.count})</strong>${run.color.toUpperCase()}`)
        .join(", ");

      // Markdown format with bold quantity: **(18)**G
      const mdText = runs
        .map((run) => `**(${run.count})**${run.color.toUpperCase()}`)
        .join(", ");

      rowsData.push({
        rowNumber: rIdx,
        rowLabel,
        isClasp: false,
        runs,
        rawText,
        htmlText,
        mdText,
      });
    }
  });

  return {
    totalRows,
    totalCols: numCols,
    totalBeads,
    numPatternRows: claspData.numPatternRows,
    rows: rowsData,
  };
}

export function exportWordChartAsText(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE
): string {
  const chartData = generateWordChart(matrix, palette, false);
  const patternBeadCount = chartData.numPatternRows * chartData.totalCols;
  const lines: string[] = [];

  // Calculate counts per color
  const colorCounts: Record<string, number> = {};
  Object.keys(palette).forEach((k) => (colorCounts[k] = 0));
  matrix.forEach((r) => r.forEach((cell) => {
    if (colorCounts[cell] !== undefined) colorCounts[cell]++;
    else colorCounts[cell] = 1;
  }));

  lines.push(`==========================================`);
  lines.push(`WORD CHART / СЛОВЕСНАЯ ИНСТРУКЦИЯ ДЛЯ СТАНКА`);
  lines.push(`==========================================`);
  lines.push(`Размер схемы: ${chartData.totalCols} колонок × ${chartData.numPatternRows} рядов (+2 clasp)`);
  lines.push(`Всего бусин в схеме: ${patternBeadCount} шт. (${formatBeadWeight(patternBeadCount)})`);
  lines.push(`Легенда цветов:`);
  Object.entries(palette).forEach(([key, colorDef]) => {
    const count = colorCounts[key] || 0;
    lines.push(`  [${key.toUpperCase()}] : ${colorDef.name} — ${count} шт. (${formatBeadWeight(count)})`);
  });
  lines.push(`==========================================\n`);

  chartData.rows.forEach((row) => {
    lines.push(`${row.rowLabel}: ${row.rawText}`);
  });

  return lines.join("\n");
}

export function exportWordChartAsHtml(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE
): string {
  const chartData = generateWordChart(matrix, palette, false);
  const patternBeadCount = chartData.numPatternRows * chartData.totalCols;
  const lines: string[] = [];

  // Calculate counts per color
  const colorCounts: Record<string, number> = {};
  Object.keys(palette).forEach((k) => (colorCounts[k] = 0));
  matrix.forEach((r) => r.forEach((cell) => {
    if (colorCounts[cell] !== undefined) colorCounts[cell]++;
    else colorCounts[cell] = 1;
  }));

  lines.push(`==========================================`);
  lines.push(`WORD CHART / СЛОВЕСНАЯ ИНСТРУКЦИЯ ДЛЯ СТАНКА`);
  lines.push(`==========================================`);
  lines.push(`Размер схемы: ${chartData.totalCols} колонок × ${chartData.numPatternRows} рядов (+2 clasp)`);
  lines.push(`Всего бусин в схеме: ${patternBeadCount} шт. (${formatBeadWeight(patternBeadCount)})`);
  lines.push(`Легенда цветов:`);
  Object.entries(palette).forEach(([key, colorDef]) => {
    const count = colorCounts[key] || 0;
    lines.push(`  [${key.toUpperCase()}] : ${colorDef.name} — ${count} шт. (${formatBeadWeight(count)})`);
  });
  lines.push(`==========================================\n`);

  chartData.rows.forEach((row) => {
    lines.push(`${row.rowLabel}: ${row.htmlText}`);
  });

  return lines.join("\n");
}

export function exportWordChartAsMarkdown(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE
): string {
  const chartData = generateWordChart(matrix, palette, false);
  
  return chartData.rows
    .map((row) => `${row.rowLabel}: ${row.mdText}`)
    .join("\n");
}
