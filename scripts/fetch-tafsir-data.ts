import { db } from "../server/db";
import { tafsir, verses, wordOccurrences } from "../shared/schema";
import { eq, and, sql } from "drizzle-orm";

// Scholars available in spa5k tafsir API
const SCHOLARS = [
  { id: "ar-tafsir-ibn-kathir", name: "Ibn Kathir", century: 8, layer: "exegetical" },
  { id: "ar-tafsir-al-tabari", name: "Al-Tabari", century: 3, layer: "exegetical" },
  { id: "ar-tafsir-al-qurtubi", name: "Al-Qurtubi", century: 7, layer: "exegetical" },
  { id: "ar-tafsir-al-baghawi", name: "Al-Baghawi", century: 6, layer: "exegetical" },
  { id: "ar-tafsir-muyassar", name: "Al-Muyassar", century: 21, layer: "modern" },
];

// Fetch tafsir for a specific surah from spa5k API
async function fetchTafsirForSurah(scholarId: string, surah: number) {
  try {
    const url = `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${scholarId}/${surah}.json`;
    console.log(`  Fetching ${scholarId} for surah ${surah}...`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`    ⚠️  Not available (${response.status})`);
      return null;
    }
    
    const data = await response.json();
    console.log(`    ✅ Got ${data.ayahs?.length || 0} ayahs`);
    return data;
  } catch (error) {
    console.error(`    ❌ Error:`, error);
    return null;
  }
}

async function main() {
  console.log("📥 Fetching tafsir data for controversial words in verse 4:34...\n");

  // Get verse 4:34
  const verse434 = await db
    .select()
    .from(verses)
    .where(and(eq(verses.surah, 4), eq(verses.ayah, 34)))
    .limit(1);

  if (verse434.length === 0) {
    console.log("❌ Verse 4:34 not found in database");
    return;
  }

  const verseId = verse434[0].id;
  console.log(`✅ Found verse 4:34 (id: ${verseId})\n`);

  // Get words in this verse
  const wordsIn434 = await db
    .select()
    .from(wordOccurrences)
    .where(and(
      eq(wordOccurrences.surah, 4),
      eq(wordOccurrences.ayah, 34)
    ));

  console.log(`📊 Found ${wordsIn434.length} words in verse 4:34\n`);

  // Fetch tafsir from all scholars for surah 4
  for (const scholar of SCHOLARS) {
    const data = await fetchTafsirForSurah(scholar.id, 4);
    
    if (!data || !data.ayahs) continue;

    // Find ayah 34
    const ayah34 = data.ayahs.find((a: any) => a.ayah === 34);
    if (!ayah34 || !ayah34.text) {
      console.log(`    ⚠️  No text for ayah 34`);
      continue;
    }

    // Store tafsir for each major word in the verse
    // For verse 4:34, the controversial words are: daraba, qawwamun, nushuzuhunna
    const keyWords = [
      { arabic: "ضَرَبَ", focus: "ضَرَبَ" }, // daraba
      { arabic: "قَوَّامُونَ", focus: "قَوَّامُونَ" }, // qawwamun
      { arabic: "نُشُوزَهُنَّ", focus: "نُشُوزَهُنَّ" }, // nushuzuhunna
    ];

    for (const word of keyWords) {
      try {
        // Check if tafsir already exists
        const existing = await db
          .select()
          .from(tafsir)
          .where(and(
            eq(tafsir.verseId, verseId),
            eq(tafsir.wordFocus, word.focus),
            eq(tafsir.scholar, scholar.id)
          ))
          .limit(1);

        if (existing.length > 0) {
          console.log(`    ⏭️  Already have ${scholar.name} for ${word.focus}`);
          continue;
        }

        // Insert new tafsir
        await db.insert(tafsir).values({
          verseId,
          wordFocus: word.focus,
          scholar: scholar.id,
          text: ayah34.text,
          layer: scholar.layer,
          century: scholar.century,
          translation: null, // Will add English translation later
        });

        console.log(`    ✅ Added ${scholar.name} tafsir for ${word.focus}`);
      } catch (error) {
        console.error(`    ❌ Error saving ${scholar.name} for ${word.focus}:`, error);
      }
    }
  }

  console.log("\n✨ Tafsir import complete!");
  
  // Summary
  const tafsirCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(tafsir);
  
  console.log(`\n📊 Total tafsir entries in database: ${tafsirCount[0].count}`);
}

main().catch(console.error);
