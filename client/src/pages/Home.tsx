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
import { ChevronDown, Sparkles } from "lucide-react";

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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-background to-cream dark:from-background dark:via-background dark:to-background">
        <IslamicPattern />
        
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
          <div className="text-center space-y-8 md:space-y-12 max-w-5xl mx-auto">
            {/* Bismillah */}
            <div className="space-y-3 md:space-y-4 animate-in fade-in-50 duration-700">
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-amiri text-gold drop-shadow-md" 
                dir="rtl" 
                lang="ar"
                data-testid="text-bismillah"
              >
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </h1>
              <p className="text-sm md:text-base text-muted-foreground italic">
                Bismillāhi r-Raḥmāni r-Raḥīm
              </p>
            </div>
            
            {/* Logo & Tagline */}
            <div className="space-y-4 md:space-y-6 animate-in fade-in-50 duration-700 delay-150">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-gold animate-pulse" />
                <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent tracking-tight">
                  Lisan
                </h2>
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-gold animate-pulse" />
              </div>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground font-bold leading-tight">
                Restore Truth to Sacred Text
              </p>
            </div>
            
            {/* Mission Statement */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-crimson max-w-3xl mx-auto leading-relaxed animate-in fade-in-50 duration-700 delay-300 px-4">
              Understand the Qur'an through its original language — not through screenshots. 
              <span className="block mt-2 text-foreground/70 font-semibold">
                Exposing mistranslations, verifying hadiths, and revealing the depth of Quranic Arabic.
              </span>
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center pt-4 md:pt-8 animate-in fade-in-50 duration-700 delay-500 px-4">
              <div className="w-full">
                <SearchBar 
                  onSearch={handleSearch} 
                  placeholder="Enter Arabic word or English term (e.g., daraba, qawwam)" 
                />
                <p className="text-sm md:text-base text-muted-foreground mt-4 md:mt-6 text-center">
                  Search in Arabic: <span className="font-amiri text-lg md:text-xl text-gold">ضرب، قوام، جلباب</span> or English transliteration
                </p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-8 md:pt-12 animate-bounce">
              <ChevronDown className="w-8 h-8 md:w-10 md:h-10 mx-auto text-muted-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Words Section */}
      <section className="py-16 md:py-24 bg-background" id="featured-words">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Analysis</p>
            </div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6">
              Commonly Mistranslated Words
            </h3>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-gold to-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto font-crimson leading-relaxed">
              Click any word to see its full linguistic analysis, all Quranic occurrences, and scholarly interpretations with interactive visualizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {featuredWords.map((word, index) => (
              <div 
                key={index}
                className="animate-in fade-in-50 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FeaturedWordCard
                  {...word}
                  onClick={() => handleWordClick(word.arabicWord)}
                />
              </div>
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
