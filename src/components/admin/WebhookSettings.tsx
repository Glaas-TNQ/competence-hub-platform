
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  TestTube, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfig {
  endpoint: string;
  apiKey: string;
  isConfigured: boolean;
}

interface WebhookSettingsProps {
  config: WebhookConfig;
  onConfigUpdate: (config: WebhookConfig) => void;
}

export const WebhookSettings: React.FC<WebhookSettingsProps> = ({ config, onConfigUpdate }) => {
  const { toast } = useToast();
  const [localConfig, setLocalConfig] = useState(config);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const validateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    if (!localConfig.endpoint) {
      toast({
        title: "Endpoint obbligatorio",
        description: "Inserisci l'URL del webhook.",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(localConfig.endpoint)) {
      toast({
        title: "URL non valido",
        description: "Inserisci un URL valido (deve iniziare con http:// o https://).",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      const newConfig = {
        ...localConfig,
        isConfigured: true
      };

      // Save to localStorage
      localStorage.setItem('agentic-webhook-config', JSON.stringify(newConfig));
      
      onConfigUpdate(newConfig);
      setIsSaving(false);
      
      toast({
        title: "Configurazione salvata",
        description: "Le impostazioni del webhook sono state salvate con successo.",
      });
    }, 500);
  };

  const handleTest = async () => {
    if (!validateUrl(localConfig.endpoint)) {
      toast({
        title: "URL non valido",
        description: "Inserisci un URL valido prima di testare.",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const testPayload = {
        test: true,
        message: "Test connection from FairMind Academy Admin Panel",
        timestamp: new Date().toISOString()
      };

      const response = await fetch(localConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localConfig.apiKey && { 'Authorization': `Bearer ${localConfig.apiKey}` })
        },
        body: JSON.stringify(testPayload)
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: `Test riuscito! Status: ${response.status}`
        });
        toast({
          title: "Test riuscito",
          description: "La connessione al webhook funziona correttamente.",
        });
      } else {
        setTestResult({
          success: false,
          message: `Test fallito. Status: ${response.status} - ${response.statusText}`
        });
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult({
        success: false,
        message: `Errore di connessione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurazione Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint n8n *</Label>
            <Input
              id="endpoint"
              type="url"
              value={localConfig.endpoint}
              onChange={(e) => setLocalConfig({ ...localConfig, endpoint: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/course-creator"
            />
            <p className="text-xs text-muted-foreground">
              URL del webhook n8n che gestirà le richieste di creazione corso
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (opzionale)</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={localConfig.apiKey}
                onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                placeholder="Bearer token o API key per autenticazione"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Se il tuo webhook richiede autenticazione, inserisci qui la chiave API
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salva Configurazione
                </>
              )}
            </Button>

            <Button
              onClick={handleTest}
              disabled={isTesting || !localConfig.endpoint}
              variant="outline"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Test...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test
                </>
              )}
            </Button>
          </div>

          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              testResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </span>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Stato Configurazione</span>
              <Badge variant={config.isConfigured ? "default" : "destructive"}>
                {config.isConfigured ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Configurato
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Non configurato
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payload di Esempio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Esempio del payload JSON che verrà inviato al tuo webhook:
          </p>
          <Textarea
            readOnly
            value={JSON.stringify({
              courseData: {
                title: "Introduzione al Machine Learning",
                description: "Corso base sui concetti fondamentali del ML",
                competenceAreaId: "uuid-here",
                level: "beginner",
                courseType: "text",
                objectives: ["Comprendere i concetti base del ML", "Applicare algoritmi semplici"],
                targetAudience: "Sviluppatori junior",
                duration: "4 ore",
                notes: "Include esempi pratici"
              },
              userId: "admin-user-id",
              timestamp: "2024-01-15T10:30:00Z"
            }, null, 2)}
            rows={12}
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>
    </div>
  );
};
