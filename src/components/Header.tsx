import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Scale, Globe, User, LogOut, Settings, Briefcase, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import logoImage from "@/assets/us-justice-bot-logo.png";

interface HeaderProps {
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminAccess();
  const text = {
    en: {
      title: "US Justice Bot",
      subtitle: "Equal Justice Under Law - Accessible Legal Guidance",
      languageLabel: "Language"
    },
    es: {
      title: "Bot de Justicia de EE.UU.",
      subtitle: "Justicia Igual Bajo la Ley - Orientación Legal Accesible",
      languageLabel: "Idioma"
    }
  };

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg">
              <img src={logoImage} alt="US Justice Bot" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{text[language].title}</h1>
              <p className="text-primary-foreground/80">{text[language].subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-secondary">
              🇺🇸 All 50 States
            </Badge>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* AI Tools Link */}
            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
              <Link to="/ai-tools">
                <Sparkles className="w-4 h-4 mr-1" />
                AI Tools
              </Link>
            </Button>
            
            {/* Auth Section */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/my-cases">
                      <Briefcase className="w-4 h-4 mr-1" />
                      My Cases
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="secondary" size="sm">
                      <Link to="/admin">
                        <Settings className="w-4 h-4 mr-1" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild variant="secondary" size="sm">
                  <Link to="/auth">
                    <User className="w-4 h-4 mr-1" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;