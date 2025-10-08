import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Loader2 } from "lucide-react";

type DocumentType = "fir" | "legal_notice" | "rti";

const Documents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState<DocumentType>("fir");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState("");

  // Form fields
  const [complainantName, setComplainantName] = useState("");
  const [complainantAddress, setComplainantAddress] = useState("");
  const [incidentDetails, setIncidentDetails] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [accusedDetails, setAccusedDetails] = useState("");

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleGenerate = async () => {
    if (!complainantName || !incidentDetails) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-document", {
        body: {
          documentType,
          details: {
            complainantName,
            complainantAddress,
            incidentDetails,
            incidentDate,
            accusedDetails,
          },
        },
      });

      if (error) throw error;

      setGeneratedDocument(data.document);
      toast({
        title: "Document Generated!",
        description: "Your legal document is ready to download.",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDocument], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentType}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const documentDescriptions = {
    fir: "First Information Report - File a police complaint",
    legal_notice: "Legal Notice - Send formal legal communication",
    rti: "RTI Application - Request public information from government",
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Generate Legal Documents</h1>
          <p className="text-muted-foreground">
            Create professionally formatted legal documents in minutes
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Type</CardTitle>
            <CardDescription>
              Select the type of document you want to generate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type</Label>
              <Select
                value={documentType}
                onValueChange={(value) => setDocumentType(value as DocumentType)}
              >
                <SelectTrigger id="docType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fir">FIR - First Information Report</SelectItem>
                  <SelectItem value="legal_notice">Legal Notice</SelectItem>
                  <SelectItem value="rti">RTI Application</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {documentDescriptions[documentType]}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Full Name *</Label>
                <Input
                  id="name"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Your Address</Label>
                <Textarea
                  id="address"
                  value={complainantAddress}
                  onChange={(e) => setComplainantAddress(e.target.value)}
                  placeholder="Enter your full address"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">
                  {documentType === "fir" && "Incident Details *"}
                  {documentType === "legal_notice" && "Issue Details *"}
                  {documentType === "rti" && "Information Required *"}
                </Label>
                <Textarea
                  id="details"
                  value={incidentDetails}
                  onChange={(e) => setIncidentDetails(e.target.value)}
                  placeholder="Provide complete details..."
                  rows={6}
                  required
                />
              </div>

              {documentType === "fir" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="date">Incident Date & Time</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accused">Accused Details (if known)</Label>
                    <Textarea
                      id="accused"
                      value={accusedDetails}
                      onChange={(e) => setAccusedDetails(e.target.value)}
                      placeholder="Name, address, description of accused person(s)"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Document...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Document
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {generatedDocument && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Document</CardTitle>
              <CardDescription>
                Review and download your legal document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-6 rounded-lg whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                {generatedDocument}
              </div>
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="mr-2 h-5 w-5" />
                Download Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Documents;
