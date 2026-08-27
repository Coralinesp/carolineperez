import { useEffect, useState } from "react";

/**
 * `true` en cuanto el elemento se acerca al viewport, y ya no vuelve atrás.
 *
 * Sirve para no meter lo caro en el commit inicial de la ruta. Al entrar por
 * `/#work` la página salta directamente a una sección de más abajo, así que
 * todo lo que se queda arriba —la escena 3D, el motor de física— se monta más
 * tarde, cuando de verdad se va a ver, en vez de competir por el hilo con el
 * scroll de entrada.
 *
 * Quien lo use tiene que reservar el hueco del contenido diferido, o el salto
 * al ancla caerá en el sitio equivocado.
 */
export default function useNearViewport(ref, rootMargin = "600px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}
