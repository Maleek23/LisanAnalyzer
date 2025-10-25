import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertCircle } from "lucide-react";

export function ContextualFlow() {
  return (
    <div className="space-y-6" data-testid="contextual-flow">
      <div>
        <h3 className="text-2xl font-crimson font-bold mb-2">Contextual Flow Analysis</h3>
        <p className="text-muted-foreground">
          Understanding 4:34 requires reading it alongside 4:35, which immediately follows with reconciliation instructions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Verse 4:34 */}
        <Card className="flex-1 border-destructive/50" data-testid="card-verse-4-34">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="text-sm font-semibold text-destructive">Verse 4:34</div>
              <div className="px-2 py-1 bg-destructive/10 rounded text-xs font-medium text-destructive">
                Controversial
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-cream/30 rounded-md" dir="rtl">
                <p className="font-amiri text-lg leading-relaxed text-right">
                  ...وَاللَّاتِي تَخَافُونَ نُشُوزَهُنَّ فَعِظُوهُنَّ وَاهْجُرُوهُنَّ فِي الْمَضَاجِعِ وَاضْرِبُوهُنَّ...
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Three-Step Process:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li><span className="font-medium">فَعِظُوهُنَّ</span> - Advise them</li>
                  <li><span className="font-medium">وَاهْجُرُوهُنَّ</span> - Separate beds (forsake intimacy)</li>
                  <li><span className="font-medium">وَاضْرِبُوهُنَّ</span> - "Daraba" them (disputed meaning)</li>
                </ol>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-900">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-900 dark:text-amber-100">
                  <strong>Key Observation:</strong> The word "واضربوهن" (wadribuhunna) appears WITHOUT grammatical qualifiers - 
                  unlike ALL other physical "strike" verses which specify instruments or body parts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ArrowRight className="h-8 w-8 text-primary" />
        </div>

        {/* Verse 4:35 */}
        <Card className="flex-1 border-emerald-500/50" data-testid="card-verse-4-35">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="text-sm font-semibold text-emerald-600">Verse 4:35</div>
              <div className="px-2 py-1 bg-emerald-500/10 rounded text-xs font-medium text-emerald-600">
                Arbitration
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-cream/30 rounded-md" dir="rtl">
                <p className="font-amiri text-lg leading-relaxed text-right">
                  وَإِنْ خِفْتُمْ شِقَاقَ بَيْنِهِمَا فَابْعَثُوا حَكَمًا مِّنْ أَهْلِهِ وَحَكَمًا مِّنْ أَهْلِهَا...
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Immediate Next Step:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Translation:</strong> "And if you fear dissension between the two, send an arbitrator from his people and an arbitrator from her people..."
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded border border-emerald-200 dark:border-emerald-900">
                <AlertCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-emerald-900 dark:text-emerald-100">
                  <strong>Critical Context:</strong> The Quran IMMEDIATELY follows with family arbitration and reconciliation - 
                  suggesting the previous verse aims toward separation/mediation, not escalation of conflict.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Why This Matters</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reading verses in isolation creates misunderstanding. The Quran's structure is deliberate: 4:34's final step flows directly into 4:35's arbitration.
              This supports interpreting "wadribuhunna" as <strong>"separate from them"</strong> or <strong>"leave them"</strong> - which logically leads to involving family mediators,
              rather than physical contact which would contradict the reconciliation theme.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Prophet Muhammad (ﷺ) said: <em>"The best of you are those who are best to their wives"</em> (Tirmidhi). 
              He never struck any of his wives and forbade striking women's faces. This prophetic practice must inform how we understand 4:34.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
