import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Globe, User, LogOut, Settings, Briefcase, Sparkles, FileText, TrendingUp, Menu, Gavel, BookOpen, FolderOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import logoImage from "@/assets/us-justice-bot-logo.png";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdminAccess();
  
  // Show Sign In button while loading to avoid flicker
  const showSignedIn = !loading && user;
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-foreground focus:shadow"
      >
        Skip to main content
      </a>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg shrink-0">
              <img src={logoImage} alt="US Justice Bot logo" className="w-8 h-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">{text[language].title}</h1>
              <p className="text-primary-foreground/80 truncate">{text[language].subtitle}</p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4">
            <Badge variant="secondary" className="bg-secondary">
              🇺🇸 All 50 States
            </Badge>

            <ThemeToggle />

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" aria-hidden="true" />
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20" aria-label={text[language].languageLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
              <Link to="/forms-library">
                <FileText className="w-4 h-4 mr-1" aria-hidden="true" />
                Forms
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
              <Link to="/criminal-defense-guide">
                <Gavel className="w-4 h-4 mr-1" aria-hidden="true" />
                Criminal Guide
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
              <Link to="/case-law-search">
                <BookOpen className="w-4 h-4 mr-1" aria-hidden="true" />
                Case Law
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
              <Link to="/case-analysis">
                <TrendingUp className="w-4 h-4 mr-1" aria-hidden="true" />
                Merit Score
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
              <Link to="/ai-tools">
                <Sparkles className="w-4 h-4 mr-1" aria-hidden="true" />
                AI Tools
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              {showSignedIn ? (
                <div className="flex items-center gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/my-cases">
                      <Briefcase className="w-4 h-4 mr-1" aria-hidden="true" />
                      My Cases
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="text-primary-foreground hover:bg-white/10">
                    <Link to="/book-of-documents">
                      <FolderOpen className="w-4 h-4 mr-1" aria-hidden="true" />
                      Documents
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button asChild variant="secondary" size="sm">
                      <Link to="/admin">
                        <Settings className="w-4 h-4 mr-1" aria-hidden="true" />
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
                    <LogOut className="w-4 h-4 mr-1" aria-hidden="true" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild variant="secondary" size="sm">
                  <Link to="/auth">
                    <User className="w-4 h-4 mr-1" aria-hidden="true" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex lg:hidden items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">{text[language].languageLabel}</span>
                    </div>
                    <Select value={language} onValueChange={onLanguageChange}>
                      <SelectTrigger className="w-full" aria-label={text[language].languageLabel}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <nav className="space-y-2" aria-label="Primary">
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/forms-library">
                        <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                        Forms Library
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/criminal-defense-guide">
                        <Gavel className="w-4 h-4 mr-2" aria-hidden="true" />
                        Criminal Defense Guide
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/case-law-search">
                        <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
                        Case Law Search
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/case-analysis">
                        <TrendingUp className="w-4 h-4 mr-2" aria-hidden="true" />
                        Merit Score
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/ai-tools">
                        <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                        AI Tools
                      </Link>
                    </Button>
                  </nav>

                  <div className="space-y-2">
                    {showSignedIn ? (
                      <>
                        <Button asChild variant="secondary" className="w-full justify-start">
                          <Link to="/my-cases">
                            <Briefcase className="w-4 h-4 mr-2" aria-hidden="true" />
                            My Cases
                          </Link>
                        </Button>
                        <Button asChild variant="secondary" className="w-full justify-start">
                          <Link to="/book-of-documents">
                            <FolderOpen className="w-4 h-4 mr-2" aria-hidden="true" />
                            Book of Documents
                          </Link>
                        </Button>
                        {isAdmin && (
                          <Button asChild variant="secondary" className="w-full justify-start">
                            <Link to="/admin">
                              <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                              Admin
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => signOut()} className="w-full justify-start">
                          <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button asChild variant="default" className="w-full justify-start">
                        <Link to="/auth">
                          <User className="w-4 h-4 mr-2" aria-hidden="true" />
                          Sign In / Sign Up
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;