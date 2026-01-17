
export interface PuzzleConfig {
  imageSrc: string;
  rows: number;
  cols: number;
  title: string;
  aspectRatio?: number; // Larghezza / Altezza originale
}

export type AppMode = 'setup' | 'play' | 'finished';
