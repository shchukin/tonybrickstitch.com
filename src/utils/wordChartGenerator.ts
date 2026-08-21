import { COLOR_PALETTE, type ColorDefinition } from "../data/studioPattern";

export interface ColorRun {
  color: string;
  count: number;
}

export interface WordChartRow {
  rowNumber: number;
  runs: ColorRun[];
  rawText: string;
  htmlText: string;
}

export interface WordChartData {
  totalRows: number;
  totalCols: number;
  totalBeads: number;
  rows: WordChartRow[];
}

export function generateWordChart(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE,
  bottomToTop: boolean = false
): WordChartData {
  const totalRows = matrix.length;
  const totalCols = matrix[0]?.length || 0;
  const totalBeads = totalRows * totalCols;

  const rowsData: WordChartRow[] = [];

  const rowIndices = Array.from({ length: totalRows }, (_, i) => i);
  if (bottomToTop) {
    rowIndices.reverse();
  }

  rowIndices.forEach((rIdx) => {
    const row = matrix[rIdx];
    const rowNumber = rIdx + 1; // 1-indexed

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
      .map((run) => `<b>(${run.count})</b>${run.color.toUpperCase()}`)
      .join(", ");

    rowsData.push({
      rowNumber,
      runs,
      rawText,
      htmlText,
    });
  });

  return {
    totalRows,
    totalCols,
    totalBeads,
    rows: rowsData,
  };
}

export function exportWordChartAsText(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE
): string {
  const chartData = generateWordChart(matrix, palette, false);
  const lines: string[] = [];

  lines.push(`==========================================`);
  lines.push(`WORD CHART / СЛОВЕСНАЯ ИНСТРУКЦИЯ ДЛЯ СТАНКА`);
  lines.push(`==========================================`);
  lines.push(`Размер: ${chartData.totalCols} колонок × ${chartData.totalRows} рядов`);
  lines.push(`Всего бусин: ${chartData.totalBeads} шт.`);
  lines.push(`Легенда цветов:`);
  Object.entries(palette).forEach(([key, colorDef]) => {
    lines.push(`  [${key.toUpperCase()}] : ${colorDef.name} (${colorDef.fill})`);
  });
  lines.push(`==========================================\n`);

  chartData.rows.forEach((row) => {
    const rowStr = String(row.rowNumber).padStart(3, "0");
    lines.push(`${rowStr}: ${row.rawText}`);
  });

  return lines.join("\n");
}

export function exportWordChartAsHtml(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE
): string {
  const chartData = generateWordChart(matrix, palette, false);
  const lines: string[] = [];

  lines.push(`==========================================`);
  lines.push(`WORD CHART / СЛОВЕСНАЯ ИНСТРУКЦИЯ ДЛЯ СТАНКА`);
  lines.push(`==========================================`);
  lines.push(`Размер: ${chartData.totalCols} колонок × ${chartData.totalRows} рядов`);
  lines.push(`Всего бусин: ${chartData.totalBeads} шт.`);
  lines.push(`Легенда цветов:`);
  Object.entries(palette).forEach(([key, colorDef]) => {
    lines.push(`  [${key.toUpperCase()}] : ${colorDef.name} (${colorDef.fill})`);
  });
  lines.push(`==========================================\n`);

  chartData.rows.forEach((row) => {
    const rowStr = String(row.rowNumber).padStart(3, "0");
    lines.push(`${rowStr}: ${row.htmlText}`);
  });

  return lines.join("\n");
}
