import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WarningBanner from "@/components/WarningBanner";
import LegalSections from "@/components/LegalSections";
import StateSelector from "@/components/StateSelector";
import { ChatSection } from "@/components/ChatSection";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [showStateSelector, setShowStateSelector] = useState(false);

  const handleGetStarted = () => {
    setShowStateSelector(true);
  };

  const handleSectionSelect = (section: string) => {
    navigate('/case-analysis');
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setShowStateSelector(false);
    // Scroll to chat section
    setTimeout(() => {
      const chatSection = document.getElementById('chat-section');
      chatSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="US Justice Bot - Equal Justice Under Law - Affordable Legal Guidance"
        description="Professional legal assistance at a fraction of attorney costs. We care about your justice, not billable hours. Expert guidance for all 50 US states."
        keywords="affordable legal assistance, legal advice, legal help, US law, legal guidance, constitutional law, legal bot, legal AI, attorney alternative"
        url="https://justicebot-usa.com"
      />
      <Header language={language} onLanguageChange={setLanguage} />
      
      <main>
        <HeroSection language={language} onGetStarted={handleGetStarted} />
        
        <div className="container mx-auto px-4">
          <WarningBanner language={language} />
        </div>
        
        <LegalSections language={language} onSectionSelect={handleSectionSelect} />
        
        {showStateSelector && (
          <div id="state-selector">
            <StateSelector 
              language={language} 
              onStateSelect={handleStateSelect}
              selectedState={selectedState}
            />
          </div>
        )}
        
        <div id="chat-section">
          <ChatSection 
            language={language} 
            selectedState={selectedState} 
            selectedSection={selectedSection}
            onLanguageChange={setLanguage}
            onStateChange={setSelectedState}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
