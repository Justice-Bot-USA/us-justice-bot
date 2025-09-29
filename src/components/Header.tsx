import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Scale, Globe } from "lucide-react";
import logoImage from "@/assets/us-justice-bot-logo.png";

interface HeaderProps {
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  const text = {
    en: {
      title: "US Justice Bot",
      subtitle: "Free Legal Guidance for All Americans",
      languageLabel: "Language"
    },
    es: {
      title: "Bot de Justicia de EE.UU.",
      subtitle: "Orientación Legal Gratuita para Todos los Estadounidenses",
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;