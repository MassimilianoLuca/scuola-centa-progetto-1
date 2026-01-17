
import React from 'react';

interface PuzzlePieceProps {
  imageSrc: string;
  rows: number;
  cols: number;
  row: number;
  col: number;
  isRevealed: boolean;
  onReveal: () => void;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  imageSrc,
  rows,
  cols,
  row,
  col,
  isRevealed,
  onReveal
}) => {
  // Calcolo delle posizioni percentuali per mappare correttamente l'immagine
  // Usiamo (100 / (numero_totale - 1)) * indice per allineare i bordi
  const posX = cols > 1 ? (col / (cols - 1)) * 100 : 0;
  const posY = rows > 1 ? (row / (rows - 1)) * 100 : 0;

  const isTopEdge = row === 0;
  const isBottomEdge = row === rows - 1;
  const isLeftEdge = col === 0;
  const isRightEdge = col === cols - 1;

  // Clip path dinamico per l'effetto puzzle senza distorsioni
  const getClipPath = () => {
    // Definizione dei "dentini" del puzzle (tabs e slots)
    const t = isTopEdge ? '0% 0%, 100% 0%' : '0% 0%, 35% 0%, 35% 8%, 65% 8%, 65% 0%, 100% 0%';
    const r = isRightEdge ? '100% 100%' : '100% 35%, 92% 35%, 92% 65%, 100% 65%, 100% 100%';
    const b = isBottomEdge ? '0% 100%' : '65% 100%, 65% 92%, 35% 92%, 35% 100%, 0% 100%';
    const l = isLeftEdge ? '0% 0%' : '0% 65%, 8% 65%, 8% 35%, 0% 35%, 0% 0%';
    
    return `polygon(${t}, ${r}, ${b}, ${l})`;
  };

  return (
    <div 
      className="perspective-1000 w-full h-full cursor-pointer transition-transform hover:scale-[1.01] active:scale-95 select-none"
      onClick={() => !isRevealed && onReveal()}
      style={{
        zIndex: isRevealed ? 1 : 0
      }}
    >
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
        
        {/* Fronte (Nascosto) */}
        <div 
          className="absolute inset-0 backface-hidden flex items-center justify-center bg-blue-500 border border-blue-400 shadow-inner"
          style={{ clipPath: getClipPath() }}
        >
           <div className="text-white text-3xl font-bold opacity-20">?</div>
        </div>

        {/* Retro (Svelato) - Nessuna deformazione grazie a backgroundSize e backgroundPosition mapplati sul grid */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 shadow-md overflow-hidden"
          style={{
            clipPath: getClipPath(),
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: `${cols * 100}% ${rows * 100}%`,
            backgroundPosition: `${posX}% ${posY}%`,
            backgroundRepeat: 'no-repeat',
            imageRendering: 'auto'
          }}
        />
      </div>
    </div>
  );
};
