import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import WordAnalysis from "@/components/WordAnalysis";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <p className="text-destructive">
                Failed to load word analysis. Please try again.
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
            tafsir={data.tafsir}
          />
        )}
      </div>
    </div>
  );
}
