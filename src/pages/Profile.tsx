import React from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext'; // Ajusta la ruta

const Profile = () => {
  const { id } = useParams<{ id: string }>(); // "id" coincide con la ruta /profile/:id
  const { profile } = useProfile();

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;
  }

  if (profile.uid !== id) {
    return <div className="min-h-screen flex items-center justify-center">No tienes acceso a este perfil.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="relative">
        <img src={profile.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-t-lg" />
        <img src={profile.avatar} alt={profile.nombre} className="w-32 h-32 rounded-full absolute -bottom-16 left-6 border-4 border-white" />
      </div>
      <div className="mt-20">
        <h1 className="text-3xl font-bold">{profile.nombre}</h1>
        <p className="text-gray-600">{profile.correo}</p>
        <p className="text-gray-600">{profile.telefono}</p>
        <p className="text-gray-600">{profile.direccion}</p>
        <p className="mt-4">{profile.acercade || 'Sin descripción'}</p>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Redes sociales</h2>
          {profile.redes && profile.redes.length > 0 ? (
            <ul>
              {profile.redes.map((social, index) => (
                <li key={index}>
                  {social.platform}: <a href={social.url} target="_blank" rel="noopener noreferrer">{social.url}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay redes sociales configuradas.</p>
          )}
        </div>
        <p className="mt-4">Plan: {profile.plan}</p>
        <p>Username: {profile.username}</p>
        <p>Profile URL: {profile.profileUrl}</p>
      </div>
    </div>
  );
};

export default Profile;