import React, { useEffect, useState } from 'react';
import { Share2, Phone, Mail, Instagram, Youtube, Facebook, Calendar, Users, Globe, BarChart2, UserPlus } from 'lucide-react';

const SharedProfile = () => {
  const [animationPosition, setAnimationPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPosition(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  const apps = [
    { 
      name: 'WhatsApp', 
      icon: <img src="https://img.icons8.com/ios/50/FFFFFF/whatsapp--v1.png" alt="WhatsApp" className="h-12 w-12" />,
      bgColor: 'bg-green-500',
      category: 'messaging' 
    },
    { 
      name: 'Instagram', 
      icon: <Instagram className="h-12 w-12 text-white" />, 
      bgColor: 'bg-pink-600',
      category: 'social' 
    },
    { 
      name: 'Facebook', 
      icon: <Facebook className="h-12 w-12 text-white" />, 
      bgColor: 'bg-blue-600',
      category: 'social' 
    },
    { 
      name: 'YouTube', 
      icon: <Youtube className="h-12 w-12 text-white" />, 
      bgColor: 'bg-red-600',
      category: 'social' 
    },
    { 
      name: 'Gmail', 
      icon: <Mail className="h-12 w-12 text-white" />, 
      bgColor: 'bg-red-500',
      category: 'email' 
    },
    { 
      name: 'Teléfono', 
      icon: <Phone className="h-12 w-12 text-white" />, 
      bgColor: 'bg-green-600',
      category: 'contact' 
    },
    { 
      name: 'Pagina Web', 
      icon: <Globe className="h-12 w-12 text-white" />, 
      bgColor: 'bg-indigo-500',
      category: 'web' 
    },
    { 
      name: 'Crear contacto', 
      icon: <UserPlus className="h-12 w-12 text-white" />, 
      bgColor: 'bg-gray-500',
      category: 'contact' 
    },
    { 
      name: 'Agendar cita', 
      icon: <Calendar className="h-12 w-12 text-white" />, 
      bgColor: 'bg-blue-500',
      category: 'health' 
    },
    { 
      name: 'Presentación Empresarial', 
      icon: <BarChart2 className="h-12 w-12 text-white" />, 
      bgColor: 'bg-gray-600',
      category: 'business' 
    }
  ];

  return (
    <div className="flex flex-col items-center min-h-screen pb-16 relative overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full z-0 bg-gradient-to-br from-blue-100 to-purple-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at ${animationPosition}% 20%, rgba(129, 230, 217, 0.3) 0%, rgba(129, 230, 217, 0) 50%),
            radial-gradient(circle at ${100 - animationPosition}% 80%, rgba(221, 214, 243, 0.4) 0%, rgba(250, 172, 168, 0) 50%)
          `
        }}
      >
        <div className="absolute h-32 w-32 rounded-full bg-blue-200 opacity-20" 
          style={{ 
            top: `${20 + Math.sin(animationPosition/10) * 5}%`, 
            left: `${10 + Math.cos(animationPosition/15) * 5}%` 
          }}
        />
        <div className="absolute h-24 w-24 rounded-full bg-purple-200 opacity-20" 
          style={{ 
            top: `${60 + Math.cos(animationPosition/12) * 8}%`, 
            right: `${15 + Math.sin(animationPosition/10) * 5}%` 
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex flex-row items-center mt-8 px-8 w-full max-w-lg">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-6 text-left">
            <h2 className="text-xl font-semibold">Carlos Rodríguez</h2>
            <p className="text-sm text-gray-500">Desarrollador Full Stack</p>
          </div>
        </div>

        <div className="text-center mt-4 px-8">
          <h3 className="text-md font-medium text-gray-700">Acerca de mí</h3>
          <p className="text-sm text-gray-600 mt-1">
            Desarrollador apasionado por crear soluciones tecnológicas que mejoren la vida de las personas. Especializado en React, Node.js y arquitecturas cloud.
          </p>
        </div>

        <div className="w-full px-8 mt-8">
          <div className="grid grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-xl flex items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-200 ${app.bgColor}`}>
                  {app.icon}
                </div>
                <span className="text-sm mt-2 text-center">{app.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button className="bg-black text-white px-10 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
              Intercambiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedProfile;