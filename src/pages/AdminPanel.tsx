import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  CreditCard,
  BarChart2,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Plus,
  X
} from 'lucide-react';
import { usePlanStore } from '@/store/plan/usePlanStore';
import { useAuthStore } from "@/store/auth/userAuthStore";
import { Plan as PlanType, UserData } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Feature {
  text: string;
  included: boolean;
}

interface Stat {
  label: string;
  value: string | number;
  icon: JSX.Element;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'subscriptions' | 'analytics' | 'plans' | 'settings'>('users');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<keyof UserData>('nombre');
  const { plans, fetchPlans, updatePlan, addPlan, deletePlan } = usePlanStore();
  const { allUsers, fetchAllProfiles, deleteProfile, updateProfile } = useAuthStore();
  const [editingPlan, setEditingPlan] = useState<PlanType | null>(null);
  const [editedFeatures, setEditedFeatures] = useState<Feature[]>([]);
  const [isCreatingPlanModalOpen, setIsCreatingPlanModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<PlanType, 'id'>>({
    nombre: '',
    precio: '',
    features: [{ text: '', included: true }],
    cta: '',
    popular: false,
  });
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isEditingUserModalOpen, setIsEditingUserModalOpen] = useState(false);

  const memoizedFetchPlans = useCallback(() => {
    fetchPlans();
  }, [fetchPlans]);

  const memoizedFetchAllProfiles = useCallback(() => {
    fetchAllProfiles();
  }, [fetchAllProfiles]);

  useEffect(() => {
    memoizedFetchPlans();
    memoizedFetchAllProfiles();

    console.log("Plans (después de fetch):", plans);
    console.log("All Users:", allUsers);
  }, [memoizedFetchPlans, memoizedFetchAllProfiles]);

  const handleEditPlan = (plan: PlanType) => {
    setEditingPlan(plan);
    setEditedFeatures(plan.features);
  };

  const handleSavePlan = async () => {
    if (editingPlan) {
      try {
        const updatedPlan = { ...editingPlan, features: editedFeatures };
        await updatePlan(String(updatedPlan.id), updatedPlan);
        setEditingPlan(null);
        toast.success('Plan actualizado con éxito');
      } catch (error) {
        console.error("Error al actualizar el plan:", error);
        toast.error('Error al actualizar el plan');
      }
    }
  };

  const handleAddFeature = () => {
    setEditedFeatures([...editedFeatures, { text: '', included: true }]);
  };

  const handleFeatureChange = (index: number, field: keyof Feature, value: string | boolean) => {
    const updatedFeatures = [...editedFeatures];
    updatedFeatures[index][field] = value as never;
    setEditedFeatures(updatedFeatures);
  };

  const handleDeleteFeature = (index: number) => {
    const updatedFeatures = editedFeatures.filter((_, i) => i !== index);
    setEditedFeatures(updatedFeatures);
  };

