'use client'

import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[90vh] bg-[#0A0C16] text-white flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 lg:px-16 py-28 overflow-hidden"
    >
      <div aria-hidden="true" className="grain-overlay" />

      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full opacity-30 blur-[140px]"
        style={{ background: "radial-gradient(circle, #385BF0, transparent 70%)" }}
      />

      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 font-medium mb-6"
      >
        04 Contact
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 font-display italic text-4xl sm:text-6xl md:text-8xl leading-[1.05] tracking-tight max-w-4xl"
      >
        Let&rsquo;s make something{" "}
        <span className="text-[#708AFB] not-italic">awesome.</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative z-10 mt-6 text-base sm:text-lg text-white/50 max-w-lg font-light"
      >
        Actualmente disponible para nuevas oportunidades profesionales y colaboraciones.
      </motion.p>

      <motion.a
        href="mailto:perezcruzcaroline@gmail.com"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.35 }}
        whileHover="hover"
        className="relative z-10 group mt-12 inline-flex items-center gap-4"
      >
        <span className="font-display italic text-2xl sm:text-3xl md:text-4xl tracking-tight">
          perezcruzcaroline@gmail.com
        </span>
        <motion.span
          variants={{ hover: { rotate: 45, scale: 1.1 } }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 p-3 sm:p-4 rounded-full bg-[#708AFB] text-[#0A0C16]"
        >
          <ArrowUpRight size={22} />
        </motion.span>
        <motion.span
          variants={{ hover: { scaleX: 1 } }}
          initial={{ scaleX: 0 }}
          className="absolute left-0 -bottom-1 h-[2px] w-full origin-left bg-[#708AFB]"
        />
      </motion.a>
    </section>
  )
}
