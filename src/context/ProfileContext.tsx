import React, { createContext, useContext, ReactNode, useState } from 'react';
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
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile: authProfile, updateProfile: updateAuthProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

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

  const updateProfile = async (newProfile: Partial<Profile>) => {
    if (!profile) throw new Error('No profile to update');
    setIsLoading(true);
    try {
      const updatedProfile = { ...profile, ...newProfile };
      setProfile(updatedProfile);
      // Actualizamos en useAuthStore y Firestore
      await updateAuthProfile(updatedProfile.uid, newProfile, 'user');
    } catch (error) {
      console.error('[ProfileContext] Error al actualizar perfil:', error);
      // Revertimos el cambio optimista si falla
      setProfile(profile);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSocial = async (index: number, updates: Partial<{ url: string; visible: boolean }>) => {
    if (!profile || !profile.redes) throw new Error('No profile or redes to update');
    setIsLoading(true);
    try {
      const updatedSocial = [...profile.redes];
      updatedSocial[index] = { ...updatedSocial[index], ...updates };
      const visibleCount = updatedSocial.filter(s => s.visible !== false).length;
      if (profile.plan === 'LaTXuWc7Ad9aSK3JdUts' && visibleCount > 3 && updates.visible) {
        throw new Error('Con el plan básico solo puedes tener 3 redes sociales visibles. Actualiza tu plan para agregar más.');
      }
      const updatedProfile = { ...profile, redes: updatedSocial };
      setProfile(updatedProfile);
      await updateAuthProfile(profile.uid, { redes: updatedSocial }, 'user');
    } catch (error) {
      console.error('[ProfileContext] Error al actualizar red social:', error);
      setProfile(profile); // Revertimos el cambio optimista
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, updateSocial, isLoading }}>
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