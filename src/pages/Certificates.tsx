
import React from 'react';
import { CertificateManager } from '../components/certificates/CertificateManager';

export const Certificates = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8">
        <CertificateManager />
      </div>
    </div>
  );
};
