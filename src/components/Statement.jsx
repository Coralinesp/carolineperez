import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";

const rawText =
  "Some people choose between design and engineering. I never wanted to. I love turning ideas into experiences, combining technical thinking with creativity to build products that are intuitive, functional, and full of personality.";

const highlightWords = ["design", "engineering", "experiences", "personality"];

/**
 * Sticker que asoma al pasar el cursor, indexado por palabra ya normalizada.
 * `width` va en em para acompañar al clamp del texto. `place: "above"` es para
 * palabras que no cierran la frase: a la derecha taparían lo que viene después.
 */
const stickers = {
  design: { src: "/stickers/ok.png", width: 1.7, place: "above", offset: 0.35, tilt: -8 },
  engineering: { src: "/stickers/coffee.png", width: 3.6, place: "above", offset: 0.55 },
  experiences: { src: "/stickers/flower.png", width: 1.9, spin: true },
  personality: { src: "/stickers/eye.png", width: 1.9, tilt: -10 },
};

const cleanWord = (word) => word.replace(/[.,]/g, "").toLowerCase();

export default function Statement() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.4]);

  const [peeking, setPeeking] = useState(null);

  const words = useMemo(
    () =>
      rawText.split(" ").map((word, i) => {
        const key = cleanWord(word);
        return {
          id: i,
          text: word,
          highlight: highlightWords.includes(key),
          sticker: stickers[key] ?? null,
        };
      }),
    []
  );

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full min-h-screen bg-[#f8f8f6]"
    >
      <div className="h-full min-h-screen px-4 sm:px-6 md:px-10 lg:px-16 pt-24 md:pt-28 pb-12 flex items-center">
        <motion.h2
          style={{ scale, opacity }}
          className="uppercase font-extrabold text-[#1D212A] leading-[1.05] tracking-tight text-[clamp(1.35rem,4.2vw,3.25rem)] text-center md:text-left"
        >
          {words.map((word, i) => (
            <motion.span
              key={word.id}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: i * 0.025,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              onMouseEnter={word.sticker ? () => setPeeking(word.id) : undefined}
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
                {word.sticker && peeking === word.id && (
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
        </motion.h2>
      </div>
    </section>
  );
}
