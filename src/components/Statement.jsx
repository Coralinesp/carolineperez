import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useI18n } from "../i18n/LanguageContext";

/**
 * Sticker que asoma al pasar el cursor. `width` va en em para acompañar al
 * clamp del texto. `place: "above"` es para las palabras que no cierran la
 * frase: a la derecha taparían lo que viene después. `place: "lineEnd"` saca
 * el sticker del renglón: se coloca donde termina la línea visual en la que
 * cayó la palabra, midiendo el DOM, porque el corte depende del ancho.
 */
const STICKERS = {
  ok: { src: "/stickers/ok.png", width: 1.7, place: "above", offset: 0.35, tilt: -8 },
  coffee: { src: "/stickers/coffee.png", width: 3.6, place: "above", offset: 0.55 },
  flower: { src: "/stickers/flower.png", width: 1.9, place: "lineEnd", offset: 0.4, spin: true },
  eye: { src: "/stickers/eye.png", width: 1.9, tilt: -10 },
};

/**
 * Este párrafo no puede pasar por el diccionario como una frase suelta: se
 * parte en palabras, y cuatro de ellas van subrayadas y llevan sticker. Los
 * stickers se indexan por la palabra, que cambia con el idioma, así que cada
 * idioma trae su texto y su propio mapa palabra → sticker.
 *
 * Las palabras del mapa son exactamente las que van subrayadas, en los dos
 * idiomas; no hace falta una lista aparte.
 */
const CONTENT = {
  en: {
    text:
      "Some people choose between design and engineering. I never wanted to. I love turning ideas into experiences, combining technical thinking with creativity to build products that are intuitive, functional, and full of personality.",
    words: {
      design: "ok",
      engineering: "coffee",
      experiences: "flower",
      personality: "eye",
    },
  },
  es: {
    text:
      "Hay quien elige entre diseño e ingeniería. Yo nunca quise. Me encanta convertir ideas en experiencias, combinando el pensamiento técnico con la creatividad para construir productos intuitivos, funcionales y llenos de personalidad.",
    words: {
      "diseño": "ok",
      "ingeniería": "coffee",
      experiencias: "flower",
      personalidad: "eye",
    },
  },
};

const cleanWord = (word) => word.replace(/[.,]/g, "").toLowerCase();

