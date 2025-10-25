import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Languages, FileX } from "lucide-react";

export default function ProblemCards() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Viral Misquotes",
      description: "Screenshot Islam with no context",
      detail: "Social media spreads isolated verses without linguistic analysis or historical context, creating dangerous misunderstandings.",
      color: "text-red-600 dark:text-red-400"
    },
    {
      icon: Languages,
      title: "Shallow Translations",
      description: '"Beat them" ignores 10 other meanings',
      detail: "Single-word translations erase the semantic richness of Arabic. The word ضرب has over 25 meanings depending on context.",
      color: "text-amber-600 dark:text-amber-400"
    },
    {
      icon: FileX,
      title: "Fake Hadiths",
      description: "70% of viral hadiths are fabricated",
      detail: "Unverified quotes circulate as authentic Islamic teaching, spreading misinformation and damaging the faith's reputation.",
      color: "text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            The Problem We're Solving
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Card 
                key={index}
                className="hover-elevate active-elevate-2 border-border transition-all duration-300 group"
                data-testid={`card-problem-${index}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`${problem.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-12 h-12 mx-auto" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground text-center">
                    {problem.title}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground text-center">
                    {problem.description}
                  </p>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed font-crimson">
                    {problem.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
