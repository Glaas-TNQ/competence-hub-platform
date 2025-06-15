
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Share2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

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
  if (!certificate) return null;

  const cert = certificate.certificates;
  const templateColor = cert.template_data?.color || '#3b82f6';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Visualizza Certificato
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
                CERTIFICATO DI RICONOSCIMENTO
              </h1>
              <div className="w-24 h-1 mx-auto rounded" style={{ backgroundColor: templateColor }}></div>
            </div>

            {/* Content */}
            <div className="text-center space-y-6">
              <div>
                <p className="text-lg text-gray-600 mb-4">
                  Si certifica che
                </p>
                <div 
                  className="text-4xl font-bold mb-4 border-b-2 pb-2 inline-block"
                  style={{ borderColor: templateColor, color: templateColor }}
                >
                  [Nome Utente]
                </div>
                <p className="text-lg text-gray-600">
                  ha completato con successo
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
                  Certificato Ufficiale
                </Badge>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 flex justify-between items-end text-sm text-gray-600">
              <div>
                <p className="font-semibold">Data di rilascio:</p>
                <p>{format(new Date(certificate.issued_at), 'dd MMMM yyyy', { locale: it })}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Codice di verifica:</p>
                <p className="font-mono">{certificate.verification_code}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Scarica PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Condividi
            </Button>
          </div>

          {/* Certificate Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <h3 className="font-semibold">Dettagli del Certificato:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Tipo:</strong> {cert.certificate_type}
              </div>
              <div>
                <strong>ID Certificato:</strong> {cert.id}
              </div>
              {cert.points_required > 0 && (
                <div>
                  <strong>Punti richiesti:</strong> {cert.points_required}
                </div>
              )}
              <div>
                <strong>Stato:</strong> <span className="text-green-600">Valido</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