export default function Statement() {
  const { lang } = useI18n();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.4]);

  const [peeking, setPeeking] = useState(null);

  // El sticker de fin de línea no puede colgar de la palabra: vive en el h2 y
  // se coloca con medidas reales, porque dónde corta cada línea depende del
  // ancho de la ventana y del idioma.
  const headingRef = useRef(null);
  const wordRefs = useRef(new Map());
  const [lineEnd, setLineEnd] = useState(null);

  const words = useMemo(() => {
    const { text, words: marked } = CONTENT[lang] ?? CONTENT.en;
    return text.split(" ").map((word, i) => {
      const sticker = marked[cleanWord(word)];
      return {
        // La `key` lleva el idioma: al cambiarlo se remonta cada palabra y la
        // entrada escalonada se reproduce entera, en vez de quedarse a medias
        // con los nodos que React habría reutilizado.
        id: `${lang}-${i}`,
        text: word,
        highlight: Boolean(sticker),
        sticker: sticker ? STICKERS[sticker] : null,
      };
    });
  }, [lang]);

  /**
   * Borde derecho de la última palabra que comparte renglón con la señalada:
   * dos palabras van en la misma línea si sus cajas arrancan a la misma
   * altura. Devuelve la posición ya relativa al h2.
   */
  const measureLineEnd = (word) => {
    const heading = headingRef.current;
    const node = wordRefs.current.get(word.id);
    if (!heading || !node) return null;

    const base = heading.getBoundingClientRect();
    const rect = node.getBoundingClientRect();

    let right = rect.right;
    wordRefs.current.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (Math.abs(r.top - rect.top) < rect.height / 2 && r.right > right) {
        right = r.right;
      }
    });

    const em = parseFloat(getComputedStyle(heading).fontSize) || 16;
    const width = (word.sticker.width ?? 1.9) * em;
    const gap = (word.sticker.offset ?? 0.35) * em;

    return {
      // El tope evita que la flor se salga del bloque y abra scroll lateral
      // cuando la línea llega justo hasta el margen.
      left: Math.min(right - base.left + gap, base.width - width),
      top: rect.top - base.top + rect.height / 2,
      width,
    };
  };

  const handleEnter = (word) => {
    setPeeking(word.id);
    if (word.sticker.place === "lineEnd") setLineEnd(measureLineEnd(word));
  };

  const peekingWord = words.find((word) => word.id === peeking);
  const lineEndSticker =
    peekingWord?.sticker?.place === "lineEnd" ? peekingWord.sticker : null;

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full min-h-screen bg-[#f8f8f6]"
    >
      <div className="h-full min-h-screen px-4 sm:px-6 md:px-10 lg:px-16 pt-24 md:pt-28 pb-12 flex items-center">
        <motion.h2
          ref={headingRef}
          style={{ scale, opacity }}
          className="relative uppercase font-extrabold text-[#1D212A] leading-[1.05] tracking-tight text-[clamp(1.35rem,4.2vw,3.25rem)] text-center md:text-left"
        >
          {words.map((word, i) => (
            <motion.span
              key={word.id}
              ref={(el) => {
                if (el) wordRefs.current.set(word.id, el);
                else wordRefs.current.delete(word.id);
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.025,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={word.sticker ? () => handleEnter(word) : undefined}
              onMouseLeave={word.sticker ? () => setPeeking(null) : undefined}
              className={`relative inline-block mr-[0.24em] ${
                word.highlight
                  // En em y no en px: el texto va con clamp y leading-[1.05],
                  // asi que en px el subrayado no encoge con la fuente y a
                  // partir de ~1240px de ancho ya cae dentro de la linea
                  // siguiente. En em conserva la proporcion a cualquier tamano.
                  ? "underline decoration-[0.09em] underline-offset-[0.16em] decoration-[#385BF0]"
                  : ""
              } ${word.sticker ? "cursor-pointer" : ""}`}
            >
              {word.text}

              {/* Se ancla a la palabra y se mide en `em`, así acompaña al clamp
                  del texto sin recalcular nada. El centrado vertical lo hace
                  flexbox y no -translate-y-1/2: Framer escribe `transform`
                  inline en este mismo nodo y pisaría el translate de Tailwind.
                  La entrada va en el contenedor y el giro en la imagen, para que
                  no se peleen por la propiedad `rotate`. */}
              <AnimatePresence>
                {word.sticker && word.sticker.place !== "lineEnd" && peeking === word.id && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.4, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 340, damping: 17 }}
                    style={
                      word.sticker.place === "above"
                        ? { marginBottom: `${word.sticker.offset ?? 0.15}em` }
                        : { marginLeft: `${word.sticker.offset ?? 0.35}em` }
                    }
                    className={`pointer-events-none absolute z-20 flex ${
                      word.sticker.place === "above"
                        ? "bottom-full left-0 right-0 justify-center"
                        : "bottom-0 left-full top-0 items-center"
                    }`}
                  >
                    <motion.img
                      src={word.sticker.src}
                      alt=""
                      style={{ width: `${word.sticker.width ?? 1.9}em` }}
                      className="max-w-none"
                      animate={
                        word.sticker.spin
                          ? { rotate: 360 }
                          : { rotate: word.sticker.tilt ?? 0 }
                      }
                      transition={
                        word.sticker.spin
                          ? { duration: 7, repeat: Infinity, ease: "linear" }
                          : { type: "spring", stiffness: 340, damping: 17 }
                      }
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          ))}

          {/* Fuera del flujo del párrafo: se coloca en el hueco que queda tras
              la última palabra de la línea, con `marginTop` negativo para
              centrarlo en el renglón sin tocar el `transform` que Framer usa
              para el rebote de entrada. */}
          <AnimatePresence>
            {lineEndSticker && lineEnd && (
              <motion.span
                key="line-end-sticker"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 340, damping: 17 }}
                style={{
                  left: lineEnd.left,
                  top: lineEnd.top,
                  width: lineEnd.width,
                  marginTop: -lineEnd.width / 2,
                }}
                className="pointer-events-none absolute z-20 block"
              >
                <motion.img
                  src={lineEndSticker.src}
                  alt=""
                  className="w-full max-w-none"
                  animate={
                    lineEndSticker.spin
                      ? { rotate: 360 }
                      : { rotate: lineEndSticker.tilt ?? 0 }
                  }
                  transition={
                    lineEndSticker.spin
                      ? { duration: 7, repeat: Infinity, ease: "linear" }
                      : { type: "spring", stiffness: 340, damping: 17 }
                  }
                />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.h2>
      </div>
    </section>
  );
}
