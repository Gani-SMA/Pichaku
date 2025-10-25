import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Scale,
  MessageSquare,
  Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchQuerySchema } from "@/lib/validations";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = searchQuerySchema.safeParse({ query: query.trim() });

    if (!validation.success) {
      toast({
        title: "Invalid Search",
        description: validation.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  const commonIssues = [
    "Landlord won't return security deposit",
    "Workplace harassment complaint",
    "Consumer product defect refund",
    "Cybercrime reporting procedure",
    "Property dispute with neighbor",
    "Cheque bounce case filing",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero px-4 py-20">
        <div className="bg-grid-white/[0.05] absolute inset-0 bg-[size:20px_20px]" />
        <div className="container relative mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
            Powered by AI Legal Intelligence
          </Badge>
          <h1 className="mb-6 font-heading text-4xl font-bold text-white md:text-6xl">
            Know Your Rights.
            <br />
            Navigate Justice.
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Get clear, step-by-step legal guidance in plain language. No jargon, no confusion—just
            answers.
          </p>

          <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="text"
                placeholder="What's your legal problem? Describe it in your own words..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 pl-12 pr-32 text-base shadow-lg"
                aria-label="Search legal issues"
                maxLength={500}
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                aria-label="Search for legal guidance"
              >
                Get Guidance
              </Button>
            </div>
          </form>

          <p className="mt-4 text-sm text-white/80">Try: "{commonIssues[0]}"</p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">100% Authoritative</h3>
                <p className="text-sm text-muted-foreground">Based on BNS, BSA & BNSS 2023</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Instant Answers</h3>
                <p className="text-sm text-muted-foreground">Get guidance in under 15 seconds</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Zero Bias</h3>
                <p className="text-sm text-muted-foreground">Equal justice for everyone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-heading text-3xl font-bold">
            Common Legal Issues We Help With
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commonIssues.map((issue, index) => (
              <Card
                key={index}
                className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
                onClick={() => navigate(`/results?q=${encodeURIComponent(issue)}`)}
              >
                <CardContent className="flex items-center justify-between p-6">
                  <span className="text-sm font-medium">{issue}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold">How ENACT Helps You</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Understand Your Rights</CardTitle>
                <CardDescription>
                  Get clear explanations of laws in simple language, no legal jargon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/results?q=what are my rights">
                    Learn More <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Chat with AI Assistant</CardTitle>
                <CardDescription>
                  Ask follow-up questions and get personalized guidance through conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/chat">
                    Start Chat <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Gavel className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Track Your Case</CardTitle>
                <CardDescription>
                  Monitor case status and hearing dates from E-Courts portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/case-tracking">
                    Track Case <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-hero text-white">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <h2 className="mb-4 font-heading text-3xl font-bold">
                Every Citizen Deserves Justice
              </h2>
              <p className="mb-8 max-w-2xl text-lg text-white/90">
                ENACT makes legal knowledge accessible to everyone, regardless of education or
                economic status. Start your journey to justice today.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => document.querySelector("input")?.focus()}
              >
                Search Your Legal Issue
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
