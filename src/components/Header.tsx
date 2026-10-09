import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Globe, User, LogOut, Settings, Briefcase, Sparkles, FileText, Menu, Gavel, FolderOpen, Scale, ScrollText, GraduationCap, LayoutGrid, ChevronDown, Search, Database, Users, Heart, BarChart3, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import logoImage from "@/assets/ai-anal-logo.png";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  language: 'en' | 'es';
  onLanguageChange: (lang: 'en' | 'es') => void;
}

const navButtonClass = "text-primary-foreground hover:bg-white/10";

// Secondary links shown under "More" in the desktop nav (the mobile menu lists them directly).
const moreLinks = [
  {
    label: "Guides & forms",
    links: [
      { to: "/self-help", label: "Self-Help Guide", icon: Users },
      { to: "/usa-forms", label: "US Court Forms Catalog", icon: Scale },
      { to: "/criminal-defense-guide", label: "Criminal Defense Guide", icon: Gavel },
    ],
  },
  {
    label: "Family",
    links: [
      { to: "/ca/family-law/custody-visitation", label: "Custody & Visitation (CA)", icon: Heart },
      { to: "/ca/family-law/custody-visitation/forms", label: "CA Custody Forms", icon: FileText },
      { to: "/ca/family-law/custody-visitation/start", label: "Find Your Path", icon: Sparkles },
      { to: "/issues", label: "All Issue Hubs", icon: LayoutGrid },
    ],
  },
  {
    label: "Court data",
    links: [
      { to: "/courtlistener", label: "CourtListener Search", icon: Search },
      { to: "/court-records", label: "Court Records", icon: ScrollText },
    ],
  },
  {
    label: "Learn",
    links: [
      { to: "/courses", label: "Course Hub", icon: GraduationCap },
      { to: "/ai-tools", label: "AI Tools", icon: Sparkles },
    ],
  },
];

