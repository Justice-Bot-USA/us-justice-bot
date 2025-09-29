import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WarningBanner from "@/components/WarningBanner";
import LegalSections from "@/components/LegalSections";
import StateSelector from "@/components/StateSelector";
import { ChatSection } from "@/components/ChatSection";

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showStateSelector, setShowStateSelector] = useState(false);

  const handleGetStarted = () => {
    setShowStateSelector(true);
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    if (!selectedState) {
      setShowStateSelector(true);
    }
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main>
        <HeroSection language={language} onGetStarted={handleGetStarted} />
        
        <div className="container mx-auto px-4">
          <WarningBanner language={language} />
        </div>
        
        <LegalSections language={language} onSectionSelect={handleSectionSelect} />
        
        {showStateSelector && (
          <StateSelector 
            language={language} 
            onStateSelect={handleStateSelect}
            selectedState={selectedState}
          />
        )}
        
        <ChatSection 
          language={language} 
          selectedState={selectedState} 
          selectedSection={selectedSection}
          onLanguageChange={setLanguage}
          onStateChange={setSelectedState}
        />
      </main>
    </div>
  );
};

export default Index;
