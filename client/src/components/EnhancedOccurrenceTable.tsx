import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowUpDown, Filter, BookOpen } from "lucide-react";

interface Occurrence {
  id: number;
  surah: number;
  ayah: number;
  surahName: string;
  arabicText: string;
  translation: string;
  category?: string;
  contextIndicators?: string[];
}

interface EnhancedOccurrenceTableProps {
  occurrences: Occurrence[];
  categories: string[];
  translators?: { id: string; name: string }[];
}

export default function EnhancedOccurrenceTable({
  occurrences,
  categories,
  translators = []
}: EnhancedOccurrenceTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTranslator, setSelectedTranslator] = useState<string>(translators[0]?.id || "");
  const [sortBy, setSortBy] = useState<"reference" | "category">("reference");

  // Filter and sort occurrences
  const filteredOccurrences = useMemo(() => {
    let filtered = [...occurrences];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(occ => occ.category === selectedCategory);
    }

    // Sort
    if (sortBy === "reference") {
      filtered.sort((a, b) => {
        if (a.surah !== b.surah) return a.surah - b.surah;
        return a.ayah - b.ayah;
      });
    } else if (sortBy === "category") {
      filtered.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
    }

    return filtered;
  }, [occurrences, selectedCategory, sortBy]);

  const categoryColors: Record<string, string> = {
    'Physical Strike': '#8B0000',
    'Travel/Journey': '#2C5F2D',
    'Set Forth Example': '#2C5282',
    'Metaphorical': '#0F5F4E',
    'Separate/Depart': '#4A5568',
  };

  return (
    <Card className="border-primary/20" data-testid="card-occurrence-table">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              All Quranic Occurrences ({filteredOccurrences.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Explore every usage of this word throughout the Qur'an
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by meaning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Translator Selection */}
            {translators.length > 0 && (
              <Select value={selectedTranslator} onValueChange={setSelectedTranslator}>
                <SelectTrigger className="w-full sm:w-48" data-testid="select-translator">
                  <SelectValue placeholder="Select translator" />
                </SelectTrigger>
                <SelectContent>
                  {translators.map(trans => (
                    <SelectItem key={trans.id} value={trans.id}>
                      {trans.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Sort Toggle */}
            <Button 
              variant="outline" 
              onClick={() => setSortBy(sortBy === "reference" ? "category" : "reference")}
              data-testid="button-sort-toggle"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              {sortBy === "reference" ? "By Ref" : "By Category"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredOccurrences.map((occ) => (
            <div 
              key={occ.id}
              className="p-5 rounded-lg border border-border hover-elevate group"
              data-testid={`occurrence-${occ.id}`}
            >
              {/* Header: Reference + Category */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary">
                    {occ.surah}:{occ.ayah}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Surah {occ.surahName}
                  </span>
                </div>
                {occ.category && (
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${categoryColors[occ.category]}15`,
                      color: categoryColors[occ.category],
                      borderColor: categoryColors[occ.category]
                    }}
                    className="border"
                  >
                    {occ.category}
                  </Badge>
                )}
              </div>

              {/* Arabic Text */}
              <div className="mb-3 p-4 bg-cream/30 rounded-lg border border-gold/20">
                <p className="text-xl font-amiri text-right leading-loose text-foreground">
                  {occ.arabicText}
                </p>
              </div>

              {/* Translation */}
              <div className="mb-3">
                <p className="text-foreground leading-relaxed">
                  {occ.translation}
                </p>
              </div>

              {/* Context Indicators */}
              {occ.contextIndicators && occ.contextIndicators.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                    Context Indicators:
                  </span>
                  {occ.contextIndicators.map((indicator, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline"
                      className="text-xs"
                    >
                      {indicator}
                    </Badge>
                  ))}
                </div>
              )}

              {/* View Full Context Button */}
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary hover:text-primary"
                  data-testid={`button-view-context-${occ.id}`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Full Context
                </Button>
              </div>
            </div>
          ))}

          {filteredOccurrences.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No occurrences found for the selected filters</p>
            </div>
          )}
        </div>

        {/* Load More (for pagination) */}
        {filteredOccurrences.length > 10 && (
          <div className="mt-6 text-center">
            <Button variant="outline" data-testid="button-load-more">
              Load More Verses
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
