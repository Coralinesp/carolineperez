import { useEffect } from "react";

/**
 * Deja la camara de una escena de Spline quieta, sin tocar sus interacciones.
 *
 * En un Mac el pinch del trackpad no llega como gesto propio: Chrome y Firefox
 * lo traducen a un `wheel` con `ctrlKey`, y Safari emite ademas los eventos
 * `gesture*`. Ninguno de los dos lo cubre el ajuste de camara del editor de
 * Spline, porque en el fondo no es la camara: es el zoom del navegador sobre
 * el lienzo. Por eso se sigue colando aunque el zoom este desactivado en la
 * escena.
 *
 * Se filtra en fase de captura y sobre el contenedor, asi el lienzo no llega a
 * verlos. Dos cosas se dejan pasar a proposito:
 *
 * - El `wheel` normal, o Lenis dejaria de desplazar la pagina en cuanto el
 *   cursor pasara por encima de la escena.
 * - Todos los eventos de puntero, que son los que mueven las interacciones de
 *   los objetos. Aqui no se toca ni uno.
 */
export default function useBlockSceneZoom(ref, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const block = (event) => {
      // Rueda a secas: es scroll de pagina, no pinch. Sigue su camino.
      if (event.type === "wheel" && !event.ctrlKey) return;
      // Un dedo es un toque, no un pellizco.
      if (event.touches && event.touches.length < 2) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const types = [
      "wheel",
      "gesturestart",
      "gesturechange",
      "gestureend",
      "touchstart",
      "touchmove",
    ];
    const options = { passive: false, capture: true };

    types.forEach((type) => el.addEventListener(type, block, options));
    return () => types.forEach((type) => el.removeEventListener(type, block, options));
  }, [ref, enabled]);
}
