import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import VerseCard from "./VerseCard";

interface Meaning {
  arabic: string;
  english: string;
  context: string;
  exampleVerse?: string;
}

interface Occurrence {
  surah: number;
  ayah: number;
  arabicText: string;
  translations: { translator: string; text: string }[];
}

interface WordAnalysisProps {
  word: string;
  transliteration: string;
  root: string;
  verbForm?: string;
  meanings: Meaning[];
  occurrences: Occurrence[];
  occurrenceCount: number;
}

export default function WordAnalysis({
  word,
  transliteration,
  root,
  verbForm,
  meanings,
  occurrences,
  occurrenceCount,
}: WordAnalysisProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-6xl font-amiri text-primary" dir="rtl" lang="ar" data-testid="text-word">
              {word}
            </h1>
            <p className="text-2xl text-muted-foreground italic" data-testid="text-transliteration">
              {transliteration}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge className="bg-gold text-white font-amiri text-xl px-6 py-2" data-testid="badge-root">
              Root: {root}
            </Badge>
            {verbForm && (
              <Badge variant="outline" className="text-primary border-primary text-lg px-4 py-2" data-testid="badge-verb-form">
                {verbForm}
              </Badge>
            )}
            <Badge variant="secondary" className="text-base px-4 py-2" data-testid="badge-occurrence-count">
              {occurrenceCount} occurrences in Quran
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="meanings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="meanings" className="text-base py-3" data-testid="tab-meanings">
            Meanings
          </TabsTrigger>
          <TabsTrigger value="occurrences" className="text-base py-3" data-testid="tab-occurrences">
            Quranic Occurrences
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-base py-3" data-testid="tab-comparison">
            Translation Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meanings" className="mt-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">Contextual Meanings</h2>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {meanings.map((meaning, index) => (
                  <AccordionItem key={index} value={`meaning-${index}`}>
                    <AccordionTrigger className="text-left" data-testid={`accordion-meaning-${index}`}>
                      <div className="flex flex-col items-start gap-2">
                        <span className="font-amiri text-xl text-primary" dir="rtl">
                          {meaning.arabic}
                        </span>
                        <span className="font-semibold text-foreground">{meaning.english}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-2">
                        <p className="text-muted-foreground">{meaning.context}</p>
                        {meaning.exampleVerse && (
                          <p className="text-sm italic text-primary/70">
                            Example: {meaning.exampleVerse}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occurrences" className="mt-6 space-y-4">
          {occurrences.map((occurrence, index) => (
            <VerseCard
              key={index}
              surah={occurrence.surah}
              ayah={occurrence.ayah}
              arabicText={occurrence.arabicText}
              highlightWord={word}
              translations={occurrence.translations}
            />
          ))}
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-primary">How Translators Differ</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground font-crimson">
                Different translators render this word in various ways, reflecting diverse interpretations
                of its contextual meaning in Quranic verses.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-md">
                <p className="font-semibold text-primary mb-2">Linguistic Note</p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  The root <span className="font-amiri text-lg">{root}</span> carries multiple semantic ranges.
                  Understanding the context of each verse is crucial for accurate interpretation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
