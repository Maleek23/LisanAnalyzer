import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, BookOpen, TrendingUp, GitBranch, Scroll } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import VerseCard from "./VerseCard";
import { ScholarlyTimeline } from "./ScholarlyTimeline";
import { ContextualFlow } from "./ContextualFlow";

interface Meaning {
  arabic: string;
  english: string;
  context: string;
  exampleVerse?: string;
}

interface TafsirEntry {
  scholar: string;
  text: string;
  layer: string;
  century: number;
  translation: string;
}

interface Occurrence {
  surah: number;
  ayah: number;
  arabicText: string;
  translations: { translator: string; text: string }[];
  meaningUsed?: string;
  hasQualifier?: string;
  qualifier?: string | null;
  usageCategory?: string;
  tafsir?: TafsirEntry[];
}

interface WordAnalysisProps {
  word: string;
  transliteration: string;
  root: string;
  verbForm?: string;
  meanings: Meaning[];
  occurrences: Occurrence[];
  occurrenceCount: number;
  tafsir?: TafsirEntry[];
}

export default function WordAnalysis({
  word,
  transliteration,
  root,
  verbForm,
  meanings,
  occurrences,
  occurrenceCount,
  tafsir = [],
}: WordAnalysisProps) {
  // Check if this is a controversial word
  const hasControversialOccurrence = occurrences.some(occ => occ.usageCategory === 'controversial');
  const hasTafsir = tafsir && tafsir.length > 0;
  
  // Calculate usage statistics
  const physicalCount = occurrences.filter(occ => occ.usageCategory === 'physical_with_object').length;
  const metaphoricalCount = occurrences.filter(occ => occ.usageCategory === 'metaphorical').length;
  const controversialCount = occurrences.filter(occ => occ.usageCategory === 'controversial').length;
  
  const totalCategorized = physicalCount + metaphoricalCount + controversialCount;
  const physicalPercent = totalCategorized > 0 ? Math.round((physicalCount / totalCategorized) * 100) : 0;
  const metaphoricalPercent = totalCategorized > 0 ? Math.round((metaphoricalCount / totalCategorized) * 100) : 0;
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {hasControversialOccurrence && (
        <Alert className="border-destructive/50 bg-destructive/5" data-testid="alert-controversy">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-lg font-semibold text-destructive">Historically Mistranslated Word</AlertTitle>
          <AlertDescription className="mt-2 text-foreground/80">
            This word has been subject to significant scholarly debate and has competing interpretations. 
            The linguistic analysis below examines grammar patterns, qualifiers, and contextual usage across 
            all Quranic occurrences to help you understand the full picture beyond viral mistranslations.
          </AlertDescription>
        </Alert>
      )}
      
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

      <Tabs defaultValue={hasControversialOccurrence ? "grammar" : "meanings"} className="w-full">
        <TabsList className="grid w-full h-auto" style={{ gridTemplateColumns: `repeat(${4 + (hasControversialOccurrence ? 2 : 0)}, minmax(0, 1fr))` }}>
          {hasControversialOccurrence && (
            <TabsTrigger value="grammar" className="text-base py-3" data-testid="tab-grammar">
              <TrendingUp className="w-4 h-4 mr-2" />
              Grammar Analysis
            </TabsTrigger>
          )}
          {hasControversialOccurrence && (
            <TabsTrigger value="context" className="text-base py-3" data-testid="tab-context">
              <GitBranch className="w-4 h-4 mr-2" />
              Contextual Flow
            </TabsTrigger>
          )}
          {hasTafsir && (
            <TabsTrigger value="scholarly" className="text-base py-3" data-testid="tab-scholarly">
              <Scroll className="w-4 h-4 mr-2" />
              Scholarly Timeline
            </TabsTrigger>
          )}
          <TabsTrigger value="meanings" className="text-base py-3" data-testid="tab-meanings">
            <BookOpen className="w-4 h-4 mr-2" />
            Meanings
          </TabsTrigger>
          <TabsTrigger value="occurrences" className="text-base py-3" data-testid="tab-occurrences">
            Quranic Occurrences
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-base py-3" data-testid="tab-comparison">
            Translation Comparison
          </TabsTrigger>
        </TabsList>

        {/* Contextual Flow Tab */}
        {hasControversialOccurrence && (
          <TabsContent value="context" className="mt-6">
            <ContextualFlow />
          </TabsContent>
        )}

        {/* Scholarly Timeline Tab */}
        {hasTafsir && (
          <TabsContent value="scholarly" className="mt-6">
            <ScholarlyTimeline tafsir={tafsir} />
          </TabsContent>
        )}

        {hasControversialOccurrence && (
          <TabsContent value="grammar" className="mt-6 space-y-6">
            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-primary">Usage Statistics</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-green-700 dark:text-green-400">{physicalCount}</div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-500 mt-1">Physical (with objects)</div>
                    <div className="text-xs text-muted-foreground mt-2">{physicalPercent}% of usage</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-blue-700 dark:text-blue-400">{metaphoricalCount}</div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-500 mt-1">Metaphorical (examples/travel)</div>
                    <div className="text-xs text-muted-foreground mt-2">{metaphoricalPercent}% of usage</div>
                  </div>
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-destructive">{controversialCount}</div>
                    <div className="text-sm font-medium text-destructive mt-1">Controversial (no qualifier)</div>
                    <div className="text-xs text-muted-foreground mt-2">Linguistically suspicious</div>
                  </div>
                </div>
                
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-md">
                  <p className="font-semibold text-primary mb-2">Key Insight</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    In Quranic Arabic, when <span className="font-amiri text-lg">{word}</span> means physical striking, 
                    the verse ALWAYS specifies WHAT to strike with (instrument) and/or WHERE to strike (location/body part). 
                    The absence of these qualifiers typically indicates a metaphorical or different meaning.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grammar Pattern Table */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-primary">Grammar Pattern Analysis</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Examining how qualifiers (or their absence) determine meaning
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary/20">
                        <th className="text-left p-3 font-semibold">Verse</th>
                        <th className="text-left p-3 font-semibold">Category</th>
                        <th className="text-left p-3 font-semibold">Has Qualifier?</th>
                        <th className="text-left p-3 font-semibold">Qualifier Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {occurrences.map((occ, idx) => (
                        <tr 
                          key={idx} 
                          className={`border-b border-border ${occ.usageCategory === 'controversial' ? 'bg-destructive/5' : ''}`}
                          data-testid={`row-grammar-${occ.surah}-${occ.ayah}`}
                        >
                          <td className="p-3 font-mono text-sm">
                            {occ.surah}:{occ.ayah}
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={occ.usageCategory === 'controversial' ? 'destructive' : 'secondary'}
                              className="capitalize"
                            >
                              {occ.usageCategory?.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant={occ.hasQualifier === 'yes' ? 'default' : 'outline'}>
                              {occ.hasQualifier === 'yes' ? '✓ Yes' : '✗ No'}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {occ.qualifier || 'No qualifier specified'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

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
