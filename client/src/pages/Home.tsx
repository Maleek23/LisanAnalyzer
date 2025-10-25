import IslamicPattern from "@/components/IslamicPattern";
import SearchBar from "@/components/SearchBar";
import FeaturedWordCard from "@/components/FeaturedWordCard";
import ProblemCards from "@/components/ProblemCards";
import FeaturesShowcase from "@/components/FeaturesShowcase";
import HadithPreview from "@/components/HadithPreview";
import ScholarSection from "@/components/ScholarSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const featuredWords = [
    {
      arabicWord: "ضرب",
      transliteration: "ḍaraba",
      root: "ض-ر-ب",
      meaning: "Can mean 'to strike', 'to set forth (a parable)', 'to travel', or 'to separate' — context is key"
    },
    {
      arabicWord: "قوامون",
      transliteration: "qawwāmūn",
      root: "ق-و-م",
      meaning: "Often mistranslated as 'in charge of' — actually means 'maintainers' or 'supporters'"
    },
    {
      arabicWord: "جلابيبهن",
      transliteration: "jalābībihinna",
      root: "ج-ل-ب",
      meaning: "Their outer garments or cloaks — not necessarily a specific style of dress"
    },
    {
      arabicWord: "نشوزهن",
      transliteration: "nushūzahunna",
      root: "ن-ش-ز",
      meaning: "Their discord or rebellion — applies to both spouses in the Quran"
    },
    {
      arabicWord: "بخمرهن",
      transliteration: "bi-khumurihinna",
      root: "خ-م-ر",
      meaning: "With their head coverings — the Quran specifies covering the chest, not just the head"
    },
    {
      arabicWord: "الفتنة",
      transliteration: "al-fitnah",
      root: "ف-ت-ن",
      meaning: "The trial, persecution, or discord — one of the most context-dependent words"
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLocation(`/word/${encodeURIComponent(query)}`);
  };

  const handleWordClick = (word: string) => {
    setLocation(`/word/${encodeURIComponent(word)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-cream dark:bg-background">
        <IslamicPattern />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Bismillah */}
            <div className="space-y-2 animate-in fade-in-50 duration-700">
              <h1 
                className="text-5xl md:text-6xl font-amiri text-gold" 
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
            
            {/* Logo & Tagline */}
            <div className="space-y-4 animate-in fade-in-50 duration-700 delay-150">
              <h2 className="text-6xl md:text-7xl font-bold text-primary tracking-tight">
                Lisan
              </h2>
              <p className="text-2xl md:text-3xl text-foreground font-semibold">
                Restore Truth to Sacred Text
              </p>
            </div>
            
            {/* Mission Statement */}
            <p className="text-lg md:text-xl text-muted-foreground font-crimson max-w-3xl mx-auto leading-relaxed animate-in fade-in-50 duration-700 delay-300">
              Understand the Qur'an through its original language — not through screenshots. 
              Exposing mistranslations, verifying hadiths, and revealing the depth of Quranic Arabic.
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center pt-6 animate-in fade-in-50 duration-700 delay-500">
              <div className="w-full max-w-2xl">
                <SearchBar 
                  onSearch={handleSearch} 
                  placeholder="Enter Arabic word or English term (e.g., daraba, qawwam)" 
                />
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Search in Arabic: <span className="font-amiri text-base">ضرب، قوام، جلباب</span> or English transliteration
                </p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-12 animate-bounce">
              <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Words Section */}
      <section className="py-20 bg-background" id="featured-words">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-primary mb-4">
              Commonly Mistranslated Words
            </h3>
            <div className="w-24 h-1 bg-gold mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-crimson">
              Click any word to see its full linguistic analysis, all Quranic occurrences, and scholarly interpretations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredWords.map((word, index) => (
              <FeaturedWordCard
                key={index}
                {...word}
                onClick={() => handleWordClick(word.arabicWord)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement Cards */}
      <div id="how-it-works">
        <ProblemCards />
      </div>

      {/* Features Showcase */}
      <div id="features">
        <FeaturesShowcase />
      </div>

      {/* Hadith Verification Preview */}
      <HadithPreview />

      {/* Scholar Section */}
      <ScholarSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
