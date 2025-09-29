import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, AlertTriangle, Scale } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
}

export function ChatInterface({ language, selectedState, selectedSection }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: text[language].welcome,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [language, selectedState, selectedSection]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response - in a real app, this would call an AI API
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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const responsePool = responses[language];
    return responsePool[Math.floor(Math.random() * responsePool.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
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
            </p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            {text[language].disclaimer}
          </Badge>
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
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
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
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <p className="text-sm text-muted-foreground italic">
                    {text[language].thinking}
                  </p>
                </div>
              </div>
            )}
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
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}