// src/pages/Register.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useFormik } from "formik";
import * as Yup from "yup"; 
import { UserData, EmpresaData } from '../types';
import { auth } from '@/config/firebaseConfig';
import { useAuthStore } from '@/store/auth/userAuthStore';
import { usePlanStore } from '@/store/plan/usePlanStore';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  formik: any;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type, formik }) => (
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
      className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
        formik.touched[id] && formik.errors[id] ? 'border-red-500' : ''
      }`}
    />
    {formik.touched[id] && formik.errors[id] && (
      <p className="text-red-500 text-sm mt-1">{formik.errors[id]}</p>
    )}
  </div>
);

const AccountTypeToggle: React.FC<{ accountType: string; setAccountType: React.Dispatch<React.SetStateAction<"personal" | "business">>; formik: any }> = ({ accountType, setAccountType, formik }) => (
  <div className="flex mb-6">
    <button
      type="button"
      className={`flex-1 py-3 px-4 flex items-center justify-center ${accountType === 'personal' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } rounded-l-md transition duration-150`}
      onClick={() => {
        setAccountType('personal');
        formik.setFieldValue('accountType', 'personal');
      }}
    >
      <User className="h-5 w-5 mr-2" />
      Personal
    </button>
    <button
      type="button"
      className={`flex-1 py-3 px-4 flex items-center justify-center ${accountType === 'business' ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } rounded-r-md transition duration-150`}
      onClick={() => {
        setAccountType('business');
        formik.setFieldValue('accountType', 'business');
      }}
    >
      <Briefcase className="h-5 w-5 mr-2" />
      Empresa
    </button>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading, error } = useAuthStore();
  const { plans, fetchPlans } = usePlanStore();
  const [accountType, setAccountType] = useState<"personal" | "business">("personal");

  useEffect(() => {
    fetchPlans(); 
  }, [fetchPlans]);

  const validationSchema = Yup.object().shape({
    accountType: Yup.string().required(),
    nombre: Yup.string().required("El nombre es obligatorio"),
    correo: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
    telefono: Yup.string().matches(/^\+?\d{10,15}$/, "Número de teléfono inválido").required("El teléfono es obligatorio"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    stack: Yup.string().required("El stack es obligatorio"),
    plan: Yup.string().required("El plan es obligatorio"),
    nit: Yup.string().test('nit-required-for-business', "El NIT es obligatorio para empresas", function (value) {
      const { accountType } = this.parent;
      return accountType === 'business' ? !!value : true;
    }),
  });

  const formik = useFormik({
    initialValues: {
      accountType: "personal",
      nombre: "",
      correo: "",
      password: "",
      confirmPassword: "",
      telefono: "",
      direccion: "",
      stack: "",
      plan: "",
      nit: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const { correo, password, nombre, telefono, direccion, stack, plan, nit } = values;

        const data: UserData | EmpresaData = values.accountType === "personal"
          ? {
              uid: "",
              nombre,
              correo,
              telefono,
              direccion,
              stack,
              plan: plan,
              estado: true,
              rol: "USER",
              acercade: "",
              redes: [],
              username: nombre.toLowerCase().replace(" ", "_"),
            }
          : {
              uid: "", 
              nombre,
              correo,
              telefono,
              direccion,
              stack,
              plan: plan ,
              estado: true,
              rol: "USER",
              acercade: "",
              redes: [],
              nit,
              username: nombre.toLowerCase().replace(" ", "_"),
            };

        await register(correo, password, data, values.accountType === "personal" ? "user" : "empresa");
        resetForm();
        navigate('/login');
      } catch (err) {
        console.error("Error en el registro:", err);
      }
    },
  });



  // const handleGoogleSignIn = async () => {
  //   try {
  //     await loginWithGoogle();
  //     navigate('/profile/' + (await auth.currentUser)?.uid);
  //   } catch (error) {
  //     console.error("Error con Google:", error);
  //   }
  // };
  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/login');
    } catch (error) {
      console.error("Error con Google:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-cyan-500 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Crea tu cuenta en NEFI</h2>
        <p className="text-center text-gray-600 mb-6">Únete a NEFI hoy mismo</p>

        <AccountTypeToggle accountType={accountType} setAccountType={setAccountType} formik={formik} />

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <InputField label="Nombre" id="nombre" type="text" formik={formik} />
          {accountType === "business" && <InputField label="NIT" id="nit" type="text" formik={formik} />}
          <InputField label="Teléfono" id="telefono" type="text" formik={formik} />
          <InputField label="Dirección" id="direccion" type="text" formik={formik} />
          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
              Plan
            </label>
            <select
              id="plan"
              name="plan"
              value={formik.values.plan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                formik.touched.plan && formik.errors.plan ? 'border-red-500' : ''
              }`}
            >
              <option value="" disabled>Selecciona un plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre} - {plan.precio}
                </option>
              ))}
            </select>
            {formik.touched.plan && formik.errors.plan && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.plan}</p>
            )}
          </div>
          <InputField label="Stack" id="stack" type="text" formik={formik} />
          <InputField label="Correo Electrónico" id="correo" type="email" formik={formik} />
          <InputField label="Contraseña" id="password" type="password" formik={formik} />
          <InputField label="Confirmar Contraseña" id="confirmPassword" type="password" formik={formik} />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-800 to-cyan-500 text-white font-bold py-3 px-6 rounded-md shadow-md hover:from-blue-900 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isLoading ? "Registrando..." : "Crear Cuenta"}
            <ArrowRight size={20} />
          </button>

          <div className="mt-4">
            <button 
              onClick={handleGoogleSignIn} 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-all duration-300"
            >
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