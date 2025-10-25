import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Drama, GraduationCap, Globe, CheckCircle2 } from "lucide-react";

interface GrammarPattern {
  form: string;
  frequency: number;
  examples: string[];
}

interface RhetoricalDevice {
  type: string;
  description: string;
  verses: string[];
}

interface ScholarInterpretation {
  scholar: string;
  century: number;
  interpretation: string;
  layer: 'linguistic' | 'rhetorical' | 'exegetical' | 'modern';
}

interface ModernContext {
  misconception: string;
  clarification: string;
  evidence: string[];
}

interface FourLayerAnalysisProps {
  // Linguistic Layer
  grammarPatterns?: GrammarPattern[];
  syntaxRoles?: { role: string; description: string; frequency: number }[];
  
  // Rhetorical Layer
  rhetoricalDevices?: RhetoricalDevice[];
  
  // Scholarly Layer
  scholarlyTimeline?: ScholarInterpretation[];
  
  // Modern Layer
  modernContexts?: ModernContext[];
  
  // Conditional visibility
  hasDeepAnalysis: boolean;
}

export default function FourLayerAnalysis({
  grammarPatterns = [],
  syntaxRoles = [],
  rhetoricalDevices = [],
  scholarlyTimeline = [],
  modernContexts = [],
  hasDeepAnalysis
}: FourLayerAnalysisProps) {
  const [activeTab, setActiveTab] = useState("linguistic");

  if (!hasDeepAnalysis) {
    return (
      <Card className="border-gold/30 bg-gold/5" data-testid="card-analysis-unavailable">
        <CardContent className="p-8 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gold" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Deep Analysis Coming Soon
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This word is in our database, but comprehensive 4-layer analysis (grammar patterns, 
            rhetorical devices, scholarly commentary, and modern context) hasn't been added yet.
          </p>
          <button 
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover-elevate"
            data-testid="button-request-analysis"
          >
            Request Analysis for This Word
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20" data-testid="card-four-layer-analysis">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 h-auto">
            <TabsTrigger 
              value="linguistic"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              data-testid="tab-linguistic"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs md:text-sm">Linguistic</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rhetorical"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              data-testid="tab-rhetorical"
            >
              <Drama className="w-5 h-5" />
              <span className="text-xs md:text-sm">Rhetorical</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scholarly"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              data-testid="tab-scholarly"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-xs md:text-sm">Scholarly</span>
            </TabsTrigger>
            <TabsTrigger 
              value="modern"
              className="flex flex-col items-center gap-2 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary"
              data-testid="tab-modern"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs md:text-sm">Modern</span>
            </TabsTrigger>
          </TabsList>

          {/* Linguistic Layer */}
          <TabsContent value="linguistic" className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Grammatical & Morphological Analysis
              </h3>
              <p className="text-muted-foreground mb-6">
                Understanding the word through its grammatical structure, verb forms, and syntax roles
              </p>

              {/* Grammar Patterns */}
              {grammarPatterns.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Verb Form Patterns</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {grammarPatterns.map((pattern, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-border bg-card">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-primary">{pattern.form}</span>
                          <span className="text-sm text-muted-foreground">
                            {pattern.frequency} occurrences
                          </span>
                        </div>
                        <div className="space-y-1">
                          {pattern.examples.map((example, exIdx) => (
                            <div key={exIdx} className="text-sm font-amiri text-foreground">
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syntax Roles */}
              {syntaxRoles.length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Syntax Roles</h4>
                  <div className="space-y-2">
                    {syntaxRoles.map((role, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground">{role.role}</span>
                            <span className="text-sm text-muted-foreground">
                              {role.frequency}×
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Rhetorical Layer */}
          <TabsContent value="rhetorical" className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Drama className="w-6 h-6" />
                Rhetorical Devices & Literary Techniques
              </h3>
              <p className="text-muted-foreground mb-6">
                Exploring metaphors, similes, emphasis patterns, and Quranic eloquence (بلاغة)
              </p>

              {rhetoricalDevices.length > 0 ? (
                <div className="space-y-4">
                  {rhetoricalDevices.map((device, idx) => (
                    <div key={idx} className="p-5 rounded-lg border border-gold/30 bg-gold/5">
                      <h4 className="font-semibold text-foreground text-lg mb-2">{device.type}</h4>
                      <p className="text-muted-foreground mb-3">{device.description}</p>
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-primary">Examples:</span>
                        {device.verses.map((verse, vIdx) => (
                          <div key={vIdx} className="text-sm bg-background p-2 rounded border border-border">
                            {verse}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Rhetorical analysis data will be added soon
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scholarly Layer */}
          <TabsContent value="scholarly" className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                Scholarly Interpretations Across Centuries
              </h3>
              <p className="text-muted-foreground mb-6">
                Tracking how scholars from the 8th to 21st century interpreted this word
              </p>

              {scholarlyTimeline.length > 0 ? (
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
                  
                  <div className="space-y-6">
                    {scholarlyTimeline.map((entry, idx) => (
                      <div key={idx} className="relative pl-16">
                        {/* Timeline dot */}
                        <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                        
                        <div className="p-4 rounded-lg border border-border bg-card">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-foreground text-lg">{entry.scholar}</h4>
                            <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                              {entry.century}th Century
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2 uppercase tracking-wide">
                            {entry.layer} Analysis
                          </p>
                          <p className="text-foreground leading-relaxed">
                            {entry.interpretation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Scholarly commentary data will be added soon
                </div>
              )}
            </div>
          </TabsContent>

          {/* Modern Layer */}
          <TabsContent value="modern" className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6" />
                Modern Context & Common Misconceptions
              </h3>
              <p className="text-muted-foreground mb-6">
                Addressing contemporary misunderstandings and clarifying proper usage
              </p>

              {modernContexts.length > 0 ? (
                <div className="space-y-6">
                  {modernContexts.map((context, idx) => (
                    <div key={idx} className="p-5 rounded-lg border border-burgundy/30 bg-burgundy/5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-burgundy/20">
                          <svg className="w-5 h-5 text-burgundy" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-lg mb-2">
                            Common Misconception
                          </h4>
                          <p className="text-foreground/90">{context.misconception}</p>
                        </div>
                      </div>

                      <div className="ml-11 mb-3">
                        <h5 className="font-semibold text-primary mb-2">Clarification:</h5>
                        <p className="text-foreground leading-relaxed">{context.clarification}</p>
                      </div>

                      <div className="ml-11">
                        <h5 className="font-semibold text-primary mb-2">Evidence:</h5>
                        <ul className="space-y-2">
                          {context.evidence.map((item, eIdx) => (
                            <li key={eIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Modern context analysis data will be added soon
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
