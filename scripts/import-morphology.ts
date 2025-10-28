import { db } from "../server/db";
import { wordOccurrences, roots, tafsir } from "../shared/schema";
import { eq, sql } from "drizzle-orm";

// Download and parse Quranic morphology data
async function fetchMorphologyData() {
  const response = await fetch(
    "https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt"
  );
  const text = await response.text();
  return text.split("\n").filter(line => line.trim());
}

// Parse morphology line
// Format: 1:1:1:2سْمِNROOT:سمو|LEM:اسْم|M|GEN
function parseMorphologyLine(line: string) {
  const parts = line.split("|");
  if (parts.length < 2) return null;

  // Parse location and Arabic word
  const firstPart = parts[0];
  const match = firstPart.match(/^(\d+):(\d+):(\d+):(\d+)(.+)$/);
  if (!match) return null;

  const [, surah, ayah, wordPos, segment, arabicWord] = match;
  
  // Extract root
  const rootMatch = firstPart.match(/ROOT:([^\|]+)/);
  const root = rootMatch ? rootMatch[1] : null;

  // Extract lemma
  const lemmaMatch = firstPart.match(/LEM:([^\|]+)/);
  const lemma = lemmaMatch ? lemmaMatch[1] : null;

  // Extract POS tag (first character after arabic word)
  const posMatch = arabicWord.match(/[A-Z]+$/);
  const pos = posMatch ? posMatch[0] : null;

  return {
    surah: parseInt(surah),
    ayah: parseInt(ayah),
    wordPos: parseInt(wordPos),
    segment: parseInt(segment),
    arabicWord: arabicWord.replace(/[A-Z]+$/, ''), // Remove POS tag
    root,
    lemma,
    pos,
    features: parts.slice(1).join("|") // All remaining features
  };
}

// Fetch tafsir from spa5k API
async function fetchTafsir(scholarId: string, surah: number) {
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${scholarId}/${surah}.json`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${scholarId} for surah ${surah}:`, error);
    return null;
  }
}

async function main() {
  console.log("📥 Downloading morphology data...");
  const lines = await fetchMorphologyData();
  console.log(`✅ Downloaded ${lines.length} morphology entries`);

  console.log("\n🔍 Parsing morphology data...");
  const parsed = lines.map(parseMorphologyLine).filter(Boolean);
  console.log(`✅ Parsed ${parsed.length} entries`);

  // Group by word (surah:ayah:wordPos)
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

  // Get all roots
  const rootsSet = new Set(parsed.filter(Boolean).map(p => p!.root).filter(Boolean));
  console.log(`✅ Found ${rootsSet.size} unique roots`);

  console.log("\n📊 Updating database with morphology...");
  let updatedCount = 0;

  for (const [key, segments] of wordGroups) {
    if (!segments || segments.length === 0) continue;
    // Take the main segment (usually segment 2, or first available)
    const mainSegment = segments.find(s => s && s.segment === 2) || segments[0];
    if (!mainSegment || !mainSegment.root) continue;

    const [surah, ayah, wordPos] = key.split(":").map(Number);

    try {
      // Find matching word occurrence
      const occurrences = await db
        .select()
        .from(wordOccurrences)
        .where(
          sql`${wordOccurrences.surah} = ${surah} AND ${wordOccurrences.ayah} = ${ayah} AND ${wordOccurrences.position} = ${wordPos}`
        )
        .limit(1);

      if (occurrences.length > 0) {
        // Update with root and morphology
        await db
          .update(wordOccurrences)
          .set({
            root: mainSegment.root,
            lemma: mainSegment.lemma,
            pos: mainSegment.pos,
            morphology: mainSegment.features
          })
          .where(eq(wordOccurrences.id, occurrences[0].id));

        updatedCount++;
        if (updatedCount % 100 === 0) {
          console.log(`  Updated ${updatedCount} word occurrences...`);
        }
      }
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
    }
  }

  console.log(`\n✅ Updated ${updatedCount} word occurrences with morphology`);

  console.log("\n📥 Fetching tafsir data for controversial words...");
  
  // Fetch tafsir for verse 4:34 (daraba, qawwamun, nushuzuhunna)
  const scholars = [
    { id: "ar-tafsir-ibn-kathir", name: "Ibn Kathir", century: 8 },
    { id: "ar-tafsir-al-tabari", name: "Al-Tabari", century: 3 },
    { id: "ar-tafsir-al-qurtubi", name: "Al-Qurtubi", century: 7 },
    { id: "ar-tafsir-al-baghawi", name: "Al-Baghawi", century: 6 },
  ];

  // Get verse ID for 4:34
  const verseResult = await db.execute(
    sql`SELECT id FROM verses WHERE surah = 4 AND ayah = 34 LIMIT 1`
  );
  
  if (verseResult.rows.length === 0) {
    console.log("⚠️  Verse 4:34 not found in database");
    return;
  }

  const verseId = verseResult.rows[0].id as number;

  for (const scholar of scholars) {
    console.log(`  Fetching ${scholar.name}...`);
    const data = await fetchTafsir(scholar.id, 4);
    
    if (data && data.ayahs) {
      const ayah34 = data.ayahs.find((a: any) => a.ayah === 34);
      if (ayah34 && ayah34.text) {
        // Store tafsir for daraba (ضَرَبَ)
        try {
          await db.insert(tafsir).values({
            verseId,
            wordFocus: "ضَرَبَ",
            scholar: scholar.id,
            text: ayah34.text,
            layer: "exegetical",
            century: scholar.century,
            translation: null // Will add English translation later
          });
          console.log(`    ✅ Added ${scholar.name} tafsir for daraba`);
        } catch (error) {
          console.log(`    ⚠️  ${scholar.name} already exists`);
        }
      }
    }
  }

  console.log("\n✨ Import complete!");
}

main().catch(console.error);
