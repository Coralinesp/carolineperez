import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import es from "./es";

/**
 * Idioma del sitio.
 *
 * Las claves del diccionario son el propio texto en inglés, no identificadores
 * inventados (`hero.kicker` y compañía). Dos razones:
 *
 * - El JSX se sigue leyendo: la llamada lleva dentro la frase de verdad, en vez
 *   de un identificador que obliga a ir a buscar qué pone ahí.
 * - Si a una frase le falta traducción, `t` devuelve el original y la página
 *   sale en inglés en vez de romperse o mostrar la clave en crudo. En un sitio
 *   escrito en inglés, ese es el fallback correcto.
 *
 * El precio es que al cambiar un texto en inglés su traducción queda huérfana.
 * Para eso está `npm run i18n:check`, que lista las que sobran y las que faltan.
 */
const LanguageContext = createContext(null);

const STORAGE_KEY = "lang";
export const LANGUAGES = ["en", "es"];

/**
 * El idioma de autor del sitio es el inglés, así que se arranca ahí salvo que
 * la persona ya haya elegido. No se mira `navigator.language` a propósito: el
 * portafolio se enseña a gente de fuera tanto como de dentro, y que la home
 * cambie de idioma según el navegador de quien abre el enlace es una sorpresa,
 * no una comodidad.
 */
const readInitial = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    // Modo privado o cookies bloqueadas: se arranca en inglés y ya.
  }
  return "en";
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readInitial);

  useEffect(() => {
    // `lang` en el html es lo que usan lectores de pantalla para elegir voz y
    // el navegador para partir palabras. Sin esto leería el español en inglés.
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Si no se puede guardar, la elección dura lo que dure la pestaña.
    }
  }, [lang]);

  const t = useCallback((text) => (lang === "es" ? es[text] ?? text : text), [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useI18n necesita estar dentro de <LanguageProvider>");
  return context;
}
