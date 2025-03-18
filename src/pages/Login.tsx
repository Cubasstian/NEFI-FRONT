import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '@/store/auth/authUser';
import { useEmpresaStore } from '@/store/auth/authEmpresa';
import { auth, db } from '@/config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import nefiLogo from '../assets/nefi.png';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, isLoading: userLoading } = useAuthStore();
  const { loginEmpresa, isLoading: empresaLoading } = useEmpresaStore();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const correoInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: { correo: '', password: '' },
    validationSchema: Yup.object({
      correo: Yup.string().email('Debe ser un correo válido').required('Campo obligatorio'),
      password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Campo obligatorio'),
    }),
    onSubmit: async ({ correo, password }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, correo, password);
        const user = userCredential.user;
        const userRef = doc(db, "usuarios", user.uid);
        const empresaRef = doc(db, "empresas", user.uid);
        const [userSnap, empresaSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(empresaRef)
        ]);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          navigate(userData.rol === "ADMIN" ? '/admin' : `/profile/${user.uid}`);
        } else if (empresaSnap.exists()) {
          navigate(`/profile/${user.uid}`);
        }
      } catch (error) {
        console.error("Error en el login:", error);
      }
    },
  });

  useEffect(() => {
    if (correoInputRef.current) {
      correoInputRef.current.focus();
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      const userRef = doc(db, "usuarios", auth.currentUser?.uid || "");
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        navigate(userData.rol === "ADMIN" ? "/admin" : `/profile/${userData.id}`);
      }
    } catch (error) {
      console.error("Error con Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
        {/* Formulario */}
        <div className="w-full md:w-1/2 bg-white p-6">
          <div className="flex justify-center mb-6">
            <img src={nefiLogo} alt="NEFI Logo" className="h-16 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Iniciar Sesión</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
              <input 
                ref={correoInputRef}
                type="email" 
                id="correo" 
                name="correo" 
                placeholder="Tu correo"
                value={formik.values.correo} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
                  formik.errors.correo && formik.touched.correo ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.correo && formik.errors.correo && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.correo}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password" 
                placeholder="Tu contraseña"
                value={formik.values.password} 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm pr-8 ${
                  formik.errors.password && formik.touched.password ? 'border-red-500' : ''
                }`}
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className="absolute right-2 top-1/2 translate-y-1 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-800 to-cyan-500 text-white font-medium py-2 px-4 rounded-md hover:from-blue-900 hover:to-cyan-600 transition-all flex items-center justify-center gap-1 text-sm"
            >
              <LogIn size={16} /> {userLoading || empresaLoading ? "Ingresando..." : "Ingresar"}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500 hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>

            <button 
              onClick={handleGoogleSignIn} 
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all text-sm"
            >
              <FcGoogle className="h-4 w-4" /> Google
            </button>
          </form>
        </div>

        {/* Sección azul con descripción sobre NEFI */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-800 to-cyan-500 p-6 text-white items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">NEFI: Tarjetas NFC Personalizadas</h2>
            <p className="text-sm leading-relaxed max-w-md">
              NEFI te permite crear y gestionar tarjetas NFC personalizadas para compartir tu información de contacto, enlaces o contenido digital de forma rápida y moderna. Conecta con el mundo con un solo toque.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;