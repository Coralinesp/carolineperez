import { useEffect, useState } from "react";

/**
 * Suscripción a una media query, para poder decidir en JS lo que Tailwind
 * decidiría en CSS.
 *
 * La diferencia con `hidden md:block` es que aquí lo que no aplica no se monta:
 * con clases, las dos variantes de un bloque existen en el DOM y la oculta
 * sigue costando imágenes, observers y — si cuelga del scroll — una escritura
 * de estilo por frame aunque nadie la vea.
 *
 * El valor se lee ya en el inicializador y no en un efecto, para que el primer
 * pintado sea el bueno y no haya un cambio de layout justo después.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
