import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Enter Arabic word or English term" }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-gold/20 to-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"></div>
        <div className="relative bg-white rounded-xl shadow-lg border-2 border-primary/10 group-focus-within:border-primary/30 transition-all duration-300">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="h-16 md:h-20 text-lg md:text-xl pl-16 md:pl-20 pr-32 md:pr-40 bg-transparent border-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            data-testid="input-search"
          />
          <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-primary">
            <Search className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <Button
            type="submit"
            size="default"
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold bg-primary hover:bg-primary/90 shadow-md"
            data-testid="button-search"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
