import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../store/auth/userAuthStore'; // Ajusta la ruta
import { UserData, EmpresaData } from '../types'; // Ajusta la ruta

interface Profile extends UserData {
  avatar?: string; // Opcional, usaremos la imagen estática por ahora
  coverImage?: string; // Opcional, usaremos la imagen estática por ahora
  profileViews?: number; // Opcional, para estadísticas
  profileUrl?: string; // Opcional, para la URL pública
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (newProfile: Partial<Profile>) => void;
  updateSocial: (index: number, updates: Partial<{ url: string; visible: boolean }>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile: authProfile, updateProfile: updateAuthProfile } = useAuthStore();

  // Combinamos los datos del usuario autenticado con valores por defecto para campos adicionales
  const [profile, setProfile] = React.useState<Profile | null>(() => {
    if (!authProfile) return null;
    // return {
    //   ...authProfile,
    //   avatar: authProfile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
    //   coverImage: authProfile.coverImage || 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    //   profileViews: authProfile.profileViews || 0,
    //   profileUrl: authProfile.profileUrl || `nefi.com/${authProfile.username}`,
    // };
    return {
      ...authProfile,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
      coverImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      profileViews:  0,
      profileUrl:  `nefi.com/${authProfile.username}`,
    };
  });

  // Sincronizamos el perfil cuando cambia en useAuthStore
  React.useEffect(() => {
    if (authProfile) {
      // setProfile({
      //   ...authProfile,
      //   avatar: authProfile.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
      //   coverImage: authProfile.coverImage || 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      //   profileViews: authProfile.profileViews || 0,
      //   profileUrl: authProfile.profileUrl || `nefi.com/${authProfile.username}`,
      // });
      setProfile({
        ...authProfile,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80',
        coverImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        profileViews: 0,
        profileUrl:  `nefi.com/${authProfile.username}`,
      });
    } else {
      setProfile(null);
    }
  }, [authProfile]);

  const updateProfile = (newProfile: Partial<Profile>) => {
    if (!profile) return;
    const updatedProfile = { ...profile, ...newProfile };
    setProfile(updatedProfile);
    // Actualizamos en useAuthStore y Firestore
    updateAuthProfile(updatedProfile.uid, newProfile, 'user'); // Asumimos tipo "user" por ahora
  };

  const updateSocial = (index: number, updates: Partial<{ url: string; visible: boolean }>) => {
    if (!profile || !profile.redes) return;
    const updatedSocial = [...profile.redes];
    updatedSocial[index] = { ...updatedSocial[index], ...updates };
    // Lógica para limitar redes visibles según el plan (ajusta según tus planes)
    const visibleCount = updatedSocial.filter(s => s.visible !== false).length;
    if (profile.plan === 'LaTXuWc7Ad9aSK3JdUts' && visibleCount > 3 && updates.visible) {
      alert('Con el plan básico solo puedes tener 3 redes sociales visibles. Actualiza tu plan para agregar más.');
      return;
    }
    const updatedProfile = { ...profile, redes: updatedSocial };
    setProfile(updatedProfile);
    updateAuthProfile(profile.uid, { redes: updatedSocial }, 'user');
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