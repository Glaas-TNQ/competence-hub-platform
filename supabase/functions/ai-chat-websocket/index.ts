
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  socket.onopen = () => {
    console.log("WebSocket connesso");
    socket.send(JSON.stringify({
      type: 'connection',
      status: 'connected',
      message: 'Connessione AI Chat stabilita'
    }));
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Messaggio ricevuto:", data);
      
      if (data.type === 'message') {
        // Qui puoi integrare con OpenAI, Claude, o il tuo sistema AI preferito
        // Per ora simulo una risposta
        const aiResponse = await generateAIResponse(data.content);
        
        socket.send(JSON.stringify({
          type: 'message',
          content: aiResponse,
          timestamp: new Date().toISOString()
        }));
        
        // Invia il messaggio anche a n8n se necessario
        await sendToN8n({
          userMessage: data.content,
          aiResponse: aiResponse,
          userId: data.userId,
          timestamp: data.timestamp
        });
      }
    } catch (error) {
      console.error("Errore nel processare il messaggio:", error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Si è verificato un errore nel processare il messaggio'
      }));
    }
  };

  socket.onerror = (error) => {
    console.error("Errore WebSocket:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnesso");
  };

  return response;
});

async function generateAIResponse(userMessage: string): Promise<string> {
  // Qui puoi integrare con il tuo AI preferito
  // Per ora ritorno una risposta simulata
  
  const responses = [
    "Capisco la tua domanda. Come posso aiutarti ulteriormente?",
    "Interessante! Fammi sapere se hai bisogno di chiarimenti.",
    "Sono qui per assisterti. Cosa altro vorresti sapere?",
    "Ottima domanda! Ecco cosa penso al riguardo...",
    "Posso aiutarti con questo. Hai altre domande specifiche?"
  ];
  
  // Simula un delay per una risposta più realistica
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  return responses[Math.floor(Math.random() * responses.length)];
}

async function sendToN8n(data: any) {
  try {
    // Sostituisci con il tuo webhook n8n URL
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL');
    
    if (n8nWebhookUrl) {
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
  } catch (error) {
    console.error('Errore invio a n8n:', error);
  }
}
