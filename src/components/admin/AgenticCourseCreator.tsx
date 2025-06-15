
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Settings, 
  Send, 
  MessageSquare, 
  TestTube, 
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCompetenceAreas } from '@/hooks/useSupabase';
import { ChatInterface } from './ChatInterface';
import { WebhookSettings } from './WebhookSettings';

interface CourseFormData {
  title: string;
  description: string;
  competenceAreaId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  courseType: 'video' | 'text' | 'interactive';
  objectives: string[];
  targetAudience: string;
  duration: string;
  notes: string;
}

export const AgenticCourseCreator = () => {
  const { toast } = useToast();
  const { data: competenceAreas } = useCompetenceAreas();
  const [activeTab, setActiveTab] = useState('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookConfig, setWebhookConfig] = useState({
    endpoint: '',
    apiKey: '',
    isConfigured: false
  });

  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    competenceAreaId: '',
    level: 'beginner',
    courseType: 'text',
    objectives: [''],
    targetAudience: '',
    duration: '',
    notes: ''
  });

  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'user' | 'system' | 'ai';
    content: string;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'error';
  }>>([]);

  // Load webhook config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('agentic-webhook-config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setWebhookConfig(config);
    }
  }, []);

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  const addObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ''] });
  };

  const removeObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index);
      setFormData({ ...formData, objectives: newObjectives });
    }
  };

  const handleSubmitCourseRequest = async () => {
    if (!webhookConfig.isConfigured) {
      toast({
        title: "Webhook non configurato",
        description: "Configura il webhook nelle impostazioni prima di procedere.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.competenceAreaId) {
      toast({
        title: "Campi obbligatori mancanti",
        description: "Completa tutti i campi obbligatori del form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: `Richiesta creazione corso: "${formData.title}"`,
      timestamp: new Date(),
      status: 'sending' as const
    };

    setChatMessages(prev => [...prev, userMessage]);

    try {
      const requestPayload = {
        courseData: {
          ...formData,
          objectives: formData.objectives.filter(obj => obj.trim() !== '')
        },
        userId: 'admin-user', // You might want to get this from auth context
        timestamp: new Date().toISOString()
      };

      const response = await fetch(webhookConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookConfig.apiKey && { 'Authorization': `Bearer ${webhookConfig.apiKey}` })
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update user message status
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );

      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: result.message || 'Richiesta ricevuta, elaborazione in corso...',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);

      toast({
        title: "Richiesta inviata",
        description: "La richiesta di creazione corso è stata inviata al workflow AI.",
      });

    } catch (error) {
      console.error('Error sending course request:', error);
      
      // Update user message status to error
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error' as const }
            : msg
        )
      );

      toast({
        title: "Errore nell'invio",
        description: "Si è verificato un errore durante l'invio della richiesta.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Agentic Course Creator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Crea corsi strutturati utilizzando l'intelligenza artificiale
          </p>
        </div>
        
        <Badge variant={webhookConfig.isConfigured ? "default" : "destructive"} className="px-4 py-2">
          {webhookConfig.isConfigured ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Configurato
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-2" />
              Non configurato
            </>
          )}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Crea Corso
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Chat AI
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Impostazioni
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dettagli del Corso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo del Corso *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Es. Introduzione al Machine Learning"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrivi cosa impareranno gli studenti..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Area di Competenza *</Label>
                    <Select value={formData.competenceAreaId} onValueChange={(value) => setFormData({ ...formData, competenceAreaId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona area" />
                      </SelectTrigger>
                      <SelectContent>
                        {competenceAreas?.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Livello</Label>
                    <Select value={formData.level} onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setFormData({ ...formData, level: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante</SelectItem>
                        <SelectItem value="intermediate">Intermedio</SelectItem>
                        <SelectItem value="advanced">Avanzato</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo di Corso</Label>
                    <Select value={formData.courseType} onValueChange={(value: 'video' | 'text' | 'interactive') => setFormData({ ...formData, courseType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Testuale</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="interactive">Interattivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durata Stimata</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Es. 4 ore"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Pubblico di Riferimento</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="Es. Sviluppatori junior, Data scientist..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Obiettivi di Apprendimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder={`Obiettivo ${index + 1}`}
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeObjective(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addObjective}
                  className="w-full"
                >
                  Aggiungi Obiettivo
                </Button>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="notes">Note Aggiuntive</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Requisiti specifici, stile di insegnamento, ecc..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmitCourseRequest}
                  disabled={isSubmitting || !webhookConfig.isConfigured}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Invia Richiesta AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <ChatInterface messages={chatMessages} onNewMessage={setChatMessages} />
        </TabsContent>

        <TabsContent value="settings">
          <WebhookSettings 
            config={webhookConfig} 
            onConfigUpdate={setWebhookConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
