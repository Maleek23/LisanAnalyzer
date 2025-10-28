import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import WordAnalysis from "@/components/WordAnalysis";
import WordRequestDialog from "@/components/WordRequestDialog";
import PrayerTimeToggle from "@/components/PrayerTimeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface WordData {
  word: string;
  transliteration: string;
  root: string;
  meanings: Array<{
    arabic: string;
    english: string;
    context: string;
    exampleVerse?: string;
  }>;
  hasDeepAnalysis: boolean;
  usageStatistics: Array<{
    meaning: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  grammarPatterns: Array<{
    form: string;
    frequency: number;
    examples: string[];
  }>;
  syntaxRoles: Array<{
    role: string;
    description: string;
    frequency: number;
  }>;
  tafsir?: Array<{
    scholar: string;
    text: string;
    layer: string;
    century: number;
    translation: string;
  }>;
  occurrences: Array<{
    surah: number;
    ayah: number;
    arabicText: string;
    translations: Array<{ translator: string; text: string }>;
    meaningUsed?: string;
    hasQualifier?: string;
    qualifier?: string | null;
    usageCategory?: string;
    verbForm?: string;
  }>;
  occurrenceCount: number;
}

export default function WordPage() {
  const [, params] = useRoute("/word/:word");
  const word = params?.word || "";

  const { data, isLoading, error } = useQuery<WordData>({
    queryKey: ['/api/word', word],
    enabled: !!word,
  });

  const isNotFound = error && (error as any).status === 404;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-background to-cream dark:from-background dark:via-background dark:to-background">
      {/* Fixed Header with Prayer Time Toggle */}
      <header className="fixed top-0 right-0 z-50 p-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-lg shadow-md border border-border p-2">
          <PrayerTimeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <Link href="/">
          <Button variant="ghost" className="mb-6 md:mb-8 hover-elevate" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-semibold">Back to Home</span>
          </Button>
        </Link>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-gold blur-xl opacity-20 animate-pulse"></div>
              <Loader2 className="relative w-16 h-16 md:w-20 md:h-20 animate-spin text-primary" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-crimson animate-pulse">
              Loading linguistic analysis...
            </p>
          </div>
        )}

        {error && !isNotFound && (
          <Card className="border-2 border-destructive/50 bg-destructive/5 shadow-lg">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-destructive" />
                </div>
                <p className="text-lg md:text-xl font-semibold text-destructive">
                  Failed to load word analysis
                </p>
                <p className="text-sm text-muted-foreground">
                  Please try again or return home to search for another word.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isNotFound && (
          <Card className="border-2 border-primary/20 shadow-2xl bg-white overflow-hidden" data-testid="card-word-not-found">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-primary"></div>
            
            <CardHeader className="text-center space-y-6 pt-12 pb-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-gold/10 p-6 rounded-full">
                    <BookOpen className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <CardTitle className="text-4xl md:text-5xl font-amiri text-primary leading-tight">
                  Word Not Found
                </CardTitle>
                <div className="w-24 h-1 bg-gradient-to-r from-primary via-gold to-primary mx-auto rounded-full"></div>
              </div>
              <CardDescription className="text-lg md:text-xl font-crimson max-w-2xl mx-auto leading-relaxed text-foreground/70 px-4">
                We don't have an analysis for <span className="font-amiri text-2xl text-gold">{word}</span> yet, but you can request it! 
                Requested words are prioritized based on community interest.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-8 pb-12 px-6">
              <div className="bg-gradient-to-br from-primary/5 to-gold/5 p-8 rounded-2xl border border-primary/10 max-w-xl mx-auto">
                <p className="font-bold text-lg mb-4 text-primary">What happens next?</p>
                <ul className="text-base text-left text-foreground/80 space-y-3 font-crimson">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span>Your request is added to our priority queue</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span>Multiple requests increase priority</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span>Scholars review and analyze the word</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-xl">✓</span>
                    <span>You'll be notified when it's ready (if email provided)</span>
                  </li>
                </ul>
              </div>
              
              <WordRequestDialog 
                defaultWord={word}
                trigger={
                  <Button size="lg" className="mt-6 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-shadow" data-testid="button-request-analysis">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Request Analysis for "{word}"
                  </Button>
                }
              />

              <p className="text-sm text-muted-foreground font-crimson mt-6">
                Or <Link href="/" className="text-primary hover:underline font-semibold">search for another word</Link>
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="animate-in fade-in-50 duration-700">
            <WordAnalysis
              word={data.word}
              transliteration={data.transliteration || word}
              root={data.root}
              verbForm={data.occurrences[0]?.verbForm}
              meanings={data.meanings || []}
              occurrences={data.occurrences || []}
              occurrenceCount={data.occurrenceCount}
              hasDeepAnalysis={data.hasDeepAnalysis}
              usageStatistics={data.usageStatistics || []}
              grammarPatterns={data.grammarPatterns || []}
              syntaxRoles={data.syntaxRoles || []}
              tafsir={data.tafsir}
            />
          </div>
        )}
      </div>
    </div>
  );
}
