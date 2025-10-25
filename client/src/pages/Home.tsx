import IslamicPattern from "@/components/IslamicPattern";
import SearchBar from "@/components/SearchBar";
import FeaturedWordCard from "@/components/FeaturedWordCard";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredWords = [
    {
      arabicWord: "ضرب",
      transliteration: "ḍaraba",
      root: "ض-ر-ب",
      meaning: "Can mean 'to strike', 'to set forth (a parable)', 'to travel', or 'to separate' — context is key"
    },
    {
      arabicWord: "قوام",
      transliteration: "qawwām",
      root: "ق-و-م",
      meaning: "Often mistranslated as 'in charge of' — actually means 'maintainers' or 'supporters'"
    },
    {
      arabicWord: "جلباب",
      transliteration: "jilbāb",
      root: "ج-ل-ب",
      meaning: "Outer garment or cloak — not necessarily a specific style of dress"
    },
    {
      arabicWord: "نشوز",
      transliteration: "nushūz",
      root: "ن-ش-ز",
      meaning: "Rising, elevation, discord, or rebellion — applies to both spouses in the Quran"
    },
    {
      arabicWord: "خمار",
      transliteration: "khimār",
      root: "خ-م-ر",
      meaning: "Head covering — the Quran specifies covering the chest, not just the head"
    },
    {
      arabicWord: "فتنة",
      transliteration: "fitnah",
      root: "ف-ت-ن",
      meaning: "Trial, temptation, persecution, or discord — one of the most context-dependent words"
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
            <div className="space-y-2">
              <h1 
                className="text-5xl md:text-6xl font-amiri text-primary" 
                dir="rtl" 
                lang="ar"
                data-testid="text-bismillah"
              >
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </h1>
              <p className="text-sm text-muted-foreground italic">
                Bismillāhi r-Raḥmāni r-Raḥīm
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-5xl font-bold text-primary mb-2">Lisan</h2>
              <p className="text-2xl text-foreground font-semibold mb-2">
                Quranic Linguistic Truth Engine
              </p>
              <p className="text-lg text-muted-foreground font-crimson max-w-2xl mx-auto">
                Understand revelation through its original language — not through screenshots. 
                Exposing mistranslations, verifying hadiths, and revealing the depth of Quranic Arabic.
              </p>
              
              <div className="flex justify-center pt-4">
                <SearchBar onSearch={handleSearch} placeholder="Enter Arabic word or English term (e.g., daraba, qawwam)" />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Search in Arabic: <span className="font-amiri text-base">ضرب، قوام، جلباب</span> or English transliteration
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-semibold text-primary mb-2">
                Commonly Mistranslated Words
              </h3>
              <p className="text-muted-foreground">
                Click any word to see its full linguistic analysis, all Quranic occurrences, and scholarly interpretations
              </p>
            </div>
            
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

          <div className="max-w-4xl mx-auto mt-20 space-y-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-primary mb-4 text-center">What is Lisan?</h3>
                <div className="space-y-4 text-foreground/90 font-crimson leading-relaxed">
                  <p>
                    <strong>Lisan</strong> (لسان = "language" or "tongue") is a linguistic truth engine that restores 
                    dignity to the Quran by exposing the semantic depth Arabic words carry across grammatical, 
                    historical, and contextual layers.
                  </p>
                  <p>
                    This is <strong>not a translation app</strong> — it's a tool to fight shallow interpretations, 
                    viral misquotes, and mistranslations with rigorous linguistic analysis and verified scholarship.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-card rounded-md">
                      <div className="text-3xl mb-2">📖</div>
                      <h4 className="font-semibold text-primary mb-1">Deep Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Root extraction, grammar, rhetoric, and 1400 years of scholarly interpretation
                      </p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-md">
                      <div className="text-3xl mb-2">🔍</div>
                      <h4 className="font-semibold text-primary mb-1">Context is Key</h4>
                      <p className="text-sm text-muted-foreground">
                        See how the same word means different things in different verses
                      </p>
                    </div>
                    <div className="text-center p-4 bg-card rounded-md">
                      <div className="text-3xl mb-2">✅</div>
                      <h4 className="font-semibold text-primary mb-1">For Everyone</h4>
                      <p className="text-sm text-muted-foreground">
                        Arabic speakers and Western learners alike — with full transliteration
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
