import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Lightbulb, AlertCircle, ExternalLink } from "lucide-react";

const News = () => {
  const newsItems = [
    {
      title: "New Consumer Protection Rules 2024",
      category: "Legislative Update",
      date: "2024-03-15",
      summary: "The government has announced new rules for e-commerce returns and refunds, giving consumers stronger protection for online purchases.",
      impact: "High",
      icon: TrendingUp,
    },
    {
      title: "Supreme Court Landmark Judgment on Digital Privacy",
      category: "Court Ruling",
      date: "2024-03-10",
      summary: "The Supreme Court has ruled that citizens have a fundamental right to digital privacy, impacting how companies handle personal data.",
      impact: "High",
      icon: AlertCircle,
    },
    {
      title: "Understanding Your Rights Under BNS 2023",
      category: "Know Your Rights",
      date: "2024-03-05",
      summary: "A comprehensive guide to the new criminal laws that replaced IPC, CrPC, and Evidence Act in 2023.",
      impact: "Medium",
      icon: Lightbulb,
    },
    {
      title: "Free Legal Aid: How to Apply",
      category: "Resources",
      date: "2024-03-01",
      summary: "Step-by-step guide on accessing free legal services through District Legal Services Authority (DLSA).",
      impact: "Medium",
      icon: Lightbulb,
    },
    {
      title: "Cyber Crime Reporting Made Easier",
      category: "Policy Change",
      date: "2024-02-25",
      summary: "New online portal launched for faster reporting of cybercrimes including financial fraud and online harassment.",
      impact: "High",
      icon: TrendingUp,
    },
    {
      title: "Women's Safety: New Guidelines for Workplaces",
      category: "Workplace Rights",
      date: "2024-02-20",
      summary: "Updated POSH (Prevention of Sexual Harassment) guidelines with stricter compliance requirements for employers.",
      impact: "High",
      icon: AlertCircle,
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Legal News & Updates</h1>
        <p className="text-muted-foreground">
          Stay informed about new laws, court rulings, and your rights
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant={getImpactColor(item.impact) as any}>
                    {item.impact} Impact
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit mb-2">
                  {item.category}
                </Badge>
                <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{item.summary}</p>
                <Button variant="outline" className="w-full" size="sm">
                  Read Full Article
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 bg-gradient-card">
        <CardContent className="flex flex-col md:flex-row items-center justify-between py-8 gap-4">
          <div>
            <h3 className="font-heading text-xl font-bold mb-2">Want Legal Updates in Your Inbox?</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for weekly legal news and rights awareness
            </p>
          </div>
          <Button size="lg">Subscribe Now</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default News;
