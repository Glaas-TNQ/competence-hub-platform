
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !ws) {
      // Connessione WebSocket alla funzione edge Supabase
      const projectRef = window.location.hostname.includes('lovableproject.com') 
        ? window.location.hostname.split('.')[0]
        : 'your-project-ref';
        
      const websocketUrl = `wss://${projectRef}.functions.supabase.co/ai-chat-websocket`;
      const websocket = new WebSocket(websocketUrl);
      
      websocket.onopen = () => {
        console.log('WebSocket connesso');
        setWs(websocket);
        
        // Messaggio di benvenuto
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Ciao! Sono il tuo assistente AI. Come posso aiutarti oggi?',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            const assistantMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: data.content,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
          } else if (data.type === 'error') {
            console.error('Errore AI:', data.message);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Errore parsing messaggio WebSocket:', error);
          setIsLoading(false);
        }
      };

      websocket.onerror = (error) => {
        console.error('Errore WebSocket:', error);
        setIsLoading(false);
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnesso');
        setWs(null);
      };

      return () => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.close();
        }
      };
    }
  }, [isOpen, ws]);

  const sendMessage = () => {
    if (!inputValue.trim() || !ws || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Invia messaggio tramite WebSocket
    ws.send(JSON.stringify({
      type: 'message',
      content: inputValue,
      userId: user?.id,
      timestamp: new Date().toISOString()
    }));

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
    setMessages([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md h-[600px] p-0 gap-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary to-secondary text-white">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Assistente AI
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[500px]">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-secondary text-white'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-white ml-auto'
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi un messaggio..."
                className="flex-1"
                disabled={isLoading || !ws}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputValue.trim() || isLoading || !ws}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
