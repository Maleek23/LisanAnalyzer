/**
 * OPTIMIZED Quran Database Seed
 * Uses batch operations to reduce database queries from 150k+ to <200
 */

import { db } from './db';
import { verses, translations } from '../shared/schema';
import { 
  fetchCompleteQuran, 
  fetchSurahMultipleEditions,
  RECOMMENDED_TRANSLATORS 
} from './services/quranApi';
import { sql } from 'drizzle-orm';

async function seedQuranOptimized() {
  console.log('🚀 Starting OPTIMIZED Quran database seed...\n');
  console.log('📊 This will add:');
  console.log('   - 6,236 verses with Arabic text');
  console.log('   - 8 translations per verse (~50,000 records)');
  console.log('   - Estimated time: 2-3 minutes with batching\n');

  try {
    // ===== STEP 1: VERSES (Already Complete) =====
    console.log('📖 Step 1/2: Checking verses...');
    const existingVerses = await db.select().from(verses);
    console.log(`   ✅ Found ${existingVerses.length} existing verses`);
    
    if (existingVerses.length < 6236) {
      console.log('   📝 Adding missing verses...');
      const quranData = await fetchCompleteQuran('quran-uthmani');
      const versesToInsert = [];
      
      for (const surah of quranData.surahs) {
        for (const ayah of surah.ayahs) {
          const exists = existingVerses.some(v => 
            v.surah === surah.number && v.ayah === ayah.numberInSurah
          );
          
          if (!exists) {
            versesToInsert.push({
              surah: surah.number,
              ayah: ayah.numberInSurah,
              arabicText: ayah.text,
              simpleText: ayah.text.replace(/[ًٌٍَُِّْٰٓ]/g, ''),
              transliteration: null,
            });
          }
        }
      }
      
      if (versesToInsert.length > 0) {
        await db.insert(verses).values(versesToInsert);
        console.log(`   ✅ Inserted ${versesToInsert.length} new verses`);
      }
    }

    // ===== STEP 2: TRANSLATIONS (BATCH MODE) =====
    console.log('\n📚 Step 2/2: Fetching translations in batch mode...');
    
    // Load ALL verses into memory for fast lookup
    const allVerses = await db.select().from(verses);
    const verseMap = new Map();
    allVerses.forEach(v => {
      verseMap.set(`${v.surah}:${v.ayah}`, v.id);
    });
    console.log(`   💾 Loaded ${allVerses.length} verses into memory`);

    // Load ALL existing translations for duplicate detection
    const existingTranslations = await db.select().from(translations);
    const translationSet = new Set(
      existingTranslations.map(t => `${t.verseId}:${t.translator}`)
    );
    console.log(`   💾 Found ${existingTranslations.length} existing translations\n`);

    const translatorIds = RECOMMENDED_TRANSLATORS.map(t => t.id);
    let translationCount = 0;
    let batchBuffer: any[] = [];
    const BATCH_SIZE = 1000;

    // Process surahs in batches
    for (let surahNum = 1; surahNum <= 114; surahNum++) {
      try {
        console.log(`   🌍 Processing Surah ${surahNum}/114...`);
        
        // Fetch all translations for this surah at once
        const translatedSurahs = await fetchSurahMultipleEditions(surahNum, translatorIds);
        
        for (const translatedSurah of translatedSurahs) {
          const translator = translatedSurah as any;
          const translatorId = translator.edition?.identifier || 'unknown';
          
          for (const ayah of translatedSurah.ayahs) {
            const verseKey = `${surahNum}:${ayah.numberInSurah}`;
            const verseId = verseMap.get(verseKey);
            
            if (!verseId) {
              console.warn(`      ⚠️  Verse not found: ${verseKey}`);
              continue;
            }

            const translationKey = `${verseId}:${translatorId}`;
            
            // Skip if already exists
            if (translationSet.has(translationKey)) {
              continue;
            }

            // Add to batch buffer
            batchBuffer.push({
              verseId,
              translator: translatorId,
              text: ayah.text,
            });

            translationCount++;

            // Insert batch when buffer is full
            if (batchBuffer.length >= BATCH_SIZE) {
              await db.insert(translations).values(batchBuffer);
              console.log(`      ✅ Inserted batch: ${translationCount} total translations...`);
              batchBuffer = [];
            }
          }
        }
      } catch (error) {
        console.error(`   ❌ Error processing Surah ${surahNum}:`, error);
      }

      // Small delay to avoid API rate limits
      if (surahNum % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Insert remaining translations
    if (batchBuffer.length > 0) {
      await db.insert(translations).values(batchBuffer);
      console.log(`      ✅ Inserted final batch: ${translationCount} total translations`);
    }

    console.log('\n✅ Step 2 Complete: Translations added');
    
    // Final statistics
    const finalVerses = await db.select().from(verses);
    const finalTranslations = await db.select().from(translations);
    
    console.log('\n✨ Quran database seed completed successfully!');
    console.log(`📊 Final Statistics:`);
    console.log(`   - Verses: ${finalVerses.length}`);
    console.log(`   - Translations: ${finalTranslations.length}`);
    console.log(`   - Translators: ${new Set(finalTranslations.map(t => t.translator)).size}`);
    
  } catch (error) {
    console.error('\n❌ Fatal error during seed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedQuranOptimized()
    .then(() => {
      console.log('\n✅ Optimized seed script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Optimized seed script failed:', error);
      process.exit(1);
    });
}

export { seedQuranOptimized };
