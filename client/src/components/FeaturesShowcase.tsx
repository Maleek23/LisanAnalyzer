import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Drama, GraduationCap, Globe } from "lucide-react";

export default function FeaturesShowcase() {
  const [activeTab, setActiveTab] = useState("linguistic");

  const features = {
    linguistic: {
      icon: BookOpen,
      title: "Linguistic Foundation",
      description: "Deep grammatical and morphological analysis",
      details: [
        "Triliteral root extraction (ض-ر-ب)",
        "Verb form patterns (Form I through Form X)",
        "Syntax role identification",
        "Morphological parsing",
        "Semantic field mapping across 10+ meanings"
      ]
    },
    rhetorical: {
      icon: Drama,
      title: "Rhetorical Devices",
      description: "Understanding Balagha (eloquence) and literary techniques",
      details: [
        "Metaphor and simile (Isti'ara)",
        "Ellipsis and implied meanings",
        "Emphasis patterns (Tawkeed)",
        "Word order significance",
        "Parallelism and rhythm (Saj')"
      ]
    },
    scholarly: {
      icon: GraduationCap,
      title: "Scholarly Commentary",
      description: "1400 years of verified tafsir and interpretation",
      details: [
        "Classical exegesis (Ibn Kathir, Tabari, Qurtubi)",
        "Modern scholarship (Sayyid Qutb, Maududi)",
        "Linguistic analysis (Al-Zamakhshari)",
        "Chain of narration verification",
        "Comparative interpretation across schools"
      ]
    },
    modern: {
      icon: Globe,
      title: "Modern Context",
      description: "Contemporary applications and usage",
      details: [
        "How meanings evolved over 14 centuries",
        "Modern Arabic usage patterns",
        "Cross-cultural translation challenges",
        "Common misconceptions debunked",
        "Real-world application examples"
      ]
    }
  };

  return (
    <section className="py-20 bg-cream dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Four Layers of Understanding
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-crimson">
            Every word analysis combines linguistic science, classical scholarship, 
            and modern context for complete comprehension
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="max-w-5xl mx-auto"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 h-auto">
            {Object.entries(features).map(([key, feature]) => {
              const Icon = feature.icon;
              return (
                <TabsTrigger 
                  key={key}
                  value={key}
                  className="flex flex-col items-center gap-2 py-3 data-[state=active]:border-b-2 data-[state=active]:border-gold"
                  data-testid={`tab-${key}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs md:text-sm">{feature.title.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(features).map(([key, feature]) => {
            const Icon = feature.icon;
            return (
              <TabsContent 
                key={key} 
                value={key}
                className="animate-in fade-in-50 duration-300"
              >
                <Card className="border-gold/20">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground font-crimson">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {feature.details.map((detail, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-3 text-foreground/90"
                        >
                          <span className="text-gold mt-1.5">•</span>
                          <span className="font-crimson">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground italic font-crimson">
                        Example: The word <span className="font-amiri text-base text-primary">ضرب</span> (daraba) 
                        demonstrates how {feature.title.toLowerCase()} reveals depth beyond simple translation — 
                        from "to strike" to "to set forth examples" to "to travel through the land."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
