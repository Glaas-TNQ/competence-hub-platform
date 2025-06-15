
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Share2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { useTranslation } from '@/contexts/LanguageContext';

interface CertificateViewerProps {
  certificate: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  certificate,
  open,
  onOpenChange,
}) => {
  const { t, language } = useTranslation();
  const dateLocale = language === 'it' ? it : enUS;

  if (!certificate) return null;

  const cert = certificate.certificates;
  const templateColor = cert.template_data?.color || '#3b82f6';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t('certificates.viewCertificate')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <div 
            className="relative bg-white border-2 rounded-lg p-8 shadow-lg"
            style={{ borderColor: templateColor }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: `${templateColor}20` }}
              >
                <Award className="h-8 w-8" style={{ color: templateColor }} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('certificates.certificateOfRecognition')}
              </h1>
              <div className="w-24 h-1 mx-auto rounded" style={{ backgroundColor: templateColor }}></div>
            </div>

            {/* Content */}
            <div className="text-center space-y-6">
              <div>
                <p className="text-lg text-gray-600 mb-4">
                  {t('certificates.certifiedThat')}
                </p>
                <div 
                  className="text-4xl font-bold mb-4 border-b-2 pb-2 inline-block"
                  style={{ borderColor: templateColor, color: templateColor }}
                >
                  [Nome Utente]
                </div>
                <p className="text-lg text-gray-600">
                  {t('certificates.hasSuccessfullyCompleted')}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {cert.name}
                </h2>
                <p className="text-gray-600 text-lg">
                  {cert.description}
                </p>
              </div>

              <div className="flex justify-center">
                <Badge 
                  className="text-white px-4 py-2 text-base"
                  style={{ backgroundColor: templateColor }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('certificates.officialCertificate')}
                </Badge>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 flex justify-between items-end text-sm text-gray-600">
              <div>
                <p className="font-semibold">{t('certificates.issueDate')}:</p>
                <p>{format(new Date(certificate.issued_at), 'dd MMMM yyyy', { locale: dateLocale })}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{t('certificates.verificationCode')}:</p>
                <p className="font-mono">{certificate.verification_code}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('certificates.downloadPdf')}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              {t('certificates.share')}
            </Button>
          </div>

          {/* Certificate Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <h3 className="font-semibold">{t('certificates.certificateDetails')}:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>{t('certificates.type')}:</strong> {t(`certificates.types.${cert.certificate_type}`) || cert.certificate_type}
              </div>
              <div>
                <strong>{t('certificates.certificateId')}:</strong> {cert.id}
              </div>
              {cert.points_required > 0 && (
                <div>
                  <strong>{t('certificates.pointsRequired')}:</strong> {cert.points_required}
                </div>
              )}
              <div>
                <strong>{t('certificates.status')}:</strong> <span className="text-green-600">{t('certificates.valid')}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
