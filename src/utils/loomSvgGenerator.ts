import { COLOR_PALETTE, type ColorDefinition } from "../data/studioPattern";

export interface LoomSvgOptions {
  colWidth?: number;
  rowHeight?: number;
  beadGap?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  showRowNumbers?: boolean;
  showColNumbers?: boolean;
  showPaletteHeader?: boolean;
}

export function generateLoomSvg(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE,
  options: LoomSvgOptions = {}
): string {
  const numRows = matrix.length;
  const numCols = matrix[0]?.length || 0;

  const {
    colWidth = 22,
    rowHeight = 26,
    beadGap = 3,
    marginLeft = 55,
    marginRight = 55,
    marginTop = 95,
    marginBottom = 45,
    showRowNumbers = true,
    showColNumbers = true,
    showPaletteHeader = true,
  } = options;

  const gridWidth = numCols * colWidth;
  const gridHeight = numRows * rowHeight;

  const totalSvgWidth = gridWidth + marginLeft + marginRight;
  const totalSvgHeight = gridHeight + marginTop + marginBottom;

  // Calculate bead counts
  const colorCounts: Record<string, number> = {};
  Object.keys(palette).forEach((key) => (colorCounts[key] = 0));

  matrix.forEach((row) => {
    row.forEach((cell) => {
      if (colorCounts[cell] !== undefined) {
        colorCounts[cell]++;
      } else {
        colorCounts[cell] = 1;
      }
    });
  });

  const totalBeads = numRows * numCols;

  const svgParts: string[] = [];

  // SVG Header
  svgParts.push(
    `<svg width="${totalSvgWidth}" height="${totalSvgHeight}" viewBox="0 0 ${totalSvgWidth} ${totalSvgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="background-color: #1a1a1c; font-family: system-ui, -apple-system, sans-serif;">`
  );

  // Definitions for filters/effects if needed
  svgParts.push(`<defs>
    <style>
      .loom-text { font-family: system-ui, sans-serif; fill: #d0d0d0; font-size: 11px; text-anchor: middle; dominant-baseline: middle; }
      .loom-num-highlight { fill: #f1d397; font-weight: bold; font-size: 12px; }
      .header-title { font-size: 16px; font-weight: 700; fill: #ffffff; text-anchor: start; }
      .header-sub { font-size: 12px; fill: #a0a0a0; text-anchor: start; }
      .swatch-label { font-size: 12px; fill: #e0e0e0; dominant-baseline: middle; }
    </style>
  </defs>`);

  // Background rect
  svgParts.push(`<rect width="${totalSvgWidth}" height="${totalSvgHeight}" fill="#18181a" rx="8" />`);

  // Header section
  if (showPaletteHeader) {
    // Title
    svgParts.push(
      `<text x="24" y="28" class="header-title">Сетка для плетения на станке (Loom Beadwork)</text>`
    );
    svgParts.push(
      `<text x="24" y="48" class="header-sub">Размер: ${numCols} колонок × ${numRows} рядов • Всего бусин: ${totalBeads}</text>`
    );

    // Color Swatches
    let swatchX = 24;
    const swatchY = 68;

    Object.entries(palette).forEach(([key, colorDef]) => {
      const count = colorCounts[key] || 0;
      const pct = ((count / totalBeads) * 100).toFixed(1);

      // Color box
      svgParts.push(
        `<rect x="${swatchX}" y="${swatchY - 8}" width="16" height="16" rx="3" fill="${colorDef.fill}" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1"/>`
      );
      
      const labelText = `[${key.toUpperCase()}] ${colorDef.name}: ${count} шт. (${pct}%)`;
      svgParts.push(
        `<text x="${swatchX + 22}" y="${swatchY}" class="swatch-label">${labelText}</text>`
      );

      swatchX += labelText.length * 7 + 45;
    });
  }

  // Group for Grid and Beads
  const originX = marginLeft;
  const originY = marginTop;

  // 1. Grid Background & Row highlights (every 5th/10th row)
  for (let r = 0; r < numRows; r++) {
    const y = originY + r * rowHeight;
    const rowNum = r + 1; // 1-indexed

    if (rowNum % 10 === 0) {
      svgParts.push(
        `<rect x="${originX}" y="${y}" width="${gridWidth}" height="${rowHeight}" fill="#ffffff" fill-opacity="0.06" />`
      );
    } else if (rowNum % 5 === 0) {
      svgParts.push(
        `<rect x="${originX}" y="${y}" width="${gridWidth}" height="${rowHeight}" fill="#ffffff" fill-opacity="0.03" />`
      );
    }
  }

  // 2. Warp Threads (Нити основы - вертикальные)
  for (let c = 0; c <= numCols; c++) {
    const x = originX + c * colWidth;
    const isEdge = c === 0 || c === numCols;
    const strokeColor = isEdge ? "#999999" : "#444444";
    const strokeWidth = isEdge ? "2" : "1";
    svgParts.push(
      `<line x1="${x}" y1="${originY - 6}" x2="${x}" y2="${originY + gridHeight + 6}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${isEdge ? "none" : "2,2"}" />`
    );
  }

  // 3. Weft Guide Lines (Горизонтальные нити/линии)
  for (let r = 0; r <= numRows; r++) {
    const y = originY + r * rowHeight;
    const isMajor = r % 10 === 0;
    const isMedium = r % 5 === 0;
    const strokeColor = isMajor ? "#777777" : isMedium ? "#555555" : "#333333";
    const strokeWidth = isMajor ? "1.5" : "1";
    svgParts.push(
      `<line x1="${originX - 6}" y1="${y}" x2="${originX + gridWidth + 6}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`
    );
  }

  // 4. Column numbers (Top & Bottom)
  if (showColNumbers) {
    for (let c = 0; c < numCols; c++) {
      const cx = originX + c * colWidth + colWidth / 2;
      const colNum = c + 1;
      const isKeyCol = colNum % 5 === 0 || colNum === 1 || colNum === numCols;
      const textClass = isKeyCol ? "loom-text loom-num-highlight" : "loom-text";

      // Top number
      svgParts.push(
        `<text x="${cx}" y="${originY - 18}" class="${textClass}">${colNum}</text>`
      );
      // Bottom number
      svgParts.push(
        `<text x="${cx}" y="${originY + gridHeight + 18}" class="${textClass}">${colNum}</text>`
      );
    }
  }

  // 5. Row numbers (Left & Right margins)
  if (showRowNumbers) {
    for (let r = 0; r < numRows; r++) {
      const cy = originY + r * rowHeight + rowHeight / 2;
      const rowNum = r + 1;
      const isKeyRow = rowNum % 10 === 0 || rowNum === 1 || rowNum === numRows;
      const isSubKeyRow = rowNum % 5 === 0;
      const textClass = isKeyRow
        ? "loom-text loom-num-highlight"
        : isSubKeyRow
        ? "loom-text"
        : "loom-text";
      const opacity = isKeyRow ? "1" : isSubKeyRow ? "0.9" : "0.5";

      // Left margin row number
      svgParts.push(
        `<text x="${originX - 24}" y="${cy}" class="${textClass}" opacity="${opacity}">${rowNum}</text>`
      );
      // Right margin row number
      svgParts.push(
        `<text x="${originX + gridWidth + 24}" y="${cy}" class="${textClass}" opacity="${opacity}">${rowNum}</text>`
      );
    }
  }

  // 6. Draw Beads (Бусины)
  const beadW = colWidth - beadGap;
  const beadH = rowHeight - beadGap;
  const beadRx = 3;

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const cellAlias = matrix[r][c];
      const colorDef = palette[cellAlias] || { fill: "#ffffff", name: "Unknown" };
      const bx = originX + c * colWidth + beadGap / 2;
      const by = originY + r * rowHeight + beadGap / 2;

      // Draw bead rectangle
      svgParts.push(
        `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${beadW.toFixed(1)}" height="${beadH.toFixed(1)}" rx="${beadRx}" fill="${colorDef.fill}" stroke="#000000" stroke-opacity="0.35" stroke-width="0.8" />`
      );

      // Subtle inner bead highlight (to simulate rounded seed bead reflection on loom)
      svgParts.push(
        `<rect x="${(bx + 2).toFixed(1)}" y="${(by + 2).toFixed(1)}" width="${(beadW - 4).toFixed(1)}" height="${(beadH / 3).toFixed(1)}" rx="1.5" fill="#ffffff" fill-opacity="0.15" />`
      );
    }
  }

  svgParts.push(`</svg>`);

  return svgParts.join("\n");
}
