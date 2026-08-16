import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Bot, User, Scale, MessageCircle, Sparkles, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { analytics } from "@/hooks/useAnalytics";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" }
];

const LEGAL_AREAS = [
  { value: "criminal", label: "Criminal Defense" },
  { value: "family", label: "Family Law" },
  { value: "housing", label: "Housing & Eviction" },
  { value: "employment", label: "Employment Law" },
  { value: "small-claims", label: "Small Claims" },
  { value: "civil-rights", label: "Civil Rights" },
  { value: "immigration", label: "Immigration" },
  { value: "personal-injury", label: "Personal Injury" },
  { value: "bankruptcy", label: "Bankruptcy" },
  { value: "consumer", label: "Consumer Protection" },
];

export function LegalChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('legal-assistance', {
        body: {
          message: userMessage,
          state: selectedState || "general",
          legalSection: selectedArea || "general",
          language: "en",
          context: messages.slice(-5)
        },
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('AI Error:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (!selectedState || !selectedArea) {
      toast({
        title: "Please select your state and legal area",
        description: "This helps us provide accurate, state-specific information.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsExpanded(true);

    // Track chat message
    analytics.chatMessage(selectedArea, selectedState);

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
        description: "Sorry, I couldn't process your request. Please try again.",
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

  const sampleQuestions = [
    "What are my rights if I'm being evicted?",
    "How do I file for divorce in my state?",
    "What should I do after a car accident?",
    "Can I expunge my criminal record?",
    "How do I file a small claims lawsuit?",
    "What are my rights as an employee?",
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Free AI Legal Assistant</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ask Your Legal Question
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant, state-specific legal information for all 50 US states. 
            Our AI understands federal and state law, court procedures, and your rights.
          </p>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Scale className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Justice Bot USA</CardTitle>
                  <p className="text-sm text-muted-foreground">AI-Powered Legal Guidance</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <AlertTriangle className="w-3 h-3" />
                Educational Info Only
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* State and Area Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {US_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Legal Area</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select legal area..." />
                  </SelectTrigger>
                  <SelectContent>
                    {LEGAL_AREAS.map((area) => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Messages Area */}
            {messages.length > 0 && (
              <ScrollArea 
                className={`border rounded-lg p-4 bg-muted/20 transition-all duration-300 ${isExpanded ? 'h-[400px]' : 'h-[200px]'}`} 
                ref={scrollAreaRef}
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background border'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {message.role === 'user' && (
                        <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <Bot className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                      <div className="bg-background border rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}

            {/* Sample Questions */}
            {messages.length === 0 && selectedState && selectedArea && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(question)}
                      className="text-xs"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  !selectedState || !selectedArea 
                    ? "First select your state and legal area above..." 
                    : "Type your legal question here..."
                }
                disabled={isLoading || !selectedState || !selectedArea}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading || !selectedState || !selectedArea}
                size="icon"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center">
              This AI provides educational legal information, not legal advice. 
              For your specific situation, consult a licensed attorney in your state.
            </p>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">50</p>
            <p className="text-sm text-muted-foreground">States Covered</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">10+</p>
            <p className="text-sm text-muted-foreground">Legal Areas</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">24/7</p>
            <p className="text-sm text-muted-foreground">Always Available</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LegalChatbot;
