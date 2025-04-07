
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'es';

// Define translations structure
interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Translation content
const translations: Translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    logSession: 'Log Session',
    logTraining: 'Log Training',
    history: 'History',
    profile: 'Profile Settings',
    footer: 'All rights reserved',
    
    // Profile page
    profileSettings: 'Profile Settings',
    manageAccount: 'Manage your account information',
    firstName: 'First Name',
    lastName: 'Last Name',
    yearOfBirth: 'Year of Birth',
    country: 'Country',
    selectCountry: 'Select your country',
    uploadAvatar: 'Click to upload a new avatar',
    saveProfile: 'Save Profile',
    saving: 'Saving...',
    
    // Auth
    logOut: 'Log out',
    
    // Language
    language: 'Language',
    changeLanguage: 'Change Language',
    english: 'English',
    spanish: 'Spanish',
    
    // Swim Sessions
    swimSessions: 'Swim Sessions',
    trainingSessions: 'Training Sessions',
  },
  es: {
    // Navigation
    dashboard: 'Panel',
    logSession: 'Registrar Sesión',
    logTraining: 'Registrar Entrenamiento',
    history: 'Historial',
    profile: 'Configuración de Perfil',
    footer: 'Todos los derechos reservados',
    
    // Profile page
    profileSettings: 'Configuración de Perfil',
    manageAccount: 'Administra tu información de cuenta',
    firstName: 'Nombre',
    lastName: 'Apellido',
    yearOfBirth: 'Año de nacimiento',
    country: 'País',
    selectCountry: 'Selecciona tu país',
    uploadAvatar: 'Haz clic para subir un nuevo avatar',
    saveProfile: 'Guardar Perfil',
    saving: 'Guardando...',
    
    // Auth
    logOut: 'Cerrar sesión',
    
    // Language
    language: 'Idioma',
    changeLanguage: 'Cambiar Idioma',
    english: 'Inglés',
    spanish: 'Español',
    
    // Swim Sessions
    swimSessions: 'Sesiones de Natación',
    trainingSessions: 'Sesiones de Entrenamiento',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get saved language from localStorage, default to English
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved && ['en', 'es'].includes(saved) ? saved : 'en';
  });

  // Save language preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
