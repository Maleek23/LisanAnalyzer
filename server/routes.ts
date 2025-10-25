import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { 
  verses, 
  translations, 
  roots, 
  wordOccurrences, 
  tafsir, 
  wordSubmissions,
  insertWordSubmissionSchema,
  moderationQueue
} from "@shared/schema";
import { eq, or, ilike, sql, inArray, desc } from "drizzle-orm";

// Helper function to get color for usage category
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'set_forth_example': '#2C5282',
    'travel_journey': '#2C5F2D',
    'physical_with_object': '#8B0000',
    'controversial_separation': '#D4AF37',
    'metaphorical_coverage': '#0F5F4E',
    'metaphorical_stamped': '#4A5568',
    'uncategorized': '#6B7280',
  };
  return colors[category] || '#6B7280';
}

// Helper function to get syntax role description
function getSyntaxRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    'fa_il': 'Subject/Agent - The doer of the action',
    'maf_ul': 'Object - The receiver of the action',
    'jarr': 'Prepositional phrase - Indicates location, time, or manner',
    'mubtada': 'Subject of nominal sentence',
    'khabar': 'Predicate of nominal sentence',
    'sifah': 'Adjective/Attribute',
    'mudaf': 'Possessor (first part of construct)',
    'mudaf_ilayh': 'Possessed (second part of construct)',
  };
  return descriptions[role] || 'Grammatical role in sentence structure';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Search for words (Arabic or transliteration)
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      // Search supports both Arabic and transliteration
      // Use exact + partial matching for comprehensive results
      const results = await db
        .select({
          word: wordOccurrences.word,
          root: roots.root,
          meanings: roots.meanings,
        })
        .from(wordOccurrences)
        .leftJoin(roots, eq(wordOccurrences.rootId, roots.id))
        .where(
          or(
            // Exact matches (best for Arabic)
            eq(wordOccurrences.word, query),
            eq(roots.root, query),
            eq(wordOccurrences.transliteration, query),
            // Partial matches (good for transliteration)
            ilike(wordOccurrences.word, `%${query}%`),
            ilike(roots.root, `%${query}%`),
            ilike(wordOccurrences.transliteration, `%${query}%`)
          )
        )
        .limit(10);

      // Deduplicate by word
      const uniqueWords = Array.from(
        new Map(results.map(r => [r.word, r])).values()
      );

      res.json(uniqueWords);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to search" });
    }
  });

  // Get word analysis
  app.get("/api/word/:word", async (req, res) => {
    try {
      const { word } = req.params;

      // First, find the word to get its root (search by Arabic word or transliteration)
      // Use exact match first, then fall back to similarity matching
      const wordResult = await db
        .select()
        .from(wordOccurrences)
        .leftJoin(roots, eq(wordOccurrences.rootId, roots.id))
        .where(
          or(
            eq(wordOccurrences.word, word),
            eq(wordOccurrences.transliteration, word),
            sql`${wordOccurrences.word} % ${word}`,
            sql`${wordOccurrences.transliteration} % ${word}`
          )
        )
        .limit(1);

      if (wordResult.length === 0) {
        return res.status(404).json({ error: "Word not found" });
      }

      const rootData = wordResult[0].roots;
      const rootId = wordResult[0].word_occurrences.rootId;

      // Now get ALL occurrences of this root (all word forms from same root)
      const occurrences = await db
        .select()
        .from(wordOccurrences)
        .leftJoin(roots, eq(wordOccurrences.rootId, roots.id))
        .where(eq(wordOccurrences.rootId, rootId!));

      const occurrenceCount = occurrences.length;

      // Get all verses where this word appears with translations
      const verseIds = occurrences.map(o => o.word_occurrences.verseId);
      const versesData = await db
        .select()
        .from(verses)
        .where(inArray(verses.id, verseIds));

      // Get translations for these verses
      const translationsData = await db
        .select()
        .from(translations)
        .where(inArray(translations.verseId, verseIds));

      // Get tafsir (scholarly commentary) for these verses
      const tafsirData = await db
        .select()
        .from(tafsir)
        .where(inArray(tafsir.verseId, verseIds));

      // Group translations by verse
      const verseTranslations = new Map();
      for (const trans of translationsData) {
        if (!verseTranslations.has(trans.verseId)) {
          verseTranslations.set(trans.verseId, []);
        }
        verseTranslations.get(trans.verseId).push({
          translator: trans.translator,
          text: trans.text,
        });
      }

      // Group tafsir by verse
      const verseTafsir = new Map();
      for (const taf of tafsirData) {
        if (!verseTafsir.has(taf.verseId)) {
          verseTafsir.set(taf.verseId, []);
        }
        verseTafsir.get(taf.verseId).push({
          scholar: taf.scholar,
          text: taf.text,
          layer: taf.layer,
          century: taf.century,
          translation: taf.translation,
        });
      }

      // Build response - use the Arabic word from database, not the search query
      const arabicWord = occurrences[0].word_occurrences.word;
      const wordTransliteration = occurrences[0].word_occurrences.transliteration;
      
      // Collect all tafsir entries across all verses
      const allTafsir: any[] = [];
      for (const entries of Array.from(verseTafsir.values())) {
        allTafsir.push(...entries);
      }

      // Calculate usage statistics
      const usageStats = new Map<string, number>();
      const grammarPatterns = new Map<string, { frequency: number; examples: string[] }>();
      const syntaxRoles = new Map<string, number>();

      for (const occ of occurrences) {
        const category = occ.word_occurrences.usageCategory || 'uncategorized';
        usageStats.set(category, (usageStats.get(category) || 0) + 1);

        const verbForm = occ.word_occurrences.verbForm;
        if (verbForm) {
          if (!grammarPatterns.has(verbForm)) {
            grammarPatterns.set(verbForm, { frequency: 0, examples: [] });
          }
          const pattern = grammarPatterns.get(verbForm)!;
          pattern.frequency++;
          if (pattern.examples.length < 3) {
            pattern.examples.push(occ.word_occurrences.word);
          }
        }

        const syntax = occ.word_occurrences.syntaxRole;
        if (syntax) {
          syntaxRoles.set(syntax, (syntaxRoles.get(syntax) || 0) + 1);
        }
      }

      // Format usage statistics for pie chart
      const usageStatistics = Array.from(usageStats.entries()).map(([category, count]) => ({
        meaning: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        percentage: (count / occurrenceCount) * 100,
        color: getCategoryColor(category),
      }));

      // Check if this word has deep analysis
      const hasDeepAnalysis = occurrences.some(occ => 
        occ.word_occurrences.usageCategory && 
        occ.word_occurrences.meaningUsed
      );

      const response = {
        word: arabicWord, // Return actual Arabic word
        transliteration: wordTransliteration, // Return actual transliteration
        root: rootData?.root || '',
        meanings: rootData?.meanings || [],
        classicalDefinition: rootData?.classicalDefinition,
        modernUsage: rootData?.modernUsage,
        occurrenceCount,
        hasDeepAnalysis,
        usageStatistics,
        grammarPatterns: Array.from(grammarPatterns.entries()).map(([form, data]) => ({
          form,
          frequency: data.frequency,
          examples: data.examples,
        })),
        syntaxRoles: Array.from(syntaxRoles.entries()).map(([role, count]) => ({
          role: role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: getSyntaxRoleDescription(role),
          frequency: count,
        })),
        tafsir: allTafsir, // All tafsir entries across all occurrences
        occurrences: versesData.map(v => {
          const occurrence = occurrences.find(o => o.word_occurrences.verseId === v.id);
          return {
            surah: v.surah,
            ayah: v.ayah,
            arabicText: v.arabicText,
            transliteration: v.transliteration,
            meaningUsed: occurrence?.word_occurrences.meaningUsed,
            syntaxRole: occurrence?.word_occurrences.syntaxRole,
            verbForm: occurrence?.word_occurrences.verbForm,
            hasQualifier: occurrence?.word_occurrences.hasQualifier,
            qualifier: occurrence?.word_occurrences.qualifier,
            usageCategory: occurrence?.word_occurrences.usageCategory,
            translations: verseTranslations.get(v.id) || [],
            tafsir: verseTafsir.get(v.id) || [], // Tafsir per verse
          };
        }),
      };

      res.json(response);
    } catch (error) {
      console.error("Word analysis error:", error);
      res.status(500).json({ error: "Failed to analyze word" });
    }
  });

  // Get specific verse with translations
  app.get("/api/verse/:surah/:ayah", async (req, res) => {
    try {
      const surah = parseInt(req.params.surah);
      const ayah = parseInt(req.params.ayah);

      const verse = await db
        .select()
        .from(verses)
        .where(
          sql`${verses.surah} = ${surah} AND ${verses.ayah} = ${ayah}`
        )
        .limit(1);

      if (verse.length === 0) {
        return res.status(404).json({ error: "Verse not found" });
      }

      const verseData = verse[0];
      const translationsData = await db
        .select()
        .from(translations)
        .where(eq(translations.verseId, verseData.id));

      res.json({
        ...verseData,
        translations: translationsData.map(t => ({
          translator: t.translator,
          text: t.text,
        })),
      });
    } catch (error) {
      console.error("Verse lookup error:", error);
      res.status(500).json({ error: "Failed to get verse" });
    }
  });

  // Get all roots (for debugging/admin)
  app.get("/api/roots", async (req, res) => {
    try {
      const allRoots = await db.select().from(roots);
      res.json(allRoots);
    } catch (error) {
      console.error("Roots error:", error);
      res.status(500).json({ error: "Failed to get roots" });
    }
  });

  // Submit a word request
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertWordSubmissionSchema.parse(req.body);
      
      // Check if word already exists in database
      const existingWord = await db
        .select()
        .from(wordOccurrences)
        .where(
          or(
            eq(wordOccurrences.word, validatedData.word),
            eq(wordOccurrences.transliteration, validatedData.transliteration || '')
          )
        )
        .limit(1);

      if (existingWord.length > 0) {
        return res.status(400).json({ 
          error: "Word already exists in database",
          word: existingWord[0].word,
          transliteration: existingWord[0].transliteration
        });
      }

      // Check if word already submitted
      const existingSubmission = await db
        .select()
        .from(wordSubmissions)
        .where(eq(wordSubmissions.word, validatedData.word))
        .limit(1);

      if (existingSubmission.length > 0) {
        // Increment request count for duplicate requests
        const updated = await db
          .update(wordSubmissions)
          .set({ 
            requestCount: sql`${wordSubmissions.requestCount} + 1`,
            updatedAt: new Date()
          })
          .where(eq(wordSubmissions.id, existingSubmission[0].id))
          .returning();

        return res.json({ 
          message: "Word request already exists - increased priority",
          submission: updated[0]
        });
      }

      // Create new submission
      const [newSubmission] = await db
        .insert(wordSubmissions)
        .values(validatedData)
        .returning();

      res.status(201).json(newSubmission);
    } catch (error: any) {
      console.error("Submission error:", error);
      res.status(400).json({ error: error.message || "Failed to submit word request" });
    }
  });

  // Get all submissions (for admin/moderation)
  app.get("/api/submissions", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      
      let query = db.select().from(wordSubmissions);
      
      if (status) {
        query = query.where(eq(wordSubmissions.status, status)) as any;
      }
      
      const submissions = await query.orderBy(desc(wordSubmissions.priority), desc(wordSubmissions.requestCount));
      
      res.json(submissions);
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ error: "Failed to get submissions" });
    }
  });

  // Update submission status (for admin/moderation)
  app.patch("/api/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, priority } = req.body;

      const updateData: any = { updatedAt: new Date() };
      if (status) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;

      const [updated] = await db
        .update(wordSubmissions)
        .set(updateData)
        .where(eq(wordSubmissions.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Submission not found" });
      }

      res.json(updated);
    } catch (error: any) {
      console.error("Update submission error:", error);
      res.status(400).json({ error: error.message || "Failed to update submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
