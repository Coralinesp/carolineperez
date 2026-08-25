import { useMemo, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const rawText =
  "Some people choose between design and engineering. I never wanted to. I love turning ideas into experiences, combining technical thinking with creativity to build products that are intuitive, functional, and full of personality.";

const highlightWords = ["design", "engineering", "experiences", "personality"];

export default function Statement() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.4]);

  const words = useMemo(
    () =>
      rawText.split(" ").map((word, i) => ({
        id: i,
        text: word,
        highlight: highlightWords.includes(word.replace(/[.,]/g, "").toLowerCase()),
      })),
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
              className={`inline-block mr-[0.24em] ${
                word.highlight
                  ? "underline decoration-[5px] underline-offset-[10px] decoration-[#385BF0]"
                  : ""
              }`}
            >
              {word.text}
            </motion.span>
          ))}
        </motion.h2>
      </div>
    </section>
  );
}