const Header = ({ language, onLanguageChange }: HeaderProps) => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin } = useAdminAccess();
  
  // Show Sign In button while loading to avoid flicker
  const showSignedIn = !loading && user;
  const text = {
    en: {
      title: "Justice Bot USA",
      subtitle: "Legal information, not legal advice",
      languageLabel: "Language"
    },
    es: {
      title: "Justice Bot USA",
      subtitle: "No Soy Abogado — información, no asesoría",
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

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logoImage} alt="Justice Bot USA logo" className="w-12 h-12 object-contain rounded-full bg-white p-1" />
            <div className="hidden sm:block lg:hidden xl:block">
              <h1 className="text-xl font-bold leading-tight">{text[language].title}</h1>
              <p className="text-xs text-primary-foreground/80">{text[language].subtitle}</p>
            </div>
          </Link>

          {/* Desktop nav: kept short so the row fits at 1024px; everything else lives under "More". */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* No room for the badge next to the signed-in buttons */}
            {!showSignedIn && (
              <Badge variant="secondary" className="bg-secondary shrink-0 hidden 2xl:inline-flex">
                🇺🇸 Live in CA & NY
              </Badge>
            )}

            <ThemeToggle />

            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" aria-hidden="true" />
              <Select value={language} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-28 bg-white/10 border-white/20" aria-label={text[language].languageLabel}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <nav className="flex items-center gap-1" aria-label="Primary">
              <Button asChild variant="ghost" size="sm" className={navButtonClass}>
                <Link to="/ca/legal-center">California</Link>
              </Button>

              <Button asChild variant="ghost" size="sm" className={navButtonClass}>
                <Link to="/ny/legal-center">New York</Link>
              </Button>

              <Button asChild variant="ghost" size="sm" className={navButtonClass}>
                <Link to="/legal-areas">Legal Areas</Link>
              </Button>

              <Button asChild variant="ghost" size="sm" className={navButtonClass}>
                <Link to="/forms-library">Forms</Link>
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className={navButtonClass}>
                    More
                    <ChevronDown className="w-3 h-3 ml-1" aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 max-h-[80vh] overflow-y-auto" align="end">
                  <div className="flex flex-col gap-1">
                    {moreLinks.map((group, gi) => (
                      <div key={group.label} className="flex flex-col gap-1">
                        {gi > 0 && <div className="border-t my-1" />}
                        <p className="px-3 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {group.label}
                        </p>
                        {group.links.map(({ to, label, icon: Icon }) => (
                          <Button key={to} asChild variant="ghost" size="sm" className="justify-start">
                            <Link to={to}>
                              <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                              {label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </nav>

            <div className="flex items-center gap-2">
              {showSignedIn ? (
                <>
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/my-cases">
                      <Briefcase className="w-4 h-4 mr-1" aria-hidden="true" />
                      My Cases
                    </Link>
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className={navButtonClass} aria-label="Account menu">
                        <User className="w-4 h-4 2xl:mr-1" aria-hidden="true" />
                        {/* Label only at 2xl so the signed-in row fits next to the title from 1024px up */}
                        <span className="hidden 2xl:inline">Account</span>
                        <ChevronDown className="w-3 h-3 ml-1" aria-hidden="true" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52 p-2" align="end">
                      <div className="flex flex-col gap-1">
                        <Button asChild variant="ghost" size="sm" className="justify-start">
                          <Link to="/book-of-documents">
                            <FolderOpen className="w-4 h-4 mr-2" aria-hidden="true" />
                            Documents
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="justify-start">
                          <Link to="/dashboard/analytics">
                            <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />
                            Analytics
                          </Link>
                        </Button>
                        {isAdmin && (
                          <Button asChild variant="ghost" size="sm" className="justify-start">
                            <Link to="/admin">
                              <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                              Admin
                            </Link>
                          </Button>
                        )}
                        <div className="border-t my-1" />
                        <Button variant="ghost" size="sm" className="justify-start" onClick={() => signOut()}>
                          <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                          Sign Out
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </>
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
              <SheetContent side="right" className="w-[320px] flex flex-col h-full">
                <SheetHeader className="shrink-0">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-4 flex-1 overflow-y-auto space-y-6 pb-8">
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
                    <p className="text-xs font-medium text-muted-foreground">
                      Live in California and New York. Other states coming soon.
                    </p>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/ca/legal-center">
                        <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                        California
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/ny/legal-center">
                        <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                        New York
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/legal-areas">
                        <LayoutGrid className="w-4 h-4 mr-2" aria-hidden="true" />
                        Legal Areas Hub
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/self-help">
                        <Users className="w-4 h-4 mr-2" aria-hidden="true" />
                        Self-Help Guide
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/usa-forms">
                        <Scale className="w-4 h-4 mr-2" aria-hidden="true" />
                        US Court Forms Catalog
                      </Link>
                    </Button>
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
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="secondary" className="w-full justify-between">
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-2" aria-hidden="true" />
                            Family
                          </span>
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 space-y-1 mt-1">
                        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                          <Link to="/ca/family-law/custody-visitation">
                            <Scale className="w-4 h-4 mr-2" aria-hidden="true" />
                            Custody & Visitation
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                          <Link to="/ca/family-law/custody-visitation/forms">
                            <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
                            CA Custody Forms
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                          <Link to="/ca/family-law/custody-visitation/start">
                            <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                            Find Your Path
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                          <Link to="/issues">
                            <LayoutGrid className="w-4 h-4 mr-2" aria-hidden="true" />
                            All Issue Hubs
                          </Link>
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="secondary" className="w-full justify-between">
                          <span className="flex items-center">
                            <Database className="w-4 h-4 mr-2" aria-hidden="true" />
                            Court Data
                          </span>
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 space-y-1 mt-1">
                        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                          <Link to="/courtlistener">
                            <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                            CourtListener Search
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start" size="sm">
                          <Link to="/court-records">
                            <ScrollText className="w-4 h-4 mr-2" aria-hidden="true" />
                            Court Records
                          </Link>
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/ai-tools">
                        <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                        AI Tools
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full justify-start">
                      <Link to="/courses">
                        <GraduationCap className="w-4 h-4 mr-2" aria-hidden="true" />
                        Course Hub
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