import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface FeaturedWordCardProps {
  arabicWord: string;
  transliteration: string;
  root: string;
  meaning: string;
  onClick?: () => void;
}

export default function FeaturedWordCard({ arabicWord, transliteration, root, meaning, onClick }: FeaturedWordCardProps) {
  return (
    <Card 
      className="group hover-elevate cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 border-primary/10 hover:border-primary/30 bg-white overflow-hidden" 
      onClick={onClick}
      data-testid={`card-word-${arabicWord}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-gold to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="pb-4 pt-8 space-y-3 relative">
        <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <BookOpen className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-5xl md:text-6xl font-amiri text-center text-primary leading-tight" dir="rtl">
          {arabicWord}
        </h3>
        <p className="text-center text-base text-muted-foreground italic font-medium">
          {transliteration}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-8">
        <div className="flex justify-center">
          <Badge className="bg-gold text-gold-foreground font-amiri text-lg px-6 py-2 shadow-md hover:shadow-lg transition-shadow" data-testid={`badge-root-${arabicWord}`}>
            {root}
          </Badge>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <p className="text-base text-foreground/80 font-crimson text-center leading-relaxed px-2" data-testid={`text-meaning-${arabicWord}`}>
          {meaning}
        </p>
      </CardContent>
    </Card>
  );
}
