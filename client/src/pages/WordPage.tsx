import { useRoute } from "wouter";
import WordAnalysis from "@/components/WordAnalysis";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function WordPage() {
  const [, params] = useRoute("/word/:word");
  const word = params?.word || "";

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
        context: "Used when Allah presents examples or parables in the Quran",
        exampleVerse: "Quran 2:26"
      },
      {
        arabic: "ضَرَبَ فِي الأَرْضِ",
        english: "To travel",
        context: "Literally 'to strike in the earth', meaning to journey or travel through the land",
        exampleVerse: "Quran 73:20"
      },
      {
        arabic: "ضَرَبَ",
        english: "To separate",
        context: "Can mean to create distance or separation between things or people",
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
            text: "...and [finally] strike them. But if they obey you, seek no means against them."
          },
          {
            translator: "Yusuf Ali",
            text: "...and beat them (lightly); but if they return to obedience, seek not against them means (of annoyance)."
          },
          {
            translator: "Pickthall",
            text: "...and scourge them. Then if they obey you, seek not a way against them."
          }
        ]
      },
      {
        surah: 2,
        ayah: 26,
        arabicText: "إِنَّ اللَّهَ لَا يَسْتَحْيِي أَن يَضْرِبَ مَثَلًا مَّا بَعُوضَةً فَمَا فَوْقَهَا",
        translations: [
          {
            translator: "Sahih International",
            text: "Indeed, Allah is not timid to present an example - that of a mosquito or what is smaller than it."
          },
          {
            translator: "Yusuf Ali",
            text: "Allah disdains not to use the similitude of things, lowest as well as highest."
          },
          {
            translator: "Pickthall",
            text: "Lo! Allah disdaineth not to coin the similitude even of a gnat."
          }
        ]
      },
      {
        surah: 73,
        ayah: 20,
        arabicText: "وَآخَرُونَ يَضْرِبُونَ فِي الْأَرْضِ يَبْتَغُونَ مِن فَضْلِ اللَّهِ",
        translations: [
          {
            translator: "Sahih International",
            text: "...and others traveling throughout the land seeking [something] of the bounty of Allah..."
          },
          {
            translator: "Yusuf Ali",
            text: "...others traveling through the land, seeking of Allah's bounty..."
          },
          {
            translator: "Pickthall",
            text: "...and others traveling in the land in search of Allah's bounty..."
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <WordAnalysis {...mockData} />
      </div>
    </div>
  );
}
