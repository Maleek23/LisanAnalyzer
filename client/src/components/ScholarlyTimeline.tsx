import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scroll, Clock, BookOpen } from "lucide-react";

interface TafsirEntry {
  scholar: string;
  text: string;
  layer: string;
  century: number;
  translation: string;
}

interface ScholarlyTimelineProps {
  tafsir: TafsirEntry[];
}

export function ScholarlyTimeline({ tafsir }: ScholarlyTimelineProps) {
  if (!tafsir || tafsir.length === 0) {
    return null;
  }

  // Sort by century (oldest first)
  const sortedTafsir = [...tafsir].sort((a, b) => a.century - b.century);

  // Get layer display info
  const getLayerInfo = (layer: string) => {
    const layers: Record<string, { label: string; color: string }> = {
      linguistic: { label: "Linguistic Analysis", color: "bg-emerald-500" },
      exegetical: { label: "Exegetical Commentary", color: "bg-blue-500" },
      rhetorical: { label: "Rhetorical Analysis", color: "bg-purple-500" },
      modern: { label: "Modern Interpretation", color: "bg-orange-500" },
    };
    return layers[layer] || { label: layer, color: "bg-gray-500" };
  };

  // Get century display text
  const getCenturyText = (century: number) => {
    if (century >= 20) {
      return `${century}st Century CE`;
    }
    return `${century}th Century CE (${century + 6}th Century AH)`;
  };

  return (
    <div className="space-y-6" data-testid="scholarly-timeline">
      <div className="flex items-center gap-2 mb-6">
        <Scroll className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-crimson font-bold">Scholarly Interpretations Timeline</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {sortedTafsir.map((entry, index) => {
            const layerInfo = getLayerInfo(entry.layer);
            return (
              <div key={index} className="relative pl-20" data-testid={`tafsir-entry-${index}`}>
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background" />

                <Card className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="font-crimson flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {entry.scholar}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {getCenturyText(entry.century)}
                        </CardDescription>
                      </div>
                      <Badge className={layerInfo.color} data-testid={`badge-layer-${entry.layer}`}>
                        {layerInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Arabic text for classical scholars */}
                    {entry.century < 20 && (
                      <div className="p-4 bg-cream/30 rounded-md" dir="rtl">
                        <p className="font-amiri text-lg leading-relaxed text-right">{entry.text}</p>
                      </div>
                    )}

                    {/* English translation/interpretation */}
                    <div className="prose prose-sm max-w-none">
                      <p className="text-base leading-relaxed">{entry.translation}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key insight callout */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Scholarly Evolution</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Notice how modern scholars increasingly emphasize linguistic analysis and prophetic practice.
                While classical scholars discussed permissibility with strict conditions, contemporary scholars
                question whether the verse refers to physical contact at all, citing grammar patterns and the
                Prophet's (ﷺ) exemplary treatment of women.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
