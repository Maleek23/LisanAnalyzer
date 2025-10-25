import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "أدخل كلمة قرآنية" }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-16 text-2xl pr-14 text-right font-amiri bg-white border-2 border-primary/20 focus-visible:border-primary focus-visible:ring-primary"
          dir="rtl"
          data-testid="input-search"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gold hover-elevate active-elevate-2 p-2 rounded-md"
          data-testid="button-search"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}
