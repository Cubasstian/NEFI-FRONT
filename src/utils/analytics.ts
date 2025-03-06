declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

/**
 * Registra una vista de página en Google Analytics
 * @param url - URL de la página visitada
 */
export const pageview = (url: string) => {
    if (window.gtag) {
        window.gtag("config", "G-TNR2VHHKCM", {
            page_path: url,
        });
    }
};

/**
 * Registra un evento personalizado en Google Analytics
 * @param action - Nombre del evento
 * @param params - Parámetros adicionales del evento
 */
export const event = (action: string, params: object) => {
    if (window.gtag) {
        window.gtag("event", action, params);
    }
};
