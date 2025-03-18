export interface UserData {
    uid: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    stack: string;
    plan: string; // ID o nombre del plan
    estado: boolean;
    rol: "USER" | "ADMIN";
    acercade: string;
    redes: SocialLink[];
    username: string;
  }
  
  export interface EmpresaData {
    uid: string;
    nombre: string;
    correo: string;
    telefono: string;
    direccion: string;
    stack: string;
    plan: string; // ID o nombre del plan
    estado: boolean;
    rol: "USER" | "ADMIN";
    acercade: string;
    redes: SocialLink[];
    nit: string;
    username: string;
  }
  
  export interface SocialLink {
    platform: string;
    url: string;
    visible: boolean;
  }
  
  export interface Plan {
    id: string;
    name: string;
    price: string;
    features: { text: string; included: boolean }[];
    cta: string;
    popular: boolean;
  }