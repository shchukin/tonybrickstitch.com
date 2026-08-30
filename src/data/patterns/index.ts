import type { PatternDefinition } from "./types";
import { BEZIER_GOLD_PATTERN } from "./bezierGold";
import { WRISTBAND_OF_EERIE_NIGHT_PATTERN } from "./wristbandOfEerieNight";
import { WRISTBAND_OF_EERIE_NIGHT_16CM_PATTERN } from "./wristbandOfEerieNight16cm";
import { WRISTBAND_OF_EERIE_NIGHT_135CM_PATTERN } from "./wristbandOfEerieNight135cm";

export * from "./types";
export { BEZIER_GOLD_PATTERN } from "./bezierGold";
export { WRISTBAND_OF_EERIE_NIGHT_PATTERN } from "./wristbandOfEerieNight";
export { WRISTBAND_OF_EERIE_NIGHT_16CM_PATTERN } from "./wristbandOfEerieNight16cm";
export { WRISTBAND_OF_EERIE_NIGHT_135CM_PATTERN } from "./wristbandOfEerieNight135cm";

export const PATTERNS_LIST: PatternDefinition[] = [
  BEZIER_GOLD_PATTERN,
  WRISTBAND_OF_EERIE_NIGHT_PATTERN,
  WRISTBAND_OF_EERIE_NIGHT_16CM_PATTERN,
  WRISTBAND_OF_EERIE_NIGHT_135CM_PATTERN,
];

export const PATTERNS_REGISTRY: Record<string, PatternDefinition> = {
  "bezier-gold": BEZIER_GOLD_PATTERN,
  "wristband-of-eerie-night": WRISTBAND_OF_EERIE_NIGHT_PATTERN,
  "wristband-of-eerie-night-16cm": WRISTBAND_OF_EERIE_NIGHT_16CM_PATTERN,
  "wristband-of-eerie-night-13.5cm": WRISTBAND_OF_EERIE_NIGHT_135CM_PATTERN,
};

export const DEFAULT_PATTERN_ID = "bezier-gold";

export function getPatternById(id?: string | null): PatternDefinition {
  if (!id || !(id in PATTERNS_REGISTRY)) {
    return BEZIER_GOLD_PATTERN;
  }
  return PATTERNS_REGISTRY[id];
}
