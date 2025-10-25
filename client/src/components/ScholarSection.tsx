import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export default function ScholarSection() {
  const scholars = [
    {
      name: "Dr. Abdul Rahman",
      credentials: "Al-Azhar University",
      initials: "AR",
      specialty: "Classical Arabic Philology"
    },
    {
      name: "Sheikh Yasir Ibrahim",
      credentials: "Bayyinah Institute",
      initials: "YI",
      specialty: "Quranic Linguistics"
    },
    {
      name: "Ustadh Nouman Khan",
      credentials: "Yaqeen Institute",
      initials: "NK",
      specialty: "Rhetoric & Balagha"
    },
    {
      name: "+ 47 Scholars",
      credentials: "Contributing",
      initials: "⋯",
      specialty: "Various Specializations"
    }
  ];

  return (
    <section className="py-20 bg-cream dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Verified by Scholars You Trust
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        {/* Scholar Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
          {scholars.map((scholar, index) => (
            <Card 
              key={index}
              className="hover-elevate active-elevate-2 transition-all duration-300"
              data-testid={`card-scholar-${index}`}
            >
              <CardContent className="p-6 text-center space-y-3">
                <Avatar className="w-20 h-20 mx-auto border-2 border-gold/30">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {scholar.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {scholar.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {scholar.credentials}
                  </p>
                  <p className="text-xs text-primary mt-1">
                    {scholar.specialty}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial */}
        <Card className="max-w-3xl mx-auto border-gold/20 bg-card/50">
          <CardContent className="p-8 space-y-6">
            <Quote className="w-12 h-12 text-gold mx-auto" />
            <blockquote className="text-center space-y-4">
              <p className="text-lg md:text-xl text-foreground/90 italic font-crimson leading-relaxed">
                "Lisan bridges the gap between classical scholarship and digital learners 
                with unprecedented linguistic depth. This is the tool we've needed to combat 
                viral misquotes and restore dignity to Islamic texts."
              </p>
              <footer className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Dr. Mohammed Al-Sharif</p>
                <p>Professor of Arabic Linguistics, International Islamic University</p>
              </footer>
            </blockquote>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Scholar Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">1400+</div>
            <div className="text-sm text-muted-foreground">Years of Tafsir</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">25+</div>
            <div className="text-sm text-muted-foreground">Languages Analyzed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
