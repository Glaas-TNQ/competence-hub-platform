
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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Certificati
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Gestisci i tuoi certificati e scopri nuovi traguardi
            </p>
          </div>
          <Button 
            onClick={handleCheckForNewCertificates}
            disabled={checkCertificates.isPending}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
          >
            <Award className="h-4 w-4 mr-2" />
            {checkCertificates.isPending ? 'Verificando...' : 'Verifica Nuovi Certificati'}
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cerca certificati..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-0 bg-background/50 rounded-xl"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="my-certificates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-sm border-0 shadow-educational rounded-2xl p-2">
          <TabsTrigger 
            value="my-certificates" 
            className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Award className="w-4 h-4 mr-2" />
            I Miei Certificati ({userCertificates?.length || 0})
          </TabsTrigger>
          <TabsTrigger 
            value="available"
            className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Clock className="w-4 h-4 mr-2" />
            Disponibili ({availableCertificates?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-certificates">
          {loadingUserCerts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-0 shadow-educational bg-card/50 backdrop-blur-sm animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted/30 rounded w-3/4"></div>
                    <div className="h-3 bg-muted/30 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted/30 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredUserCerts?.length === 0 ? (
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Nessun certificato trovato
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? 'Nessun certificato corrisponde alla tua ricerca.' : 'Non hai ancora ottenuto certificati.'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={handleCheckForNewCertificates}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl"
                  >
                    Verifica Certificati Disponibili
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUserCerts?.map((userCert) => (
                <Card key={userCert.id} className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCertificateTypeIcon(userCert.certificates.certificate_type)}
                        <CardTitle className="text-lg text-foreground">{userCert.certificates.name}</CardTitle>
                      </div>
                      {getCertificateTypeBadge(userCert.certificates.certificate_type)}
                    </div>
                    <CardDescription className="text-muted-foreground">{userCert.certificates.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Rilasciato il:</strong> {format(new Date(userCert.issued_at), 'dd MMMM yyyy', { locale: it })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Codice verifica:</strong> 
                        <code className="bg-muted/30 px-2 py-1 rounded text-xs ml-2">{userCert.verification_code}</code>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewCertificate(userCert)}
                          className="flex items-center gap-1 border-0 bg-background/50 hover:bg-background/80 rounded-xl"
                        >
                          <Eye className="h-3 w-3" />
                          Visualizza
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 border-0 bg-background/50 hover:bg-background/80 rounded-xl"
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
                <Card key={i} className="border-0 shadow-educational bg-card/50 backdrop-blur-sm animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted/30 rounded w-3/4"></div>
                    <div className="h-3 bg-muted/30 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted/30 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailable?.map((cert) => (
                <Card key={cert.id} className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getCertificateTypeIcon(cert.certificate_type)}
                        <CardTitle className="text-lg text-foreground">{cert.name}</CardTitle>
                      </div>
                      {getCertificateTypeBadge(cert.certificate_type)}
                    </div>
                    <CardDescription className="text-muted-foreground">{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cert.points_required > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Punti richiesti:</strong> {cert.points_required}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Requisiti:</strong>
                        <div className="mt-1 text-xs bg-muted/30 p-2 rounded">
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
