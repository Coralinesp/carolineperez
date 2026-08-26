"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL, socialLinks } from "../data/contact";

/**
 * Cierre en claro, no en oscuro como antes: el resto de la página es #f8f8f6 y
 * el negro queda reservado al footer, que así cierra de verdad. El lenguaje es
 * el mismo del resto del sitio — Montserrat extrabold en mayúsculas y una
 * palabra subrayada en azul.
 */
export default function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 26 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-[#f8f8f6] px-4 py-28 text-center sm:px-6 md:px-10 md:py-40 lg:px-16"
    >
      {/* El contenedor se ajusta al titular, para poder anclar la flor a su
          esquina y no a la de la sección. */}
      <div className="relative mx-auto inline-block">
        <motion.img
          aria-hidden="true"
          src="/stickers/flower.png"
          alt=""
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-5 -top-7 w-14 md:-right-10 md:-top-12 md:w-24"
        />

        <motion.h2
          {...rise()}
          className="max-w-[16ch] font-extrabold uppercase leading-[0.92] tracking-tight text-[#1D212A] text-[clamp(2.25rem,7vw,6rem)]"
        >
          Let&rsquo;s{" "}
          <span className="underline decoration-[#385BF0] decoration-[0.09em] underline-offset-[0.1em]">
            talk
          </span>{" "}
          about your project
        </motion.h2>
      </div>

      <motion.p
        {...rise(0.12)}
        className="mx-auto mt-8 max-w-md text-base leading-relaxed text-black/45 sm:text-lg"
      >
        Available for new roles and collaborations. Write me and let&rsquo;s see where it goes.
      </motion.p>

      <motion.a
        {...rise(0.2)}
        href={`mailto:${CONTACT_EMAIL}`}
        className="group mt-12 inline-flex items-center gap-3 md:mt-16"
      >
        <span className="font-bold tracking-tight text-[#1D212A] transition-colors duration-300 group-hover:text-[#385BF0] text-[clamp(1.15rem,3vw,2.5rem)]">
          {CONTACT_EMAIL}
        </span>
        <span className="grid shrink-0 place-items-center rounded-full bg-[#1D212A] p-2.5 text-white transition-all duration-300 group-hover:bg-[#385BF0] group-hover:rotate-45 sm:p-3.5">
          <ArrowUpRight size={20} />
        </span>
      </motion.a>

      <motion.ul
        {...rise(0.28)}
        className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
      >
        {socialLinks.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold uppercase tracking-widest text-black/45 transition-colors duration-300 hover:text-[#385BF0]"
            >
              {label}
            </a>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
