import { db } from './db';
import { verses, translations, roots, wordOccurrences } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await db.delete(wordOccurrences);
  await db.delete(translations);
  await db.delete(verses);
  await db.delete(roots);
  console.log('✅ Cleared existing data');

  // Seed roots for featured words
  const rootsData = [
    {
      root: 'ض-ر-ب',
      meanings: [
        {
          arabic: 'ضَرَبَ',
          english: 'To separate, leave, turn away from (scholarly debate: some say "symbolic tap", NOT violent striking)',
          context: 'Separation or minimal physical contact - HIGHLY DEBATED in 4:34',
          exampleVerse: '4:34'
        },
        {
          arabic: 'ضَرَبَ مَثَلاً',
          english: 'To set forth a parable, give an example, present a similitude',
          context: 'Rhetorical and pedagogical usage',
          exampleVerse: '14:25'
        },
        {
          arabic: 'ضَرَبَ فِي الأَرْضِ',
          english: 'To travel, journey through the land',
          context: 'Movement and travel',
          exampleVerse: '4:101'
        },
        {
          arabic: 'ضَرَبَ بَيْنَهُمْ',
          english: 'To separate, set apart, create a barrier',
          context: 'Division or separation',
          exampleVerse: '57:13'
        },
        {
          arabic: 'يَضْرِبْنَ',
          english: 'To draw, wrap, place, cover',
          context: 'Placing or drawing something over',
          exampleVerse: '24:31'
        },
        {
          arabic: 'ضَرَبَ',
          english: 'To strike, make contact with (in non-violent contexts: coins, seals, musical instruments)',
          context: 'Making an impression or impact',
          exampleVerse: 'Various'
        }
      ],
      classicalDefinition: 'The root ض-ر-ب carries the fundamental meaning of "making an impact" or "causing an effect" - which manifests in over 25 different meanings depending on context and prepositions used. CRITICAL NOTE on 4:34: Classical scholars are DIVIDED on whether واضربوهن means physical discipline at all. Many argue for "separate from them" or at most a symbolic gesture. The Prophet Muhammad (ﷺ) explicitly forbade striking the face and taught gentleness. Context and prophetic practice must guide interpretation.',
      modernUsage: 'Modern Arabic uses ضرب for: multiplication (الضرب), telephone dialing, making examples (ضرب مثل), striking/hitting, traveling, and setting forth. The 4:34 controversy has led many modern scholars to re-examine classical interpretations through the lens of prophetic practice.'
    },
    {
      root: 'ق-و-م',
      meanings: [
        {
          arabic: 'قَوَّامٌ',
          english: 'Maintainers, supporters, protectors',
          context: 'Responsibility and support',
          exampleVerse: '4:34'
        },
        {
          arabic: 'قَامَ',
          english: 'To stand, establish, maintain',
          context: 'Standing or maintaining something',
        }
      ],
      classicalDefinition: 'Root meaning involves standing, establishing, maintaining. The form قَوَّام (qawwam) is an intensive form meaning "those who maintain/support".',
      modernUsage: 'Used for standing, lists/inventories (قائمة), and management/supervision.'
    },
    {
      root: 'ج-ل-ب',
      meanings: [
        {
          arabic: 'جِلْبَابٌ',
          english: 'Outer garment, cloak, overgarment',
          context: 'Clothing',
          exampleVerse: '33:59'
        }
      ],
      classicalDefinition: 'Refers to an outer garment worn over other clothes. Classical scholars describe it as a loose outer covering.',
      modernUsage: 'Modern Arabic uses it for various types of robes or long garments.'
    },
    {
      root: 'ن-ش-ز',
      meanings: [
        {
          arabic: 'نُشُوزٌ',
          english: 'Rising, elevation, discord, rebellion',
          context: 'Marital discord or physical rising',
          exampleVerse: '4:34'
        }
      ],
      classicalDefinition: 'Literally means to rise or be elevated. In marital context, refers to discord, rebellion, or violation of marital duties by either spouse.',
      modernUsage: 'Used for elevation, rising ground, and metaphorically for rebellion or discord.'
    },
    {
      root: 'خ-م-ر',
      meanings: [
        {
          arabic: 'خِمَارٌ',
          english: 'Head covering, veil',
          context: 'Covering',
          exampleVerse: '24:31'
        },
        {
          arabic: 'خَمْرٌ',
          english: 'Wine, intoxicant',
          context: 'That which covers the mind',
        }
      ],
      classicalDefinition: 'Root meaning involves covering or concealing. خِمَار is a head covering, while خَمْر (wine) comes from the same root as it "covers" the mind.',
      modernUsage: 'Used for head coverings and veils in modern Arabic.'
    },
    {
      root: 'ف-ت-ن',
      meanings: [
        {
          arabic: 'فِتْنَةٌ',
          english: 'Trial, test, temptation',
          context: 'Testing or temptation',
          exampleVerse: '2:191'
        },
        {
          arabic: 'فِتْنَةٌ',
          english: 'Persecution, oppression',
          context: 'Forcing someone from religion',
          exampleVerse: '2:217'
        },
        {
          arabic: 'فِتْنَةٌ',
          english: 'Discord, civil strife',
          context: 'Social disorder',
        }
      ],
      classicalDefinition: 'Root meaning involves testing, burning, or purifying (like testing gold in fire). Extended meanings include temptation, persecution, and discord.',
      modernUsage: 'Used for temptation, beautiful/attractive person (فتنة), discord, and trials.'
    }
  ];

  console.log('Inserting roots...');
  const insertedRoots = await db.insert(roots).values(rootsData).returning();
  console.log(`✅ Inserted ${insertedRoots.length} roots`);

  // Seed key verses
  const versesData = [
    {
      surah: 4,
      ayah: 34,
      arabicText: 'الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ بِمَا فَضَّلَ اللَّهُ بَعْضَهُمْ عَلَىٰ بَعْضٍ وَبِمَا أَنفَقُوا مِنْ أَمْوَالِهِمْ ۚ فَالصَّالِحَاتُ قَانِتَاتٌ حَافِظَاتٌ لِّلْغَيْبِ بِمَا حَفِظَ اللَّهُ ۚ وَاللَّاتِي تَخَافُونَ نُشُوزَهُنَّ فَعِظُوهُنَّ وَاهْجُرُوهُنَّ فِي الْمَضَاجِعِ وَاضْرِبُوهُنَّ ۖ فَإِنْ أَطَعْنَكُمْ فَلَا تَبْغُوا عَلَيْهِنَّ سَبِيلًا ۗ إِنَّ اللَّهَ كَانَ عَلِيًّا كَبِيرًا',
      simpleText: 'الرجال قوامون على النساء',
      transliteration: 'Ar-rijālu qawwāmūna ʿala an-nisāʾi bimā faḍḍala llāhu baʿḍahum ʿalā baʿḍin wa-bimā anfaqū min amwālihim...'
    },
    {
      surah: 24,
      ayah: 31,
      arabicText: 'وَقُل لِّلْمُؤْمِنَاتِ يَغْضُضْنَ مِنْ أَبْصَارِهِنَّ وَيَحْفَظْنَ فُرُوجَهُنَّ وَلَا يُبْدِينَ زِينَتَهُنَّ إِلَّا مَا ظَهَرَ مِنْهَا ۖ وَلْيَضْرِبْنَ بِخُمُرِهِنَّ عَلَىٰ جُيُوبِهِنَّ',
      simpleText: 'وليضربن بخمرهن على جيوبهن',
      transliteration: 'Wa-qul li-l-muʾmināti yaghḍuḍna min abṣārihinna wa-yaḥfaẓna furūjahunna wa-lā yubdīna zīnatahunna illā mā ẓahara minhā wa-lyadribna bi-khumurihinna ʿalā juyūbihinna'
    },
    {
      surah: 33,
      ayah: 59,
      arabicText: 'يَا أَيُّهَا النَّبِيُّ قُل لِّأَزْوَاجِكَ وَبَنَاتِكَ وَنِسَاءِ الْمُؤْمِنِينَ يُدْنِينَ عَلَيْهِنَّ مِن جَلَابِيبِهِنَّ ۚ ذَٰلِكَ أَدْنَىٰ أَن يُعْرَفْنَ فَلَا يُؤْذَيْنَ ۗ وَكَانَ اللَّهُ غَفُورًا رَّحِيمًا',
      simpleText: 'يدنين عليهن من جلابيبهن',
      transliteration: 'Yā ayyuhā an-nabiyyu qul li-azwājika wa-banātika wa-nisāʾi l-muʾminīna yudnīna ʿalayhinna min jalābībihinna'
    },
    {
      surah: 2,
      ayah: 191,
      arabicText: 'وَاقْتُلُوهُمْ حَيْثُ ثَقِفْتُمُوهُمْ وَأَخْرِجُوهُم مِّنْ حَيْثُ أَخْرَجُوكُمْ ۚ وَالْفِتْنَةُ أَشَدُّ مِنَ الْقَتْلِ',
      simpleText: 'والفتنة أشد من القتل',
      transliteration: 'Wa-qtulūhum ḥaythu thaqiftumūhum wa-akhrijūhum min ḥaythu akhrajūkum wa-l-fitnatu ashaddu mina l-qatl'
    },
    {
      surah: 14,
      ayah: 25,
      arabicText: 'تُؤْتِي أُكُلَهَا كُلَّ حِينٍ بِإِذْنِ رَبِّهَا ۗ وَيَضْرِبُ اللَّهُ الْأَمْثَالَ لِلنَّاسِ لَعَلَّهُمْ يَتَذَكَّرُونَ',
      simpleText: 'ويضرب الله الأمثال للناس',
      transliteration: 'Tuʾtī ukulahā kulla ḥīnin bi-idhni rabbihā wa-yaḍribu llāhu l-amthāla li-n-nāsi laʿallahum yatadhakkarūn'
    },
    {
      surah: 4,
      ayah: 101,
      arabicText: 'وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ إِنْ خِفْتُمْ أَن يَفْتِنَكُمُ الَّذِينَ كَفَرُوا',
      simpleText: 'وإذا ضربتم في الأرض',
      transliteration: 'Wa-idhā ḍarabtum fī l-arḍi fa-laysa ʿalaykum junāḥun an taqṣurū mina ṣ-ṣalāti'
    }
  ];

  console.log('Inserting verses...');
  const insertedVerses = await db.insert(verses).values(versesData).returning();
  console.log(`✅ Inserted ${insertedVerses.length} verses`);

  // Create verse ID map for translations
  const verseMap = new Map(
    insertedVerses.map(v => [`${v.surah}:${v.ayah}`, v.id])
  );

  // Seed translations
  const translationsData = [
    // 4:34 translations
    {
      verseId: verseMap.get('4:34')!,
      translator: 'Sahih International',
      text: 'Men are in charge of women by [right of] what Allah has given one over the other and what they spend [for maintenance] from their wealth. So righteous women are devoutly obedient, guarding in [the husband\'s] absence what Allah would have them guard. But those [wives] from whom you fear arrogance - [first] advise them; [then if they persist], forsake them in bed; and [finally], strike them. But if they obey you [once more], seek no means against them. Indeed, Allah is ever Exalted and Grand.'
    },
    {
      verseId: verseMap.get('4:34')!,
      translator: 'Yusuf Ali',
      text: 'Men are the protectors and maintainers of women, because Allah has given the one more (strength) than the other, and because they support them from their means. Therefore the righteous women are devoutly obedient, and guard in (the husband\'s) absence what Allah would have them guard. As to those women on whose part ye fear disloyalty and ill-conduct, admonish them (first), (Next), refuse to share their beds, (And last) beat them (lightly); but if they return to obedience, seek not against them Means (of annoyance): For Allah is Most High, great (above you all).'
    },
    {
      verseId: verseMap.get('4:34')!,
      translator: 'Pickthall',
      text: 'Men are in charge of women, because Allah hath made the one of them to excel the other, and because they spend of their property (for the support of women). So good women are the obedient, guarding in secret that which Allah hath guarded. As for those from whom ye fear rebellion, admonish them and banish them to beds apart, and scourge them. Then if they obey you, seek not a way against them. Lo! Allah is ever High, Exalted, Great.'
    },
    // 24:31 translations
    {
      verseId: verseMap.get('24:31')!,
      translator: 'Sahih International',
      text: 'And tell the believing women to reduce [some] of their vision and guard their private parts and not expose their adornment except that which [necessarily] appears thereof and to wrap [a portion of] their headcovers over their chests...'
    },
    {
      verseId: verseMap.get('24:31')!,
      translator: 'Yusuf Ali',
      text: 'And say to the believing women that they should lower their gaze and guard their modesty; that they should not display their beauty and ornaments except what (must ordinarily) appear thereof; that they should draw their veils over their bosoms...'
    },
    {
      verseId: verseMap.get('24:31')!,
      translator: 'Pickthall',
      text: 'And tell the believing women to lower their gaze and be modest, and to display of their adornment only that which is apparent, and to draw their veils over their bosoms...'
    },
    // 33:59 translations
    {
      verseId: verseMap.get('33:59')!,
      translator: 'Sahih International',
      text: 'O Prophet, tell your wives and your daughters and the women of the believers to bring down over themselves [part] of their outer garments. That is more suitable that they will be known and not be abused. And ever is Allah Forgiving and Merciful.'
    },
    {
      verseId: verseMap.get('33:59')!,
      translator: 'Yusuf Ali',
      text: 'O Prophet! Tell thy wives and daughters, and the believing women, that they should cast their outer garments over their persons (when abroad): that is most convenient, that they should be known (as such) and not molested. And Allah is Oft-Forgiving, Most Merciful.'
    },
    {
      verseId: verseMap.get('33:59')!,
      translator: 'Pickthall',
      text: 'O Prophet! Tell thy wives and thy daughters and the women of the believers to draw their cloaks close round them (when they go abroad). That will be better, so that they may be recognized and not annoyed. Allah is ever Forgiving, Merciful.'
    },
    // 2:191 translations
    {
      verseId: verseMap.get('2:191')!,
      translator: 'Sahih International',
      text: 'And kill them wherever you overtake them and expel them from wherever they have expelled you, and fitnah is worse than killing...'
    },
    {
      verseId: verseMap.get('2:191')!,
      translator: 'Yusuf Ali',
      text: 'And slay them wherever ye catch them, and turn them out from where they have turned you out; for tumult and oppression are worse than slaughter...'
    },
    {
      verseId: verseMap.get('2:191')!,
      translator: 'Pickthall',
      text: 'And slay them wherever ye find them, and drive them out of the places whence they drove you out, for persecution is worse than slaughter...'
    },
    // 14:25 translations
    {
      verseId: verseMap.get('14:25')!,
      translator: 'Sahih International',
      text: 'It produces its fruit all the time, by permission of its Lord. And Allah presents examples for the people that perhaps they will be reminded.'
    },
    {
      verseId: verseMap.get('14:25')!,
      translator: 'Yusuf Ali',
      text: 'It brings forth its fruit at all times, by the leave of its Lord. So Allah sets forth parables for men, in order that they may receive admonition.'
    },
    {
      verseId: verseMap.get('14:25')!,
      translator: 'Pickthall',
      text: 'Giving its fruit at every season by permission of its Lord? Allah coineth the similitudes for mankind in order that they may reflect.'
    },
    // 4:101 translations
    {
      verseId: verseMap.get('4:101')!,
      translator: 'Sahih International',
      text: 'And when you travel throughout the land, there is no blame upon you for shortening the prayer, [especially] if you fear that those who disbelieve may disrupt [or attack] you...'
    },
    {
      verseId: verseMap.get('4:101')!,
      translator: 'Yusuf Ali',
      text: 'When ye travel through the earth, there is no blame on you if ye shorten your prayers, for fear the Unbelievers May attack you...'
    },
    {
      verseId: verseMap.get('4:101')!,
      translator: 'Pickthall',
      text: 'And when ye go forth in the land, it is no sin for you to curtail (your) worship if ye fear that those who disbelieve may attack you...'
    }
  ];

  console.log('Inserting translations...');
  await db.insert(translations).values(translationsData);
  console.log(`✅ Inserted ${translationsData.length} translations`);

  // Create root ID map
  const rootMap = new Map(
    insertedRoots.map(r => [r.root, r.id])
  );

  // Seed word occurrences WITH TRANSLITERATIONS
  const occurrencesData = [
    // ضرب occurrences
    {
      word: 'ضرب',
      transliteration: 'daraba',
      rootId: rootMap.get('ض-ر-ب')!,
      verseId: verseMap.get('4:34')!,
      meaningUsed: 'HIGHLY DEBATED: Many scholars say "separate/leave them" rather than "strike". If strike, only symbolic/gentle (Prophet ﷺ forbade violence). Context: last resort after advice and separation.',
      syntaxRole: 'Imperative verb (3rd step in sequence)',
      verbForm: 'Form I'
    },
    {
      word: 'يضرب',
      transliteration: 'yadrib',
      rootId: rootMap.get('ض-ر-ب')!,
      verseId: verseMap.get('14:25')!,
      meaningUsed: 'To set forth (examples/parables)',
      syntaxRole: 'Present tense verb',
      verbForm: 'Form I'
    },
    {
      word: 'ضربتم',
      transliteration: 'darabtum',
      rootId: rootMap.get('ض-ر-ب')!,
      verseId: verseMap.get('4:101')!,
      meaningUsed: 'To travel/journey',
      syntaxRole: 'Past tense verb',
      verbForm: 'Form I'
    },
    {
      word: 'ليضربن',
      transliteration: 'lyadribna',
      rootId: rootMap.get('ض-ر-ب')!,
      verseId: verseMap.get('24:31')!,
      meaningUsed: 'To draw/wrap (their headcovers)',
      syntaxRole: 'Emphatic imperative',
      verbForm: 'Form I'
    },
    // قوام occurrences
    {
      word: 'قوامون',
      transliteration: 'qawwamun',
      rootId: rootMap.get('ق-و-م')!,
      verseId: verseMap.get('4:34')!,
      meaningUsed: 'Maintainers/supporters (intensive form)',
      syntaxRole: 'Predicate (khabar)',
      verbForm: 'Intensive active participle'
    },
    // جلباب occurrences
    {
      word: 'جلابيبهن',
      transliteration: 'jalabibihin',
      rootId: rootMap.get('ج-ل-ب')!,
      verseId: verseMap.get('33:59')!,
      meaningUsed: 'Their outer garments/cloaks',
      syntaxRole: 'Object (maf\'ul bihi)',
      verbForm: 'Plural noun'
    },
    // نشوز occurrences
    {
      word: 'نشوزهن',
      transliteration: 'nushuzahunn',
      rootId: rootMap.get('ن-ش-ز')!,
      verseId: verseMap.get('4:34')!,
      meaningUsed: 'Their discord/rebellion',
      syntaxRole: 'Object (maf\'ul bihi)',
      verbForm: 'Verbal noun (masdar)'
    },
    // خمار occurrences
    {
      word: 'بخمرهن',
      transliteration: 'bikhumurihin',
      rootId: rootMap.get('خ-م-ر')!,
      verseId: verseMap.get('24:31')!,
      meaningUsed: 'Their head coverings',
      syntaxRole: 'Prepositional phrase',
      verbForm: 'Noun'
    },
    // فتنة occurrences
    {
      word: 'الفتنة',
      transliteration: 'alfitnah',
      rootId: rootMap.get('ف-ت-ن')!,
      verseId: verseMap.get('2:191')!,
      meaningUsed: 'Persecution/oppression',
      syntaxRole: 'Subject (mubtada)',
      verbForm: 'Noun'
    },
    {
      word: 'يفتنكم',
      transliteration: 'yaftinakum',
      rootId: rootMap.get('ف-ت-ن')!,
      verseId: verseMap.get('4:101')!,
      meaningUsed: 'May persecute/attack you',
      syntaxRole: 'Present tense verb',
      verbForm: 'Form I'
    }
  ];

  console.log('Inserting word occurrences...');
  await db.insert(wordOccurrences).values(occurrencesData);
  console.log(`✅ Inserted ${occurrencesData.length} word occurrences`);

  console.log('✨ Seed completed successfully!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
