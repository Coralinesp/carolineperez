import { useI18n } from "../i18n/LanguageContext";

const OPTIONS = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
];

/**
 * Cambio de idioma, discreto, anclado abajo a la izquierda.
 *
 * La píldora oscura es un solo nodo que se desplaza, en vez de encender y
 * apagar el fondo de cada botón: así lo que se anima es un `transform`, que el
 * compositor resuelve sin repintar, y el movimiento explica el cambio mejor que
 * un fundido.
 *
 * Va abajo a la izquierda porque la derecha ya está ocupada: ahí aparece la
 * etiqueta "Show" que sigue al cursor sobre la tarjeta destacada.
 */
export default function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  const activeIndex = OPTIONS.findIndex((option) => option.code === lang);

  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className="fixed bottom-5 left-5 z-50 flex items-center rounded-full border border-black/10 bg-[#f8f8f6]/85 p-1 shadow-[0_6px_20px_rgba(29,33,42,0.10)] backdrop-blur-sm sm:bottom-6 sm:left-6"
    >
      <span
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
        className="absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-full bg-[#1D212A] transition-transform duration-300 ease-out"
      />

      {OPTIONS.map((option) => {
        const isActive = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            lang={option.code}
            onClick={() => setLang(option.code)}
            aria-pressed={isActive}
            // El nombre accesible es el idioma completo: "EN" a secas no dice
            // nada leído en voz alta.
            aria-label={option.name}
            className={`relative z-10 w-9 rounded-full py-1 text-[11px] font-bold uppercase tracking-widest outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#385BF0] ${
              isActive ? "text-white" : "text-black/40 hover:text-[#1D212A]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
