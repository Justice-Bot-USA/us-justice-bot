import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Globe, MapPin, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { states } from "@/lib/states";

interface UserPreferencesProps {
  language: 'en' | 'es';
  selectedState: string;
  onLanguageChange: (language: 'en' | 'es') => void;
  onStateChange: (state: string) => void;
}

interface Preferences {
  preferred_state: string | null;
  preferred_language: 'en' | 'es';
}

export function UserPreferences({ 
  language, 
  selectedState, 
  onLanguageChange, 
  onStateChange 
}: UserPreferencesProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    preferred_state: selectedState,
    preferred_language: language
  });
  const [loading, setLoading] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const { user } = useAuth();

  const text = {
    en: {
      title: "User Preferences",
      language: "Language",
      state: "Preferred State",
      autoSave: "Auto-save preferences",
      save: "Save Preferences",
      saved: "Preferences saved successfully",
      loaded: "Preferences loaded",
      guest: "Sign in to save preferences"
    },
    es: {
      title: "Preferencias de Usuario",
      language: "Idioma",
      state: "Estado Preferido",
      autoSave: "Guardar preferencias automáticamente",
      save: "Guardar Preferencias",
      saved: "Preferencias guardadas exitosamente",
      loaded: "Preferencias cargadas",
      guest: "Inicia sesión para guardar preferencias"
    }
  };

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  useEffect(() => {
    if (autoSave && user) {
      const timeoutId = setTimeout(() => {
        savePreferences();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [preferences, autoSave, user]);

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const lang = data.preferred_language as 'en' | 'es';
        setPreferences({
          preferred_state: data.preferred_state,
          preferred_language: lang
        });
        
        if (lang !== language) {
          onLanguageChange(lang);
        }
        if (data.preferred_state && data.preferred_state !== selectedState) {
          onStateChange(data.preferred_state);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_state: preferences.preferred_state,
          preferred_language: preferences.preferred_language
        });

      if (error) throw error;

      if (!autoSave) {
        toast({
          title: "Success",
          description: text[language].saved,
        });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setPreferences(prev => ({ ...prev, preferred_language: newLanguage }));
    onLanguageChange(newLanguage);
  };

  const handleStateChange = (newState: string) => {
    setPreferences(prev => ({ ...prev, preferred_state: newState }));
    onStateChange(newState);
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {text[language].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!user && (
          <div className="text-center text-muted-foreground text-sm p-4 bg-muted/50 rounded-lg">
            {text[language].guest}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {text[language].language}
            </Label>
            <Select 
              value={preferences.preferred_language} 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {text[language].state}
            </Label>
            <Select 
              value={preferences.preferred_state || ""} 
              onValueChange={handleStateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {user && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="text-sm">
                {text[language].autoSave}
              </Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            {!autoSave && (
              <Button 
                onClick={savePreferences}
                disabled={loading}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {text[language].save}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}