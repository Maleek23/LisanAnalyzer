import WordAnalysis from '../WordAnalysis';

export default function WordAnalysisExample() {
  const mockData = {
    word: "ضرب",
    transliteration: "ḍaraba",
    root: "ض-ر-ب",
    verbForm: "Form I",
    occurrenceCount: 58,
    meanings: [
      {
        arabic: "ضَرَبَ",
        english: "To strike",
        context: "Used in contexts of physical action or impact",
        exampleVerse: "Quran 8:12"
      },
      {
        arabic: "ضَرَبَ مَثَلاً",
        english: "To set forth (a parable)",
        context: "Used when Allah presents examples or parables",
        exampleVerse: "Quran 2:26"
      },
      {
        arabic: "ضَرَبَ فِي الأَرْضِ",
        english: "To travel",
        context: "Literally 'to strike in the earth', meaning to journey",
        exampleVerse: "Quran 73:20"
      },
      {
        arabic: "ضَرَبَ",
        english: "To separate",
        context: "Can mean to create distance or separation",
        exampleVerse: "Quran 4:34"
      }
    ],
    occurrences: [
      {
        surah: 4,
        ayah: 34,
        arabicText: "وَاضْرِبُوهُنَّ فَإِنْ أَطَعْنَكُمْ فَلَا تَبْغُوا عَلَيْهِنَّ سَبِيلًا",
        translations: [
          {
            translator: "Sahih International",
            text: "...and [finally] strike them. But if they obey you..."
          },
          {
            translator: "Yusuf Ali",
            text: "...and beat them (lightly); but if they return to obedience..."
          },
          {
            translator: "Pickthall",
            text: "...and scourge them. Then if they obey you..."
          }
        ]
      },
      {
        surah: 2,
        ayah: 26,
        arabicText: "إِنَّ اللَّهَ لَا يَسْتَحْيِي أَن يَضْرِبَ مَثَلًا مَّا بَعُوضَةً",
        translations: [
          {
            translator: "Sahih International",
            text: "Indeed, Allah is not timid to present an example - that of a mosquito..."
          },
          {
            translator: "Yusuf Ali",
            text: "Allah disdains not to use the similitude of things, lowest as well as highest..."
          },
          {
            translator: "Pickthall",
            text: "Lo! Allah disdaineth not to coin the similitude even of a gnat..."
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-cream p-8">
      <WordAnalysis {...mockData} />
    </div>
  );
}
