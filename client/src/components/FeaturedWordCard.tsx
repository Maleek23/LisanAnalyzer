import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
      className="hover-elevate cursor-pointer transition-all hover:shadow-xl border-primary/10" 
      onClick={onClick}
      data-testid={`card-word-${arabicWord}`}
    >
      <CardHeader className="pb-2 space-y-1">
        <h3 className="text-4xl font-amiri text-center text-primary" dir="rtl">
          {arabicWord}
        </h3>
        <p className="text-center text-sm text-muted-foreground italic">
          {transliteration}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-center">
          <Badge className="bg-gold text-white font-amiri text-base px-4 py-1" data-testid={`badge-root-${arabicWord}`}>
            {root}
          </Badge>
        </div>
        <p className="text-sm text-foreground font-crimson text-center" data-testid={`text-meaning-${arabicWord}`}>
          {meaning}
        </p>
      </CardContent>
    </Card>
  );
}
