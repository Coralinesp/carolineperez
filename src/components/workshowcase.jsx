"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import projects from "./projects/projects";
import useTilt from "../hooks/useTilt";
import { useLenis } from "./SmoothScroll";

export const services = [
  { alt: "UX/UI Design", image: "/uxui.jpg", category: "UX/UI" },
  { alt: "Frontend Development", image: "/frontend.jpg", category: "Frontend" },
  { alt: "3D Design", image: "/3d.jpg", category: "3D Design" },
];

/** Las portadas rondan 14:9; el mazo las uniforma con object-cover. */
const DECK_RATIO = "14 / 9";
const VISIBLE_BEHIND = 2;
/** Scroll que consume cada proyecto mientras la sección está anclada. */
const STEP_VH = 45;

/**
 * Tramos del viaje de la tarjeta, medidos sobre el tramo previo al anclaje
 * (de cuando el bloque anclado asoma por abajo hasta que se ancla).
 *
 * El relevo termina justo en 1 a propósito: en ese instante el bloque acaba de
 * anclarse, así que el mazo está exactamente donde el layout lo coloca, que es
 * el punto que medimos como destino. Si el relevo acabara antes, la tarjeta se
 * desvanecería a unos píxeles del mazo y el cambio se vería.
 */
const MOVE = [0.12, 0.9];
const FLIP = [0.3, 0.8];
const HANDOFF = [0.88, 1];

/**
 * Suma de offsets desde `el` hasta `ancestor`, sin incluir el de `ancestor`.
 *
 * Nunca debe cruzar un elemento `sticky`: su propio offset refleja dónde está
 * pegado en ese momento, no dónde lo coloca el layout. Por eso el destino se
 * arma en dos tramos —posición del bloque anclado dentro de la sección, más
 * posición del mazo dentro del sticky— y ninguno lee el offset del sticky.
 */
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

/** Línea de texto con revelado enmascarado. */
function MaskedLine({ id, children, className = "" }) {
  return (
    <span className="block overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={id}
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`block ${className}`}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </span>
  );
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

