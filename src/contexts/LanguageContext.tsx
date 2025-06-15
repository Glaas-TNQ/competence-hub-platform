
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const { profile } = useAuth();

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [itTranslations, enTranslations] = await Promise.all([
          import('../locales/it.json'),
          import('../locales/en.json')
        ]);
        
        setTranslations({
          it: itTranslations.default,
          en: enTranslations.default
        });
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, []);

  // Load language from user preferences
  useEffect(() => {
    if (profile?.preferences?.language) {
      setLanguage(profile.preferences.language as Language);
    }
  }, [profile]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    // TODO: Save to user preferences when settings component is updated
  };

  const t = (key: string, variables?: Record<string, string>): string => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if Italian translation is missing
        value = translations['en'];
        for (const k of keys) {
          if (value && typeof value === 'object') {
            value = value[k];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace variables in translation
    if (variables) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
        return variables[variable] || match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
