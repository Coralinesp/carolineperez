"use client";
import { useEffect, useState } from "react";
import { useLenis } from "./SmoothScroll";

/** Alto del navbar fijo más un poco de aire, para que el título no quede debajo. */
const NAV_OFFSET = -110;

/**
 * Índice lateral de los case studies.
 *
 * Navega con Lenis en vez de con el salto nativo del ancla: el sitio corre con
 * scroll suave, y un `href="#id"` provoca un salto instantáneo que además deja
 * el título tapado por el navbar fijo.
 *
 * La sección activa se detecta observando cuál cruza la franja superior de la
 * ventana, no con `hashchange`: ese evento sólo se dispara al pulsar un enlace,
 * así que al desplazarse a mano el índice se quedaba congelado.
 */
export default function CaseStudyNav({ sections, className = "" }) {
  const [active, setActive] = useState(sections[0]?.id);
  const lenisRef = useLenis();

  useEffect(() => {
    const targets = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Franja estrecha bajo el navbar: la sección activa es la que la ocupa.
      { rootMargin: "-18% 0px -72% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  const goTo = (event, id) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    if (lenisRef?.current) lenisRef.current.scrollTo(el, { offset: NAV_OFFSET });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Secciones del caso"
      className={`md:w-1/4 w-full self-start md:sticky md:top-32 ${className}`}
    >
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium md:flex-col md:gap-4">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => goTo(event, section.id)}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex items-center gap-2 transition-colors duration-200 ${
                  isActive ? "font-semibold text-[#385BF0]" : "text-black/45 hover:text-[#385BF0]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-px transition-all duration-300 ${
                    isActive ? "w-6 bg-[#385BF0]" : "w-0 bg-transparent"
                  }`}
                />
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
