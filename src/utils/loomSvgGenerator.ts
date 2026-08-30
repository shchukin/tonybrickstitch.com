import { COLOR_PALETTE, type ColorDefinition } from "../data/studioPattern";
import { wrapMatrixWithClasp } from "./claspUtils";
import { formatBeadWeight } from "./beadWeight";

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
  const claspData = wrapMatrixWithClasp(matrix);
  const { extendedMatrix, numCols, totalRows, isClaspRow, getRowLabel, getBeadFill } = claspData;

  const {
    colWidth = 22,
    rowHeight = 26.4, // 1:1.2 ratio (22 * 1.2 = 26.4)
    beadGap = 3,
    marginLeft = 65,
    marginRight = 65,
    marginTop = 95,
    marginBottom = 45,
    showRowNumbers = true,
    showColNumbers = true,
    showPaletteHeader = true,
  } = options;

  const gridWidth = numCols * colWidth;
  const gridHeight = totalRows * rowHeight;

  const totalSvgWidth = gridWidth + marginLeft + marginRight;
  const totalSvgHeight = gridHeight + marginTop + marginBottom;

  // Calculate bead counts for pattern rows only
  const colorCounts: Record<string, number> = {};
  Object.keys(palette).forEach((key) => (colorCounts[key] = 0));

  let patternBeadCount = 0;
  matrix.forEach((row) => {
    row.forEach((cell) => {
      patternBeadCount++;
      if (colorCounts[cell] !== undefined) {
        colorCounts[cell]++;
      } else {
        colorCounts[cell] = 1;
      }
    });
  });

  const svgParts: string[] = [];

  // SVG Header
  svgParts.push(
    `<svg width="${totalSvgWidth}" height="${totalSvgHeight}" viewBox="0 0 ${totalSvgWidth} ${totalSvgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" style="background-color: #1a1a1c; font-family: system-ui, -apple-system, sans-serif;">`
  );

  // Definitions for filters/styles
  svgParts.push(`<defs>
    <style>
      .loom-text { font-family: system-ui, sans-serif; fill: #d0d0d0; font-size: 11px; text-anchor: middle; dominant-baseline: middle; }
      .loom-num-highlight { fill: #f1d397; font-weight: bold; font-size: 12px; }
      .loom-clasp-text { fill: #ff7777; font-weight: bold; font-size: 11px; font-family: monospace; }
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
      `<text x="24" y="48" class="header-sub">Схема: ${numCols} колонок × ${claspData.numPatternRows} рядов (+2 clasp) • Всего бусин: ${patternBeadCount} шт. (${formatBeadWeight(patternBeadCount)})</text>`
    );

    // Color Swatches
    let swatchX = 24;
    const swatchY = 68;

    Object.entries(palette)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .forEach(([key, colorDef]) => {
      const count = colorCounts[key] || 0;
      const weightStr = formatBeadWeight(count);

      // Color box
      svgParts.push(
        `<rect x="${swatchX}" y="${swatchY - 8}" width="16" height="16" rx="3" fill="${colorDef.fill}" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1"/>`
      );
      
      const labelText = `[${key.toUpperCase()}] ${colorDef.name}: ${count} шт. (${weightStr})`;
      svgParts.push(
        `<text x="${swatchX + 22}" y="${swatchY}" class="swatch-label">${labelText}</text>`
      );

      swatchX += labelText.length * 7 + 45;
    });
  }

  // Group for Grid and Beads
  const originX = marginLeft;
  const originY = marginTop;

  // 1. Grid Background & Row highlights
  for (let r = 0; r < totalRows; r++) {
    const y = originY + r * rowHeight;
    const isClasp = isClaspRow(r);

    if (isClasp) {
      svgParts.push(
        `<rect x="${originX}" y="${y}" width="${gridWidth}" height="${rowHeight}" fill="#ff0000" fill-opacity="0.12" stroke="#ff4444" stroke-opacity="0.3" stroke-width="1" />`
      );
    } else {
      const patternRowNum = r; // 1-indexed for pattern
      if (patternRowNum % 10 === 0) {
        svgParts.push(
          `<rect x="${originX}" y="${y}" width="${gridWidth}" height="${rowHeight}" fill="#ffffff" fill-opacity="0.06" />`
        );
      } else if (patternRowNum % 5 === 0) {
        svgParts.push(
          `<rect x="${originX}" y="${y}" width="${gridWidth}" height="${rowHeight}" fill="#ffffff" fill-opacity="0.03" />`
        );
      }
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
  for (let r = 0; r <= totalRows; r++) {
    const y = originY + r * rowHeight;
    const isClaspLine = r === 0 || r === 1 || r === totalRows - 1 || r === totalRows;
    const strokeColor = isClaspLine ? "#ff5555" : (r - 1) % 10 === 0 ? "#777777" : (r - 1) % 5 === 0 ? "#555555" : "#333333";
    const strokeWidth = isClaspLine ? "1.5" : "1";
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
    for (let r = 0; r < totalRows; r++) {
      const cy = originY + r * rowHeight + rowHeight / 2;
      const isClasp = isClaspRow(r);
      const rowLabel = getRowLabel(r, false);

      if (isClasp) {
        // Left margin
        svgParts.push(
          `<text x="${originX - 30}" y="${cy}" class="loom-clasp-text">clasp</text>`
        );
        // Right margin
        svgParts.push(
          `<text x="${originX + gridWidth + 30}" y="${cy}" class="loom-clasp-text">clasp</text>`
        );
      } else {
        const patternRowNum = r; // 1 to 98
        const isKeyRow = patternRowNum % 10 === 0 || patternRowNum === 1 || patternRowNum === claspData.numPatternRows;
        const isSubKeyRow = patternRowNum % 5 === 0;
        const textClass = isKeyRow
          ? "loom-text loom-num-highlight"
          : "loom-text";
        const opacity = isKeyRow ? "1" : isSubKeyRow ? "0.9" : "0.5";

        // Left margin row number
        svgParts.push(
          `<text x="${originX - 30}" y="${cy}" class="${textClass}" opacity="${opacity}">${rowLabel}</text>`
        );
        // Right margin row number
        svgParts.push(
          `<text x="${originX + gridWidth + 30}" y="${cy}" class="${textClass}" opacity="${opacity}">${rowLabel}</text>`
        );
      }
    }
  }

  // 6. Draw Beads (Бусины)
  const beadW = colWidth - beadGap;
  const beadH = rowHeight - beadGap;
  const beadRx = 3;

  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const cellAlias = extendedMatrix[r][c];
      const colorDef = palette[cellAlias] || { fill: "#ffffff", name: "Unknown" };
      const beadFill = getBeadFill(r, c, colorDef.fill);

      const bx = originX + c * colWidth + beadGap / 2;
      const by = originY + r * rowHeight + beadGap / 2;

      // Draw bead rectangle
      svgParts.push(
        `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${beadW.toFixed(1)}" height="${beadH.toFixed(1)}" rx="${beadRx}" fill="${beadFill}" stroke="#000000" stroke-opacity="0.35" stroke-width="0.8" />`
      );

      // Inner highlight
      svgParts.push(
        `<rect x="${(bx + 2).toFixed(1)}" y="${(by + 2).toFixed(1)}" width="${(beadW - 4).toFixed(1)}" height="${(beadH / 3).toFixed(1)}" rx="1.5" fill="#ffffff" fill-opacity="0.15" />`
      );
    }
  }

  svgParts.push(`</svg>`);

  return svgParts.join("\n");
}