export default function WorkShowcase() {
  const [selected, setSelected] = useState("UX/UI");
  const [index, setIndex] = useState(0);

  const rootRef = useRef(null);
  const slotRefs = useRef([]);
  const pinRef = useRef(null);
  const stickyRef = useRef(null);
  const landingRef = useRef(null);
  const [geo, setGeo] = useState(null);

  const navigate = useNavigate();
  const lenisRef = useLenis();
  const items = projects.filter((project) => project.tags.includes(selected));
  const service = services.find((entry) => entry.category === selected);
  const selectedIndex = services.findIndex((entry) => entry.category === selected);
  const total = items.length;
  const current = items[index] ?? items[0];

  const measure = useCallback(() => {
    const root = rootRef.current;
    const slot = slotRefs.current[selectedIndex];
    const landing = landingRef.current;
    const pin = pinRef.current;
    const sticky = stickyRef.current;
    if (!root || !slot || !landing || !pin || !sticky) return;
    if (!slot.offsetWidth || !landing.offsetWidth) return;

    const from = offsetWithin(slot, root);
    // Dos tramos, saltándose el sticky: dónde empieza el bloque anclado dentro
    // de la sección, y dónde está el mazo dentro de ese bloque.
    const pinPos = offsetWithin(pin, root);
    const inSticky = offsetWithin(landing, sticky);
    const to = { x: pinPos.x + inSticky.x, y: pinPos.y + inSticky.y };

    // Ancho y alto se interpolan por separado: la ilustración es vertical
    // (1240/1748) y el mazo horizontal (14/9), así que además de moverse la
    // tarjeta cambia de proporción para encajar en el destino.
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

  useEffect(() => setIndex(0), [selected]);

  /**
   * Al elegir una tarjeta se desplaza la página hasta donde el bloque se ancla,
   * que es donde el viaje termina. No se anima nada a mano: como el efecto
   * cuelga del scroll, mover el scroll lo reproduce entero. Por eso sigue
   * siendo reversible al subir, se haya llegado por click o por defecto.
   */
  const handleSelect = (category) => {
    setSelected(category);
    const pin = pinRef.current;
    if (!pin) return;
    if (lenisRef?.current) lenisRef.current.scrollTo(pin, { offset: 0, duration: 1.8 });
    else pin.scrollIntoView({ behavior: "smooth" });
  };

  // Tramo 1: de cuando el bloque anclado asoma por abajo hasta que se ancla.
  // Aquí viaja y gira la tarjeta. Al colgar del scroll, se deshace solo al subir.
  const { scrollYProgress: travel } = useScroll({
    target: pinRef,
    offset: ["start end", "start start"],
  });

  // Tramo 2: el anclaje. Cada proyecto se lleva una fracción igual del recorrido.
  const { scrollYProgress: deckProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(deckProgress, "change", (progress) => {
    if (!total) return;
    const step = Math.floor(progress * total);
    setIndex(Math.min(total - 1, Math.max(0, step)));
  });

  const safe = geo ?? { fromX: 0, fromY: 0, fromW: 0, fromH: 0, toX: 0, toY: 0, toW: 0, toH: 0 };
  const travelX = useTransform(travel, MOVE, [safe.fromX, safe.toX]);
  const travelY = useTransform(travel, MOVE, [safe.fromY, safe.toY]);
  const travelW = useTransform(travel, MOVE, [safe.fromW, safe.toW]);
  const travelH = useTransform(travel, MOVE, [safe.fromH, safe.toH]);
  const travelFlip = useTransform(travel, FLIP, [0, 180]);
  const travelOpacity = useTransform(travel, HANDOFF, [1, 0]);
  const deckOpacity = useTransform(travel, HANDOFF, [0, 1]);

  // La tarjeta viajera es la que se ve en el hueco del servicio elegido, así que
  // necesita su propio tilt: si no, esa card sería la única sin efecto 3D.
  const travelTilt = useTilt({ max: 12, hoverScale: 1.03, glareColor: "rgba(255,255,255,0.5)" });
  // Deja de capturar el ratón una vez cede el relevo, o taparía al mazo con un
  // elemento invisible (opacity 0 sigue recibiendo eventos).
  const travelPointer = useTransform(travel, (p) => (p >= HANDOFF[1] ? "none" : "auto"));

  const tilt = useTilt({ max: 10, hoverScale: 1.02, glareColor: "rgba(255,255,255,0.55)" });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 30, stiffness: 250, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 30, stiffness: 250, mass: 0.5 });
  const [showCursor, setShowCursor] = useState(false);

  const handleMove = (e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    tilt.onMouseMove(e);
  };

  const openCurrent = () => {
    if (!current?.link) return;
    if (current.link.startsWith("http")) window.open(current.link, "_blank", "noopener");
    else navigate(current.link);
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

      {/* Aire entre la rejilla y el anclaje */}
      <div className="h-[18vh] md:h-[26vh]" aria-hidden="true" />

      {/* Bloque anclado: la vista se queda fija y el scroll pasa los proyectos */}
      <div ref={pinRef} style={{ height: `${100 + total * STEP_VH}vh` }} className="relative">
        <div ref={stickyRef} className="sticky top-0 flex h-screen w-full flex-col justify-center">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-12">
            {/* Izquierda: título del proyecto activo */}
            <motion.div style={{ opacity: deckOpacity }} className="lg:text-right">
              <h3 className="font-extrabold uppercase leading-[1.02] tracking-tight text-[#1D212A] text-[clamp(1.5rem,3vw,2.75rem)]">
                <MaskedLine id={current?.id}>{current?.title}</MaskedLine>
              </h3>
            </motion.div>

            {/* Centro: el mazo. Su posición de layout es el destino del viaje. */}
            <div
              ref={landingRef}
              className="relative mx-auto w-full max-w-[440px] lg:w-[34vw] lg:max-w-[520px]"
              style={{ aspectRatio: DECK_RATIO }}
            >
              <motion.div style={{ opacity: deckOpacity }} className="absolute inset-0">
                {items.map((project, i) => {
                  // Distancia respecto a la carta activa, en orden circular.
                  const offset = (i - index + total) % total;
                  const hiddenCard = offset > VISIBLE_BEHIND;
                  const isTop = offset === 0;

                  return (
                    <motion.div
                      key={project.id}
                      animate={{
                        y: offset * 20,
                        scale: 1 - offset * 0.05,
                        opacity: hiddenCard ? 0 : 1 - offset * 0.15,
                      }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      style={{ zIndex: total - offset }}
                      className="absolute inset-0"
                    >
                      <motion.button
                        type="button"
                        disabled={!isTop}
                        onClick={openCurrent}
                        onMouseMove={isTop ? handleMove : undefined}
                        onMouseEnter={isTop ? () => setShowCursor(true) : undefined}
                        onMouseLeave={
                          isTop
                            ? () => {
                                setShowCursor(false);
                                tilt.onMouseLeave();
                              }
                            : undefined
                        }
                        aria-label={isTop ? `Ver ${project.title}` : undefined}
                        aria-hidden={!isTop}
                        tabIndex={isTop ? 0 : -1}
                        style={
                          isTop
                            ? { rotateX: tilt.rotateX, rotateY: tilt.rotateY, scale: tilt.scale }
                            : undefined
                        }
                        className="relative block h-full w-full overflow-hidden rounded-2xl bg-white shadow-[0_22px_60px_rgba(29,33,42,0.18)] outline-none [perspective:800px] disabled:cursor-default"
                      >
                        <img
                          src={project.cover}
                          alt={project.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        {isTop && (
                          <motion.span
                            aria-hidden="true"
                            style={{ opacity: tilt.glareOpacity, background: tilt.glare }}
                            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                          />
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Derecha: descripción y llamada a la acción */}
            <motion.div style={{ opacity: deckOpacity }} className="lg:pl-2">
              <div className="text-sm leading-relaxed text-black/50 sm:text-base">
                <MaskedLine id={`desc-${current?.id}`}>
                  <span className="block line-clamp-5">{current?.description}</span>
                </MaskedLine>
              </div>
              <p className="mt-4 text-xs uppercase tracking-widest text-black/35">
                {[current?.industry, current?.toolkit].filter(Boolean).join(" · ")}
              </p>
              <button
                type="button"
                onClick={openCurrent}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1D212A] transition-colors duration-300 hover:text-[#385BF0]"
              >
                {current?.link?.startsWith("http") ? "Visitar sitio" : "View case study"}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.div>
          </div>

          {/* Índice, centrado bajo el mazo */}
          <motion.div
            style={{ opacity: deckOpacity }}
            className="mt-10 text-center text-base font-bold text-[#1D212A]"
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </motion.div>
        </div>
      </div>

      {/* La tarjeta viajera: es la misma del servicio, sacada de su hueco y
          movida por el scroll hasta el sitio del mazo. */}
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
            perspective: 1400,
          }}
          onMouseMove={travelTilt.onMouseMove}
          onMouseLeave={travelTilt.onMouseLeave}
          className="absolute left-0 top-0 z-20"
        >
          {/* Tres niveles anidados porque cada uno gira sobre un eje distinto:
              el de fuera coloca, éste inclina con el ratón y el de dentro voltea
              con el scroll. En un solo nodo se pisarían el `transform`. */}
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
              {items[0] && (
                <div className={`${face} [transform:rotateY(180deg)] bg-white`}>
                  <img src={items[0].cover} alt="" className="h-full w-full object-cover" />
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
