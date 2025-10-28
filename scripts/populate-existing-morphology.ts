import { db } from "../server/db";
import { wordOccurrences } from "../shared/schema";
import { eq } from "drizzle-orm";

// Parse morphology line
function parseMorphologyLine(line: string) {
  const parts = line.split("|");
  if (parts.length < 2) return null;

  const firstPart = parts[0];
  const locationMatch = firstPart.match(/^(\d+):(\d+):(\d+):(\d+)(.+)$/);
  if (!locationMatch) return null;

  const [, surah, ayah, wordPos, segment, wordAndPos] = locationMatch;
  
  const posMatch = wordAndPos.match(/^(.+?)([A-Z]+)$/);
  if (!posMatch) return null;
  
  const arabicWord = posMatch[1];
  const pos = posMatch[2];
  
  let root: string | null = null;
  let lemma: string | null = null;

  for (const part of parts.slice(1)) {
    if (part.startsWith("ROOT:")) root = part.substring(5);
    else if (part.startsWith("LEM:")) lemma = part.substring(4);
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
  console.log("📥 Downloading morphology data...");
  const response = await fetch(
    "https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt"
  );
  const text = await response.text();
  const lines = text.split("\n").filter(line => line.trim());
  console.log(`✅ Downloaded ${lines.length} entries`);

  // Parse and group by word
  const wordGroups = new Map<string, any[]>();
  for (const line of lines) {
    const entry = parseMorphologyLine(line);
    if (!entry) continue;
    
    const key = `${entry.surah}:${entry.ayah}:${entry.wordPos}`;
    if (!wordGroups.has(key)) wordGroups.set(key, []);
    wordGroups.get(key)!.push(entry);
  }

  console.log("\n📊 Updating existing word occurrences...");
  
  // Get all existing word occurrences
  const existing = await db.select().from(wordOccurrences);
  console.log(`Found ${existing.length} existing word occurrences`);

  let updatedCount = 0;
  for (const word of existing) {
    if (!word.surah || !word.ayah || !word.position) {
      console.log(`⚠️ Skipping word ${word.id} - missing location data`);
      continue;
    }

    const key = `${word.surah}:${word.ayah}:${word.position}`;
    const segments = wordGroups.get(key);
    
    if (!segments || segments.length === 0) {
      console.log(`⚠️  No morphology found for ${key} (${word.word})`);
      continue;
    }

    // Get main segment with root
    const mainSegment = segments.find(s => s.root) || segments[0];
    if (!mainSegment) continue;

    await db
      .update(wordOccurrences)
      .set({
        root: mainSegment.root,
        lemma: mainSegment.lemma,
        pos: mainSegment.pos,
        morphology: mainSegment.features
      })
      .where(eq(wordOccurrences.id, word.id));

    updatedCount++;
    console.log(`✅ Updated "${word.word}" with root: ${mainSegment.root}`);
  }

  console.log(`\n✨ Updated ${updatedCount} words with morphology data!`);
}

main().catch(console.error);
