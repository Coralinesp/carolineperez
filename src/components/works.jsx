"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import projects from "../components/projects/projects";

export default function SelectedWorks() {
  const [selected, setSelected] = useState("UX/UI");
  const [hovered, setHovered] = useState(null);
  const [previewEnabled, setPreviewEnabled] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { damping: 30, stiffness: 250, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 30, stiffness: 250, mass: 0.5 });

  const categories = ["UX/UI", "Frontend", "3D Design"];
  const filteredProjects = projects.filter((project) => project.tags.includes(selected));

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const update = () => setPreviewEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleMouseMove = (e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  return (
    <section className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/40 font-medium">
              03 Selected Works
            </span>
            <h2 className="mt-3 font-display italic text-3xl sm:text-4xl md:text-5xl text-[#1D212A] tracking-tight">
              A glimpse into my portfolio
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isSelected = selected === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelected(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    isSelected
                      ? "bg-[#1D212A] text-white border-[#1D212A]"
                      : "border-black/10 text-black/50 hover:border-black/30 hover:text-[#1D212A]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div
          onMouseMove={handleMouseMove}
          className="relative"
        >
          {filteredProjects.map((project, i) => {
            const isWebDev = project.tags.includes("Frontend") || project.tags.includes("Backend");
            return (
              <ProjectCard
                key={project.id}
                index={i}
                title={project.title}
                description={project.description}
                cover={project.cover}
                tags={project.tags}
                color={project.color}
                role={project.role}
                industry={project.industry}
                link={project.link}
                buttonText={isWebDev ? "Visitar" : "View Case Study"}
                isActive={hovered === project.id}
                onHover={(state) => setHovered(state ? project.id : null)}
              />
            );
          })}
        </div>
      </div>

      {/* Vista previa flotante que sigue al cursor (solo desktop) */}
      {previewEnabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 w-[260px] h-[180px] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl"
          style={{ x: springX, y: springY }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            {hovered && (
              <motion.img
                key={hovered}
                src={projects.find((p) => p.id === hovered)?.cover}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
