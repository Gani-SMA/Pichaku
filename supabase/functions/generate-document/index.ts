import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { documentType, details } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    console.log("Generating", documentType, "document");

    const prompts = {
      fir: `Generate a complete First Information Report (FIR) based on the following details:
${JSON.stringify(details, null, 2)}

Format the FIR professionally with all required sections:
1. Police Station Details
2. Complainant Information
3. Date, Time, and Place of Occurrence
4. Nature of Information (offense details)
5. Description of Accused (if known)
6. Brief Facts of Case
7. Action Taken
8. Relevant IPC/BNS Sections

Make it formal, legally sound, and ready to file.`,

      legal_notice: `Generate a professional Legal Notice based on these details:
${JSON.stringify(details, null, 2)}

Include:
1. Header (Notice issuer details)
2. Date
3. To: (Recipient details)
4. Subject Line
5. Facts of the Case (chronologically)
6. Legal Grounds (relevant sections)
7. Demands/Relief Sought
8. Consequences of Non-Compliance
9. Timeline to Respond
10. Signature block

Use formal legal language and proper notice format.`,

      rti: `Generate a Right to Information (RTI) application based on:
${JSON.stringify(details, null, 2)}

Format according to RTI Act 2005:
1. To: (Public Information Officer details)
2. Subject Line
3. Applicant Details
4. Information Sought (specific questions)
5. Mode of Information Delivery Preferred
6. Declaration Statement
7. Payment Details Reference
8. Date and Signature

Make questions specific, clear, and within RTI scope.`,
    };

    const systemPrompt = prompts[documentType as keyof typeof prompts];
    if (!systemPrompt) {
      throw new Error("Invalid document type");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate document" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(
      JSON.stringify({ document: generatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Document generation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
