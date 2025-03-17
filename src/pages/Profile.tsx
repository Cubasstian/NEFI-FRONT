// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react'; // Añadido useEffect
import { useParams } from 'react-router-dom';
import { 
  User, 
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
import { useProfile } from '../context/ProfileContext'; // Ajustado a la carpeta context
import PlanList from '../components/PlanList'; // Importar el nuevo componente

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { profile, updateProfile, updateSocial } = useProfile();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingProfileInfo, setIsEditingProfileInfo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  }, []); // Ejecutar solo una vez al montar el componente

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profile.name}`,
        text: `Echa un vistazo al perfil de ${profile.name} en DigiProfile`,
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
      contact: {
        ...profile.contact,
        [e.target.name]: e.target.value
      }
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
    alert(`Plan actualizado a ${newPlan}. Ahora puedes ajustar tus redes sociales según el nuevo plan.`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Cover Image */}
      <div 
        className="h-64 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${profile.coverImage})` }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end">
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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2">
              {isEditingProfileInfo ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileInfoChange}
                  className="text-3xl font-bold text-gray-900 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              )}
              <button
                onClick={() => setIsEditingProfileInfo(!isEditingProfileInfo)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            </div>
            {isEditingProfileInfo ? (
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleProfileInfoChange}
                className="text-xl text-gray-600 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 w-full mt-2"
              />
            ) : (
              <p className="text-xl text-gray-600">{profile.title}</p>
            )}
            {isEditingProfileInfo ? (
              <input
                type="text"
                name="company"
                value={profile.company}
                onChange={handleProfileInfoChange}
                className="text-gray-600 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 w-full mt-2"
              />
            ) : (
              profile.company && (
                <p className="text-gray-600 flex items-center mt-1">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {profile.company}
                </p>
              )
            )}
          </div>
          <div className="space-x-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
              {profile.plan}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700"
            >
              Actualizar Plan
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Contact */}
          <div className="md:col-span-1">
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
          
          {/* Right Column - Bio & Social */}
          <div className="md:col-span-2">
            {/* Acerca de */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
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

            {/* Redes Sociales (debajo de Acerca de) */}
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
            <PlanList onSelectPlan={handlePlanUpdate} /> {/* Usar el componente reutilizable */}
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