import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
  language: 'en' | 'es';
}

const WarningBanner = ({ language }: WarningBannerProps) => {
  const text = {
    en: {
      warning: "Legal Disclaimer",
      message: "This bot provides general legal information only and does not constitute legal advice. Always consult with a qualified attorney for your specific situation. In emergencies, call 911."
    },
    es: {
      warning: "Exención de Responsabilidad Legal",
      message: "Este bot proporciona solo información legal general y no constituye asesoramiento legal. Siempre consulte con un abogado calificado para su situación específica. En emergencias, llame al 911."
    }
  };

  return (
    <Alert className="mb-8 border-destructive/50 text-destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>{text[language].warning}:</strong> {text[language].message}
      </AlertDescription>
    </Alert>
  );
};

export default WarningBanner;