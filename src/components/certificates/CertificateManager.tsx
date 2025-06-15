
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Download, Eye, Search, CheckCircle, Clock, Star } from 'lucide-react';
import { useUserCertificates, useAvailableCertificates, useCheckCertificates } from '@/hooks/useCertificates';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CertificateViewer } from './CertificateViewer';
import { Input } from '@/components/ui/input';

export const CertificateManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  const { data: userCertificates, isLoading: loadingUserCerts } = useUserCertificates();
  const { data: availableCertificates, isLoading: loadingAvailable } = useAvailableCertificates();
  const checkCertificates = useCheckCertificates();

  const handleCheckForNewCertificates = () => {
    checkCertificates.mutate();
  };

  const handleViewCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
    setViewerOpen(true);
  };

  const getCertificateTypeIcon = (type: string) => {
    switch (type) {
      case 'excellence':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'competence_mastery':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getCertificateTypeBadge = (type: string) => {
    const variants = {
      'course_completion': 'default',
      'competence_mastery': 'secondary',
      'excellence': 'destructive',
      'special_event': 'outline'
    } as const;

    const labels = {
      'course_completion': 'Completamento Corso',
      'competence_mastery': 'Maestria Competenza',
      'excellence': 'Eccellenza',
      'special_event': 'Evento Speciale'
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'default'}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const filteredAvailable = availableCertificates?.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserCerts = userCertificates?.filter(cert =>
    cert.certificates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificates.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificati</h1>
          <p className="text-gray-600 mt-2">Gestisci i tuoi certificati e scopri nuovi traguardi</p>
        </div>
        <Button 
          onClick={handleCheckForNewCertificates}
          disabled={checkCertificates.isPending}
          className="flex items-center gap-2"
        >
          <Award className="h-4 w-4" />
          {checkCertificates.isPending ? 'Verificando...' : 'Verifica Nuovi Certificati'}
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cerca certificati..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="my-certificates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-certificates" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            I Miei Certificati ({userCertificates?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Disponibili ({availableCertificates?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-certificates">
          {loadingUserCerts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredUserCerts?.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nessun certificato trovato
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Nessun certificato corrisponde alla tua ricerca.' : 'Non hai ancora ottenuto certificati.'}
                </p>
                {!searchTerm && (
                  <Button onClick={handleCheckForNewCertificates}>
                    Verifica Certificati Disponibili
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUserCerts?.map((userCert) => (
                <Card key={userCert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCertificateTypeIcon(userCert.certificates.certificate_type)}
                        <CardTitle className="text-lg">{userCert.certificates.name}</CardTitle>
                      </div>
                      {getCertificateTypeBadge(userCert.certificates.certificate_type)}
                    </div>
                    <CardDescription>{userCert.certificates.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Rilasciato il:</strong> {format(new Date(userCert.issued_at), 'dd MMMM yyyy', { locale: it })}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Codice verifica:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{userCert.verification_code}</code>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewCertificate(userCert)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Visualizza
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Scarica PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available">
          {loadingAvailable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailable?.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCertificateTypeIcon(cert.certificate_type)}
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                      </div>
                      {getCertificateTypeBadge(cert.certificate_type)}
                    </div>
                    <CardDescription>{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cert.points_required > 0 && (
                        <div className="text-sm text-gray-600">
                          <strong>Punti richiesti:</strong> {cert.points_required}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        <strong>Requisiti:</strong>
                        <div className="mt-1 text-xs bg-gray-50 p-2 rounded">
                          {cert.certificate_type === 'course_completion' && 'Completa i corsi richiesti'}
                          {cert.certificate_type === 'competence_mastery' && 'Completa tutti i corsi di una competenza'}
                          {cert.certificate_type === 'excellence' && `Raggiungi ${cert.points_required} punti`}
                          {cert.certificate_type === 'special_event' && 'Partecipa agli eventi speciali'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CertificateViewer
        certificate={selectedCertificate}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  );
};
