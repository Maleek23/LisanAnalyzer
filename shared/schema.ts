import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, jsonb, index, timestamp, boolean } from "drizzle-orm/pg-core";
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
  wordFocus: varchar("word_focus", { length: 50 }).notNull(), // REQUIRED: Which word this tafsir is about (e.g., 'ضَرَبَ')
  scholar: varchar("scholar", { length: 100 }).notNull(), // 'tabari', 'ibn_kathir', 'qurtubi', etc.
  text: text("text").notNull(),
  layer: varchar("layer", { length: 50 }), // 'linguistic', 'rhetorical', 'exegetical', 'modern'
  century: integer("century"), // 2 = 8th century (200 AH), 9 = 15th century, etc.
  translation: text("translation"), // English translation of tafsir
}, (table) => ({
  verseLayerIdx: index("verse_layer_idx").on(table.verseId, table.layer),
  wordFocusIdx: index("word_focus_idx").on(table.wordFocus),
}));

// Scholar profiles - for attribution and credibility
export const scholarProfiles = pgTable("scholar_profiles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 150 }).notNull(),
  affiliation: varchar("affiliation", { length: 200 }), // University, institution
  credentials: text("credentials"), // Brief bio/credentials
  expertise: text("expertise"), // Areas of specialization
  century: integer("century"), // For classical scholars
  isClassical: boolean("is_classical").default(false),
  websiteUrl: varchar("website_url", { length: 300 }),
});

// Word submission requests - users can request word analysis
export const wordSubmissions = pgTable("word_submissions", {
  id: serial("id").primaryKey(),
  word: varchar("word", { length: 50 }).notNull(), // Arabic word
  transliteration: varchar("transliteration", { length: 100 }), // Optional transliteration
  submitterEmail: varchar("submitter_email", { length: 200 }),
  reason: text("reason"), // Why they want this word analyzed
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, reviewing, approved, rejected, published
  priority: integer("priority").default(0), // Higher = more urgent
  requestCount: integer("request_count").default(1), // How many users requested this
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("submission_status_idx").on(table.status),
  wordIdx: index("submission_word_idx").on(table.word),
  priorityIdx: index("submission_priority_idx").on(table.priority),
}));

// Moderation queue - for reviewing and approving content
export const moderationQueue = pgTable("moderation_queue", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").references(() => wordSubmissions.id),
  contentType: varchar("content_type", { length: 50 }).notNull(), // 'word_analysis', 'tafsir', 'meaning'
  contentData: jsonb("content_data").notNull(), // The actual content being reviewed
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected
  reviewerId: integer("reviewer_id"), // Scholar who reviewed
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
}, (table) => ({
  statusIdx: index("moderation_status_idx").on(table.status),
  typeIdx: index("moderation_type_idx").on(table.contentType),
}));

// Insert schemas
export const insertVerseSchema = createInsertSchema(verses).omit({ id: true });
export const insertTranslationSchema = createInsertSchema(translations).omit({ id: true });
export const insertRootSchema = createInsertSchema(roots).omit({ id: true });
export const insertWordOccurrenceSchema = createInsertSchema(wordOccurrences).omit({ id: true });
export const insertTafsirSchema = createInsertSchema(tafsir).omit({ id: true });
export const insertScholarProfileSchema = createInsertSchema(scholarProfiles).omit({ id: true });
export const insertWordSubmissionSchema = createInsertSchema(wordSubmissions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertModerationQueueSchema = createInsertSchema(moderationQueue).omit({ id: true, createdAt: true, reviewedAt: true });

// Select types
export type Verse = typeof verses.$inferSelect;
export type Translation = typeof translations.$inferSelect;
export type Root = typeof roots.$inferSelect;
export type WordOccurrence = typeof wordOccurrences.$inferSelect;
export type Tafsir = typeof tafsir.$inferSelect;
export type ScholarProfile = typeof scholarProfiles.$inferSelect;
export type WordSubmission = typeof wordSubmissions.$inferSelect;
export type ModerationQueue = typeof moderationQueue.$inferSelect;

export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type InsertRoot = z.infer<typeof insertRootSchema>;
export type InsertWordOccurrence = z.infer<typeof insertWordOccurrenceSchema>;
export type InsertTafsir = z.infer<typeof insertTafsirSchema>;
export type InsertScholarProfile = z.infer<typeof insertScholarProfileSchema>;
export type InsertWordSubmission = z.infer<typeof insertWordSubmissionSchema>;
export type InsertModerationQueue = z.infer<typeof insertModerationQueueSchema>;
