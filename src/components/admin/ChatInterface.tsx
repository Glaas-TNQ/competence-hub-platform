
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Bot, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'ai';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onNewMessage: (messages: ChatMessage[]) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  const getMessageIcon = (type: string, status?: string) => {
    if (type === 'ai') return <Bot className="h-4 w-4 text-blue-600" />;
    if (type === 'system') return <MessageSquare className="h-4 w-4 text-gray-600" />;
    
    // User message with status
    if (status === 'sending') return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
    if (status === 'error') return <AlertCircle className="h-4 w-4 text-red-600" />;
    if (status === 'sent') return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <User className="h-4 w-4 text-blue-600" />;
  };

  const getMessageBadge = (type: string) => {
    switch (type) {
      case 'ai':
        return <Badge variant="default">AI Assistant</Badge>;
      case 'system':
        return <Badge variant="secondary">System</Badge>;
      case 'user':
        return <Badge variant="outline">Admin</Badge>;
      default:
        return null;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'sending':
        return 'Invio in corso...';
      case 'error':
        return 'Errore nell\'invio';
      case 'sent':
        return 'Inviato';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat con AI Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Nessun messaggio. Invia una richiesta di creazione corso per iniziare.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : message.type === 'ai'
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'bg-gray-50 border-l-4 border-gray-500'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getMessageIcon(message.type, message.status)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    {getMessageBadge(message.type)}
                    <span className="text-xs text-muted-foreground">
                      {format(message.timestamp, 'HH:mm:ss')}
                    </span>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.status && (
                    <p className={`text-xs ${
                      message.status === 'error' 
                        ? 'text-red-600' 
                        : message.status === 'sent' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`}>
                      {getStatusText(message.status)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {messages.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Totale messaggi:</strong> {messages.length} | 
              <strong> Ultimo aggiornamento:</strong> {messages.length > 0 ? format(messages[messages.length - 1].timestamp, 'dd/MM/yyyy HH:mm') : 'Mai'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
