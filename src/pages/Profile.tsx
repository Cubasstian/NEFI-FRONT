import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Globe, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github,
  Youtube,
  Share2
} from 'lucide-react';

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock profile data - in a real app, this would be fetched from an API
  const profile = {
    id: id,
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
      website: 'carlosrodriguez.dev'
    },
    social: [
      { platform: 'linkedin', url: 'https://linkedin.com/in/carlosrodriguez', icon: <Linkedin className="h-5 w-5" /> },
      { platform: 'github', url: 'https://github.com/carlosrodriguez', icon: <Github className="h-5 w-5" /> },
      { platform: 'twitter', url: 'https://twitter.com/carlosrodriguez', icon: <Twitter className="h-5 w-5" /> },
      { platform: 'instagram', url: 'https://instagram.com/carlosrodriguez', icon: <Instagram className="h-5 w-5" /> },
      { platform: 'facebook', url: 'https://facebook.com/carlosrodriguez', icon: <Facebook className="h-5 w-5" /> },
      { platform: 'youtube', url: 'https://youtube.com/carlosrodriguez', icon: <Youtube className="h-5 w-5" /> }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'MongoDB'],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'Plataforma de comercio electrónico completa con pasarela de pagos, gestión de inventario y panel de administración.',
        url: 'https://github.com/carlosrodriguez/ecommerce'
      },
      {
        title: 'Task Management App',
        description: 'Aplicación de gestión de tareas con funcionalidades de colaboración en tiempo real y notificaciones.',
        url: 'https://github.com/carlosrodriguez/taskmanager'
      }
    ]
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profile.name}`,
        text: `Echa un vistazo al perfil de ${profile.name} en DigiProfile`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
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
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="h-32 w-32 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-xl text-gray-600">{profile.title}</p>
            {profile.company && (
              <p className="text-gray-600 flex items-center mt-1">
                <Briefcase className="h-4 w-4 mr-1" />
                {profile.company}
              </p>
            )}
          </div>
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Contact & Social */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Contacto</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
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
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Redes Sociales</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-3">
                  {profile.social.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                      aria-label={social.platform}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Habilidades</h3>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Bio & Projects */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Acerca de</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Proyectos</h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-6">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Ver Proyecto →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;