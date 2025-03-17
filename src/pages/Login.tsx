import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import nefiLogo from '../assets/nefi.png';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      correo: '',
      password: '',
    },
    validationSchema: Yup.object({
      correo: Yup.string()
        .email('Debe ser un correo válido')
        .required('Campo obligatorio'),
      password: Yup.string()
        .min(6, 'Mínimo 6 caracteres')
        .required('Campo obligatorio'),
    }),
    onSubmit: async (values) => {
      try {
        if (values.correo === 'admin@gmail.com') {
          navigate('/admin');
        } else {
          const userId = 123;
          navigate(`/profile/${userId}`);
        }
        console.log(values);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        {/* Columna izquierda: Formulario (más grande) */}
        <div className="w-full md:w-1/2 bg-white p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={nefiLogo}
              alt="NEFI Logo"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Iniciar Sesión
          </h2>
          <br />

          <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                name="correo"
                placeholder="Ingresa tu correo"
                value={formik.values.correo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${formik.errors.correo && formik.touched.correo ? 'border-red-500' : ''
                  }`}
              />
              {formik.touched.correo && formik.errors.correo && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.correo}</p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pr-10 ${formik.errors.password && formik.touched.password ? 'border-red-500' : ''
                  }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Recordarme
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-blue-500 hover:underline transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-cyan-500 text-white font-bold py-3 px-6 rounded-md shadow-md hover:from-blue-900 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Ingresar
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200 font-medium"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Columna derecha: Texto descriptivo (centrado) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-800 to-cyan-500 p-8 text-white items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              We are more than just a company
            </h2>
            <p className="text-sm leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;