import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Verses table - stores Quranic verses
export const verses = pgTable("verses", {
  id: serial("id").primaryKey(),
  surah: integer("surah").notNull(),
  ayah: integer("ayah").notNull(),
  arabicText: text("arabic_text").notNull(),
  simpleText: text("simple_text"), // simplified for search
  transliteration: text("transliteration"),
}, (table) => ({
  surahAyahIdx: index("surah_ayah_idx").on(table.surah, table.ayah),
  surahAyahUnique: sql`UNIQUE (surah, ayah)`,
}));

// Translations table - stores verse translations
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  verseId: integer("verse_id").notNull().references(() => verses.id),
  translator: varchar("translator", { length: 100 }).notNull(),
  text: text("text").notNull(),
}, (table) => ({
  verseTranslatorIdx: index("verse_translator_idx").on(table.verseId, table.translator),
}));

// Roots table - stores Arabic word roots and their meanings
export const roots = pgTable("roots", {
  id: serial("id").primaryKey(),
  root: varchar("root", { length: 10 }).notNull().unique(),
  meanings: jsonb("meanings").$type<{
    arabic: string;
    english: string;
    context: string;
    exampleVerse?: string;
  }[]>(),
  classicalDefinition: text("classical_definition"),
  modernUsage: text("modern_usage"),
});

// Word occurrences table - tracks where words appear in Quran
export const wordOccurrences = pgTable("word_occurrences", {
  id: serial("id").primaryKey(),
  word: varchar("word", { length: 50 }).notNull(),
  transliteration: varchar("transliteration", { length: 100 }), // English transliteration
  rootId: integer("root_id").references(() => roots.id),
  verseId: integer("verse_id").notNull().references(() => verses.id),
  meaningUsed: text("meaning_used"),
  syntaxRole: varchar("syntax_role", { length: 100 }), // fa'il, maf'ul, jarr, etc.
  verbForm: varchar("verb_form", { length: 100 }), // Form I, II, III, etc.
  hasQualifier: varchar("has_qualifier", { length: 20 }), // 'yes', 'no', 'n/a' - does verse specify WHAT to strike with or WHERE?
  qualifier: text("qualifier"), // The actual qualifier text (e.g., "with your staff", "on their necks")
  usageCategory: varchar("usage_category", { length: 50 }), // 'physical_with_object', 'metaphorical', 'controversial', etc.
}, (table) => ({
  wordIdx: index("word_idx").on(table.word),
  transliterationIdx: index("transliteration_idx").on(table.transliteration),
  rootIdx: index("root_idx").on(table.rootId),
  verseIdx: index("verse_idx").on(table.verseId),
  categoryIdx: index("category_idx").on(table.usageCategory),
}));

// Tafsir (scholarly commentary) table
export const tafsir = pgTable("tafsir", {
  id: serial("id").primaryKey(),
  verseId: integer("verse_id").notNull().references(() => verses.id),
  scholar: varchar("scholar", { length: 100 }).notNull(), // 'tabari', 'ibn_kathir', 'qurtubi', etc.
  text: text("text").notNull(),
  layer: varchar("layer", { length: 50 }), // 'linguistic', 'rhetorical', 'exegetical', 'modern'
  century: integer("century"), // 2 = 8th century (200 AH), 9 = 15th century, etc.
  translation: text("translation"), // English translation of tafsir
}, (table) => ({
  verseLayerIdx: index("verse_layer_idx").on(table.verseId, table.layer),
}));

// Insert schemas
export const insertVerseSchema = createInsertSchema(verses).omit({ id: true });
export const insertTranslationSchema = createInsertSchema(translations).omit({ id: true });
export const insertRootSchema = createInsertSchema(roots).omit({ id: true });
export const insertWordOccurrenceSchema = createInsertSchema(wordOccurrences).omit({ id: true });
export const insertTafsirSchema = createInsertSchema(tafsir).omit({ id: true });

// Select types
export type Verse = typeof verses.$inferSelect;
export type Translation = typeof translations.$inferSelect;
export type Root = typeof roots.$inferSelect;
export type WordOccurrence = typeof wordOccurrences.$inferSelect;
export type Tafsir = typeof tafsir.$inferSelect;

export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type InsertRoot = z.infer<typeof insertRootSchema>;
export type InsertWordOccurrence = z.infer<typeof insertWordOccurrenceSchema>;
export type InsertTafsir = z.infer<typeof insertTafsirSchema>;
