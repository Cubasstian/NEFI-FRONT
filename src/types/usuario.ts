export interface User {
    acercade:  string;
    correo:    string;
    direccion: string;
    estado:    boolean;
    nombre:    string;
    password?:  string;
    plan:      string;
    redes?:     string[];
    rol:       string;
    stack:     string;
    telefono:  string;
    username?:  string;
}