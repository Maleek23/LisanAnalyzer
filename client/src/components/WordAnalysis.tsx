import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, BookOpen, TrendingUp, GitBranch, Scroll } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import VerseCard from "./VerseCard";
import { ScholarlyTimeline } from "./ScholarlyTimeline";
import { ContextualFlow } from "./ContextualFlow";
import UsageStatistics from "./UsageStatistics";
import FourLayerAnalysis from "./FourLayerAnalysis";
import EnhancedOccurrenceTable from "./EnhancedOccurrenceTable";
import SemanticTimeline, { TimelineEra } from "./SemanticTimeline";
import GrammarHeatMap, { GrammarPattern } from "./GrammarHeatMap";

// Helper functions
function getSurahName(surahNumber: number): string {
  const surahNames: Record<number, string> = {
    1: 'Al-Fatiha', 2: 'Al-Baqarah', 3: 'Ali Imran', 4: 'An-Nisa', 
    5: 'Al-Maidah', 6: 'Al-Anam', 7: 'Al-Araf', 8: 'Al-Anfal',
    // Add more as needed - simplified for now
  };
  return surahNames[surahNumber] || `Surah ${surahNumber}`;
}

function formatCategory(category?: string): string {
  if (!category) return '';
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getUniqueTranslators(occurrences: Occurrence[]): Array<{ id: string; name: string }> {
  const translatorSet = new Set<string>();
  occurrences.forEach(occ => {
    occ.translations.forEach(t => translatorSet.add(t.translator));
  });
  return Array.from(translatorSet).map(id => ({
    id,
    name: formatTranslatorName(id)
  }));
}

function formatTranslatorName(id: string): string {
  const names: Record<string, string> = {
    'en.sahih': 'Sahih International',
    'en.asad': 'Muhammad Asad',
    'en.pickthall': 'Marmaduke Pickthall',
    'en.yusufali': 'Yusuf Ali',
    'en.ahmedali': 'Ahmed Ali',
    'en.maududi': 'Abul Ala Maududi',
    'en.shakir': 'Mohammad Habib Shakir',
    'en.haleem': 'Abdel Haleem',
    'Sahih International': 'Sahih International',
    'Pickthall': 'Marmaduke Pickthall',
    'Yusuf Ali': 'Yusuf Ali',
  };
  return names[id] || id;
}

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
  hasDeepAnalysis,
  usageStatistics,
  grammarPatterns,
  syntaxRoles,
  tafsir = [],
}: WordAnalysisProps) {
  // Check if this is a controversial word
  const hasControversialOccurrence = occurrences.some(occ => occ.usageCategory === 'controversial_separation' || occ.usageCategory === 'controversial');
  const hasTafsir = tafsir && tafsir.length > 0;

  // Revolutionary Semantic Timeline Data (sample data for demonstration)
  const semanticTimelineData: TimelineEra[] = hasDeepAnalysis && word === "ضَرَبَ" ? [
    {
      century: 1,
      scholars: ["Ibn Abbas", "Mujahid", "Qatadah"],
      interpretation: "Early scholars emphasized the multiplicity of meanings based on grammatical context and surrounding words.",
      dominantMeaning: "Set forth an example / parable",
      percentage: 65
    },
    {
      century: 2,
      scholars: ["Al-Tabari", "Ibn Kathir", "Al-Qurtubi"],
      interpretation: "Classical tafsir further developed contextual analysis, noting that 'daraba' requires examining the direct object to determine meaning.",
      dominantMeaning: "Context-dependent usage",
      percentage: 75
    },
    {
      century: 8,
      scholars: ["Ibn Taymiyyah", "Ibn Qayyim", "Al-Shatibi"],
      interpretation: "Medieval scholars systematized the various meanings and their contextual indicators, creating comprehensive lexicons.",
      dominantMeaning: "Multiple meanings with grammatical rules",
      percentage: 80
    },
    {
      century: 14,
      scholars: ["Muhammad Asad", "Abdel Haleem", "Laleh Bakhtiar"],
      interpretation: "Modern scholars use corpus linguistics to show 'strike' is the minority usage, with 'set forth example' being most common.",
      dominantMeaning: "Data-driven contextual analysis",
      percentage: 85
    }
  ] : [];

  // Grammar Heat Map Data (sample for demonstration)
  const grammarHeatMapData: GrammarPattern[] = hasDeepAnalysis && word === "ضَرَبَ" ? [
    {
      context: "with_direct_object_example",
      meanings: [
        { meaning: "Set forth example", occurrences: 9 },
        { meaning: "Strike/Hit", occurrences: 0 },
        { meaning: "Travel", occurrences: 0 },
        { meaning: "Separate", occurrences: 0 }
      ]
    },
    {
      context: "with_preposition_fi",
      meanings: [
        { meaning: "Set forth example", occurrences: 0 },
        { meaning: "Strike/Hit", occurrences: 2 },
        { meaning: "Travel", occurrences: 4 },
        { meaning: "Separate", occurrences: 0 }
      ]
    },
    {
      context: "followed_by_person",
      meanings: [
        { meaning: "Set forth example", occurrences: 0 },
        { meaning: "Strike/Hit", occurrences: 1 },
        { meaning: "Travel", occurrences: 0 },
        { meaning: "Separate", occurrences: 0 }
      ]
    },
    {
      context: "with_preposition_bayn",
      meanings: [
        { meaning: "Set forth example", occurrences: 0 },
        { meaning: "Strike/Hit", occurrences: 0 },
        { meaning: "Travel", occurrences: 0 },
        { meaning: "Separate", occurrences: 1 }
      ]
    }
  ] : [];
  
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

      <Tabs defaultValue={hasDeepAnalysis ? "analysis" : "meanings"} className="w-full">
        <TabsList className="flex flex-wrap w-full h-auto gap-2 p-2">
          {hasDeepAnalysis && (
            <TabsTrigger value="analysis" className="text-sm py-2 px-3 flex-1 min-w-[140px]" data-testid="tab-analysis">
              <TrendingUp className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Analysis
            </TabsTrigger>
          )}
          {hasControversialOccurrence && (
            <TabsTrigger value="context" className="text-sm py-2 px-3 flex-1 min-w-[140px]" data-testid="tab-context">
              <GitBranch className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Context
            </TabsTrigger>
          )}
          {hasTafsir && (
            <TabsTrigger value="scholarly" className="text-sm py-2 px-3 flex-1 min-w-[140px]" data-testid="tab-scholarly">
              <Scroll className="w-4 h-4 mr-1.5 hidden sm:inline" />
              Scholarly
            </TabsTrigger>
          )}
          <TabsTrigger value="meanings" className="text-sm py-2 px-3 flex-1 min-w-[140px]" data-testid="tab-meanings">
            <BookOpen className="w-4 h-4 mr-1.5 hidden sm:inline" />
            Meanings
          </TabsTrigger>
          <TabsTrigger value="occurrences" className="text-sm py-2 px-3 flex-1 min-w-[140px]" data-testid="tab-occurrences">
            Occurrences
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-sm py-2 px-3 flex-1 min-w-[140px]" data-testid="tab-comparison">
            Translations
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

        {hasDeepAnalysis && (
          <TabsContent value="analysis" className="mt-6 space-y-6">
            {/* NEW: Interactive Usage Statistics Dashboard */}
            {usageStatistics.length > 0 && (
              <UsageStatistics 
                data={usageStatistics}
                totalOccurrences={occurrenceCount}
              />
            )}

            {/* REVOLUTIONARY: Semantic Timeline - 14 Centuries of Scholarship */}
            {semanticTimelineData.length > 0 && (
              <SemanticTimeline 
                word={word}
                data={semanticTimelineData}
              />
            )}

            {/* REVOLUTIONARY: Grammar Context Heat Map */}
            {grammarHeatMapData.length > 0 && (
              <GrammarHeatMap 
                word={word}
                patterns={grammarHeatMapData}
              />
            )}

            {/* NEW: 4-Layer Deep Analysis Tabs - NOW WITH FULL DATA */}
            <FourLayerAnalysis 
              grammarPatterns={grammarPatterns}
              syntaxRoles={syntaxRoles}
              hasDeepAnalysis={hasDeepAnalysis}
            />

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

        <TabsContent value="occurrences" className="mt-6">
          <EnhancedOccurrenceTable 
            occurrences={occurrences.map((occ, index) => ({
              id: index,
              surah: occ.surah,
              ayah: occ.ayah,
              surahName: getSurahName(occ.surah),
              arabicText: occ.arabicText,
              translation: occ.translations[0]?.text || '',
              category: formatCategory(occ.usageCategory),
              contextIndicators: occ.qualifier ? [occ.qualifier] : undefined,
            }))}
            categories={Array.from(new Set(occurrences.map(o => formatCategory(o.usageCategory)).filter(Boolean)))}
            translators={getUniqueTranslators(occurrences)}
          />
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
