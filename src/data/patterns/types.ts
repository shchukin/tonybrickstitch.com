import type { ColorDefinition } from "../studioPattern";

export interface PatternDefinition {
  id: string;
  name: string;
  description: string;
  matrix: string[][];
  palette: Record<string, ColorDefinition>;
}
