import React, { useState } from 'react';
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

  const formik = useFormik({
    initialValues: { correo: '', password: '' },
    validationSchema: Yup.object({
      correo: Yup.string().email('Debe ser un correo válido').required('Campo obligatorio'),
      password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Campo obligatorio'),
    }),
    onSubmit: async ({ correo, password }) => {
      try {
        // Autenticamos al usuario en Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, correo, password);
        const user = userCredential.user;

        // Buscamos en Firestore si es un usuario o una empresa
        const userRef = doc(db, "usuarios", user.uid);
        const empresaRef = doc(db, "empresas", user.uid);

        const [userSnap, empresaSnap] = await Promise.all([
          getDoc(userRef),
          getDoc(empresaRef)
        ]);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("Usuario encontrado:", userData);

          if (userData.rol === "ADMIN") {
            navigate('/admin');
          } else {
            navigate(`/profile/${user.uid}`);
          }
        } else if (empresaSnap.exists()) {
          const empresaData = empresaSnap.data();
          console.log("Empresa encontrada:", empresaData);
          navigate(`/profile/${user.uid}`);
        } else {
          console.error("No se encontró el usuario ni la empresa en Firestore.");
        }
      } catch (error) {
        console.error("Error en el login:", error);
      }
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      const userRef = doc(db, "usuarios", auth.currentUser?.uid || "");
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("Usuario con Google:", userData);
        navigate(userData.rol === "ADMIN" ? "/admin" : `/profile/${userData.id}`);
      }
    } catch (error) {
      console.error("Error con Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        {/* Formulario */}
        <div className="w-full md:w-1/2 bg-white p-10">
          <div className="flex justify-center mb-8">
            <img src={nefiLogo} alt="NEFI Logo" className="h-20 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Iniciar Sesión</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" id="correo" name="correo" placeholder="Ingresa tu correo"
                value={formik.values.correo} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${formik.errors.correo && formik.touched.correo ? 'border-red-500' : ''}`} />
              {formik.touched.correo && formik.errors.correo && <p className="text-red-500 text-sm mt-1">{formik.errors.correo}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Ingresa tu contraseña"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pr-10 ${formik.errors.password && formik.touched.password ? 'border-red-500' : ''}`} />
              <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.password && formik.errors.password && <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>}
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-blue-800 to-cyan-500 text-white font-bold py-3 px-6 rounded-md shadow-md hover:from-blue-900 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2">
              <LogIn size={20} /> {userLoading || empresaLoading ? "Ingresando..." : "Ingresar"}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200 font-medium">Regístrate</Link>
              </p>
            </div>
            <div className="mt-4">
              <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300">
                <FcGoogle className="h-5 w-5" /> Iniciar con Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
