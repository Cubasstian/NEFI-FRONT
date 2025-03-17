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
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { accountType, ...formData });
  };

  const handleGoogleSignIn = () => {
    console.log('Iniciar sesión con Google');
    // Aquí iría la lógica para el inicio de sesión con Google
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-cyan-500 p-4">
      {/* Contenedor del formulario (menos ancho) */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        {/* Título */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Crea tu cuenta en NEFI
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Únete a NEFI hoy mismo
        </p>

        <div className="flex mb-6">
          <button
            type="button"
            className={`flex-1 py-3 px-4 flex items-center justify-center ${
              accountType === 'personal'
                ? 'bg-blue-800 text-white'
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
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-r-md transition duration-150`}
            onClick={() => setAccountType('business')}
          >
            <Briefcase className="h-5 w-5 mr-2" />
            Empresa
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {accountType === 'business' && (
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de la Empresa
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required={accountType === 'business'}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {accountType === 'personal' ? 'Nombre Completo' : 'Nombre del Contacto'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label
              htmlFor="agreeTerms"
              className="ml-2 block text-sm text-gray-700"
            >
              Acepto los términos y condiciones
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-800 to-cyan-500 text-white font-bold py-3 px-6 rounded-md shadow-md hover:from-blue-900 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Crear Cuenta
            <ArrowRight size={20} />
          </button>

          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300"
            >
              <FcGoogle className="h-5 w-5" />
              Registrarse con Google
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200 font-medium"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;