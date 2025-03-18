import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Profile {
  id: string | undefined;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
  coverImage: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    website: string;
  };
  social: {
    platform: string;
    url: string;
    icon: React.ReactNode;
    visible: boolean;
  }[];
  plan: string;
  profileViews: number;
  profileUrl: string; // Agregamos profileUrl como string
}

interface ProfileContextType {
  profile: Profile;
  updateProfile: (newProfile: Partial<Profile>) => void;
  updateSocial: (index: number, updates: Partial<{ url: string; visible: boolean }>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>({
    id: undefined,
    name: 'Carlos Rodríguez',
    title: 'Desarrollador Full Stack',
    company: 'TechInnovate',
    bio: 'Desarrollador apasionado por crear soluciones tecnológicas que mejoren la vida de las personas. Especializado en React, Node.js y arquitecturas cloud.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
    coverImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    contact: {
      email: 'carlos@example.com',
      phone: '+34 612 345 678',
      location: 'Madrid, España',
      website: 'carlosrodriguez.dev',
    },
    social: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/carlosrodriguez', icon: <></>, visible: true },
      { platform: 'github', url: 'https://github.com/carlosrodriguez', icon: <></>, visible: true },
      { platform: 'twitter', url: 'https://twitter.com/carlosrodriguez', icon: <></>, visible: true },
      { platform: 'instagram', url: 'https://instagram.com/carlosrodriguez', icon: <></>, visible: false },
      { platform: 'facebook', url: 'https://facebook.com/carlosrodriguez', icon: <></>, visible: false },
      { platform: 'youtube', url: 'https://youtube.com/carlosrodriguez', icon: <></>, visible: false },
    ],
    plan: 'Plan Básico',
    profileViews: 128,
    profileUrl: 'nefi.com/carlos', // Inicializamos profileUrl con un valor
  });

  const updateProfile = (newProfile: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const updateSocial = (index: number, updates: Partial<{ url: string; visible: boolean }>) => {
    const updatedSocial = [...profile.social];
    updatedSocial[index] = { ...updatedSocial[index], ...updates };
    const visibleCount = updatedSocial.filter(s => s.visible).length;
    if (profile.plan === 'Plan Básico' && visibleCount > 3 && updates.visible) {
      alert('Con el Plan Básico solo puedes tener 3 redes sociales visibles. Actualiza tu plan para agregar más.');
      return;
    }
    setProfile((prev) => ({ ...prev, social: updatedSocial }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, updateSocial }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};