import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEmpresaStore } from '@/store/auth/authEmpresa';
import { useAuthStore } from '@/store/auth/authUser';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  formik: any;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type, formik = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={formik.values[id]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${formik.touched[id] && formik.errors[id] ? 'border-red-500' : ''
        }`}

    />
    {formik.touched[id] && formik.errors[id] && (
      <p className="text-red-500 text-sm mt-1">{formik.errors[id]}</p>
    )}
  </div>
);

const AccountTypeToggle: React.FC<{ accountType: string; setAccountType: React.Dispatch<React.SetStateAction<"personal" | "business">> }> = ({ accountType, setAccountType }) => (
  <div className="flex mb-6">
    <button
      type="button"
      className={`flex-1 py-3 px-4 flex items-center justify-center ${accountType === 'personal' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } rounded-l-md transition duration-150`}
      onClick={() => setAccountType('personal')}
    >
      <User className="h-5 w-5 mr-2" />
      Personal
    </button>
    <button
      type="button"
      className={`flex-1 py-3 px-4 flex items-center justify-center ${accountType === 'business' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } rounded-r-md transition duration-150`}
      onClick={() => setAccountType('business')}
    >
      <Briefcase className="h-5 w-5 mr-2" />
      Empresa
    </button>
  </div>
);

const Register = () => {
  const navigate = useNavigate()
  const { registerUser, loginWithGoogle, isLoading: userLoading } = useAuthStore();
  const { registerEmpresa, isLoading: empresaLoading } = useEmpresaStore();
  const [accountType, setAccountType] = useState<"personal" | "business">("personal");

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    correo: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
    telefono: Yup.string().matches(/^\+?\d{10,15}$/, "Número de teléfono inválido").required("El teléfono es obligatorio"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    stack: Yup.string().required("El stack es obligatorio"),
    plan: Yup.string().required("El plan es obligatorio"),
    nit: Yup.string(), // Se validará en onSubmit si es "business"
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      correo: "",
      password: "",
      confirmPassword: "",
      telefono: "",
      direccion: "",
      stack: "develop",
      plan: "/planes/LaTXuWc7Ad9aSK3JdUts",
      nit: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (accountType === "business" && !values.nit) {
        alert("El NIT es obligatorio para empresas.");
        return;
      }

      try {
        const { correo, password, nombre, telefono, direccion, stack, plan, nit } = values;

        if (accountType === "personal") {
          await registerUser(correo, password, {
            nombre,
            correo,
            telefono,
            direccion,
            stack,
            plan,
            estado: true,
            rol: "USER",
            acercade: "",
            redes: [],
            username: nombre.toLowerCase().replace(" ", "_"),
          });
          resetForm()
          navigate('/login')
        } else {
          await registerEmpresa(correo, password, {
            nombre,
            correo,
            telefono,
            direccion,
            stack,
            plan,
            estado: true,
            rol: "USER",
            acercade: "",
            redes: [],
            nit,
            username: nombre.toLowerCase().replace(" ", "_"),
          });
          resetForm()
          navigate('/login')
        }
      } catch (error) {
        console.error("Error en el registro:", error);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-cyan-500 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Crea tu cuenta en NEFI</h2>
        <p className="text-center text-gray-600 mb-6">Únete a NEFI hoy mismo</p>

        <AccountTypeToggle accountType={accountType} setAccountType={setAccountType} />

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <InputField label="Nombre" id="nombre" type="text" formik={formik} />
          {accountType === "business" && <InputField label="NIT" id="nit" type="text" formik={formik} required />}
          <InputField label="Teléfono" id="telefono" type="text" formik={formik} />
          <InputField label="Dirección" id="direccion" type="text" formik={formik} />
          <InputField label="Plan" id="plan" type="text" formik={formik} />
          <InputField label="Stack" id="stack" type="text" formik={formik} />
          <InputField label="Correo Electrónico" id="correo" type="email" formik={formik} />
          <InputField label="Contraseña" id="password" type="password" formik={formik} />
          <InputField label="Confirmar Contraseña" id="confirmPassword" type="password" formik={formik} />

          <button type="submit" className="w-full bg-gradient-to-r from-blue-800 to-cyan-500 text-white font-bold py-3 px-6 rounded-md shadow-md hover:from-blue-900 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2">
            {(userLoading || empresaLoading) ? "Registrando..." : "Crear Cuenta"}
            <ArrowRight size={20} />
          </button>

          <div className="mt-4">
            <button onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300">
              <FcGoogle className="h-5 w-5" />
              Registrarse con Google
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200 font-medium">
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
