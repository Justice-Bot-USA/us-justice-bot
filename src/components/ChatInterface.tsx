import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, AlertTriangle, Scale, LogIn, LogOut, History, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { ChatHistory } from "@/components/ChatHistory";
import { UserPreferences } from "@/components/UserPreferences";
import { TypingIndicator } from "@/components/LoadingComponents";
import { validateAndSanitizeMessage } from "@/lib/validation";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  language: 'en' | 'es';
  selectedState: string;
  selectedSection: string;
  onLanguageChange: (language: 'en' | 'es') => void;
  onStateChange: (state: string) => void;
}

export function ChatInterface({ 
  language, 
  selectedState, 
  selectedSection, 
  onLanguageChange, 
  onStateChange 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();

  const text = {
    en: {
      placeholder: "Ask your legal question...",
      send: "Send",
      disclaimer: "This is AI-generated legal information, not legal advice",
      thinking: "Justice Bot is thinking...",
      welcome: `Welcome to US Justice Bot! I'm here to help with ${selectedSection} questions in ${selectedState}. How can I assist you today?`,
      error: "Sorry, I encountered an error. Please try again."
    },
    es: {
      placeholder: "Haz tu pregunta legal...",
      send: "Enviar",
      disclaimer: "Esta es información legal generada por IA, no asesoramiento legal",
      thinking: "Justice Bot está pensando...",
      welcome: `¡Bienvenido a US Justice Bot! Estoy aquí para ayudar con preguntas de ${selectedSection} en ${selectedState}. ¿Cómo puedo asistirte hoy?`,
      error: "Lo siento, encontré un error. Por favor intenta de nuevo."
    }
  };

  useEffect(() => {
    // Create or load chat session
    const initializeSession = async () => {
      try {
        const { data: session, error } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user?.id || null,
            state: selectedState,
            legal_section: selectedSection,
            language: language
          })
          .select()
          .single();

        if (error) throw error;
        
        setSessionId(session.id);
        
        // Add welcome message
        const welcomeMessage: Message = {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: text[language].welcome,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        
        // Save welcome message to database
        await supabase
          .from('chat_messages')
          .insert({
            session_id: session.id,
            role: 'assistant',
            content: text[language].welcome
          });
          
      } catch (error) {
        console.error('Error initializing session:', error);
        toast({
          title: "Error",
          description: text[language].error,
          variant: "destructive"
        });
      }
    };

    initializeSession();
  }, [language, selectedState, selectedSection, user]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Call Supabase Edge Function for legal assistance
    try {
      const { data, error } = await supabase.functions.invoke('legal-assistance', {
        body: {
          message: userMessage,
          state: selectedState,
          legalSection: selectedSection,
          language: language,
          context: messages.slice(-5) // Last 5 messages for context
        },
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('AI Error:', error);
      // Fallback to simulated response
      const responses = {
        en: [
          `Based on ${selectedState} law regarding ${selectedSection}, here's what you should know: This is general information and should not be considered legal advice. I recommend consulting with a qualified attorney for your specific situation.`,
          `In ${selectedState}, ${selectedSection} matters are generally handled as follows: [Detailed explanation]. Please note this is educational information only and not legal advice.`,
          `For ${selectedSection} issues in ${selectedState}, the typical process involves: [Process explanation]. Always consult with a local attorney for advice specific to your case.`
        ],
        es: [
          `Basado en la ley de ${selectedState} sobre ${selectedSection}, esto es lo que debes saber: Esta es información general y no debe considerarse asesoramiento legal. Recomiendo consultar con un abogado calificado para tu situación específica.`,
          `En ${selectedState}, los asuntos de ${selectedSection} generalmente se manejan de la siguiente manera: [Explicación detallada]. Ten en cuenta que esta es solo información educativa y no asesoramiento legal.`,
          `Para problemas de ${selectedSection} en ${selectedState}, el proceso típico involucra: [Explicación del proceso]. Siempre consulta con un abogado local para obtener asesoramiento específico para tu caso.`
        ]
      };
      
      const responsePool = responses[language];
      return responsePool[Math.floor(Math.random() * responsePool.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    try {
      // Validate and sanitize user input
      const sanitizedContent = validateAndSanitizeMessage(input);
      
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: sanitizedContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        // Save user message to database
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'user',
            content: userMessage.content
          });

        const aiResponse = await generateAIResponse(userMessage.content);
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Save AI response to database
        await supabase
          .from('chat_messages')
          .insert({
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse
          });
          
      } catch (error) {
        toast({
          title: "Error",
          description: text[language].error,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
      
    } catch (validationError) {
      // Handle validation errors
      if (validationError instanceof Error) {
        toast({
          title: "Invalid Input",
          description: validationError.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: text[language].error,
          variant: "destructive"
        });
      }
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  };

  const loadChatSession = async (sessionId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = messages.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));

      setMessages(formattedMessages);
      setSessionId(sessionId);
    } catch (error) {
      console.error('Error loading chat session:', error);
      toast({
        title: "Error",
        description: text[language].error,
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary">US Justice Bot</h3>
            <p className="text-sm text-muted-foreground">
              {selectedSection} • {selectedState}
              {user && <span className="ml-2">• {user.email}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {text[language].disclaimer}
            </Badge>
            
            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatHistory(true)}
                  className="gap-1"
                >
                  <History className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                  className="gap-1"
                >
                  <Settings className="w-3 h-3" />
                </Button>
              </>
            )}
            
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="gap-1"
              >
                <LogOut className="w-3 h-3" />
                {language === 'en' ? 'Sign Out' : 'Cerrar Sesión'}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="gap-1"
              >
                <LogIn className="w-3 h-3" />
                {language === 'en' ? 'Sign In' : 'Iniciar Sesión'}
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 py-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 animate-fade-in ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-full flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && <TypingIndicator language={language} />}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2 pt-4 border-t">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={text[language].placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="hover-scale"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        language={language}
      />
      
      <ChatHistory
        isOpen={showChatHistory}
        onClose={() => setShowChatHistory(false)}
        onSelectSession={loadChatSession}
        language={language}
      />
      
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreferences(false)}
              className="absolute -top-10 right-0 text-white hover:bg-white/20"
            >
              ✕
            </Button>
            <UserPreferences
              language={language}
              selectedState={selectedState}
              onLanguageChange={onLanguageChange}
              onStateChange={onStateChange}
            />
          </div>
        </div>
      )}
    </Card>
  );
}