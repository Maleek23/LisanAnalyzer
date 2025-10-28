import { Info, Flame } from "lucide-react";

export interface GrammarPattern {
  context: string;
  meanings: {
    meaning: string;
    occurrences: number;
  }[];
}

interface GrammarHeatMapProps {
  word: string;
  patterns: GrammarPattern[];
}

function formatContext(context: string): string {
  return context
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function GrammarHeatMap({ word, patterns }: GrammarHeatMapProps) {
  if (!patterns || patterns.length === 0) return null;

  // Get all unique meanings across all patterns
  const allMeanings = Array.from(
    new Set(patterns.flatMap(p => p.meanings.map(m => m.meaning)))
  );

  // Calculate max occurrences for intensity scaling
  const maxOccurrences = Math.max(
    ...patterns.flatMap(p => p.meanings.map(m => m.occurrences))
  );

  return (
    <div className="my-8 md:my-12" data-testid="grammar-heatmap">
      <h3 className="text-h3 heading-section mb-6 md:mb-8 text-primary flex items-center gap-3">
        <Flame className="w-7 h-7 md:w-8 md:h-8 text-warning-red" data-testid="icon-grammar-heatmap" />
        <span data-testid="text-grammar-heatmap-title">Grammar Context Heat Map</span>
      </h3>
      
      <div className="bg-white dark:bg-card rounded-xl shadow-lg p-4 md:p-8 overflow-x-auto">
        {/* Info Banner */}
        <div className="mb-6 p-4 bg-data-blue/10 dark:bg-data-blue/20 rounded-lg border border-data-blue/30">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-data-blue flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80">
              This heat map shows how the word's meaning changes based on grammatical context. 
              Darker cells indicate more frequent usage in that specific context-meaning combination.
            </p>
          </div>
        </div>

        {/* Heat Map Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-aged-paper dark:border-border">
                <th className="text-left py-4 px-4 font-bold text-sm md:text-base sticky left-0 bg-white dark:bg-card z-10">
                  Grammatical Context
                </th>
                {allMeanings.map(meaning => (
                  <th 
                    key={meaning} 
                    className="text-center py-4 px-2 text-xs md:text-sm font-bold min-w-[100px]"
                  >
                    <div className="max-w-[120px] mx-auto">
                      {meaning}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patterns.map((pattern, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-aged-paper/50 dark:border-border/50 hover:bg-aged-paper/30 dark:hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4 font-semibold text-sm md:text-base sticky left-0 bg-white dark:bg-card">
                    {formatContext(pattern.context)}
                  </td>
                  {allMeanings.map(meaningName => {
                    const meaningData = pattern.meanings.find(m => m.meaning === meaningName);
                    const occurrences = meaningData?.occurrences || 0;
                    const intensity = maxOccurrences > 0 ? occurrences / maxOccurrences : 0;
                    
                    return (
                      <td key={meaningName} className="text-center py-4 px-2">
                        <div 
                          className="mx-auto w-12 h-12 md:w-14 md:h-14 rounded-md flex items-center justify-center font-bold text-xs md:text-sm transition-all hover:scale-110 cursor-pointer shadow-sm"
                          style={{
                            backgroundColor: occurrences > 0 
                              ? `rgba(212, 175, 55, ${Math.max(0.15, intensity)})` 
                              : 'transparent',
                            color: intensity > 0.5 ? 'white' : 'hsl(var(--foreground))',
                            border: occurrences === 0 ? '1px dashed hsl(var(--border))' : 'none'
                          }}
                          title={occurrences > 0 ? `${occurrences} occurrence${occurrences > 1 ? 's' : ''} in this context` : 'Not used in this context'}
                          data-testid={`heatmap-cell-${idx}-${meaningName}`}
                        >
                          {occurrences > 0 ? occurrences : '—'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-aged-paper dark:border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm">
            <span className="font-semibold text-foreground">Intensity Scale:</span>
            <div className="flex items-center gap-3 flex-wrap">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
                <div key={intensity} className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-md shadow-sm"
                    style={{ backgroundColor: `rgba(212, 175, 55, ${intensity})` }}
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    {Math.round(intensity * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-scholar-gold/10 dark:bg-scholar-gold/20 rounded-lg">
            <p className="text-xs md:text-sm text-foreground/80">
              <strong className="text-scholar-gold">Key Insight:</strong> Pay attention to high-intensity cells — 
              they reveal the most common meaning-context pairings. Empty cells (—) indicate combinations 
              not found in the Quran, helping you understand which interpretations are contextually impossible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
