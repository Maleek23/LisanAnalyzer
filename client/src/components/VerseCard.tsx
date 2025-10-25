import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Translation {
  translator: string;
  text: string;
}

interface VerseCardProps {
  surah: number;
  ayah: number;
  arabicText: string;
  highlightWord?: string;
  transliteration?: string;
  translations: Translation[];
}

export default function VerseCard({
  surah,
  ayah,
  arabicText,
  highlightWord,
  transliteration,
  translations,
}: VerseCardProps) {
  const [copied, setCopied] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${arabicText}\n\nQuran ${surah}:${ayah}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightText = (text: string) => {
    if (!highlightWord) return text;
    const parts = text.split(new RegExp(`(${highlightWord})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={i} className="bg-gold/20 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-verse-${surah}-${ayah}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <Badge variant="outline" className="text-gold border-gold font-semibold" data-testid={`badge-reference-${surah}-${ayah}`}>
          Quran {surah}:{ayah}
        </Badge>
        <div className="flex items-center gap-2">
          {transliteration && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTransliteration(!showTransliteration)}
              data-testid={`button-toggle-transliteration-${surah}-${ayah}`}
            >
              {showTransliteration ? "Hide" : "Show"} Transliteration
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            data-testid={`button-copy-${surah}-${ayah}`}
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p
          className="text-3xl font-amiri leading-loose text-right"
          dir="rtl"
          lang="ar"
          data-testid={`text-arabic-${surah}-${ayah}`}
        >
          {highlightText(arabicText)}
        </p>

        {showTransliteration && transliteration && (
          <p className="text-sm italic text-muted-foreground text-right" dir="rtl" data-testid={`text-transliteration-${surah}-${ayah}`}>
            {transliteration}
          </p>
        )}

        <div className="border-t pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {translations.map((translation, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-semibold text-sm text-primary" data-testid={`text-translator-${index}`}>
                  {translation.translator}
                </h4>
                <p className="text-sm text-foreground/80 font-crimson leading-relaxed" data-testid={`text-translation-${index}`}>
                  {translation.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
