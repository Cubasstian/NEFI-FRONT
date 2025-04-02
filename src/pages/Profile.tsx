import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext'; // Ajusta la ruta
import { auth, googleProvider, db } from "../config/firebaseConfig";
import { doc, updateDoc } from 'firebase/firestore';

// Definimos los tipos (esto debería estar en src/types/index.ts, pero lo incluyo aquí para claridad)
interface SocialLink {
  platform: string;
  url: string;
  visible: boolean;
}

interface Profile {
  uid: string;
  nombre: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  acercade?: string;
  redes?: SocialLink[];
  plan: string;
  username: string;
  profileUrl: string;
  avatar: string;
}

interface ProfileContextType {
  profile: Profile | null;
  updateProfile: (updatedProfile: Partial<Profile>) => Promise<void>;
}

const Profile = () => {
  const { id } = useParams<{ id: string }>(); // "id" coincide con la ruta /profile/:id
  const { profile, updateProfile } = useProfile() as unknown as ProfileContextType;

  // Estados para edición de campos
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');

  // Estados para edición de imagen
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [newAvatarBase64, setNewAvatarBase64] = useState<string | null>(null);

  // Estados para redes sociales
  const [socials, setSocials] = useState<SocialLink[]>(profile?.redes || []);
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [newSocial, setNewSocial] = useState<SocialLink>({ platform: '', url: '', visible: true });
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);

  // Lista ampliada de redes sociales
  const availableSocials = [
    'LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'YouTube', 'GitHub', 'Pinterest',
    'Reddit', 'TikTok', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Twitch', 'Medium',
    'Behance', 'Dribbble', 'Spotify', 'SoundCloud', 'Vimeo'
  ];

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;
  }

  if (profile.uid !== id) {
    return <div className="min-h-screen flex items-center justify-center">No tienes acceso a este perfil.</div>;
  }

  // Manejar la edición de un campo
  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditedValue(currentValue);
  };

  const saveField = async (field: string) => {
    if (editedValue.trim() === '') return;
    const profileRef = doc(db, 'profiles', profile.uid);
    await updateDoc(profileRef, { [field]: editedValue });
    await updateProfile({ ...profile, [field]: editedValue });
    setEditingField(null);
    setEditedValue('');
  };

  // Manejar la selección y conversión de la imagen a Base64
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);

      // Convertir la imagen a Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Guardar la imagen en Firebase como Base64
  const saveAvatar = async () => {
    if (newAvatarBase64) {
      try {
        const profileRef = doc(db, 'profiles', profile.uid);
        await updateDoc(profileRef, { avatar: newAvatarBase64 });
        await updateProfile({ ...profile, avatar: newAvatarBase64 });
        setNewAvatarFile(null);
        setNewAvatarBase64(null);
        setIsEditingAvatar(false);
      } catch (error) {
        console.error('Error al guardar la imagen en Firebase:', error);
      }
    }
  };

  // Manejar selección de redes sociales (usando la propiedad visible)
  const handleSocialSelection = async (index: number) => {
    const updatedSocials = [...socials];
    updatedSocials[index] = { ...updatedSocials[index], visible: !updatedSocials[index].visible };
    setSocials(updatedSocials);
    const profileRef = doc(db, 'profiles', profile.uid);
    await updateDoc(profileRef, { redes: updatedSocials });
    await updateProfile({ ...profile, redes: updatedSocials });
  };

  // Manejar cambio en el formulario de redes sociales
  const handleNewSocialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewSocial({ ...newSocial, [e.target.name]: e.target.value });
  };

  // Agregar una nueva red social
  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSocial.platform && newSocial.url) {
      const updatedSocials = [...socials, { ...newSocial, visible: true }];
      setSocials(updatedSocials);
      const profileRef = doc(db, 'profiles', profile.uid);
      await updateDoc(profileRef, { redes: updatedSocials });
      await updateProfile({ ...profile, redes: updatedSocials });
      setNewSocial({ platform: '', url: '', visible: true });
      setIsAddingSocial(false);
    }
  };

  // Editar una red social existente
  const startEditingSocial = (index: number) => {
    setEditingSocialIndex(index);
    setNewSocial(socials[index]);
  };

  const saveEditedSocial = async () => {
    if (editingSocialIndex !== null && newSocial.platform && newSocial.url) {
      const updatedSocials = [...socials];
      updatedSocials[editingSocialIndex] = { ...newSocial, visible: socials[editingSocialIndex].visible };
      setSocials(updatedSocials);
      const profileRef = doc(db, 'profiles', profile.uid);
      await updateDoc(profileRef, { redes: updatedSocials });
      await updateProfile({ ...profile, redes: updatedSocials });
      setEditingSocialIndex(null);
      setNewSocial({ platform: '', url: '', visible: true });
    }
  };

  // Eliminar una red social
  const deleteSocial = async (index: number) => {
    const updatedSocials = socials.filter((_, i) => i !== index);
    setSocials(updatedSocials);
    const profileRef = doc(db, 'profiles', profile.uid);
    await updateDoc(profileRef, { redes: updatedSocials });
    await updateProfile({ ...profile, redes: updatedSocials });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Encabezado del Dashboard */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">Ver Mi Perfil</button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <span className="text-2xl mr-2">👤</span>
            <div>
              <p className="text-gray-500">Visitas al Perfil</p>
              <p className="text-2xl font-bold">128</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🔗</span>
            <div>
              <p className="text-gray-500">Enlaces Clickeados</p>
              <p className="text-2xl font-bold">87</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <span className="text-2xl mr-2">💾</span>
            <div>
              <p className="text-gray-500">Contactos Guardados</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Perfil y Redes Sociales */}
      <div className="grid grid-cols-2 gap-6">
        {/* Información del Perfil */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Información del Perfil</h2>
          <div className="flex items-center mb-4">
            {isEditingAvatar ? (
              <div className="flex flex-col">
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="mb-2" />
                {newAvatarBase64 && (
                  <img src={newAvatarBase64} alt="Preview" className="w-16 h-16 rounded-full mb-2" />
                )}
                <div className="flex space-x-2">
                  <button onClick={saveAvatar} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                  <button onClick={() => setIsEditingAvatar(false)} className="bg-red-500 text-white px-2 py-1 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <img src={profile.avatar} alt={profile.nombre} className="w-16 h-16 rounded-full mr-4" />
                <span
                  onClick={() => setIsEditingAvatar(true)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ✏️
                </span>
              </>
            )}
          </div>

          {/* Nombre */}
          <div className="flex items-center mb-2">
            <strong className="w-32">Nombre:</strong>
            {editingField === 'nombre' ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onBlur={() => saveField('nombre')}
                onKeyPress={(e) => e.key === 'Enter' && saveField('nombre')}
                className="border p-1 rounded"
                autoFocus
              />
            ) : (
              <>
                <span>{profile.nombre}</span>
                <span
                  onClick={() => startEditing('nombre', profile.nombre)}
                  className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ✏️
                </span>
              </>
            )}
          </div>

          {/* Correo (no editable) */}
          <div className="flex items-center mb-2">
            <strong className="w-32">Correo:</strong>
            <span>{profile.correo}</span>
          </div>

          {/* Teléfono */}
          <div className="flex items-center mb-2">
            <strong className="w-32">Teléfono:</strong>
            {editingField === 'telefono' ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onBlur={() => saveField('telefono')}
                onKeyPress={(e) => e.key === 'Enter' && saveField('telefono')}
                className="border p-1 rounded"
                autoFocus
              />
            ) : (
              <>
                <span>{profile.telefono || 'No especificado'}</span>
                <span
                  onClick={() => startEditing('telefono', profile.telefono || '')}
                  className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ✏️
                </span>
              </>
            )}
          </div>

          {/* Dirección */}
          <div className="flex items-center mb-2">
            <strong className="w-32">Dirección:</strong>
            {editingField === 'direccion' ? (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onBlur={() => saveField('direccion')}
                onKeyPress={(e) => e.key === 'Enter' && saveField('direccion')}
                className="border p-1 rounded"
                autoFocus
              />
            ) : (
              <>
                <span>{profile.direccion || 'No especificado'}</span>
                <span
                  onClick={() => startEditing('direccion', profile.direccion || '')}
                  className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ✏️
                </span>
              </>
            )}
          </div>

          {/* Acerca de */}
          <div className="flex items-start mb-2">
            <strong className="w-32">Acerca de:</strong>
            {editingField === 'acercade' ? (
              <textarea
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onBlur={() => saveField('acercade')}
                className="border p-1 rounded w-full"
                autoFocus
              />
            ) : (
              <>
                <span>{profile.acercade || 'Sin descripción'}</span>
                <span
                  onClick={() => startEditing('acercade', profile.acercade || '')}
                  className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  ✏️
                </span>
              </>
            )}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Redes Sociales</h2>
          {socials.length > 0 ? (
            <ul className="mb-4">
              {socials.map((social, index) => (
                <li key={index} className="flex items-center mb-2">
                  {editingSocialIndex === index ? (
                    <div className="flex space-x-2 w-full">
                      <select
                        name="platform"
                        value={newSocial.platform}
                        onChange={handleNewSocialChange}
                        className="border p-1 rounded"
                      >
                        <option value="">Selecciona una red social</option>
                        {availableSocials.map((platform, i) => (
                          <option key={i} value={platform}>{platform}</option>
                        ))}
                      </select>
                      <input
                        type="url"
                        name="url"
                        value={newSocial.url}
                        onChange={handleNewSocialChange}
                        placeholder="https://..."
                        className="border p-1 rounded flex-1"
                      />
                      <button onClick={saveEditedSocial} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                      <button
                        onClick={() => setEditingSocialIndex(null)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={social.visible}
                        onChange={() => handleSocialSelection(index)}
                        className="mr-2"
                      />
                      <span>{social.platform}: </span>
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                        {social.url}
                      </a>
                      <span
                        onClick={() => startEditingSocial(index)}
                        className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                      >
                        ✏️
                      </span>
                      <span
                        onClick={() => deleteSocial(index)}
                        className="ml-2 cursor-pointer text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-4">No hay redes sociales configuradas.</p>
          )}

          {/* Formulario para agregar redes sociales */}
          <button
            onClick={() => setIsAddingSocial(!isAddingSocial)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            {isAddingSocial ? 'Cerrar' : 'Agregar Red Social'}
          </button>

          {isAddingSocial && (
            <form onSubmit={handleAddSocial} className="flex space-x-4">
              <select
                name="platform"
                value={newSocial.platform}
                onChange={handleNewSocialChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Selecciona una red social</option>
                {availableSocials.map((platform, index) => (
                  <option key={index} value={platform}>{platform}</option>
                ))}
              </select>
              <input
                type="url"
                name="url"
                value={newSocial.url}
                onChange={handleNewSocialChange}
                placeholder="https://..."
                className="border p-2 rounded flex-1"
                required
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Agregar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Información de Cuenta */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Información de Cuenta</h2>
        {/* Nombre de usuario */}
        <div className="flex items-center mb-2">
          <strong className="w-32">Username:</strong>
          {editingField === 'username' ? (
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              onBlur={() => saveField('username')}
              onKeyPress={(e) => e.key === 'Enter' && saveField('username')}
              className="border p-1 rounded"
              autoFocus
            />
          ) : (
            <>
              <span>{profile.username}</span>
              <span
                onClick={() => startEditing('username', profile.username)}
                className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
              >
                ✏️
              </span>
            </>
          )}
        </div>

        {/* URL del Perfil */}
        <div className="flex items-center mb-2">
          <strong className="w-32">URL del Perfil:</strong>
          <a href={profile.profileUrl} className="text-blue-500">{profile.profileUrl}</a>
        </div>

        {/* Plan Actual (no editable) */}
        <div className="flex items-center mb-2">
          <strong className="w-32">Plan Actual:</strong>
          <span className="text-blue-500">Básico</span>
        </div>

        {/* Tarjeta NFC */}
        <div className="flex items-center mb-2">
          <strong className="w-32">Tarjeta NFC:</strong>
          <span className="text-green-500">Activa</span>
        </div>

        <button className="mt-4 bg-gray-200 px-4 py-2 rounded">Gestionar Suscripción</button>
      </div>
    </div>
  );
};

export default Profile;