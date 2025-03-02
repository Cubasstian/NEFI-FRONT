import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, BarChart2, CreditCard, FileText, Bell, LogOut } from 'lucide-react';

const Dashboard = () => {
  // Mock user data
  const user = {
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    profileViews: 128,
    profileUrl: 'digiprofile.com/carlos',
    plan: 'Premium'
  };

  // Mock statistics
  const stats = [
    { label: 'Visitas al Perfil', value: user.profileViews, icon: <User className="h-6 w-6 text-indigo-500" /> },
    { label: 'Enlaces Clickeados', value: 87, icon: <FileText className="h-6 w-6 text-indigo-500" /> },
    { label: 'Contactos Guardados', value: 42, icon: <Bell className="h-6 w-6 text-indigo-500" /> }
  ];

  // Mock recent activities
  const recentActivities = [
    { action: 'Perfil visitado', user: 'María López', time: 'Hace 5 minutos' },
    { action: 'Contacto guardado', user: 'Juan Pérez', time: 'Hace 2 horas' },
    { action: 'Enlace clickeado', user: 'Ana García', time: 'Hace 1 día', link: 'LinkedIn' },
    { action: 'Perfil visitado', user: 'Roberto Sánchez', time: 'Hace 2 días' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Bienvenido de nuevo, {user.name}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/profile/edit"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Editar Perfil
            </Link>
            <Link
              to={`/profile/${user.profileUrl}`}
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
                  <div className="flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Información del Perfil
                </h3>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center mb-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <User className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">URL del Perfil</span>
                    <span className="text-sm font-medium text-indigo-600">{user.profileUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Plan Actual</span>
                    <span className="text-sm font-medium text-indigo-600">{user.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tarjeta NFC</span>
                    <span className="text-sm font-medium text-green-600">Activa</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to="/billing"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Gestionar Suscripción
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Actividad Reciente
                </h3>
              </div>
              <div className="px-6 py-5">
                <ul className="divide-y divide-gray-200">
                  {recentActivities.map((activity, index) => (
                    <li key={index} className="py-4">
                      <div className="flex space-x-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">{activity.action}</h3>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            {activity.user} {activity.link && `(${activity.link})`}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link
                    to="/analytics"
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Ver Estadísticas Completas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;