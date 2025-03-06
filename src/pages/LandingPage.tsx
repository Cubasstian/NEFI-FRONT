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

  const features = [
    {
      icon: <Smartphone className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Tarjetas NFC',
      description: 'Comparte tu perfil digital con solo acercar tu tarjeta a cualquier smartphone compatible con NFC.'
    },
    {
      icon: <Users className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Perfiles Personalizables',
      description: 'Personaliza tu perfil con tus datos, redes sociales, fotos y toda la información que desees compartir.'
    },
    {
      icon: <Share2 className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Fácil de Compartir',
      description: 'Comparte tu perfil mediante URL, código QR o directamente con tu tarjeta NFC.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Estadísticas',
      description: 'Conoce cuántas personas han visitado tu perfil y qué enlaces han sido más utilizados.'
    },
    {
      icon: <Shield className="h-10 w-10 text-[#00C2FF]" />,
      title: 'Seguridad',
      description: 'Tus datos están seguros con nosotros. Controla qué información quieres compartir.'
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
      price: '0',
      features: [
        { text: 'Perfil digital básico', included: true },
        { text: 'URL personalizada', included: true },
        { text: 'Hasta 5 enlaces de redes sociales', included: true },
        { text: 'Estadísticas básicas', included: true },
        { text: 'Tarjeta NFC', included: false },
        { text: 'Diseños premium', included: false },
        { text: 'Soporte prioritario', included: false },
        { text: 'Múltiples perfiles', included: false }
      ],
      cta: 'Comenzar Gratis',
      popular: false
    },
    {
      name: 'Premium',
      price: '9.99',
      features: [
        { text: 'Perfil digital completo', included: true },
        { text: 'URL personalizada', included: true },
        { text: 'Enlaces ilimitados', included: true },
        { text: 'Estadísticas avanzadas', included: true },
        { text: 'Tarjeta NFC', included: true },
        { text: 'Diseños premium', included: true },
        { text: 'Soporte prioritario', included: true },
        { text: 'Múltiples perfiles', included: false }
      ],
      cta: 'Obtener Premium',
      popular: true
    },
    {
      name: 'Empresarial',
      price: '29.99',
      features: [
        { text: 'Perfiles digitales completos', included: true },
        { text: 'URLs personalizadas', included: true },
        { text: 'Enlaces ilimitados', included: true },
        { text: 'Estadísticas avanzadas', included: true },
        { text: 'Tarjetas NFC (5 unidades)', included: true },
        { text: 'Diseños premium y personalizados', included: true },
        { text: 'Soporte prioritario 24/7', included: true },
        { text: 'Hasta 10 perfiles', included: true }
      ],
      cta: 'Contactar Ventas',
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
      question: '¿Puedo cambiar de plan en cualquier momento?',
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
                Tu Perfil Digital en una Tarjeta
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 font-lemon">
                Comparte toda tu información profesional con un simple toque. Conecta tu mundo digital con el físico mediante nuestra tecnología NFC.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register" 
                  className="px-4 sm:px-6 py-2 sm:py-3 text-center rounded-md bg-[#FFFFFF] text-[#00C2FF] font-medium font-lemon hover:bg-[#E6E7E8] transition duration-150"
                >
                  Comenzar Ahora
                </Link>
                <a 
                  href="#features" 
                  className="px-4 sm:px-6 py-2 sm:py-3 text-center rounded-md bg-[#00C2FF] text-[#0A2640] font-medium font-lemon hover:bg-[#99D9F2] transition duration-150"
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
              <div key={index} className="bg-[#FFFFFF] p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="mb-2 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-[#0A2640] font-lemon">
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
              Cómo Funciona
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#0A2640] max-w-2xl sm:max-w-3xl mx-auto font-lemon">
              En tres simples pasos, tendrás tu perfil digital listo para compartir.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="bg-[#E6E7E8] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold text-[#00C2FF] font-montserrat">1</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                Regístrate
              </h3>
              <p className="text-sm sm:text-base text-[#0A2640] font-lemon">
                Crea tu cuenta y elige el plan que mejor se adapte a tus necesidades.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#E6E7E8] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold text-[#00C2FF] font-montserrat">2</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                Personaliza tu Perfil
              </h3>
              <p className="text-sm sm:text-base text-[#0A2640] font-lemon">
                Añade tu información, enlaces a redes sociales, fotos y todo lo que quieras mostrar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#E6E7E8] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold text-[#00C2FF] font-montserrat">3</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0A2640] mb-1 sm:mb-2 font-montserrat">
                Comparte
              </h3>
              <p className="text-sm sm:text-base text-[#0A2640] font-lemon">
                Recibe tu tarjeta NFC y comienza a compartir tu perfil con un simple toque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#E6E7E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A2640] mb-2 sm:mb-4 font-montserrat">
              Planes y Precios
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#0A2640] max-w-2xl sm:max-w-3xl mx-auto font-lemon">
              Elige el plan que mejor se adapte a tus necesidades y comienza a disfrutar de todos los beneficios.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`bg-[#FFFFFF] p-4 sm:p-6 rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl ${plan.popular ? 'border-2 border-[#00C2FF] transform scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-[#00C2FF] text-[#0A2640] text-center py-1 sm:py-2 font-medium font-montserrat">
                    Más Popular
                  </div>
                )}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0A2640] mb-2 sm:mb-4 font-montserrat">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-2 sm:mb-4">
                    <span className="text-2xl sm:text-4xl font-extrabold text-[#0A2640] font-montserrat">${plan.price}</span>
                    <span className="text-sm sm:text-base text-[#0A2640] ml-1 font-lemon">/mes</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-4 sm:h-5 w-4 sm:w-5 text-[#00C2FF] mr-1 sm:mr-2 flex-shrink-0" />
                        ) : (
                          <X className="h-4 sm:h-5 w-4 sm:w-5 text-[#0A2640] mr-1 sm:mr-2 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-sm sm:text-base text-[#0A2640] font-lemon' : 'text-sm sm:text-base text-[#E6E7E8] font-lemon'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to="/register" 
                    className={`block w-full py-2 sm:py-3 px-2 sm:px-4 rounded-md text-center font-medium ${
                      plan.popular 
                        ? 'bg-[#00C2FF] text-[#0A2640] hover:bg-[#99D9F2] font-montserrat' 
                        : 'bg-[#E6E7E8] text-[#0A2640] hover:bg-[#D3D4D5] font-lemon'
                    } transition duration-150`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0A2640] mb-2 sm:mb-4 font-montserrat">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-[#0A2640] max-w-2xl sm:max-w-3xl mx-auto font-lemon">
              Descubre cómo NEFI ha ayudado a profesionales y empresas a mejorar su presencia digital.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#FFFFFF] p-4 sm:p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-2 sm:mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-8 sm:w-12 h-8 sm:h-12 rounded-full mr-2 sm:mr-4"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-[#0A2640] font-montserrat">{testimonial.name}</h4>
                    <p className="text-xs sm:text-sm text-[#0A2640] font-lemon">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-[#0A2640] italic font-lemon">"{testimonial.quote}"</p>
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
              Encuentra respuestas a las preguntas más comunes sobre nuestro servicio.
            </p>
          </div>
          
          <div className="space-y-2 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#FFFFFF] rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full px-4 sm:px-6 py-2 sm:py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-sm sm:text-base font-medium text-[#0A2640] font-montserrat">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-4 sm:h-5 w-4 sm:w-5 text-[#00C2FF]" />
                  ) : (
                    <ChevronDown className="h-4 sm:h-5 w-4 sm:w-5 text-[#00C2FF]" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-2 sm:pb-4">
                    <p className="text-sm sm:text-base text-[#0A2640] font-lemon">{faq.answer}</p>
                  </div>
                )}
              </div>
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