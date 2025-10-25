import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import WordAnalysis from "@/components/WordAnalysis";
import WordRequestDialog from "@/components/WordRequestDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";
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

  // Check if error is 404 (word not found)
  const isNotFound = error && (error as any).status === 404;

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {error && !isNotFound && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <p className="text-destructive">
                Failed to load word analysis. Please try again.
              </p>
            </CardContent>
          </Card>
        )}

        {isNotFound && (
          <Card className="border-2 border-primary/20" data-testid="card-word-not-found">
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="flex justify-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <BookOpen className="w-12 h-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-amiri text-primary">
                Word Not Found
              </CardTitle>
              <CardDescription className="text-base font-crimson max-w-md mx-auto">
                We don't have an analysis for "{word}" yet, but you can request it! 
                Requested words are prioritized based on community interest.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4 pb-6">
              <div className="bg-accent/30 p-4 rounded-lg space-y-2">
                <p className="font-semibold text-sm">What happens next?</p>
                <ul className="text-sm text-muted-foreground space-y-1 font-crimson">
                  <li>✓ Your request is added to our priority queue</li>
                  <li>✓ Multiple requests increase priority</li>
                  <li>✓ Scholars review and analyze the word</li>
                  <li>✓ You'll be notified when it's ready (if email provided)</li>
                </ul>
              </div>
              
              <WordRequestDialog 
                defaultWord={word}
                trigger={
                  <Button size="lg" className="mt-4" data-testid="button-request-analysis">
                    Request Analysis for "{word}"
                  </Button>
                }
              />

              <p className="text-xs text-muted-foreground font-crimson mt-4">
                Or <Link href="/" className="text-primary hover:underline">search for another word</Link>
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <WordAnalysis
            word={data.word} // Arabic word from API
            transliteration={data.transliteration || word} // Transliteration from API, fallback to URL
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
        )}
      </div>
    </div>
  );
}
