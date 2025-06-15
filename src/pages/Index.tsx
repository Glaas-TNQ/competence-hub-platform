
import React from 'react';
import { Dashboard } from './Dashboard';

const Index = () => {
  console.log('Index component rendering');
  
  try {
    return <Dashboard />;
  } catch (error) {
    console.error('Error in Index component:', error);
    return (
      <div className="container-educational layout-educational space-educational">
        <div className="text-center py-educational-5xl">
          <h2 className="heading-educational-section text-destructive mb-educational-md">
            Errore dell'applicazione
          </h2>
          <p className="text-educational-body text-muted-foreground">
            Si è verificato un errore imprevisto. Ricarica la pagina per riprovare.
          </p>
        </div>
      </div>
    );
  }
};

export default Index;
