import { Link } from "react-router-dom";
import { Scale, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-6 w-6" />
              <span className="text-xl font-bold">Veritas Path</span>
            </div>
            <p className="text-sm opacity-80 mb-4">
              A Justice-Bot Technologies Platform. AI-powered legal assistance for all 50 states.
            </p>
            <p className="text-xs opacity-60">
              Not a law firm. We provide legal information and form guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link to="/usa-forms" className="hover:opacity-100 transition-opacity">US Court Forms Catalog</Link></li>
              <li><Link to="/forms-library" className="hover:opacity-100 transition-opacity">Forms Library</Link></li>
              <li><Link to="/ai-tools" className="hover:opacity-100 transition-opacity">AI Tools</Link></li>
              <li><Link to="/pricing" className="hover:opacity-100 transition-opacity">Pricing</Link></li>
              <li><Link to="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link to="/warrant-lookup" className="hover:opacity-100 transition-opacity">Warrant Lookup</Link></li>
              <li><Link to="/sex-offender-registry" className="hover:opacity-100 transition-opacity">Sex Offender Registry</Link></li>
              <li><Link to="/court-records" className="hover:opacity-100 transition-opacity">Court Records Lookup</Link></li>
              <li><Link to="/support" className="hover:opacity-100 transition-opacity">Support</Link></li>
            </ul>
          </div>

          {/* Legal Areas */}
          <div>
            <h4 className="font-semibold mb-4">Legal Areas</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/legal-areas/family" className="hover:opacity-100 transition-opacity">Family Law</Link></li>
              <li><Link to="/legal-areas/small-claims" className="hover:opacity-100 transition-opacity">Small Claims</Link></li>
              <li><Link to="/legal-areas/housing" className="hover:opacity-100 transition-opacity">Housing & Tenant Rights</Link></li>
              <li><Link to="/legal-areas/employment" className="hover:opacity-100 transition-opacity">Employment</Link></li>
              <li><Link to="/legal-areas/human-rights" className="hover:opacity-100 transition-opacity">Human Rights</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@justicebot-usa.com" className="hover:opacity-100 transition-opacity">
                  support@justicebot-usa.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Serving all 50 US States</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-60">
            © {currentYear} Veritas Path — A Justice-Bot Technologies Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm opacity-60">
            <Link to="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:opacity-100 transition-opacity">Legal Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