  const handleCreatePlan = async () => {
    try {
      await addPlan(newPlan);
      setIsCreatingPlanModalOpen(false);
      setNewPlan({ nombre: '', precio: '', features: [{ text: '', included: true }], cta: '', popular: false });
      memoizedFetchPlans();
      toast.success('Plan creado con éxito');
    } catch (error) {
      console.error("Error al crear el plan:", error);
      toast.error('Error al crear el plan');
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlan(id);
      toast.success('Plan eliminado con éxito');
    } catch (error) {
      console.error("Error al eliminar el plan:", error);
      toast.error('Error al eliminar el plan');
    }
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setIsEditingUserModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        await updateProfile(editingUser.uid, editingUser, "user");
        toast.success('Usuario actualizado con éxito');
        setIsEditingUserModalOpen(false);
      } catch (error) {
        toast.error('Error al actualizar el usuario');
        console.error("Error al actualizar el usuario:", error);
      }
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    const confirmDelete = window.confirm(`¿Seguro que deseas eliminar a ${user.nombre}?`);
    if (confirmDelete) {
        try {
            await deleteProfile(user.uid, "user");
            toast.success('Usuario eliminado con éxito');
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            toast.error('Error al eliminar el usuario');
        }
    }
  };

  const stats: Stat[] = [
    { label: 'Total Usuarios', value: 1254, icon: <Users className="h-6 w-6 text-indigo-600" /> },
    { label: 'Ingresos Mensuales', value: '€9,854', icon: <CreditCard className="h-6 w-6 text-green-600" /> },
    { label: 'Visitas a Perfiles', value: '45.2K', icon: <BarChart2 className="h-6 w-6 text-blue-600" /> }
  ];

  const handleSort = (column: keyof UserData) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: keyof UserData) => {
    if (sortBy !== column) return null;

    return sortDirection === 'asc' ?
      <ChevronUp className="h-4 w-4" /> :
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToastContainer />
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona usuarios, suscripciones y analiza estadísticas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('users')}
              className={`${activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'} px-3 py-2 font-medium text-sm rounded-md`}
            >
              Usuarios
            </button>
            {/* <button
              onClick={() => setActiveTab('subscriptions')}
              className={`${activeTab === 'subscriptions' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'} px-3 py-2 font-medium text-sm rounded-md`}
            >
              Suscripciones
            </button> */}
            {/* <button
              onClick={() => setActiveTab('analytics')}
              className={`${activeTab === 'analytics' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'} px-3 py-2 font-medium text-sm rounded-md`}
            >
              Analíticas
            </button> */}
            <button
              onClick={() => setActiveTab('plans')}
              className={`${activeTab === 'plans' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'} px-3 py-2 font-medium text-sm rounded-md`}
            >
              Planes
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${activeTab === 'settings' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'} px-3 py-2 font-medium text-sm rounded-md`}
            >
              Ajustes
            </button>
          </nav>
        </div>

     

        {activeTab === 'users' && allUsers && allUsers.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <div className="flex items-center">
                <Search className="h-5 w-5 text-gray-500" />
                <input type="text" placeholder="Buscar usuarios..." className="ml-2 border-none focus:ring-0" />
              </div>
              <button className="flex items-center text-indigo-600">
                <Filter className="h-5 w-5 mr-1" />
                Filtrar
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('nombre')}>
                        Usuario
                        {getSortIcon('nombre')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('plan')}>
                        Plan
                        {getSortIcon('plan')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('estado')}>
                        Estado
                        {getSortIcon('estado')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('rol')}>
                        Rol
                        {getSortIcon('rol')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <tr key={user.uid}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">{user.nombre.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                            <div className="text-sm text-gray-500">{user.correo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                          user.plan === 'Business' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {user.estado ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {user.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.rol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-900">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'plans' && plans && plans.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-semibold mb-4">Gestión de Planes</h2>

            <div>
              <button onClick={() => setIsCreatingPlanModalOpen(true)} className="bg-[#0A2640] text-white px-4 py-2 rounded mb-4">
                Añadir Nuevo Plan
              </button>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Características
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTA
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Popular
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans && plans.map((plan) => {
                    console.log("Plan en el map:", plan);
                    return (
                      <tr key={plan.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{plan.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{plan.precio}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ul className="list-disc list-inside">
                            {plan.features.map((feature, index) => (
                              <li key={index} className={feature.included ? 'text-green-600' : 'text-red-600'}>
                                {feature.text}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{plan.cta}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{plan.popular ? 'Sí' : 'No'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => handleEditPlan(plan)} className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeletePlan(String(plan.id))} className="text-red-600 hover:text-red-900">
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {editingPlan && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                <div className="bg-white rounded-lg p-6 w-1/2">
                  <h3 className="text-lg font-semibold mb-4">Editar Plan</h3>
                  <input
                    type="text"
                    value={editingPlan.nombre}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nombre: e.target.value })}
                    className="border rounded px-3 py-2 mb-2 w-full"
                  />
                  <input
                    type="text"
                    value={editingPlan.precio}
                    onChange={(e) => setEditingPlan({ ...editingPlan, precio: e.target.value })}
                    className="border rounded px-3 py-2 mb-2 w-full"
                  />
                  {editedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={feature.text}
                        onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                        className="border rounded px-3 py-2 flex-grow mr-2"
                      />
                      <input
                        type="checkbox"
                        checked={feature.included}
                        onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                        className="mr-2"
                      />
                      <button onClick={() => handleDeleteFeature(index)} className="text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={handleAddFeature} className="text-indigo-600 mb-2">
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir Característica
                  </button>
                  <input
                    type="text"
                    value={editingPlan.cta}
                    onChange={(e) => setEditingPlan({ ...editingPlan, cta: e.target.value })}
                    className="border rounded px-3 py-2 mb-2 w-full"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingPlan.popular}
                      onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                      className="mr-2"
                    />
                    Popular
                  </label>
                  <div className="flex justify-end">
                    <button onClick={handleSavePlan} className="bg-indigo-600 text-white px-4 py-2 rounded">
                      Guardar
                    </button>
                    <button onClick={() => setEditingPlan(null)} className="ml-2 px-4 py-2">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal para Crear Nuevo Plan */}
        {isCreatingPlanModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-1/2">
              <h3 className="text-lg font-semibold mb-4">Crear Nuevo Plan</h3>
              <input
                type="text"
                placeholder="Nombre del Plan"
                value={newPlan.nombre}
                onChange={(e) => setNewPlan({ ...newPlan, nombre: e.target.value })}
                className="border rounded px-3 py-2 mb-2 w-full"
              />
              <input
                type="text"
                placeholder="Precio"
                value={newPlan.precio}
                onChange={(e) => setNewPlan({ ...newPlan, precio: e.target.value })}
                className="border rounded px-3 py-2 mb-2 w-full"
              />
              {newPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder="Característica"
                    value={feature.text}
                    onChange={(e) => {
                      const updatedFeatures = [...newPlan.features];
                      updatedFeatures[index].text = e.target.value;
                      setNewPlan({ ...newPlan, features: updatedFeatures });
                    }}
                    className="border rounded px-3 py-2 flex-grow mr-2"
                  />
                  <input
                    type="checkbox"
                    checked={feature.included}
                    onChange={(e) => {
                      const updatedFeatures = [...newPlan.features];
                      updatedFeatures[index].included = e.target.checked;
                      setNewPlan({ ...newPlan, features: updatedFeatures });
                    }}
                    className="mr-2"
                  />
                  <button
                    onClick={() => {
                      const updatedFeatures = newPlan.features.filter((_, i) => i !== index);
                      setNewPlan({ ...newPlan, features: updatedFeatures });
                    }}
                    className="text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => setNewPlan({ ...newPlan, features: [...newPlan.features, { text: '', included: true }] })} className="text-indigo-600 mb-2">
                <Plus className="h-4 w-4 mr-1" />
                Añadir Característica
              </button>
              <input
                type="text"
                placeholder="CTA"
                value={newPlan.cta}
                onChange={(e) => setNewPlan({ ...newPlan, cta: e.target.value })}
                className="border rounded px-3 py-2 mb-2 w-full"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newPlan.popular}
                  onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked })}
                  className="mr-2"
                />
                Popular
              </label>
              <div className="flex justify-end">
                <button onClick={handleCreatePlan} className="bg-indigo-600 text-white px-4 py-2 rounded">
                  Crear Plan
                </button>
                <button onClick={() => setIsCreatingPlanModalOpen(false)} className="ml-2 px-4 py-2">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Editar Usuario */}
        {isEditingUserModalOpen && editingUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-1/2">
              <h3 className="text-lg font-semibold mb-4">Editar Usuario</h3>
              <input
                type="text"
                value={editingUser.nombre}
                onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                className="border rounded px-3 py-2 mb-2 w-full"
              />
              <input
                type="text"
                value={editingUser.correo}
                onChange={(e) => setEditingUser({ ...editingUser, correo: e.target.value })}
                className="border rounded px-3 py-2 mb-2 w-full"
              />
              <select
                value={editingUser.plan}
                onChange={(e) => setEditingUser({ ...editingUser, plan: e.target.value })}
                className="border rounded px-3 py-2 mb-2 w-full"
              >
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Business">Business</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingUser.estado}
                  onChange={(e) => setEditingUser({ ...editingUser, estado: e.target.checked })}
                  className="mr-2"
                />
                Activo
              </label>
              <select
                value={editingUser.rol}
                onChange={(e) => setEditingUser({ ...editingUser, rol: e.target.value as 'ADMIN' | 'USER' })}
                className="border rounded px-3 py-2 mb-2 w-full"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
              <div className="flex justify-end">
                <button onClick={handleUpdateUser} className="bg-indigo-600 text-white px-4 py-2 rounded">
                  Guardar
                </button>
                <button onClick={() => setIsEditingUserModalOpen(false)} className="ml-2 px-4 py-2">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;