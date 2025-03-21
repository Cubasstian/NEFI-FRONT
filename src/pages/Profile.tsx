import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext'; // Ajusta la ruta

const Profile = () => {
  const { id } = useParams<{ id: string }>(); // "id" coincide con la ruta /profile/:id
  const { profile } = useProfile();

  // Estado para manejar la edición de redes sociales
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [socials, setSocials] = useState(profile?.redes || []);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

  // Lista de redes sociales disponibles para seleccionar
  const availableSocials = ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'];

  // Estado para manejar las redes seleccionadas
  const [selectedSocials, setSelectedSocials] = useState<string[]>(socials.map(s => s.platform));

  // Actividades recientes (simuladas, puedes obtenerlas de una API o contexto)
  const recentActivities = [
    { action: 'Perfil visitado', user: 'María López', time: 'Hace 5 minutos' },
    { action: 'Contacto guardado', user: 'Juan Pérez', time: 'Hace 2 horas' },
    { action: 'Enlace clickeado', user: 'Ana García (LinkedIn)', time: 'Hace 1 día' },
    { action: 'Perfil visitado', user: '', time: 'Hace 2 días' },
  ];

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;
  }

  if (profile.uid !== id) {
    return <div className="min-h-screen flex items-center justify-center">No tienes acceso a este perfil.</div>;
  }

  // Manejar la selección de redes sociales
  const handleSocialSelection = (platform: string) => {
    if (selectedSocials.includes(platform)) {
      setSelectedSocials(selectedSocials.filter(s => s !== platform));
    } else {
      setSelectedSocials([...selectedSocials, platform]);
    }
  };

  // Manejar el cambio en el formulario de nueva red social
  const handleNewSocialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewSocial({ ...newSocial, [e.target.name]: e.target.value });
  };

  // Agregar una nueva red social
  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSocial.platform && newSocial.url) {
     // setSocials([...socials, newSocial]);
      setSelectedSocials([...selectedSocials, newSocial.platform]);
      setNewSocial({ platform: '', url: '' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Encabezado del Dashboard */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-2">
           <button className="bg-blue-500 text-white px-4 py-2 rounded">Editar Perfil</button>
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

      {/* Información del Perfil y Actividad Reciente */}
      <div className="grid grid-cols-2 gap-6">
        {/* Información del Perfil */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Información del Perfil</h2>
          <div className="flex items-center mb-4">
            <img src={profile.avatar} alt={profile.nombre} className="w-16 h-16 rounded-full mr-4" />
            <div>
              <h3 className="text-lg font-semibold">{profile.nombre}</h3>
              <p className="text-gray-600">{profile.correo}</p>
            </div>
          </div>
          <p className="mb-2"><strong>URL del Perfil:</strong> <a href={profile.profileUrl} className="text-blue-500">{profile.profileUrl}</a></p>
          <p className="mb-2"><strong>Plan Actual:</strong> <span className="text-blue-500">{profile.plan}</span></p>
          <p className="mb-2"><strong>Tarjeta NFC:</strong> <span className="text-green-500">Activa</span></p>
          <button className="mt-4 bg-gray-200 px-4 py-2 rounded">Gestionar Suscripción</button>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex justify-between">
                <div>
                  <p className="font-semibold">{activity.action}</p>
                  {activity.user && <p className="text-gray-600">{activity.user}</p>}
                </div>
                <p className="text-gray-500">{activity.time}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sección de Redes Sociales */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-bold mb-4">Redes Sociales</h2>
        {socials.length > 0 ? (
          <ul className="mb-4">
            {socials.map((social, index) => (
              <li key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={selectedSocials.includes(social.platform)}
                  onChange={() => handleSocialSelection(social.platform)}
                  className="mr-2"
                />
                <span>{social.platform}: </span>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                  {social.url}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4">No hay redes sociales configuradas.</p>
        )}

        {/* Formulario para agregar redes sociales */}
        <button
          onClick={() => setIsEditingSocials(!isEditingSocials)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {isEditingSocials ? 'Cerrar' : 'Agregar Red Social'}
        </button>

        {isEditingSocials && (
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
                <option key={index} value={platform}>
                  {platform}
                </option>
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
  );
};

export default Profile;