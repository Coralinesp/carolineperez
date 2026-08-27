"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import projects from "./projects/projects";
import useTilt from "../hooks/useTilt";
import { useLenis } from "./SmoothScroll";

export const services = [
  { alt: "UX/UI Design", image: "/uxui.jpg", category: "UX/UI" },
  { alt: "Frontend Development", image: "/frontend.jpg", category: "Frontend" },
  { alt: "3D Design", image: "/3d.jpg", category: "3D Design" },
];

/** Las portadas rondan 14:9; las tarjetas las uniforman con object-cover. */
const CARD_RATIO = "14 / 9";

/**
 * Tramos del viaje de la tarjeta, medidos sobre el recorrido del destacado: de
 * cuando asoma por abajo hasta que su borde superior toca el de la ventana.
 *
 * El relevo termina justo en 1 a propósito: en ese instante el destacado está
 * exactamente donde el layout lo coloca, que es el punto que medimos como
 * destino. Si acabara antes, la tarjeta se desvanecería a unos píxeles de su
 * sitio y el cambio se vería.
 */
const MOVE = [0.12, 0.9];
const FLIP = [0.3, 0.8];
const HANDOFF = [0.88, 1];

/**
 * Si el proyecto lleva a alguna parte.
 *
 * `null` es lo que llevan los que están en curso y `"/"` los que no tienen caso
 * publicable (NDA). Los segundos apuntarían a la home, así que en la práctica
 * son lo mismo: una tarjeta que no debe comportarse como enlace.
 */
const hasCase = (project) => Boolean(project?.link) && project.link !== "/";

/** Suma de offsets desde `el` hasta `ancestor`, sin incluir el de `ancestor`. */
function offsetWithin(el, ancestor) {
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return { x, y };
}

function ServiceTile({ service, isSelected, onSelect, hidden }) {
  const tilt = useTilt({ max: 12, hoverScale: 1.03, glareColor: "rgba(255,255,255,0.5)" });

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(service.category)}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      aria-label={`Ver proyectos de ${service.alt}`}
      style={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.scale,
        // La seleccionada deja su hueco reservado: la que se ve es la viajera.
        visibility: hidden ? "hidden" : "visible",
      }}
      className={`relative block w-full overflow-hidden rounded-2xl shadow-[0_16px_50px_rgba(29,33,42,0.13)] outline-none focus-visible:ring-4 focus-visible:ring-[#385BF0]/40 ${
        isSelected ? "ring-4 ring-[#385BF0]" : ""
      }`}
    >
      <img
        src={service.image}
        alt={service.alt}
        style={{ aspectRatio: "1240 / 1748" }}
        className="block w-full object-cover"
        loading="lazy"
      />
      <motion.span
        aria-hidden="true"
        style={{ opacity: tilt.glareOpacity, background: tilt.glare }}
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
      />
    </motion.button>
  );
}

/**
 * Tarjeta de la rejilla: sólo la portada, y el título y los datos asomando al
 * pasar por encima.
 *
 * La ficha se pinta siempre y se revela con `opacity`, no se monta al entrar el
 * cursor: así el navegador ya tiene el texto compuesto y no hay reflow en mitad
 * del hover. También responde a `focus-visible`, o con teclado sería invisible.
 *
 * Es un enlace de verdad y no un botón con `navigate`, para que se pueda abrir
 * en otra pestaña. Y sin `useTilt`: son hasta nueve a la vez y cada instancia
 * son seis muelles, así que el hover se resuelve con transiciones de CSS.
 */
