/**
 * Seed Quran Database with All Verses and Translations
 * Uses AlQuran Cloud API (free, no authentication required)
 * 
 * This will populate:
 * - All 6,236 verses with Arabic text
 * - 8 English translations for each verse (48,000+ translation records)
 */

import { db } from './db';
import { verses, translations } from '../shared/schema';
import { 
  fetchCompleteQuran, 
  fetchSurahMultipleEditions,
  RECOMMENDED_TRANSLATORS 
} from './services/quranApi';
import { sql } from 'drizzle-orm';

async function seedQuranDatabase() {
  console.log('🌙 Starting Quran database seed...\n');
  console.log('📊 This will add:');
  console.log('   - 6,236 verses with Arabic text');
  console.log('   - 8 translations per verse (~50,000 records)');
  console.log('   - Estimated time: 5-10 minutes\n');

  try {
    // Step 1: Fetch complete Quran in Arabic (Uthmani script)
    console.log('📖 Step 1/2: Fetching all 114 Surahs (Arabic text)...');
    const quranData = await fetchCompleteQuran('quran-uthmani');
    
    let totalVerses = 0;
    let successCount = 0;

    // Step 2: Insert all verses
    for (const surah of quranData.surahs) {
      console.log(`   📝 Processing Surah ${surah.number}: ${surah.englishName} (${surah.numberOfAyahs} ayahs)`);
      
      for (const ayah of surah.ayahs) {
        try {
          // Check if verse already exists
          const existing = await db
            .select()
            .from(verses)
            .where(sql`${verses.surah} = ${surah.number} AND ${verses.ayah} = ${ayah.numberInSurah}`);

          if (existing.length > 0) {
            // Skip if already exists
            totalVerses++;
            continue;
          }

          // Insert new verse
          await db.insert(verses).values({
            surah: surah.number,
            ayah: ayah.numberInSurah,
            arabicText: ayah.text,
            simpleText: ayah.text.replace(/[ًٌٍَُِّْٰٓ]/g, ''), // Remove diacritics for search
            transliteration: null, // We can add this later
          });

          successCount++;
          totalVerses++;

          // Log progress every 100 verses
          if (successCount % 100 === 0) {
            console.log(`      ✅ ${successCount} verses inserted...`);
          }
        } catch (error) {
          console.error(`      ❌ Error inserting ${surah.number}:${ayah.numberInSurah}:`, error);
        }
      }
    }

    console.log(`\n✅ Step 1 Complete: ${successCount} new verses added (${totalVerses} total)`);

    // Step 3: Fetch translations for all surahs
    console.log('\n📚 Step 2/2: Fetching translations for all Surahs...');
    const translatorIds = RECOMMENDED_TRANSLATORS.map(t => t.id);
    
    let translationCount = 0;
    
    for (let surahNum = 1; surahNum <= 114; surahNum++) {
      try {
        console.log(`   🌍 Fetching translations for Surah ${surahNum}...`);
        
        // Fetch this surah in all translations at once (more efficient)
        const translatedSurahs = await fetchSurahMultipleEditions(surahNum, translatorIds);
        
        // translatedSurahs is an array of surahs, one per translation
        for (const translatedSurah of translatedSurahs) {
          const translator = translatedSurah as any; // API returns with edition info
          const translatorId = translator.edition?.identifier || 'unknown';
          
          for (const ayah of translatedSurah.ayahs) {
            try {
              // Find the corresponding verse ID
              const verseResult = await db
                .select()
                .from(verses)
                .where(sql`${verses.surah} = ${surahNum} AND ${verses.ayah} = ${ayah.numberInSurah}`);

              if (verseResult.length === 0) {
                console.warn(`      ⚠️  Verse not found: ${surahNum}:${ayah.numberInSurah}`);
                continue;
              }

              const verseId = verseResult[0].id;

              // Check if translation already exists
              const existingTranslation = await db
                .select()
                .from(translations)
                .where(sql`${translations.verseId} = ${verseId} AND ${translations.translator} = ${translatorId}`);

              if (existingTranslation.length > 0) {
                continue; // Skip if already exists
              }

              // Insert translation
              await db.insert(translations).values({
                verseId,
                translator: translatorId,
                text: ayah.text,
              });

              translationCount++;

              // Log progress every 500 translations
              if (translationCount % 500 === 0) {
                console.log(`      ✅ ${translationCount} translations inserted...`);
              }
            } catch (error) {
              console.error(`      ❌ Error inserting translation ${surahNum}:${ayah.numberInSurah}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`   ❌ Error fetching translations for Surah ${surahNum}:`, error);
      }

      // Add small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Step 2 Complete: ${translationCount} translations added`);
    
    console.log('\n✨ Quran database seed completed successfully!');
    console.log(`📊 Final Statistics:`);
    console.log(`   - Verses: ${totalVerses}`);
    console.log(`   - Translations: ${translationCount}`);
    console.log(`   - Translators: ${RECOMMENDED_TRANSLATORS.length}`);
    
  } catch (error) {
    console.error('\n❌ Fatal error during seed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedQuranDatabase()
    .then(() => {
      console.log('\n✅ Seed script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seed script failed:', error);
      process.exit(1);
    });
}

export { seedQuranDatabase };
