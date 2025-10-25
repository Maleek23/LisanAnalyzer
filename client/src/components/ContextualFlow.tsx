import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertCircle } from "lucide-react";

export function ContextualFlow() {
  return (
    <div className="space-y-8" data-testid="contextual-flow">
      <div className="space-y-3">
        <h3 className="text-2xl font-crimson font-bold">Contextual Flow Analysis</h3>
        <p className="text-muted-foreground leading-relaxed">
          Understanding 4:34 requires reading it alongside 4:35, which immediately follows with reconciliation instructions
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Verse 4:34 */}
        <Card className="flex-1 border-destructive/50 w-full" data-testid="card-verse-4-34">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="text-sm font-semibold text-destructive">Verse 4:34</div>
              <div className="px-3 py-1 bg-destructive/10 rounded text-xs font-medium text-destructive whitespace-nowrap">
                Controversial
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-cream/30 rounded-md" dir="rtl">
                <p className="font-amiri text-xl leading-loose text-right">
                  ...وَاللَّاتِي تَخَافُونَ نُشُوزَهُنَّ فَعِظُوهُنَّ وَاهْجُرُوهُنَّ فِي الْمَضَاجِعِ وَاضْرِبُوهُنَّ...
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Three-Step Process:</p>
                <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground leading-relaxed">
                  <li className="break-words"><span className="font-medium font-amiri">فَعِظُوهُنَّ</span> - Advise them</li>
                  <li className="break-words"><span className="font-medium font-amiri">وَاهْجُرُوهُنَّ</span> - Separate beds</li>
                  <li className="break-words"><span className="font-medium font-amiri">وَاضْرِبُوهُنَّ</span> - "Daraba" (disputed)</li>
                </ol>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-900">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                  <strong>Key Observation:</strong> The word appears WITHOUT grammatical qualifiers - 
                  unlike other physical "strike" verses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="flex-shrink-0 flex items-center justify-center lg:py-0 py-2">
          <ArrowRight className="h-8 w-8 text-primary lg:rotate-0 rotate-90" />
        </div>

        {/* Verse 4:35 */}
        <Card className="flex-1 border-emerald-500/50 w-full" data-testid="card-verse-4-35">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="text-sm font-semibold text-emerald-600">Verse 4:35</div>
              <div className="px-3 py-1 bg-emerald-500/10 rounded text-xs font-medium text-emerald-600 whitespace-nowrap">
                Arbitration
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-cream/30 rounded-md" dir="rtl">
                <p className="font-amiri text-xl leading-loose text-right">
                  وَإِنْ خِفْتُمْ شِقَاقَ بَيْنِهِمَا فَابْعَثُوا حَكَمًا مِّنْ أَهْلِهِ وَحَكَمًا مِّنْ أَهْلِهَا...
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">Immediate Next Step:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Translation:</strong> "If you fear dissension between them, send arbitrators from both families..."
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-md border border-emerald-200 dark:border-emerald-900">
                <AlertCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">
                  <strong>Critical Context:</strong> The Quran immediately follows with family arbitration - 
                  suggesting separation/mediation, not conflict escalation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insight */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Why This Matters</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reading verses in isolation creates misunderstanding. The Quran's structure is deliberate: 4:34's final step 
              flows directly into 4:35's arbitration. This supports interpreting "wadribuhunna" as <strong>"separate from them"</strong> 
              or <strong>"leave them"</strong> - which logically leads to involving family mediators.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Prophet Muhammad (ﷺ) said: <em>"The best of you are those who are best to their wives"</em> (Tirmidhi). 
              He never struck any of his wives. This prophetic practice must inform how we understand 4:34.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
