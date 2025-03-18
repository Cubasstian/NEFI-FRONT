import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Settings,
  BarChart2,
  CreditCard,
  FileText,
  Bell,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Share2,
  Edit2,
  Briefcase
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext'; // Ajustado según tu estructura
import PlanList from '../components/PlanList'; // Componente reutilizable para planes

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, updateProfile, updateSocial } = useProfile();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingProfileInfo, setIsEditingProfileInfo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos mock para estadísticas y actividad reciente (puedes reemplazarlos con datos reales)
  const stats = [
    { label: 'Visitas al Perfil', value: profile.profileViews || 128, icon: <User className="h-6 w-6 text-indigo-500" /> },
    { label: 'Enlaces Clickeados', value: 87, icon: <FileText className="h-6 w-6 text-indigo-500" /> },
    { label: 'Contactos Guardados', value: 42, icon: <Bell className="h-6 w-6 text-indigo-500" /> }
  ];

  const recentActivities = [
    { action: 'Perfil visitado', user: 'María López', time: 'Hace 5 minutos' },
    { action: 'Contacto guardado', user: 'Juan Pérez', time: 'Hace 2 horas' },
    { action: 'Enlace clickeado', user: 'Ana García', time: 'Hace 1 día', link: 'LinkedIn' },
    { action: 'Perfil visitado', user: 'Roberto Sánchez', time: 'Hace 2 días' }
  ];

  // Asignar íconos a las redes sociales al montar el componente
  useEffect(() => {
    const updatedSocial = profile.social.map((social) => {
      const icons: { [key: string]: React.ReactNode } = {
        linkedin: <Linkedin className="h-5 w-5" />,
        github: <Github className="h-5 w-5" />,
        twitter: <Twitter className="h-5 w-5" />,
        instagram: <Instagram className="h-5 w-5" />,
        facebook: <Facebook className="h-5 w-5" />,
        youtube: <Youtube className="h-5 w-5" />
      };
      return { ...social, icon: icons[social.platform] || <Globe className="h-5 w-5" /> };
    });
    updateProfile({ social: updatedSocial });
  }, []); // Ejecutar solo al montar

  // Funciones para manejar cambios
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profile.name}`,
        text: `Echa un vistazo al perfil de ${profile.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleProfileInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile({ [e.target.name]: e.target.value });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateProfile({ bio: e.target.value });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProfile({
      contact: { ...profile.contact, [e.target.name]: e.target.value }
    });
  };

  const handleSocialChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'url') {
      updateSocial(index, { url: e.target.value });
    } else if (e.target.name === 'visible') {
      updateSocial(index, { visible: e.target.checked });
    }
  };

  const handlePlanUpdate = (newPlan: string) => {
    updateProfile({ plan: newPlan });
    setIsModalOpen(false);
    alert(`Plan actualizado a ${newPlan}.`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div
        className="h-64 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.coverImage})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end">
          <div className="relative -bottom-16">
            {isEditingProfileInfo ? (
              <input
                type="text"
                name="avatar"
                value={profile.avatar}
                onChange={handleProfileInfoChange}
                className="h-32 w-32 rounded-full border-4 border-white object-cover px-3 py-2 text-gray-700"
                placeholder="URL de la foto de perfil"
              />
            ) : (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-32 w-32 rounded-full border-4 border-white object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              {isEditingProfileInfo ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileInfoChange}
                  className="text-2xl font-bold text-gray-900 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                />
              ) : (
                profile.name
              )}
              <button
                onClick={() => setIsEditingProfileInfo(!isEditingProfileInfo)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Bienvenido de nuevo, {profile.name}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </button>

            <Link
              to={`/perfil/${profile.profileUrl.split('/').pop() || id || 'default'}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <User className="h-4 w-4 mr-2" />
              Ver Mi Perfil
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">{stat.icon}</div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.label}</dt>
                      <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info & Contact */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Info */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Información del Perfil</h3>
              </div>
              <div className="px-6 py-5">
                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">URL del Perfil</span>
                    <span className="text-sm font-medium text-indigo-600">{profile.profileUrl || `nefi.com/${id}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Plan Actual</span>
                    <span className="text-sm font-medium text-indigo-600">{profile.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tarjeta NFC</span>
                    <span className="text-sm font-medium text-green-600">Activa</span>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Link
                    to="/billing"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar Suscripción
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700"
                  >
                    Actualizar Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Contacto</h3>
                <button
                  onClick={() => setIsEditingContact(!isEditingContact)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-4 space-y-4">
                {isEditingContact ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={profile.contact.email}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.contact.phone}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      name="location"
                      value={profile.contact.location}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      name="website"
                      value={profile.contact.website}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                  </>
                ) : (
                  <>
                    {profile.contact.email && (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <a href={`mailto:${profile.contact.email}`} className="text-gray-700 hover:text-indigo-600">
                          {profile.contact.email}
                        </a>
                      </div>
                    )}
                    {profile.contact.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <a href={`tel:${profile.contact.phone}`} className="text-gray-700 hover:text-indigo-600">
                          {profile.contact.phone}
                        </a>
                      </div>
                    )}
                    {profile.contact.location && (
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-700">{profile.contact.location}</span>
                      </div>
                    )}
                    {profile.contact.website && (
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-3" />
                        <a
                          href={`https://${profile.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-indigo-600"
                        >
                          {profile.contact.website}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Activity, Bio & Social */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}


            {/* Bio */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Acerca de</h3>
                <button
                  onClick={() => setIsEditingBio(!isEditingBio)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-4">
                {isEditingBio ? (
                  <textarea
                    value={profile.bio}
                    onChange={handleBioChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Redes Sociales</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                {profile.social.map((social, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-700">
                      {social.icon}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="url"
                        value={social.url}
                        onChange={(e) => handleSocialChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                        placeholder={`URL de ${social.platform}`}
                      />
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="visible"
                        checked={social.visible}
                        onChange={(e) => handleSocialChange(index, e)}
                        className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Visible</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para actualizar plan */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Actualizar Plan</h2>
            <p className="mb-4">Elige un plan para desbloquear más funciones:</p>
            <PlanList onSelectPlan={handlePlanUpdate} />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;