function ProjectTile({ project }) {
  const linked = hasCase(project);
  const external = project.link?.startsWith("http");

  const body = (
    <div
      className="relative overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_rgba(29,33,42,0.10)] transition-shadow duration-500 ease-out group-hover:shadow-[0_22px_60px_rgba(29,33,42,0.18)]"
      style={{ aspectRatio: CARD_RATIO }}
    >
      <img
        src={project.cover}
        alt={project.title}
        loading="lazy"
        decoding="async"
        // El zoom sólo en las que llevan a alguna parte: en las demás sería
        // prometer un click que no existe.
        className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
          linked ? "group-hover:scale-[1.04]" : ""
        }`}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-[#1D212A]/95 via-[#1D212A]/75 to-transparent px-5 pb-5 pt-14 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        <h4 className="flex items-start gap-2 font-extrabold uppercase leading-[1.15] tracking-tight text-white text-sm sm:text-base">
          <span className="min-w-0">{project.title}</span>
          {linked && <ArrowUpRight size={16} className="mt-0.5 shrink-0" />}
        </h4>
        <p className="mt-2 line-clamp-2 text-[11px] uppercase leading-relaxed tracking-widest text-white/55">
          {[project.industry, project.toolkit].filter(Boolean).join(" · ")}
        </p>
      </div>
    </div>
  );

  const className =
    "group block rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-[#385BF0]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f8f6]";

  // Mantiene el `group` para que la ficha asome igual, pero sin cursor de enlace
  // ni zoom: se puede leer de qué proyecto es aunque todavía no haya a dónde ir.
  if (!linked) {
    return (
      <li>
        <div className="group block cursor-default rounded-2xl">{body}</div>
      </li>
    );
  }

  return (
    <li>
      {external ? (
        <a href={project.link} target="_blank" rel="noopener noreferrer" className={className}>
          {body}
        </a>
      ) : (
        <Link to={project.link} className={className}>
          {body}
        </Link>
      )}
    </li>
  );
}

export default function WorkShowcase() {
  const [selected, setSelected] = useState("UX/UI");

  const rootRef = useRef(null);
  const slotRefs = useRef([]);
  const featuredRef = useRef(null);
  const landingRef = useRef(null);
  const [geo, setGeo] = useState(null);

  const navigate = useNavigate();
  const lenisRef = useLenis();
  const items = projects.filter((project) => project.tags.includes(selected));
  const service = services.find((entry) => entry.category === selected);
  const selectedIndex = services.findIndex((entry) => entry.category === selected);
  const total = items.length;
  // El destacado se marca en los datos con `featured: true` y es donde aterriza
  // el vuelo; si la categoría no tiene ninguno marcado, cae en el primero. El
  // resto sale entero en la rejilla, sin tener que pasarlos uno a uno.
  const featured = items.find((project) => project.featured) ?? items[0];
  const rest = items.filter((project) => project !== featured);
  const canOpen = hasCase(featured);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const slot = slotRefs.current[selectedIndex];
    const landing = landingRef.current;
    if (!root || !slot || !landing) return;
    if (!slot.offsetWidth || !landing.offsetWidth) return;

    const from = offsetWithin(slot, root);
    const to = offsetWithin(landing, root);

    // Ancho y alto se interpolan por separado: la ilustración es vertical
    // (1240/1748) y el destacado horizontal (14/9), así que además de moverse
    // la tarjeta cambia de proporción para encajar en el destino.
    setGeo({
      fromX: from.x,
      fromY: from.y,
      fromW: slot.offsetWidth,
      fromH: slot.offsetHeight,
      toX: to.x,
      toY: to.y,
      toW: landing.offsetWidth,
      toH: landing.offsetHeight,
    });
  }, [selectedIndex]);

  useLayoutEffect(measure, [measure, selected, total]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /**
   * Al elegir un servicio se desplaza la página hasta el destacado, que es donde
   * el viaje termina. No se anima nada a mano: como el efecto cuelga del scroll,
   * mover el scroll lo reproduce entero. Por eso sigue siendo reversible al
   * subir, se haya llegado por click o por defecto.
   */
  const handleSelect = (category) => {
    setSelected(category);
    const el = featuredRef.current;
    if (!el) return;
    if (lenisRef?.current) lenisRef.current.scrollTo(el, { offset: 0, duration: 1.8 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  // El vuelo: de cuando el destacado asoma por abajo hasta que su borde superior
  // toca el de la ventana. Al colgar del scroll, se deshace solo al subir.
  const { scrollYProgress: travel } = useScroll({
    target: featuredRef,
    offset: ["start end", "start start"],
  });

  const safe = geo ?? { fromX: 0, fromY: 0, fromW: 0, fromH: 0, toX: 0, toY: 0, toW: 0, toH: 0 };
  const travelX = useTransform(travel, MOVE, [safe.fromX, safe.toX]);
  const travelY = useTransform(travel, MOVE, [safe.fromY, safe.toY]);
  const travelW = useTransform(travel, MOVE, [safe.fromW, safe.toW]);
  const travelH = useTransform(travel, MOVE, [safe.fromH, safe.toH]);
  const travelFlip = useTransform(travel, FLIP, [0, 180]);
  const travelOpacity = useTransform(travel, HANDOFF, [1, 0]);
  const featuredOpacity = useTransform(travel, HANDOFF, [0, 1]);

  // La tarjeta viajera es la que se ve en el hueco del servicio elegido, así que
  // necesita su propio tilt: si no, esa card sería la única sin efecto 3D.
  const travelTilt = useTilt({ max: 12, hoverScale: 1.03, glareColor: "rgba(255,255,255,0.5)" });
  // Deja de capturar el ratón una vez cede el relevo, o taparía al destacado con
  // un elemento invisible (opacity 0 sigue recibiendo eventos).
  const travelPointer = useTransform(travel, (p) => (p >= HANDOFF[1] ? "none" : "auto"));
  // Y se retira del pintado en el mismo instante: con `opacity: 0` el navegador
  // le sigue manteniendo su capa (dos portadas grandes y una `perspective`).
  const travelVisibility = useTransform(travel, (p) => (p >= HANDOFF[1] ? "hidden" : "visible"));

  const tilt = useTilt({ max: 10, hoverScale: 1.02, glareColor: "rgba(255,255,255,0.55)" });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 32, stiffness: 700, mass: 0.35 });
  const springY = useSpring(cursorY, { damping: 32, stiffness: 700, mass: 0.35 });
  const [showCursor, setShowCursor] = useState(false);

  const handleMove = (e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    tilt.onMouseMove(e);
  };

  const openFeatured = () => {
    if (!canOpen) return;
    if (featured.link.startsWith("http")) window.open(featured.link, "_blank", "noopener");
    else navigate(featured.link);
  };

  const face = "absolute inset-0 h-full w-full overflow-hidden rounded-2xl [backface-visibility:hidden]";

  return (
    <section ref={rootRef} className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16">
      <h2 className="text-center font-extrabold uppercase leading-[0.95] tracking-tight text-[#1D212A] text-[clamp(1.9rem,4.6vw,4rem)]">
        What can I do for you?
      </h2>
      <p className="mx-auto mt-5 mb-12 max-w-md text-center text-sm text-black/45 sm:text-base md:mb-16">
        Pick one to see the projects behind it.
      </p>

      <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        {services.map((entry, i) => (
          <li
            key={entry.image}
            ref={(el) => (slotRefs.current[i] = el)}
            className="[perspective:1100px]"
          >
            <ServiceTile
              service={entry}
              isSelected={selected === entry.category}
              onSelect={handleSelect}
              hidden={selected === entry.category}
            />
          </li>
        ))}
      </ul>

      {/* Aire entre los servicios y el destacado */}
      <div className="h-[18vh] md:h-[26vh]" aria-hidden="true" />

      {/* Destacado: aquí aterriza el vuelo. El relleno superior es lo que deja el
          contenido por debajo del navbar cuando `handleSelect` alinea el borde
          de este bloque con el de la ventana. */}
      {featured && (
        <div ref={featuredRef} className="pt-16 md:pt-24">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-12">
            {/* Izquierda: título del destacado */}
            <motion.div style={{ opacity: featuredOpacity }} className="lg:text-right">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#385BF0]">
                Featured
              </p>
              <h3 className="font-extrabold uppercase leading-[1.02] tracking-tight text-[#1D212A] text-[clamp(1.5rem,3vw,2.75rem)]">
                {featured.title}
              </h3>
            </motion.div>

            {/* Centro: la tarjeta. Su posición de layout es el destino del viaje. */}
            <div
              ref={landingRef}
              className="relative mx-auto w-full max-w-[440px] lg:w-[34vw] lg:max-w-[520px]"
              style={{ aspectRatio: CARD_RATIO }}
            >
              <motion.div style={{ opacity: featuredOpacity }} className="absolute inset-0">
                <motion.button
                  type="button"
                  onClick={openFeatured}
                  onMouseMove={handleMove}
                  onMouseEnter={canOpen ? () => setShowCursor(true) : undefined}
                  onMouseLeave={() => {
                    setShowCursor(false);
                    tilt.onMouseLeave();
                  }}
                  aria-label={canOpen ? `Ver ${featured.title}` : undefined}
                  aria-hidden={!canOpen}
                  tabIndex={canOpen ? 0 : -1}
                  style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, scale: tilt.scale }}
                  className={`relative block h-full w-full overflow-hidden rounded-2xl bg-white shadow-[0_22px_60px_rgba(29,33,42,0.18)] outline-none [perspective:800px] ${
                    canOpen ? "" : "cursor-default"
                  }`}
                >
                  <img
                    src={featured.cover}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <motion.span
                    aria-hidden="true"
                    style={{ opacity: tilt.glareOpacity, background: tilt.glare }}
                    className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                  />
                </motion.button>
              </motion.div>
            </div>

            {/* Derecha: descripción y llamada a la acción */}
            <motion.div style={{ opacity: featuredOpacity }} className="lg:pl-2">
              <p className="line-clamp-5 text-sm leading-relaxed text-black/50 sm:text-base">
                {featured.description}
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-black/35">
                {[featured.industry, featured.toolkit].filter(Boolean).join(" · ")}
              </p>
              {canOpen && (
                <button
                  type="button"
                  onClick={openFeatured}
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1D212A] transition-colors duration-300 hover:text-[#385BF0]"
                >
                  {featured.link.startsWith("http") ? "Visitar sitio" : "View case study"}
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* El resto de la categoría, toda a la vez */}
      {rest.length > 0 && (
        <div className="mt-20 md:mt-28">
          <div className="mb-8 flex items-baseline justify-between gap-4 border-t border-black/10 pt-6 md:mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-black/45">
              More in {selected}
            </h3>
            <span className="text-sm font-bold text-[#1D212A]">
              {String(rest.length).padStart(2, "0")}
            </span>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {rest.map((project) => (
              <ProjectTile key={project.id} project={project} />
            ))}
          </ul>
        </div>
      )}

      {/* La tarjeta viajera: es la misma del servicio, sacada de su hueco y
          movida por el scroll hasta el sitio del destacado. */}
      {geo && (
        <motion.div
          aria-hidden="true"
          style={{
            x: travelX,
            y: travelY,
            width: travelW,
            height: travelH,
            opacity: travelOpacity,
            pointerEvents: travelPointer,
            visibility: travelVisibility,
            perspective: 1400,
          }}
          onMouseMove={travelTilt.onMouseMove}
          onMouseLeave={travelTilt.onMouseLeave}
          className="absolute left-0 top-0 z-20"
        >
          {/* Tres niveles anidados porque cada uno gira sobre un eje distinto: el
              de fuera coloca, éste inclina con el ratón y el de dentro voltea con
              el scroll. En un solo nodo se pisarían el `transform`. */}
          <motion.div
            style={{
              rotateX: travelTilt.rotateX,
              rotateY: travelTilt.rotateY,
              scale: travelTilt.scale,
              transformStyle: "preserve-3d",
            }}
            className="h-full w-full"
          >
            <motion.div
              style={{ rotateY: travelFlip, transformStyle: "preserve-3d" }}
              className="relative h-full w-full shadow-[0_22px_60px_rgba(29,33,42,0.18)]"
            >
              <img src={service.image} alt="" className={`${face} object-cover`} />
              {featured && (
                <div className={`${face} [transform:rotateY(180deg)] bg-white`}>
                  <img src={featured.cover} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <motion.span
                aria-hidden="true"
                style={{ opacity: travelTilt.glareOpacity, background: travelTilt.glare }}
                className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-soft-light"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <motion.span
        aria-hidden="true"
        style={{ x: springX, y: springY }}
        animate={{ opacity: showCursor ? 1 : 0, scale: showCursor ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fixed left-0 top-0 z-40 rounded-full bg-[#1D212A] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white"
      >
        Show
      </motion.span>
    </section>
  );
}
