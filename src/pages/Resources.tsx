import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Clock, Search, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const emergencyHelplines = [
    { name: "Women Helpline", number: "181", available: "24/7" },
    { name: "Child Helpline", number: "1098", available: "24/7" },
    { name: "Senior Citizen Helpline", number: "14567", available: "24/7" },
    { name: "Cyber Crime Helpline", number: "1930", available: "24/7" },
    { name: "National Legal Services Authority", number: "15100", available: "24/7" },
  ];

  const legalAidCenters = [
    {
      name: "District Legal Services Authority - Delhi",
      address: "Patiala House Courts Complex, New Delhi",
      phone: "011-23073254",
      hours: "Mon-Fri: 10 AM - 5 PM",
      services: ["Free legal consultation", "Court representation", "Mediation"],
    },
    {
      name: "State Legal Services Authority - Mumbai",
      address: "High Court Building, Mumbai",
      phone: "022-22620328",
      hours: "Mon-Fri: 10 AM - 5 PM",
      services: ["Free legal aid", "Lok Adalat", "Legal awareness"],
    },
    {
      name: "District Legal Services Authority - Bangalore",
      address: "City Civil Court Complex, Bangalore",
      phone: "080-22867462",
      hours: "Mon-Fri: 10 AM - 5 PM",
      services: ["Free legal advice", "Alternative dispute resolution", "Victim compensation"],
    },
  ];

  const policeStations = [
    {
      name: "Connaught Place Police Station",
      address: "Parliament Street, New Delhi - 110001",
      phone: "011-23364577",
      type: "Central Delhi",
    },
    {
      name: "Colaba Police Station",
      address: "Colaba, Mumbai - 400001",
      phone: "022-22154206",
      type: "South Mumbai",
    },
    {
      name: "Cyber Crime Cell - Delhi",
      address: "I.P. Estate, New Delhi - 110002",
      phone: "011-23490012",
      type: "Specialized",
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Legal Resources & Contacts</h1>
        <p className="text-muted-foreground">
          Find legal assistance, helplines, and support services near you
        </p>
      </div>

      {/* Emergency Helplines */}
      <Card className="mb-8 border-l-4 border-l-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Phone className="h-5 w-5" />
            Emergency Helplines
          </CardTitle>
          <CardDescription>Available 24/7 for immediate assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {emergencyHelplines.map((helpline, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border bg-card p-4"
              >
                <div>
                  <p className="font-semibold">{helpline.name}</p>
                  <p className="text-2xl font-bold text-primary">{helpline.number}</p>
                  <Badge variant="secondary" className="mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {helpline.available}
                  </Badge>
                </div>
                <Button size="icon" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
                aria-hidden="true"
              />
              <Input 
                placeholder="Search by location, service type..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search resources"
              />
            </div>
            <Button type="submit" aria-label="Search resources">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Tabbed Resources */}
      <Tabs defaultValue="legal-aid" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="legal-aid">Legal Aid Centers</TabsTrigger>
          <TabsTrigger value="police">Police Stations</TabsTrigger>
          <TabsTrigger value="courts">Courts</TabsTrigger>
        </TabsList>

        <TabsContent value="legal-aid" className="space-y-4">
          {legalAidCenters.map((center, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    <CardDescription className="flex items-start gap-2 mt-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{center.address}</span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{center.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{center.hours}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Services Offered:</p>
                  <div className="flex flex-wrap gap-2">
                    {center.services.map((service, idx) => (
                      <Badge key={idx} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="police" className="space-y-4">
          {policeStations.map((station, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{station.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">{station.type}</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{station.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{station.phone}</span>
                </div>
                <Button className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Station
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="courts" className="space-y-4">
          <EmptyState
            icon={MapPin}
            title="Court Directory Coming Soon"
            description="We're building a comprehensive directory of district courts, tribunals, and high courts"
            action={{
              label: "Visit E-Courts Portal",
              onClick: () => window.open("https://ecourts.gov.in", "_blank"),
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