/**
 * Generates exact original-style SVG image with vibrant random clasp rows.
 */
export function generateOriginalPatternSvg(
  matrix: string[][],
  palette: Record<string, ColorDefinition> = COLOR_PALETTE
): string {
  const claspData = wrapMatrixWithClasp(matrix);
  const { extendedMatrix, numCols, totalRows, getBeadFill } = claspData;

  const stepX = 24.875;
  const beadW = 22.877;
  const startX = 1.877;

  // 1 : 1.2 aspect ratio for loom beadwork
  const stepY = stepX * 1.2; // 29.85
  const beadH = beadW * 1.2; // 27.4524
  const startY = 32.0;
  const totalHeight = Math.ceil(startY + (totalRows - 1) * stepY + beadH + 2);
  const canvasWidth = Math.ceil(startX + (numCols - 1) * stepX + beadW + 2);

  const svgParts: string[] = [];
  svgParts.push(
    `<svg width="${canvasWidth}" height="${totalHeight}" viewBox="0 0 ${canvasWidth} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">`
  );
  svgParts.push(`<rect width="${canvasWidth}" height="${totalHeight}" fill="black"/>`);

  for (let r = 0; r < totalRows; r++) {
    const y1 = (startY + r * stepY).toFixed(4);
    const y2 = (parseFloat(y1) + beadH).toFixed(4);

    for (let c = 0; c < numCols; c++) {
      const cellAlias = extendedMatrix[r][c];
      const colorDef = palette[cellAlias] || { fill: "#F1D397" };
      const beadFill = getBeadFill(r, c, colorDef.fill);

      const x1 = (startX + c * stepX).toFixed(3);
      const x2 = (parseFloat(x1) + beadW).toFixed(3);

      svgParts.push(
        `<path d="M${x2} ${y2}L${x2} ${y1}L${x1} ${y1}L${x1} ${y2}Z" fill="${beadFill}"/>`
      );
    }
  }

  svgParts.push(`</svg>`);
  return svgParts.join("\n");
}
