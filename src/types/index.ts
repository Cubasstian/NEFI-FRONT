export interface UserData {
    uid: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    stack: string;
    plan: string; 
    estado: boolean;
    rol: "USER" | "ADMIN";
    acercade: string;
    redes: SocialLink[];
    username: string;
    avatar?: string
  }
  
  export interface EmpresaData {
    uid: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    stack: string;
    plan: string;
    estado: boolean;
    rol: "USER" | "ADMIN";
    acercade: string;
    redes: SocialLink[];
    nit: string;
    username: string;
    avatar?: string
  }
  
  export interface SocialLink {
    platform?: string;
    url?: string;
    name?:string
    visible?: boolean;
    icon?: string | undefined
    bgColor?: string
    category?: string
  }
  
  export interface Plan {
    id: string;
    nombre: string;
    precio: string;
    features: { text: string; included: boolean }[];
    cta: string;
    popular: boolean;
  }