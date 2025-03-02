import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: '',
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { accountType, ...formData });
  };

  const handleGoogleSignIn = () => {
    console.log("Iniciar sesión con Google");
    // Aquí iría la lógica para el inicio de sesión con Google
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Crea tu cuenta en NEFI
          </h2>

          <div className="flex mb-6">
            <button
              type="button"
              className={`flex-1 py-3 px-4 flex items-center justify-center ${
                accountType === 'personal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-l-md transition duration-150`}
              onClick={() => setAccountType('personal')}
            >
              <User className="h-5 w-5 mr-2" />
              Personal
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 flex items-center justify-center ${
                accountType === 'business'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-r-md transition duration-150`}
              onClick={() => setAccountType('business')}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Empresa
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {accountType === 'business' && (
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required={accountType === 'business'}
                  />
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {accountType === 'personal' ? 'Nombre Completo' : 'Nombre del Contacto'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 flex items-center justify-center"
            >
              Crear Cuenta
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              <FcGoogle className="h-5 w-5" />
              Registrarse con Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
