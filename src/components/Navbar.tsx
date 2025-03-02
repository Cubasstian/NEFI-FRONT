import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import nefiLogo from '../assets/nefi.png';

// Importa la imagen si usas un bundler como Vite o Create React App
// import nefiLogo from '../assets/nefi.png'; // Ajusta la ruta según tu estructura

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#FFFFFF] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={nefiLogo}
                  className="h-8 w-auto" // Tamaño ajustado
                />
              </Link>
            </div>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-[#0A2640] hover:text-[#00C2FF] transition duration-150">
              Inicio
            </Link>
            <Link to="/#features" className="px-3 py-2 rounded-md text-sm font-medium text-[#0A2640] hover:text-[#00C2FF] transition duration-150">
              Características
            </Link>
            <Link to="/#pricing" className="px-3 py-2 rounded-md text-sm font-medium text-[#0A2640] hover:text-[#00C2FF] transition duration-150">
              Planes
            </Link>
            <Link to="/#faq" className="px-3 py-2 rounded-md text-sm font-medium text-[#0A2640] hover:text-[#00C2FF] transition duration-150">
              FAQ
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#00C2FF] hover:text-[#99D9F2] flex items-center transition duration-150">
              <LogIn className="h-4 w-4 mr-1 text-[#00C2FF]" />
              Iniciar Sesión
            </Link>
            <Link to="/register" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-[#0A2640] bg-[#00C2FF] hover:bg-[#99D9F2] flex items-center transition duration-150">
              <User className="h-4 w-4 mr-1 text-[#0A2640]" />
              Registrarse
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#0A2640] hover:text-[#FFFFFF] hover:bg-[#00C2FF] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00C2FF]"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#FFFFFF]">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#0A2640] hover:text-[#00C2FF] hover:bg-[#E6E7E8] transition duration-150"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/#features"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#0A2640] hover:text-[#00C2FF] hover:bg-[#E6E7E8] transition duration-150"
              onClick={() => setIsOpen(false)}
            >
              Características
            </Link>
            <Link
              to="/#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#0A2640] hover:text-[#00C2FF] hover:bg-[#E6E7E8] transition duration-150"
              onClick={() => setIsOpen(false)}
            >
              Planes
            </Link>
            <Link
              to="/#faq"
              className="block px-3 py-2 rounded-md text-base font-medium text-[#0A2640] hover:text-[#00C2FF] hover:bg-[#E6E7E8] transition duration-150"
              onClick={() => setIsOpen(false)}
            >
              FAQ
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-[#E6E7E8] bg-[#FFFFFF]">
            <div className="flex items-center px-5">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-[#00C2FF] hover:text-[#99D9F2] transition duration-150"
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="block ml-4 px-3 py-2 rounded-md text-base font-medium text-[#0A2640] bg-[#00C2FF] hover:bg-[#99D9F2] transition duration-150"
                onClick={() => setIsOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;