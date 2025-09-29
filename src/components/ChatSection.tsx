import { ChatInterface } from "./ChatInterface";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, AlertTriangle } from "lucide-react";

interface ChatSectionProps {
  language: 'en' | 'es';
  selectedState: string;
  selectedSection: string;
}

export function ChatSection({ language, selectedState, selectedSection }: ChatSectionProps) {
  const text = {
    en: {
      title: "Legal Assistance Chat",
      subtitle: "Get instant help with your legal questions",
      disclaimer: "Important Legal Disclaimer",
      disclaimerText: "This chatbot provides general legal information and should not be considered as legal advice. Always consult with a qualified attorney for advice specific to your situation. The information provided is based on general legal principles and may not reflect the most current laws in your jurisdiction.",
      accuracy: "AI-Powered Responses",
      accuracyText: "Our AI provides information based on legal databases and general legal principles, but human legal expertise is irreplaceable for complex matters.",
      confidentiality: "Privacy Notice",
      confidentialityText: "Do not share sensitive personal information. This chat is for general information purposes only."
    },
    es: {
      title: "Chat de Asistencia Legal",
      subtitle: "Obtén ayuda instantánea con tus preguntas legales",
      disclaimer: "Aviso Legal Importante",
      disclaimerText: "Este chatbot proporciona información legal general y no debe considerarse como asesoramiento legal. Siempre consulta con un abogado calificado para obtener asesoramiento específico para tu situación. La información proporcionada se basa en principios legales generales y puede no reflejar las leyes más actuales en tu jurisdicción.",
      accuracy: "Respuestas Potenciadas por IA",
      accuracyText: "Nuestra IA proporciona información basada en bases de datos legales y principios legales generales, pero la experiencia legal humana es irreemplazable para asuntos complejos.",
      confidentiality: "Aviso de Privacidad",
      confidentialityText: "No compartas información personal sensible. Este chat es solo para fines de información general."
    }
  };

  if (!selectedState || !selectedSection) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <Scale className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'Select State and Legal Area' : 'Selecciona Estado y Área Legal'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Please select your state and the legal area you need help with to start chatting.'
                : 'Por favor selecciona tu estado y el área legal con la que necesitas ayuda para comenzar a chatear.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">{text[language].title}</h2>
          <p className="text-lg text-muted-foreground mb-6">{text[language].subtitle}</p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              {selectedState}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Scale className="w-4 h-4 mr-2" />
              {selectedSection}
            </Badge>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="mb-8">
          <ChatInterface 
            language={language}
            selectedState={selectedState}
            selectedSection={selectedSection}
          />
        </div>

        {/* Legal Disclaimers */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h4 className="font-semibold text-destructive">{text[language].disclaimer}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {text[language].disclaimerText}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-primary">{text[language].accuracy}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {text[language].accuracyText}
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-secondary-foreground" />
                <h4 className="font-semibold">{text[language].confidentiality}</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {text[language].confidentialityText}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}