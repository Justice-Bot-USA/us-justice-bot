import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { MessageSquare, Send, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface SupportMessage {
  id: string;
  message: string;
  is_staff_response: boolean;
  created_at: string;
  user_id: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const SupportTicket: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New ticket form
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('general');
  const [newTicketPriority, setNewTicketPriority] = useState('medium');

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
      // Set up realtime subscription for new messages
      const channel = supabase
        .channel(`ticket-${selectedTicket.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `ticket_id=eq.${selectedTicket.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as SupportMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const createTicket = async () => {
    if (!newTicketTitle.trim() || !newTicketDescription.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id,
          title: newTicketTitle,
          description: newTicketDescription,
          category: newTicketCategory,
          priority: newTicketPriority
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Support ticket created successfully');
      setTickets(prev => [data, ...prev]);
      setShowNewTicket(false);
      setNewTicketTitle('');
      setNewTicketDescription('');
      setNewTicketCategory('general');
      setNewTicketPriority('medium');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create support ticket');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user?.id,
          message: newMessage,
          is_staff_response: false
        });

      if (error) throw error;

      setNewMessage('');
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: 'default',
      in_progress: 'secondary',
      waiting_response: 'outline',
      resolved: 'secondary',
      closed: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-500',
      medium: 'bg-blue-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500'
    };
    return (
      <Badge className={colors[priority] || 'bg-gray-500'}>
        {priority}
      </Badge>
    );
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to access support</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Ticket List */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Support Tickets
            <Button size="sm" onClick={() => setShowNewTicket(!showNewTicket)}>
              New Ticket
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showNewTicket && (
            <div className="space-y-4 mb-4 p-4 border rounded-lg">
              <Input
                placeholder="Ticket Title"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
              />
              <Textarea
                placeholder="Describe your issue..."
                value={newTicketDescription}
                onChange={(e) => setNewTicketDescription(e.target.value)}
                rows={4}
              />
              <Select value={newTicketCategory} onValueChange={setNewTicketCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="legal">Legal Question</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newTicketPriority} onValueChange={setNewTicketPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button onClick={createTicket} disabled={loading} className="flex-1">
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowNewTicket(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors ${
                    selectedTicket?.id === ticket.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(ticket.status)}
                    <span className="font-medium text-sm truncate flex-1">
                      {ticket.title}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {tickets.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No support tickets yet
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ticket Messages */}
      <Card className="md:col-span-2">
        {selectedTicket ? (
          <>
            <CardHeader>
              <CardTitle>{selectedTicket.title}</CardTitle>
              <CardDescription className="flex gap-2 items-center">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                <Badge variant="outline">{selectedTicket.category}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {/* Initial ticket description */}
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedTicket.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Messages */}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.is_staff_response
                          ? 'bg-primary/10 ml-8'
                          : 'bg-secondary/50 mr-8'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {message.is_staff_response ? 'Support Team' : 'You'} •{' '}
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {selectedTicket.status !== 'closed' && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-[500px]">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a ticket to view messages</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};