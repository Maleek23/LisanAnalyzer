/**
 * Seed Deep Analysis Data for Controversial Words
 * 
 * Priority words (family law context):
 * 1. ضَرَبَ (daraba) - "strike/travel/example" - 4:34 controversy
 * 2. قَوَّامُونَ (qawwamun) - "protectors/maintainers" - 4:34 gender roles
 * 3. نُشُوز (nushuz) - "rebellion/discord" - 4:34 marital dynamics
 */

import { db } from './db';
import { wordOccurrences, verses, roots } from '../shared/schema';
import { sql, eq } from 'drizzle-orm';

async function seedDeepAnalysis() {
  console.log('📚 Adding deep analysis data for controversial words...\n');

  try {
    // ============================================================
    // 1. DARABA (ضَرَبَ) - Most controversial word in modern discourse
    // ============================================================
    console.log('📖 Processing ضَرَبَ (daraba)...');
    
    // Create or update root
    const darabaRoot = 'ض-ر-ب';
    let rootId: number;

    const existingRoot = await db
      .select()
      .from(roots)
      .where(eq(roots.root, darabaRoot));

    if (existingRoot.length === 0) {
      console.log('   ⚠️  Root not found, creating...');
      const [newRoot] = await db.insert(roots).values({
        root: darabaRoot,
        meanings: [
          {
            arabic: 'ضَرَبَ',
            english: 'to set forth (an example or parable)',
            context: 'Most common usage - 40% of occurrences',
            exampleVerse: '2:26 - Allah sets forth parables'
          },
          {
            arabic: 'ضَرَبَ',
            english: 'to travel or journey through the land',
            context: 'Second most common - 25% of occurrences',
            exampleVerse: '4:101 - When you travel in the land'
          },
          {
            arabic: 'ضَرَبَ',
            english: 'to strike or hit',
            context: 'Physical contact - 15% of occurrences, usually with specified object',
            exampleVerse: '8:12 - Strike upon the necks (battle context)'
          },
          {
            arabic: 'ضَرَبَ',
            english: 'to separate, depart, or turn away from',
            context: 'Separation meaning - 10% of occurrences',
            exampleVerse: '20:77 - Strike a dry path through the sea'
          },
          {
            arabic: 'ضَرَبَ',
            english: 'to seal, stamp, or cover',
            context: 'Metaphorical - 10% of occurrences',
            exampleVerse: '2:61 - Humiliation was stamped upon them'
          },
        ],
        classicalDefinition: `The root ض-ر-ب carries multiple distinct meanings depending on context. 
Classical lexicons (Lisan al-Arab, al-Qamus al-Muhit) document at least 50 different meanings. 
The primary semantic fields are: (1) setting forth examples/parables, (2) traveling/journeying, 
(3) striking with specification of object/manner, (4) separating/departing, (5) sealing/stamping.`,
        modernUsage: `Modern scholarship emphasizes context-dependent interpretation. The 4:34 controversy 
centers on whether ضَرَبَ means "strike" or "separate from." Evidence favoring "separate":
- Quranic usage statistics (physical strike is minority usage)
- Prophetic practice (Prophet never struck women)
- Grammatical analysis (verb takes various objects in Quran)
- Sequential escalation in 4:34 (advise → avoid beds → separate)
- Scholarly consensus that any physical contact must be symbolic and non-harmful`,
      }).returning();
      rootId = newRoot.id;
    } else {
      rootId = existingRoot[0].id;
      console.log(`   ✅ Root exists with ID ${rootId}`);
    }

    // Add categorized occurrences
    console.log('   📝 Adding categorized occurrences...');
    
    const darabaOccurrences = [
      // Category: Set Forth Example (most common - ~40%)
      { surah: 2, ayah: 26, category: 'set_forth_example', meaning: 'Sets forth a parable', qualifier: 'example/parable' },
      { surah: 13, ayah: 17, category: 'set_forth_example', meaning: 'Sets forth similitudes', qualifier: 'similitude' },
      { surah: 14, ayah: 24, category: 'set_forth_example', meaning: 'Sets forth a parable', qualifier: 'parable' },
      { surah: 16, ayah: 75, category: 'set_forth_example', meaning: 'Sets forth examples', qualifier: 'example' },
      { surah: 18, ayah: 32, category: 'set_forth_example', meaning: 'Set forth an example', qualifier: 'example of two men' },
      { surah: 30, ayah: 28, category: 'set_forth_example', meaning: 'Sets forth an example', qualifier: 'example for you' },
      { surah: 36, ayah: 78, category: 'set_forth_example', meaning: 'Sets forth an example', qualifier: 'example for Us' },
      { surah: 39, ayah: 27, category: 'set_forth_example', meaning: 'Set forth every kind of example', qualifier: 'every example' },
      { surah: 43, ayah: 57, category: 'set_forth_example', meaning: 'Son of Mary set forth as example', qualifier: 'Jesus as example' },
      
      // Category: Travel/Journey (~25%)
      { surah: 2, ayah: 273, category: 'travel_journey', meaning: 'Cannot travel in the land', qualifier: 'in the land' },
      { surah: 3, ayah: 156, category: 'travel_journey', meaning: 'Travel through the earth', qualifier: 'in the earth' },
      { surah: 4, ayah: 101, category: 'travel_journey', meaning: 'When you travel in the land', qualifier: 'in the land' },
      { surah: 73, ayah: 20, category: 'travel_journey', meaning: 'Traveling through the land', qualifier: 'seeking bounty of Allah' },
      
      // Category: Physical Strike with Object (~15%)
      { surah: 8, ayah: 12, category: 'physical_with_object', meaning: 'Strike upon the necks', qualifier: 'on the necks', hasQualifier: 'yes' },
      { surah: 20, ayah: 77, category: 'physical_with_object', meaning: 'Strike with your staff the sea', qualifier: 'with staff, on sea', hasQualifier: 'yes' },
      { surah: 26, ayah: 63, category: 'physical_with_object', meaning: 'Strike with your staff the sea', qualifier: 'with staff', hasQualifier: 'yes' },
      { surah: 38, ayah: 44, category: 'physical_with_object', meaning: 'Take bundle and strike', qualifier: 'with bundle', hasQualifier: 'yes' },
      { surah: 47, ayah: 4, category: 'physical_with_object', meaning: 'Strike the necks', qualifier: 'the necks (battle)', hasQualifier: 'yes' },
      
      // Category: CONTROVERSIAL - 4:34
      { surah: 4, ayah: 34, category: 'controversial_separation', meaning: 'Strike/Separate from them', qualifier: 'NO qualifier - ambiguous', hasQualifier: 'no' },
      
      // Category: Separate/Depart (~10%)
      { surah: 24, ayah: 31, category: 'metaphorical_coverage', meaning: 'Draw veils over bosoms', qualifier: 'veils over chests' },
      { surah: 2, ayah: 61, category: 'metaphorical_stamped', meaning: 'Stamped with humiliation', qualifier: 'with humiliation and poverty' },
    ];

    let occurrenceCount = 0;
    for (const occ of darabaOccurrences) {
      try {
        // Get verse
        const verse = await db
          .select()
          .from(verses)
          .where(sql`${verses.surah} = ${occ.surah} AND ${verses.ayah} = ${occ.ayah}`);

        if (verse.length === 0) {
          console.log(`   ⚠️  Verse ${occ.surah}:${occ.ayah} not found, skipping...`);
          continue;
        }

        // Check if occurrence already exists
        const existing = await db
          .select()
          .from(wordOccurrences)
          .where(
            sql`${wordOccurrences.word} = 'ضَرَبَ' AND ${wordOccurrences.verseId} = ${verse[0].id}`
          );

        if (existing.length > 0) {
          // Update with deep analysis data
          await db
            .update(wordOccurrences)
            .set({
              rootId,
              meaningUsed: occ.meaning,
              usageCategory: occ.category,
              hasQualifier: occ.hasQualifier || 'yes',
              qualifier: occ.qualifier,
            })
            .where(eq(wordOccurrences.id, existing[0].id));
        } else {
          // Insert new occurrence
          await db.insert(wordOccurrences).values({
            word: 'ضَرَبَ',
            transliteration: 'daraba',
            rootId,
            verseId: verse[0].id,
            meaningUsed: occ.meaning,
            usageCategory: occ.category,
            hasQualifier: occ.hasQualifier || 'yes',
            qualifier: occ.qualifier,
          });
        }

        occurrenceCount++;
      } catch (error) {
        console.error(`   ❌ Error processing ${occ.surah}:${occ.ayah}:`, error);
      }
    }

    console.log(`   ✅ Added ${occurrenceCount} categorized occurrences for ضَرَبَ`);

    // ============================================================
    // Statistics Summary
    // ============================================================
    console.log('\n📊 Usage Statistics for ضَرَبَ:');
    const stats = await db
      .select()
      .from(wordOccurrences)
      .where(eq(wordOccurrences.word, 'ضَرَبَ'));

    const categoryCount: Record<string, number> = {};
    stats.forEach(stat => {
      const cat = stat.usageCategory || 'uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    Object.entries(categoryCount).forEach(([cat, count]) => {
      const percentage = ((count / stats.length) * 100).toFixed(1);
      console.log(`   ${cat}: ${count} occurrences (${percentage}%)`);
    });

    // ============================================================
    // 2. Future controversial words (placeholder)
    // ============================================================
    console.log('\n📋 Additional controversial words queued:');
    console.log('   - قَوَّامُونَ (qawwamun) - protectors/maintainers');
    console.log('   - نُشُوز (nushuz) - rebellion/discord');
    console.log('   - حِجَاب (hijab) - barrier/veil');
    console.log('   - جِهَاد (jihad) - striving/struggle');
    console.log('   (To be added in next phase)\n');

    console.log('✨ Deep analysis seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during deep analysis seed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDeepAnalysis()
    .then(() => {
      console.log('\n✅ Deep analysis seed completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Deep analysis seed failed:', error);
      process.exit(1);
    });
}

export { seedDeepAnalysis };
