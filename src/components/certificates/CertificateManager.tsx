import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Award, 
  Download, 
  Eye, 
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useUserCertificates } from '@/hooks/useCertificates';
import { CertificateViewer } from './CertificateViewer';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { useTranslation } from '@/contexts/LanguageContext';

export const CertificateManager = () => {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'earned' | 'available'>('all');
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  const { data: userCertificates = [], isLoading: userLoading } = useUserCertificates();
  const dateLocale = language === 'it' ? it : enUS;

  const filteredCertificates = userCertificates.filter(cert => {
    const matchesSearch = cert.certificates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificates.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (selectedFilter) {
      case 'earned':
        return matchesSearch && cert.issued_at;
      case 'available':
        return matchesSearch && !cert.issued_at;
      default:
        return matchesSearch;
    }
  });

  const handleViewCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
    setViewerOpen(true);
  };

  if (userLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('certificates.searchCertificates')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            size="sm"
          >
            {t('certificates.all')}
          </Button>
          <Button
            variant={selectedFilter === 'earned' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('earned')}
            size="sm"
          >
            {t('certificates.earned')}
          </Button>
          <Button
            variant={selectedFilter === 'available' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('available')}
            size="sm"
          >
            {t('certificates.available')}
          </Button>
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCertificates.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm ? t('certificates.noCertificatesFound') : t('certificates.noCertificatesFound')}
          </h3>
          <p className="text-muted-foreground">
            {searchTerm ? t('certificates.noCertificatesSearchDesc') : t('certificates.noCertificatesDesc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => {
            const cert = certificate.certificates;
            const isEarned = !!certificate.issued_at;
            
            return (
              <Card key={certificate.id} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-lg line-clamp-2">{cert.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {cert.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      {isEarned ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Certificate Type */}
                  <Badge variant="secondary" className="text-xs">
                    {t(`certificates.types.${cert.certificate_type}`) || cert.certificate_type}
                  </Badge>

                  {/* Points Required */}
                  {cert.points_required > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>{cert.points_required.toString()} {t('certificates.pointsRequired')}</span>
                    </div>
                  )}

                  {/* Issue Date or Requirements */}
                  {isEarned ? (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {t('certificates.issuedOn')} {format(new Date(certificate.issued_at), 'dd MMM yyyy', { locale: dateLocale })}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">{t('certificates.requirements')}:</p>
                      <p>{t(`certificates.requirements.${cert.certificate_type}`, { points: cert.points_required.toString() })}</p>
                    </div>
                  )}

                  {/* Verification Code for earned certificates */}
                  {isEarned && certificate.verification_code && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">{t('certificates.verificationCode')}:</span> {certificate.verification_code}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {isEarned ? (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleViewCertificate(certificate)}
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t('certificates.view')}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" disabled className="flex-1">
                        {t('certificates.available')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      <CertificateViewer 
        certificate={selectedCertificate}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  );
};
