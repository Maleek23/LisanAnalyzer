import { Bot, Sparkles, BookOpenText } from "lucide-react";

export interface TimelineEra {
  century: number;
  scholars: string[];
  interpretation: string;
  dominantMeaning: string;
  percentage: number;
}

interface SemanticTimelineProps {
  word: string;
  data: TimelineEra[];
}

function getCenturyLabel(century: number): string {
  const startYear = (century - 1) * 100 + 622;
  const endYear = century * 100 + 622;
  return `${century}${century === 1 ? 'st' : century === 2 ? 'nd' : century === 3 ? 'rd' : 'th'} Century AH (${startYear}-${endYear} CE)`;
}

export default function SemanticTimeline({ word, data }: SemanticTimelineProps) {
  if (!data || data.length === 0) return null;

  const midCentury = Math.floor(data.length / 2);

  return (
    <div className="relative py-8 md:py-12" data-testid="semantic-timeline">
      <h3 className="text-h3 heading-section mb-6 md:mb-8 text-primary flex items-center gap-3">
        <BookOpenText className="w-7 h-7 md:w-8 md:h-8 text-scholar-gold" data-testid="icon-semantic-timeline" />
        <span data-testid="text-semantic-timeline-title">Semantic Evolution Across {data.length} Centuries</span>
      </h3>
      
      {/* Timeline Container */}
      <div className="relative bg-gradient-to-r from-aged-paper via-manuscript-beige to-aged-paper dark:from-background dark:via-muted dark:to-background rounded-xl p-4 md:p-8 overflow-hidden">
        
        {/* Vertical Timeline Axis */}
        <div className="absolute left-8 md:left-12 top-8 bottom-8 w-1 bg-scholar-gold"></div>
        
        {/* Timeline Eras */}
        <div className="space-y-6 md:space-y-8">
          {data.map((era, idx) => (
            <div 
              key={era.century}
              className="relative flex items-start gap-4 md:gap-6"
              style={{ 
                opacity: 0.3 + (idx * 0.7 / data.length),
                transform: `translateX(${idx * 8}px)` 
              }}
            >
              {/* Timeline Dot */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-scholar-gold flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg">
                  {era.century}
                </div>
              </div>
              
              {/* Era Card */}
              <div className="flex-1 bg-white dark:bg-card rounded-lg p-4 md:p-6 shadow-md border-l-4 border-scholar-gold hover-elevate transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                  <span className="text-xs md:text-sm font-bold text-scholar-gold uppercase tracking-wide">
                    {getCenturyLabel(era.century)}
                  </span>
                  <span className="text-xs bg-scholar-gold/20 dark:bg-scholar-gold/30 text-scholar-gold px-3 py-1 rounded-full font-semibold w-fit">
                    {era.percentage}% consensus
                  </span>
                </div>
                
                <p className="font-bold text-base md:text-lg mb-3 text-foreground">
                  "{era.dominantMeaning}"
                </p>
                
                <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                  {era.interpretation}
                </p>
                
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
                    Key Scholars:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {era.scholars.slice(0, 3).map((scholar, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-parchment-cream dark:bg-muted px-3 py-1.5 rounded-md font-medium"
                      >
                        {scholar}
                      </span>
                    ))}
                    {era.scholars.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1.5 italic">
                        +{era.scholars.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Insight Panel */}
      <div className="mt-8 p-6 md:p-8 bg-gradient-to-r from-insight-purple/10 via-data-blue/10 to-insight-purple/10 dark:from-insight-purple/20 dark:via-data-blue/20 dark:to-insight-purple/20 rounded-xl border-2 border-insight-purple/30 dark:border-insight-purple/40 shadow-lg hover-elevate transition-all" data-testid="ai-insight">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-insight-purple to-data-blue flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-bold text-lg md:text-xl text-foreground">
                AI Pattern Recognition
              </h4>
              <Sparkles className="w-5 h-5 text-insight-purple" />
            </div>
            <p className="text-sm md:text-base leading-relaxed text-foreground/90">
              Analysis of <strong>{data.length} centuries</strong> of tafsir reveals a{' '}
              <strong className="text-insight-purple">gradual evolution</strong> in interpretation. 
              Starting from the {data[0].century}th century with "{data[0].dominantMeaning}" ({data[0].percentage}% consensus), 
              the meaning shifted around the <strong>{data[midCentury]?.century}th century</strong>, 
              correlating with increased scholarly discourse and cross-cultural exchange in Islamic civilization. 
              By the {data[data.length - 1].century}th century, "{data[data.length - 1].dominantMeaning}" 
              emerged with {data[data.length - 1].percentage}% consensus.
            </p>
            
            <div className="mt-4 pt-4 border-t border-insight-purple/20">
              <p className="text-xs md:text-sm text-muted-foreground italic">
                This timeline demonstrates how linguistic understanding deepens over time 
                as scholars build upon previous interpretations while maintaining reverence 
                for the original meaning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
