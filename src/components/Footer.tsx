import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-12">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-bold text-primary">ENACT</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering Navigation through Accessible Civic Tools. Making justice accessible for every Indian citizen.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  Chat Assistant
                </Link>
              </li>
              <li>
                <Link to="/documents" className="text-muted-foreground hover:text-primary transition-colors">
                  Document Templates
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                  Legal Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal Info</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>About BNS, BSA & BNSS</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Disclaimer</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Emergency Helplines</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-destructive" />
                <span className="font-semibold">Women: 181</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-destructive" />
                <span className="font-semibold">Cyber Crime: 1930</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-destructive" />
                <span className="font-semibold">Legal Aid: 15100</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 ENACT. All rights reserved. Built for the people of India.</p>
          <p className="text-xs">
            This platform provides general legal information only and does not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
