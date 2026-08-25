"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const services = [
  {
    title: "UX/UI Design",
    image: "/Pen.webp",
    description:
      "Diseño experiencias digitales centradas en el usuario, desde el primer wireframe hasta el prototipo interactivo final.",
    items: ["User Research", "Wireframing", "Prototyping", "Usability Testing"],
  },
  {
    title: "Frontend Development",
    image: "/Code.webp",
    description:
      "Interfaces web modernas, responsivas y con animaciones cuidadas, construidas con las herramientas más actuales.",
    items: ["React", "HTML", "CSS", "JavaScript", "GitHub", "VS Code"],
  },
  {
    title: "3D Design",
    image: "/Cubo.webp",
    description:
      "Renders, modelos, mockups y animaciones 3D que le dan una capa extra de personalidad a cada proyecto visual.",
    items: ["Blender", "Rendering", "Mockups", "Texturing", "Lighting", "VFX"],
  },
];

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16">
      <div>
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/40 font-medium">
              02 What I Do
            </span>
            <h2 className="mt-3 font-display italic text-3xl sm:text-4xl md:text-5xl text-[#1D212A] tracking-tight max-w-xl">
              Where design strategy meets code &amp; visual innovation
            </h2>
          </div>
        </div>

        <div>
          {services.map((service, i) => {
            const isActive = active === i;
            return (
              <div
                key={service.title}
                className=""
                onMouseEnter={() => setActive(i)}
              >
                <button
                  onClick={() => setActive(isActive ? -1 : i)}
                  className="w-full flex items-center justify-between gap-6 py-8 md:py-10 text-left group"
                >
                  <div className="min-w-0">
                    <h3
                      className={`font-display text-3xl sm:text-5xl md:text-7xl tracking-tight truncate transition-colors duration-300 ${
                        isActive ? "text-[#385BF0]" : "text-[#1D212A] group-hover:text-[#385BF0]/70"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>
                  <motion.span
                    animate={{ rotate: isActive ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 p-2 sm:p-3 rounded-full border border-black/10 text-[#1D212A]"
                  >
                    <ArrowUpRight size={20} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 md:pb-12 flex flex-col md:flex-row gap-8 md:gap-16 md:pl-16">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 object-contain"
                        />
                        <div className="flex flex-col gap-6 max-w-xl">
                          <p className="text-black/60 text-base sm:text-lg leading-relaxed">
                            {service.description}
                          </p>
                          <p className="text-xs uppercase tracking-widest font-semibold text-[#385BF0]">
                            {service.items.join(" · ")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
