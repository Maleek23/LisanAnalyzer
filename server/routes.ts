import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { verses, translations, roots, wordOccurrences, tafsir } from "@shared/schema";
import { eq, or, ilike, sql, inArray } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search for words (Arabic or transliteration)
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      // Search in word occurrences and roots
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
      const wordResult = await db
        .select()
        .from(wordOccurrences)
        .leftJoin(roots, eq(wordOccurrences.rootId, roots.id))
        .where(
          or(
            ilike(wordOccurrences.word, word),
            ilike(wordOccurrences.transliteration, word)
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
      for (const entries of verseTafsir.values()) {
        allTafsir.push(...entries);
      }

      const response = {
        word: arabicWord, // Return actual Arabic word
        transliteration: wordTransliteration, // Return actual transliteration
        root: rootData?.root || '',
        meanings: rootData?.meanings || [],
        classicalDefinition: rootData?.classicalDefinition,
        modernUsage: rootData?.modernUsage,
        occurrenceCount,
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

  const httpServer = createServer(app);
  return httpServer;
}
