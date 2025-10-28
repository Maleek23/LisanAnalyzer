import { db } from "../server/db";
import { wordOccurrences, verses, roots, tafsir } from "../shared/schema";
import { eq, sql, and } from "drizzle-orm";

// Download and parse Quranic morphology data
async function fetchMorphologyData() {
  console.log("📥 Downloading morphology data...");
  const response = await fetch(
    "https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt"
  );
  const text = await response.text();
  return text.split("\n").filter(line => line.trim());
}

// Parse morphology line
// Format: 1:1:1:1بِPP|PREF|LEM:ب
function parseMorphologyLine(line: string) {
  // Split by | to get features
  const parts = line.split("|");
  if (parts.length < 2) return null;

  // First part contains location + arabicWord + POS
  // Format: surah:ayah:word:segment + arabicWord + POS_TAG
  const firstPart = parts[0];
  const locationMatch = firstPart.match(/^(\d+):(\d+):(\d+):(\d+)(.+)$/);
  if (!locationMatch) return null;

  const [, surah, ayah, wordPos, segment, wordAndPos] = locationMatch;
  
  // Extract POS tag (uppercase letters at end) and arabic word
  const posMatch = wordAndPos.match(/^(.+?)([A-Z]+)$/);
  if (!posMatch) return null;
  
  const arabicWord = posMatch[1];
  const pos = posMatch[2];
  
  // Find ROOT and LEM in features
  let root: string | null = null;
  let lemma: string | null = null;

  for (const part of parts.slice(1)) {
    if (part.startsWith("ROOT:")) {
      root = part.substring(5);
    } else if (part.startsWith("LEM:")) {
      lemma = part.substring(4);
    }
  }

  return {
    surah: parseInt(surah),
    ayah: parseInt(ayah),
    wordPos: parseInt(wordPos),
    segment: parseInt(segment),
    arabicWord,
    root,
    lemma,
    pos,
    features: parts.slice(1).join("|")
  };
}

async function main() {
  const lines = await fetchMorphologyData();
  console.log(`✅ Downloaded ${lines.length} morphology entries`);

  console.log("\n🔍 Parsing morphology data...");
  const parsed = lines.map(parseMorphologyLine).filter(Boolean);
  console.log(`✅ Parsed ${parsed.length} entries`);

  // Group by word (surah:ayah:wordPos) and combine segments
  type ParsedEntry = NonNullable<ReturnType<typeof parseMorphologyLine>>;
  const wordGroups = new Map<string, ParsedEntry[]>();
  
  for (const entry of parsed) {
    if (!entry) continue;
    const key = `${entry.surah}:${entry.ayah}:${entry.wordPos}`;
    if (!wordGroups.has(key)) {
      wordGroups.set(key, []);
    }
    wordGroups.get(key)!.push(entry);
  }

  console.log(`✅ Grouped into ${wordGroups.size} unique words`);

  // Collect unique roots
  const rootsSet = new Set<string>();
  for (const segments of wordGroups.values()) {
    const mainSegment = segments.find(s => s.root) || segments[0];
    if (mainSegment?.root) {
      rootsSet.add(mainSegment.root);
    }
  }
  console.log(`✅ Found ${rootsSet.size} unique roots`);

  console.log("\n📊 Creating word occurrences in database...");
  let createdCount = 0;
  let errorCount = 0;

  for (const [key, segments] of wordGroups) {
    if (!segments || segments.length === 0) continue;

    // Combine all segments to get the full word
    const fullWord = segments.map(s => s.arabicWord).join("");
    
    // Get main segment with root (usually segment 2)
    const mainSegment = segments.find(s => s.root) || segments[0];
    if (!mainSegment) continue;

    const [surah, ayah, wordPos] = key.split(":").map(Number);

    try {
      // Find corresponding verse
      const verse = await db
        .select({ id: verses.id })
        .from(verses)
        .where(and(
          eq(verses.surah, surah),
          eq(verses.ayah, ayah)
        ))
        .limit(1);

      if (verse.length === 0) {
        // Verse not in database yet, skip
        continue;
      }

      // Check if word occurrence already exists
      const existing = await db
        .select({ id: wordOccurrences.id })
        .from(wordOccurrences)
        .where(and(
          eq(wordOccurrences.surah, surah),
          eq(wordOccurrences.ayah, ayah),
          eq(wordOccurrences.position, wordPos)
        ))
        .limit(1);

      if (existing.length > 0) {
        // Update existing
        await db
          .update(wordOccurrences)
          .set({
            word: fullWord,
            root: mainSegment.root,
            lemma: mainSegment.lemma,
            pos: mainSegment.pos,
            morphology: mainSegment.features
          })
          .where(eq(wordOccurrences.id, existing[0].id));
      } else {
        // Insert new
        await db.insert(wordOccurrences).values({
          word: fullWord,
          verseId: verse[0].id,
          surah,
          ayah,
          position: wordPos,
          root: mainSegment.root,
          lemma: mainSegment.lemma,
          pos: mainSegment.pos,
          morphology: mainSegment.features,
          rootId: null,
          transliteration: null,
          meaningUsed: null,
          syntaxRole: null,
          verbForm: null,
          hasQualifier: null,
          qualifier: null,
          usageCategory: null
        });
      }

      createdCount++;
      if (createdCount % 500 === 0) {
        console.log(`  Processed ${createdCount} words...`);
      }
    } catch (error) {
      errorCount++;
      if (errorCount < 10) {
        console.error(`Error processing ${key}:`, error);
      }
    }
  }

  console.log(`\n✅ Created/updated ${createdCount} word occurrences`);
  console.log(`⚠️  ${errorCount} errors`);
  console.log("\n✨ Import complete!");
}

main().catch(console.error);
