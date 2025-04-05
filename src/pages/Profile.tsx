import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../config/firebaseConfig";
import { SocialLink, UserData } from '../types';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, updateProfile, updateSocial, isLoading } = useProfile();

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
    try {
      const profileRef = doc(db, 'usuarios', profile.uid);
      await updateDoc(profileRef, { [field]: editedValue });
      await updateProfile({ [field]: editedValue });
    } catch (error: any) {
      console.error(`Error al guardar ${field}:`, error);
      alert(`Error al guardar ${field}: ${error.message}`);
    } finally {
      setEditingField(null);
      setEditedValue('');
    }
  };

  // Manejar la selección y conversión de la imagen a Base64
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = async () => {
    if (newAvatarBase64) {
      try {
        const profileRef = doc(db, 'usuarios', profile.uid);
        await updateDoc(profileRef, { avatar: newAvatarBase64 });
        await updateProfile({ avatar: newAvatarBase64 });
        setNewAvatarFile(null);
        setNewAvatarBase64(null);
        setIsEditingAvatar(false);
      } catch (error: any) {
        console.error('Error al guardar la imagen en Firebase:', error);
        alert(`Error al guardar la imagen: ${error.message}`);
      }
    }
  };

  // Manejar selección de redes sociales
  const handleSocialSelection = async (index: number) => {
    const updatedSocials = [...socials];
    const willBeVisible = !updatedSocials[index].visible;
    try {
      await updateSocial(index, { visible: willBeVisible });
      setSocials(updatedSocials.map((social, i) => (i === index ? { ...social, visible: willBeVisible } : social)));
    } catch (error: any) {
      console.error('Error al actualizar visibilidad de red social:', error);
      alert(error.message);
    }
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
      try {
        const profileRef = doc(db, 'usuarios', profile.uid);
        await updateDoc(profileRef, { redes: updatedSocials });
        await updateProfile({ redes: updatedSocials });
        setSocials(updatedSocials);
        setNewSocial({ platform: '', url: '', visible: true });
        setIsAddingSocial(false);
      } catch (error: any) {
        console.error('Error al agregar red social:', error);
        alert(`Error al agregar red social: ${error.message}`);
      }
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
      try {
        const profileRef = doc(db, 'usuarios', profile.uid);
        await updateDoc(profileRef, { redes: updatedSocials });
        await updateProfile({ redes: updatedSocials });
        setSocials(updatedSocials);
        setEditingSocialIndex(null);
        setNewSocial({ platform: '', url: '', visible: true });
      } catch (error: any) {
        console.error('Error al editar red social:', error);
        alert(`Error al editar red social: ${error.message}`);
      }
    }
  };

  // Eliminar una red social
  const deleteSocial = async (index: number) => {
    const updatedSocials = socials.filter((_, i) => i !== index);
    try {
      const profileRef = doc(db, 'usuarios', profile.uid);
      await updateDoc(profileRef, { redes: updatedSocials });
      await updateProfile({ redes: updatedSocials });
      setSocials(updatedSocials);
    } catch (error: any) {
      console.error('Error al eliminar red social:', error);
      alert(`Error al eliminar red social: ${error.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="text-white text-xl">Cargando...</div>
        </div>
      )}
      {/* Encabezado del Dashboard */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <button className="bg-purple-500 text-white px-4 py-2 rounded" disabled={isLoading}>
            Ver Mi Perfil
          </button>
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
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="mb-2" disabled={isLoading} />
                {newAvatarBase64 && (
                  <img src={newAvatarBase64} alt="Preview" className="w-16 h-16 rounded-full mb-2" />
                )}
                <div className="flex space-x-2">
                  <button onClick={saveAvatar} className="bg-green-500 text-white px-2 py-1 rounded" disabled={isLoading}>Save</button>
                  <button onClick={() => setIsEditingAvatar(false)} className="bg-red-500 text-white px-2 py-1 rounded" disabled={isLoading}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <img src={profile.avatar || 'https://via.placeholder.com/64'} alt={profile.nombre} className="w-16 h-16 rounded-full mr-4" />
                <span
                  onClick={() => setIsEditingAvatar(true)}
                  className={`cursor-pointer text-gray-500 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                disabled={isLoading}
              />
            ) : (
              <>
                <span>{profile.nombre}</span>
                <span
                  onClick={() => startEditing('nombre', profile.nombre)}
                  className={`ml-2 cursor-pointer text-gray-500 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  ✏️
                </span>
              </>
            )}
          </div>

          {/* Correo */}
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
                disabled={isLoading}
              />
            ) : (
              <>
                <span>{profile.telefono || 'No especificado'}</span>
                <span
                  onClick={() => startEditing('telefono', profile.telefono || '')}
                  className={`ml-2 cursor-pointer text-gray-500 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                disabled={isLoading}
              />
            ) : (
              <>
                <span>{profile.direccion || 'No especificado'}</span>
                <span
                  onClick={() => startEditing('direccion', profile.direccion || '')}
                  className={`ml-2 cursor-pointer text-gray-500 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                disabled={isLoading}
              />
            ) : (
              <>
                <span>{profile.acercade || 'Sin descripción'}</span>
                <span
                  onClick={() => startEditing('acercade', profile.acercade || '')}
                  className={`ml-2 cursor-pointer text-gray-500 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <button onClick={saveEditedSocial} className="bg-green-500 text-white px-2 py-1 rounded" disabled={isLoading}>Save</button>
                      <button
                        onClick={() => setEditingSocialIndex(null)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <span>{social.platform}: </span>
                      <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                        {social.url}
                      </a>
                      <span
                        onClick={() => startEditingSocial(index)}
                        className={`ml-2 cursor-pointer text-gray-500 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        ✏️
                      </span>
                      <span
                        onClick={() => deleteSocial(index)}
                        className={`ml-2 cursor-pointer text-red-500 hover:text-red-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            className={`bg-blue-500 text-white px-4 py-2 rounded mb-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded" disabled={isLoading}>
                Agregar
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Información de Cuenta */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Información de Cuenta</h2>
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
              disabled={isLoading}
            />
          ) : (
            <>
              <span>{profile.username}</span>
              <span
                onClick={() => startEditing('username', profile.username)}
                className={`ml-2 cursor-pointer text-gray-500 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ✏️
              </span>
            </>
          )}
        </div>
        <div className="flex items-center mb-2">
          <strong className="w-32">URL del Perfil:</strong>
          <a href={profile.profileUrl} className="text-blue-500">{profile.profileUrl}</a>
        </div>
        <div className="flex items-center mb-2">
          <strong className="w-32">Plan Actual:</strong>
          <span className="text-blue-500">{profile.plan}</span>
        </div>
        <button className="mt-4 bg-gray-200 px-4 py-2 rounded" disabled={isLoading}>Gestionar Suscripción</button>
      </div>
    </div>
  );
};

export default Profile;