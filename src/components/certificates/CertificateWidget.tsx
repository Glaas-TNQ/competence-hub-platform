
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Eye } from 'lucide-react';
import { useUserCertificates } from '@/hooks/useCertificates';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export const CertificateWidget = () => {
  const { data: certificates, isLoading } = useUserCertificates();
  const navigate = useNavigate();

  const recentCertificates = certificates?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certificati
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-muted/30 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Award className="h-5 w-5 text-primary" />
          Certificati
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          I tuoi ultimi certificati ottenuti
        </CardDescription>
      </CardHeader>
      <CardContent>
        {certificates?.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Nessun certificato ancora ottenuto
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-0 bg-background/50 hover:bg-background/80 rounded-xl"
              onClick={() => navigate('/certificates')}
            >
              Scopri i certificati disponibili
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCertificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors cursor-pointer"
                onClick={() => navigate('/certificates')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{cert.certificates.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(cert.issued_at), 'dd MMM yyyy', { locale: it })}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  <Eye className="h-3 w-3 mr-1" />
                  Visualizza
                </Badge>
              </div>
            ))}
            
            {certificates.length > 3 && (
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-0 bg-background/50 hover:bg-background/80 rounded-xl"
                  onClick={() => navigate('/certificates')}
                >
                  Vedi tutti i certificati ({certificates.length})
                </Button>
              </div>
            )}

            {certificates.length > 0 && certificates.length <= 3 && (
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-0 bg-background/50 hover:bg-background/80 rounded-xl"
                  onClick={() => navigate('/certificates')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Gestisci certificati
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
