import IslamicPattern from "@/components/IslamicPattern";
import SearchBar from "@/components/SearchBar";
import FeaturedWordCard from "@/components/FeaturedWordCard";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredWords = [
    {
      arabicWord: "ضرب",
      root: "ض-ر-ب",
      meaning: "Can mean 'to strike', 'to set forth (a parable)', 'to travel', or 'to separate'"
    },
    {
      arabicWord: "قوام",
      root: "ق-و-م",
      meaning: "Often translated as 'maintainers' or 'protectors'"
    },
    {
      arabicWord: "جلباب",
      root: "ج-ل-ب",
      meaning: "Outer garment or cloak"
    },
    {
      arabicWord: "نشوز",
      root: "ن-ش-ز",
      meaning: "Rising, elevation, or discord"
    },
    {
      arabicWord: "خمار",
      root: "خ-م-ر",
      meaning: "Head covering or veil"
    },
    {
      arabicWord: "فتنة",
      root: "ف-ت-ن",
      meaning: "Trial, temptation, or persecution"
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
  };

  const handleWordClick = (word: string) => {
    console.log('Navigate to word:', word);
  };

  return (
    <div className="min-h-screen bg-cream">
      <IslamicPattern />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-8 mb-16">
            <h1 
              className="text-6xl md:text-7xl font-amiri text-primary mb-4" 
              dir="rtl" 
              lang="ar"
              data-testid="text-bismillah"
            >
              بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
            </h1>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-4xl font-bold text-primary">Lisan</h2>
              <p className="text-xl text-muted-foreground font-crimson">
                Understand the Quran through its original language
              </p>
              
              <div className="flex justify-center pt-4">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
              Commonly Mistranslated Words
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWords.map((word, index) => (
                <FeaturedWordCard
                  key={index}
                  {...word}
                  onClick={() => handleWordClick(word.arabicWord)}
                />
              ))}
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-20 text-center">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-primary mb-4">About Lisan</h3>
                <p className="text-muted-foreground font-crimson leading-relaxed">
                  Lisan helps you explore the depth of Quranic Arabic by breaking down words to their roots,
                  revealing multiple meanings, and showing how context shapes translation. Discover how
                  seemingly simple words carry profound nuances that are often lost in translation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
