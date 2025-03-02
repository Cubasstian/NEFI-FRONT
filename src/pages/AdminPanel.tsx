import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  BarChart2, 
  Settings, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Trash,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState('createdAt');
  
  // Mock data
  const users = [
    { 
      id: 1, 
      name: 'María González', 
      email: 'maria@example.com', 
      plan: 'Premium', 
      status: 'active', 
      createdAt: '2023-05-15', 
      lastLogin: '2023-06-10' 
    },
    { 
      id: 2, 
      name: 'Juan Pérez', 
      email: 'juan@example.com', 
      plan: 'Free', 
      status: 'active', 
      createdAt: '2023-04-20', 
      lastLogin: '2023-06-12' 
    },
    { 
      id: 3, 
      name: 'Ana Rodríguez', 
      email: 'ana@example.com', 
      plan: 'Premium', 
      status: 'inactive', 
      createdAt: '2023-03-10', 
      lastLogin: '2023-05-01' 
    },
    { 
      id: 4, 
      name: 'Carlos López', 
      email: 'carlos@example.com', 
      plan: 'Business', 
      status: 'active', 
      createdAt: '2023-06-01', 
      lastLogin: '2023-06-15' 
    },
    { 
      id: 5, 
      name: 'Laura Martínez', 
      email: 'laura@example.com', 
      plan: 'Premium', 
      status: 'active', 
      createdAt: '2023-02-28', 
      lastLogin: '2023-06-14' 
    }
  ];
  
  const stats = [
    { label: 'Total Usuarios', value: 1254, icon: <Users className="h-6 w-6 text-indigo-600" /> },
    { label: 'Ingresos Mensuales', value: '€9,854', icon: <CreditCard className="h-6 w-6 text-green-600" /> },
    { label: 'Visitas a Perfiles', value: '45.2K', icon: <BarChart2 className="h-6 w-6 text-blue-600" /> }
  ];
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona usuarios, suscripciones y analiza estadísticas
            </p>
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
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Users className="h-5 w-5 mr-2" />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`${
                activeTab === 'subscriptions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Suscripciones
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Settings className="h-5 w-5 mr-2" />
              Configuración
            </button>
          </nav>
        </div>
        
        {/* Content */}
        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
              <div className="flex space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                        Usuario
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('plan')}>
                        Plan
                        {getSortIcon('plan')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                        Estado
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('createdAt')}>
                        Fecha Registro
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('lastLogin')}>
                        Último Acceso
                        {getSortIcon('lastLogin')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">{user.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                          user.plan === 'Business' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de <span className="font-medium">42</span> resultados
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Anterior
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'subscriptions' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gestión de Suscripciones</h3>
            <p className="text-gray-500">Contenido de gestión de suscripciones en desarrollo.</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
            <p className="text-gray-500">Contenido de estadísticas en desarrollo.</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
            <p className="text-gray-500">Contenido de configuración en desarrollo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;