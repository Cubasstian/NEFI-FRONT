import React from 'react';
import { Link } from 'react-router-dom';
import nefi001 from '../assets/img-001.png';
import { 
  Smartphone, 
  Users, 
  Share2, 
  BarChart, 
  Shield, 
  Zap,
  Check,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Configurable WhatsApp number
const WHATSAPP_NUMBER = "+1234567890"; // Change this to your desired number

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Features array
  const features = [
    {
      icon: <Smartphone className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Tarjetas NFC',
      description: 'Comparte tu perfil digital con solo acercar tu tarjeta a cualquier smartphone compatible con NFC.'
    },
    {
      icon: <Share2 className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Fácil de Compartir',
      description: 'Comparte tu perfil mediante URL, código QR o directamente con tu tarjeta NFC.'
    },
    {
      icon: <Users className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Perfiles Personalizables',
      description: 'Personaliza tu perfil con tus datos, redes sociales, fotos y toda la información que desees compartir.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Estadísticas',
      description: 'Conoce cuántas personas han visitado tu perfil y qué enlaces han sido más utilizados.'
    },
    {
      icon: <Shield className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Seguridad',
      description: 'Tus datos están protegidos. Tú decides qué datos compartir y con quién.'
    },
    {
      icon: <Zap className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Actualización Instantánea',
      description: 'Actualiza tu información en cualquier momento y los cambios se reflejan al instante.'
    }
  ];

  const plans = [
    {
      name: 'Gratuito',
      price: '$0/MES',
      features: [
        { text: 'PERFIL DIGITAL BÁSICO.', included: true },
        { text: 'URL PERSONALIZADA.', included: true },
        { text: 'HASTA 5 ENLACES DE REDES SOCIALES.', included: true },
        { text: 'ESTADÍSTICAS.', included: false },
        { text: 'DISEÑO PREMIUM.', included: false },
        { text: 'SOPORTE PRIORITARIO.', included: false },
        { text: 'MÚLTIPLE PERFILES.', included: false }
      ],
      cta: 'COMENZAR GRATIS',
      popular: false
    },
    {
      name: 'Premium',
      price: '$49.999/MES',
      features: [
        { text: 'PERFIL DIGITAL COMPLETO.', included: true },
        { text: 'URL PERSONALIZADA.', included: true },
        { text: 'ENLACES ILIMITADOS.', included: true },
        { text: 'ESTADÍSTICAS AVANZADAS.', included: true },
        { text: 'DISEÑO PREMIUM.', included: true },
        { text: 'SOPORTE PRIORITARIO.', included: true },
        { text: 'MÚLTIPLE PERFILES.', included: false }
      ],
      cta: 'OBTENER PREMIUM',
      popular: true
    },
    {
      name: 'Micro Empresa',
      price: '$120.000/MES',
      features: [
        { text: 'PERFIL DIGITAL COMPLETO.', included: true },
        { text: 'URL PERSONALIZADA.', included: true },
        { text: 'ENLACES ILIMITADOS.', included: true },
        { text: 'ESTADÍSTICAS AVANZADAS.', included: true },
        { text: 'DISEÑOS PREMIUM Y.', included: true },
        { text: 'SOPORTE PRIORITARIO.', included: true },
        { text: 'HASTA 10 PERFILES.', included: true }
      ],
      cta: 'CONTACTAR CON UN ASESOR',
      popular: false
    },
    {
      name: 'Empresarial',
      price: '$199.999/MES',
      features: [
        { text: 'PERFIL DIGITAL COMPLETO.', included: true },
        { text: 'URL PERSONALIZADA.', included: true },
        { text: 'ENLACES ILIMITADOS.', included: true },
        { text: 'ESTADÍSTICAS AVANZADAS.', included: true },
        { text: 'DISEÑOS PREMIUM Y.', included: true },
        { text: 'SOPORTE PRIORITARIO.', included: true },
        { text: 'PERFILES ILIMITADOS.', included: true }
      ],
      cta: 'CONTACTAR CON UN ASESOR',
      popular: false
    }
  ];

  const faqs = [
    {
      question: '¿Cómo funciona la tarjeta NFC?',
      answer: 'Nuestra tarjeta NFC contiene un chip que almacena la URL de tu perfil digital. Al acercarla a un smartphone compatible con NFC, el teléfono detectará la tarjeta y abrirá automáticamente tu perfil en el navegador.'
    },
    {
      question: '¿Necesito la tarjeta NFC para usar el servicio?',
      answer: 'No, puedes usar nuestro servicio sin la tarjeta NFC. Podrás compartir tu perfil mediante una URL o código QR. La tarjeta NFC es una forma más conveniente de compartir tu perfil.'
    },
    {
      question: '¿Puedo actualizar mi información después de recibir la tarjeta?',
      answer: 'Sí, puedes actualizar tu información en cualquier momento desde tu panel de control. La tarjeta NFC contiene un enlace a tu perfil, por lo que cualquier cambio que hagas se reflejará instantáneamente cuando alguien acceda a tu perfil.'
    },
    {
      question: '¿Cuánto tiempo tarda en llegar la tarjeta NFC?',
      answer: 'El tiempo de entrega depende de tu ubicación. Generalmente, las tarjetas se entregan en un plazo de 3 a 7 días hábiles después de la confirmación del pedido.'
    },
    {
      question: '¿Puedo cambiar el plan en cualquier momento?',
      answer: 'Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu panel de control. Si actualizas, se te cobrará la diferencia prorrateada. Si degradas, el cambio se aplicará al final de tu ciclo de facturación actual.'
    },
    {
      question: '¿Qué pasa si pierdo mi tarjeta NFC?',
      answer: 'Si pierdes tu tarjeta NFC, puedes solicitar una nueva desde tu panel de control. Se te cobrará el costo de la tarjeta más el envío. Tu perfil seguirá activo y accesible mediante la URL o código QR mientras esperas la nueva tarjeta.'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Fotógrafa Freelance',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'NEFI ha revolucionado la forma en que comparto mi portafolio con clientes potenciales. Ahora solo acerco mi tarjeta a su teléfono y pueden ver todo mi trabajo al instante.'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'CEO de TechStart',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Equipamos a todo nuestro equipo de ventas con tarjetas DigiProfile. Ha mejorado significativamente nuestra imagen profesional y facilitado el seguimiento con clientes potenciales.'
    },
    {
      name: 'Laura Martínez',
      role: 'Consultora de Marketing',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      quote: 'Me encanta poder actualizar mi información de contacto en tiempo real. Si cambio de número o añado una nueva red social, no necesito imprimir nuevas tarjetas.'
    }
  ];

  return (
    <div className="bg-[#FFFFFF] font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#0A2640] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-montserrat">
                "Comparte tu información con un solo toque."
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-lemon">
                Tarjetas NFC inteligentes para conectar más rápido y sin complicaciones. Acércate, toca y conéctate al instante con Nefi.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register" 
                  className="px-4 sm:px-6 py-2 sm:py-3 text-center rounded-md bg-[#00C2FF] text-[#FFFFFF] font-medium font-lemon hover:bg-[#99D9F2] transition duration-150"
                >
                  Comienza Ahora
                </Link>
                <a 
                  href="#features" 
                  className="px-4 sm:px-6 py-2 sm:py-3 text-center rounded-md bg-[#FFFFFF] text-[#00C2FF] font-medium font-lemon hover:bg-[#E6E7E8] transition duration-150"
                >
                  Conocer Más
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src={nefi001} 
                alt="Tarjeta NFC y smartphone" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 sm:h-8 w-6 sm:w-8 text-[#FFFFFF]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#00C2FF"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#E6E7E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A2640] mb-2 sm:mb-4 font-montserrat">
              Características Principales
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#0A2640] max-w-2xl sm:max-w-3xl mx-auto font-lemon">
              Descubre todas las ventajas que NEFI ofrece para tu presencia digital profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#0A2640] p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="mb-2 sm:mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#FFFFFF] mb-1 sm:mb-2 text-left font-montserrat">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-[#FFFFFF] text-left font-lemon">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A2640] mb-2 sm:mb-4 font-montserrat">
              ¿Cómo Funciona?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#0A2640] max-w-2xl sm:max-w-3xl mx-auto font-lemon">
              En solo tres simples pasos, activa tu perfil digital y compártelo al instante
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-6 sm:space-x-8 md:space-x-12">
            <div className="text-center">
              <div className="bg-[#00C2FF] rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold text-[#FFFFFF] font-montserrat">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                Regístrate
              </h3>
              <p className="text-sm sm:text-base text-[#0A2640] max-w-xs text-center font-lemon">
                Crea tu cuenta y selecciona el plan que mejor se adapte a tus necesidades.
              </p>
            </div>
            <div className="border-t-2 border-[#0A2640] w-16 sm:w-24"></div>
            <div className="text-center">
              <div className="bg-[#00C2FF] rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold text-[#FFFFFF] font-montserrat">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                Configura tu perfil
              </h3>
              <p className="text-sm sm:text-base text-[#0A2640] max-w-xs text-center font-lemon">
                Agrega tu información, enlaces estratégicos y detalles clave para tu red de contactos.
              </p>
            </div>
            <div className="border-t-2 border-[#0A2640] w-16 sm:w-24"></div>
            <div className="text-center">
              <div className="bg-[#00C2FF] rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold text-[#FFFFFF] font-montserrat">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                Conéctate al instante
              </h3>
              <p className="text-sm sm:text-base text-[#0A2640] max-w-xs text-center font-lemon">
                Recibe tu tarjeta NFC y comparte tu perfil profesional con un solo toque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#0A2640] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-2 sm:mb-4 font-montserrat">
              Planes y Precios
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#FFFFFF] max-w-2xl sm:max-w-3xl mx-auto font-lemon">
              Elige el plan que mejor se adapte a tus necesidades y comienza a disfrutar de todos los beneficios de NEFI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto sm:max-w-none">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-[#FFFFFF] p-3 sm:p-4 rounded-xl shadow-md overflow-hidden transition duration-300 hover:shadow-xl ${plan.popular ? 'border-2 border-[#00C2FF] transform scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-[#00C2FF] text-[#0A2640] text-center py-1 sm:py-1.5 font-medium font-montserrat text-sm">
                    Más Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-1 sm:mb-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#0A2640] font-montserrat">{plan.price}</span>
                  </div>
                  <ul className="space-y-1 sm:space-y-2 mb-2 sm:mb-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-3 sm:h-4 w-3 sm:w-4 text-[#00C2FF] mr-1 sm:mr-1.5 flex-shrink-0" />
                        ) : (
                          <X className="h-3 sm:h-4 w-3 sm:w-4 text-[#0A2640] mr-1 sm:mr-1.5 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-xs sm:text-sm text-[#0A2640] font-lemon' : 'text-xs sm:text-sm text-[#E6E7E8] font-lemon'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to="/register" 
                    className="block w-full py-1 sm:py-2 px-2 sm:px-3 rounded-md text-center font-medium bg-[#00C2FF] text-[#0A2640] hover:bg-[#99D9F2] font-montserrat text-sm sm:text-base transition duration-150"
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* FAQ Section */}
      <section id="faq" className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#E6E7E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A2640] mb-2 sm:mb-4 font-montserrat">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#0A2640] font-lemon">
              Respuestas de las preguntas más comunes sobre nuestros servicios.
            </p>
          </div>
          
          <div className="space-y-2 sm:space-y-4">
            {faqs.map((faq, index) => (
              <button
                key={index}
                className="w-full bg-[#00C2FF] text-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-left focus:outline-none flex justify-between items-center"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-sm sm:text-base font-medium text-[#FFFFFF] font-montserrat">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-white" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white" />
                )}
                {openFaq === index && (
                  <div className="mt-2">
                    <p className="text-sm sm:text-base text-[#FFFFFF] font-lemon">{faq.answer}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#0A2640] text-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 font-montserrat">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 max-w-2xl sm:max-w-3xl mx-auto font-lemon">
            Únete a miles de profesionales que ya están utilizando NEFI para mejorar su presencia digital.
          </p>
          <Link 
            to="/register" 
            className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-[#FFFFFF] text-[#00C2FF] font-medium font-lemon hover:bg-[#E6E7E8] transition duration-150"
          >
            Crear Mi Perfil
          </Link>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=Hola!%20Quiero%20más%20información%20sobre%20NEFI`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] p-3 sm:p-4 rounded-full shadow-lg hover:bg-[#20bd5a] transition duration-300 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-8 sm:w-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.105.543 4.088 1.496 5.836L0 24l6.352-1.668A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.543 17.395c-.305.855-.885 1.543-1.73 1.885-.35.14-.74.236-1.176.283-.702.076-1.408-.02-2.058-.283-.875-.35-1.682-.885-2.43-1.588-.746-.702-1.287-1.518-1.628-2.43-.14-.35-.236-.74-.283-1.176-.02-.21-.035-.42-.035-.627 0-.305.087-.604.262-.855l.236-.35c.14-.21.35-.35.568-.35h.35c.21 0 .42.105.568.283.613.702 1.287 1.287 2.058 1.682.175.087.35.14.543.14.14 0 .262-.035.385-.105.14-.087.262-.21.35-.35.087-.175.14-.35.14-.543 0-.14-.035-.262-.087-.385-.437-1.137-1.43-2.058-2.605-2.605-.175-.087-.35-.14-.543-.14-.087 0-.175.017-.262.052-.087.035-.175.087-.236.157-.087.105-.14.236-.175.367-.035.14-.052.283-.052.437 0 .21.035.42.105.613.525 1.518 1.682 2.732 3.152 3.5.21.105.437.175.682.175z"/>
        </svg>
      </a>
    </div>
  );
};

export default LandingPage;