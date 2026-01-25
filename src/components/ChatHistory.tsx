import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ChatSession {
  id: string;
  state: string;
  legal_section: string;
  language: 'en' | 'es';
  created_at: string;
  message_count?: number;
  last_message?: string;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
  language: 'en' | 'es';
}

export function ChatHistory({ isOpen, onClose, onSelectSession, language }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const text = {
    en: {
      title: "Chat History",
      noHistory: "No chat history yet",
      loadMore: "Load More",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this conversation?"
    },
    es: {
      title: "Historial de Chat",
      noHistory: "No hay historial de chat aún",
      loadMore: "Cargar Más",
      delete: "Eliminar",
      confirmDelete: "¿Estás seguro de que quieres eliminar esta conversación?"
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadChatHistory();
    }
  }, [isOpen, user]);

  const loadChatHistory = async () => {
    setLoading(true);
    try {
      const { data: sessionsData, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          chat_messages(content, created_at)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const processedSessions = sessionsData?.map(session => ({
        ...session,
        language: session.language as 'en' | 'es',
        message_count: session.chat_messages?.length || 0,
        last_message: session.chat_messages?.[session.chat_messages.length - 1]?.content?.substring(0, 100) + '...' || ''
      })) || [];

      setSessions(processedSessions as ChatSession[]);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm(text[language].confirmDelete)) return;

    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        title: "Success",
        description: "Conversation deleted",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {text[language].title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {text[language].noHistory}
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors animate-fade-in"
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        onSelectSession(session.id);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{session.legal_section}</Badge>
                        <Badge variant="secondary">{session.state}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {session.last_message && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {session.last_message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {session.message_count} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSession(session.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}