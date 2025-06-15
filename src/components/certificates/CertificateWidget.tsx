
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certificati
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certificati
        </CardTitle>
        <CardDescription>
          I tuoi ultimi certificati ottenuti
        </CardDescription>
      </CardHeader>
      <CardContent>
        {certificates?.length === 0 ? (
          <div className="text-center py-6">
            <Award className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">
              Nessun certificato ancora ottenuto
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
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
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{cert.certificates.name}</h4>
                    <p className="text-xs text-gray-600">
                      {format(new Date(cert.issued_at), 'dd MMM yyyy', { locale: it })}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
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
                  className="w-full"
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
                  className="w-full"
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
