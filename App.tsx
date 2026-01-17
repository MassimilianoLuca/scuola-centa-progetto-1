
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './components/Button';
import { PuzzlePiece } from './components/PuzzlePiece';
import { AppMode, PuzzleConfig } from './types';

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('setup');
  const [config, setConfig] = useState<PuzzleConfig>({
    imageSrc: '',
    rows: 3,
    cols: 3,
    title: 'Cosa si nasconde?',
    aspectRatio: 1
  });
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        
        // Calcoliamo l'aspect ratio dell'immagine caricata
        const img = new Image();
        img.onload = () => {
          setConfig(prev => ({ 
            ...prev, 
            imageSrc: dataUrl, 
            aspectRatio: img.width / img.height 
          }));
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStart = () => {
    if (!config.imageSrc) return;
    setRevealedIndices(new Set());
    setMode('play');
  };

  const handleReset = () => {
    setMode('setup');
    setRevealedIndices(new Set());
  };

  const toggleReveal = (index: number) => {
    setRevealedIndices(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const totalPieces = config.rows * config.cols;
  const isAllRevealed = revealedIndices.size === totalPieces;

  useEffect(() => {
    if (isAllRevealed && mode === 'play') {
      const timer = setTimeout(() => {
        setMode('finished');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAllRevealed, mode]);

  return (
    <div className="min-h-screen flex flex-col items-center p-2 md:p-6 bg-[#fdfcf0]">
      {/* Header compatto */}
      <header className="w-full max-w-7xl flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-playful font-bold text-blue-600 tracking-tight flex items-center">
           🧩 <span className="ml-2 hidden sm:inline">I.C. Vigolo Vattaro</span>
        </h1>
        {mode !== 'setup' && (
          <Button variant="danger" onClick={handleReset} className="scale-90 px-4 py-2">
            Nuovo Puzzle
          </Button>
        )}
      </header>

      {/* Area principale */}
      <main className="w-full max-w-full flex-grow flex flex-col items-center justify-center">
        
        {mode === 'setup' && (
          <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-playful">Configura il Puzzle</h2>
            
            <div className="space-y-6">
              {/* Image Input */}
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Immagine da caricare</label>
                <div className={`relative h-48 w-full border-4 border-dashed rounded-2xl flex flex-col items-center justify-center transition-colors overflow-hidden ${config.imageSrc ? 'border-green-300 bg-green-50' : 'border-blue-200 hover:bg-blue-50'}`}>
                  {config.imageSrc ? (
                    <>
                      <img src={config.imageSrc} alt="Preview" className="h-full w-full object-contain p-2" />
                      <button 
                        onClick={() => setConfig(prev => ({ ...prev, imageSrc: '' }))}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      <UploadIcon />
                      <span className="text-blue-500 font-bold">Clicca per caricare l'immagine</span>
                    </>
                  )}
                </div>
              </div>

              {/* Grid Size Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider block">Righe</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="15" 
                    value={config.rows}
                    onChange={(e) => setConfig(prev => ({ ...prev, rows: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 outline-none text-xl font-bold text-center"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider block">Colonne</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="15" 
                    value={config.cols}
                    onChange={(e) => setConfig(prev => ({ ...prev, cols: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 outline-none text-xl font-bold text-center"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">Titolo della sfida</label>
                <input 
                  type="text" 
                  value={config.title}
                  placeholder="Cosa si nasconde?"
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-400 outline-none"
                />
              </div>

              <Button 
                variant="primary" 
                className="w-full mt-4 text-xl py-4 flex items-center justify-center"
                disabled={!config.imageSrc}
                onClick={handleStart}
              >
                <PlayIcon /> GIOCA ORA
              </Button>
            </div>
          </div>
        )}

        {(mode === 'play' || mode === 'finished') && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {config.title && (
              <h2 className="text-2xl md:text-4xl font-playful font-bold text-blue-700 mb-4 text-center px-4">
                {config.title}
              </h2>
            )}

            {/* Puzzle Container: Occupa il massimo spazio possibile mantenendo l'aspect ratio dell'immagine */}
            <div 
              className={`relative bg-white p-2 md:p-4 rounded-xl shadow-2xl border-4 border-white overflow-hidden transition-all duration-700 ${mode === 'finished' ? 'scale-[1.02]' : 'scale-100'}`}
              style={{
                width: 'min(95vw, 85vh * ' + (config.aspectRatio || 1) + ')',
                maxWidth: '95vw',
                maxHeight: '80vh',
                aspectRatio: `${config.aspectRatio}`,
                display: 'grid',
                gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                gap: '1px'
              }}
            >
              {Array.from({ length: totalPieces }).map((_, i) => {
                const row = Math.floor(i / config.cols);
                const col = i % config.cols;
                return (
                  <PuzzlePiece
                    key={i}
                    imageSrc={config.imageSrc}
                    rows={config.rows}
                    cols={config.cols}
                    row={row}
                    col={col}
                    isRevealed={revealedIndices.has(i) || mode === 'finished'}
                    onReveal={() => toggleReveal(i)}
                  />
                );
              })}

              {mode === 'finished' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                   <div className="bg-yellow-400/90 text-blue-900 px-8 py-4 rounded-full text-2xl md:text-5xl font-playful font-bold shadow-2xl animate-bounce border-4 border-white text-center">
                     COMPLETATO! 🌟
                   </div>
                </div>
              )}
            </div>

            {/* Controlli inferiori */}
            <div className="mt-4 flex flex-wrap justify-center items-center gap-4 w-full">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md border-2 border-blue-100 min-w-[200px]">
                <div className="flex-grow">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Progresso</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-600">{revealedIndices.size} / {totalPieces}</span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full ml-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(revealedIndices.size / totalPieces) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="accent" onClick={handleStart} className="px-4 py-2 text-sm">
                Rinascondi Tutto
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-4 text-blue-300 text-xs font-medium">
         I.C. Vigolo Vattaro
      </footer>
    </div>
  );
};

export default App;
