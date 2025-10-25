import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, ArrowRight } from "lucide-react";

export default function HadithPreview() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Stop Sharing Fake Hadiths
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-crimson">
            Verify authenticity instantly with chain of narration analysis and scholarly grading
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Before - Unverified */}
          <Card className="border-muted-foreground/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-foreground">
                  Unverified Social Media Post
                </h3>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-amber-500">
                <p className="text-sm font-amiri text-right leading-relaxed mb-2" dir="rtl" lang="ar">
                  طلب العلم فريضة على كل مسلم
                </p>
                <p className="text-sm text-muted-foreground italic font-crimson">
                  "Seeking knowledge is obligatory upon every Muslim"
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Shared 12,483 times on Twitter
                </p>
                <p className="text-sm text-muted-foreground">
                  No source cited, no chain of narration
                </p>
                <Badge variant="outline" className="text-amber-600 border-amber-600">
                  Authenticity Unknown
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* After - Verified */}
          <Card className="border-primary/40 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Verified by Lisan
                </h3>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <Badge className="mb-3 bg-primary hover:bg-primary">
                  ✓ Sahih (Authentic)
                </Badge>
                <p className="text-sm font-crimson text-foreground/90 mb-2">
                  <strong>Source:</strong> Sunan Ibn Majah (224)
                </p>
                <p className="text-sm font-crimson text-foreground/90">
                  <strong>Chain:</strong> Verified through 5 narrators to Anas ibn Malik (RA)
                </p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground font-crimson">
                <p>
                  <strong>Al-Albani grading:</strong> Hasan (Good)
                </p>
                <p>
                  <strong>Context:</strong> Emphasis on acquiring religious knowledge, 
                  not just worldly education
                </p>
              </div>

              <Button 
                className="w-full" 
                variant="outline"
                disabled
                data-testid="button-verify-hadith"
              >
                <span>Verify Any Hadith</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Coming soon in next update
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Grading Legend */}
        <div className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-foreground">Sahih</p>
              <p className="text-xs text-muted-foreground">Authentic, strong chain</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-foreground">Hasan/Daif</p>
              <p className="text-xs text-muted-foreground">Good or weak narration</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-foreground">Mawdu</p>
              <p className="text-xs text-muted-foreground">Fabricated or not found</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
