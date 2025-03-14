import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      correo: "",
      password: "",
    },
    validationSchema: Yup.object({
      correo: Yup.string().email("Debe ser un correo válido").required("Campo obligatorio"),
      password: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo obligatorio"),
    }),
    onSubmit: async (values) => {
      try {
        if( values.correo === 'admin@gmail.com' ){
          navigate('/admin');
        }else{
          const userId = 123;
      navigate(`/profile/${userId}`);

        }
       console.log(values)
      } catch (error) {
        console.log(error)
      }
    },
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };


  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Iniciar Sesión en NEFI
          </h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                    type="email"
                    name="correo"
                    placeholder="Ingresa tu correo"
                    value={formik.values.correo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border ${formik.errors.correo && formik.touched.correo ? "border-red-500" : "border-stroke"
                      }border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {formik.touched.correo && formik.errors.correo && (
                    <p className="text-red-500 text-sm">{formik.errors.correo }</p>
                  )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                    type="password"
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border ${formik.errors.password && formik.touched.password ? "border-red-500" : "border-stroke"
                      }border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password }</p>
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Recordarme
                  </label>
                </div>
                
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
