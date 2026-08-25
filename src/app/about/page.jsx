import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Download } from 'lucide-react';
import Navbar from '../../components/navbar';
import CallToAction from '../../components/cierre';

/**
 * Intro del hero como declaración tipográfica: se escribe por segmentos para
 * poder resaltar partes, y luego se aplana a palabras sueltas para animarlas
 * una a una (cada palabra es inline-block, así el texto sigue re-fluyendo).
 */
const intro = [
  { text: "Hey, I’m" },
  { text: "Caroline Pérez,", className: "font-bold" },
  { text: "a" },
  { text: "software engineer and UX/UI designer", className: "text-[#385BF0]" },
  {
    text:
      "from the Dominican Republic, building the interfaces I design. " +
      "With a background in 3D and electronics, and a keen eye for detail. " +
      "Focused on crafting simple, accessible products that go from research to production.",
  },
];

const introWords = intro.flatMap((segment) =>
  segment.text.split(" ").map((word) => ({ word, className: segment.className }))
);

const experience = [
  {
    role: "UI Designer Intern",
    company: "Botcity (Remote)",
    date: "Nov 2025 — Present",
    desc: "Designing interactive web interfaces and adapting prototypes into functional solutions.",
  },
  {
    role: "UX/UI Designer & Frontend Developer",
    company: "Arcode Dominicana",
    date: "Jan 2025",
    desc: "Leading design processes and translating UI designs into functional React components.",
  },
  {
    role: "UX/UI Designer & Frontend Developer",
    company: "GL SILA",
    date: "Sep 2024 — Apr 2025",
    desc: "Full development of a responsive website with a blog system integrated via Supabase.",
  },
  {
    role: "Freelance UX/UI & 3D Designer",
    company: "Multiple clients",
    date: "2021 — Present",
    desc: "Ongoing collaborations across design, frontend, and 3D, from branding to full product builds.",
  },
];

const education = [
  { title: "Google UX Design", school: "Coursera · Online Certificate", date: "Jun 30, 2025" },
  { title: "Software Engineering", school: "UNAPEC", date: "2023 — 2026" },
  { title: "Electronics (High School)", school: "Instituto Politécnico Loyola", date: "2019 — 2022" },
];

/**
 * Collage "Beyond Work" (desktop).
 *
 * La sección se ancla con `position: sticky`: al llegar, la vista se queda
 * fija —el título no se mueve— y el scroll únicamente desplaza el lienzo de
 * imágenes hacia arriba hasta que pasan todas. Recién entonces la página
 * continúa.
 *
 * El lienzo mide CANVAS_W x CANVAS_H y cada imagen se posiciona en esas mismas
 * unidades, convertidas a % — así la composición escala igual en cualquier
 * ancho y nunca se descuadra.
 *
 * Carriles: el título ocupa la franja central (~x 490–950). Las 12 imágenes de
 * los carriles laterales (x < 400 y x > 1040) no lo tocan nunca; sólo tres
 * "cruzadas" invaden el centro, tapando como mucho la mitad del título al pasar.
 *
 * `ratio` es la proporción real del archivo (ya con la rotación EXIF aplicada,
 * que el navegador respeta), así que object-cover no recorta nada.
 *
 * `speed` es un parallax extra por imagen (px sobre CANVAS_W), de +speed/2 a
 * -speed/2. Es pequeño frente a la separación mínima entre vecinas de un mismo
 * carril (187 px), así que no pueden amontonarse.
 */
const CANVAS_W = 1440;
const CANVAS_H = 4000;
/** Cuánto scroll cuesta el recorrido: >1 hace que las fotos suban más lento. */
const SCROLL_FACTOR = 1.1;

const pct = (value, total) => `${(value / total) * 100}%`;

const moments = [
  // carril izquierdo
  { src: "/beyond/00521698-557B-4C80-902B-4D015C9139A2.jpg", alt: "Colour-pencil portrait study",               ratio: "9/16",      left: 55,   top: 0,    width: 280, speed: 40 },
  { src: "/beyond/IMG-20210929-WA0047.jpg",                  alt: "Acrylic study of Van Gogh’s Starry Night",   ratio: "1081/1280", left: 40,   top: 690,  width: 340, speed: -45 },
  { src: "/beyond/IMG-20211125-WA0013.jpg",                  alt: "Soldered LED board resting on my hand",      ratio: "9/16",      left: 65,   top: 1280, width: 275, speed: 35 },
  { src: "/beyond/IMG_9434.jpg",                             alt: "At the American Museum of Natural History",  ratio: "3/4",       left: 45,   top: 1960, width: 335, speed: -40 },
  { src: "/beyond/Swim.webp",                                alt: "The olympic pool where I used to train",     ratio: "694/811",   left: 35,   top: 2600, width: 355, speed: 45 },
  { src: "/beyond/IMG_0693.jpg",                             alt: "Third place at Oracle’s Back to the Cloud",  ratio: "3/4",       left: 50,   top: 3210, width: 330, speed: -35 },
  // carril derecho
  { src: "/beyond/20211031_223337.jpg",                      alt: "LEDs lit up on a breadboard at night",       ratio: "3/4",       left: 1045, top: 250,  width: 345, speed: -50 },
  { src: "/beyond/IMG-20211105-WA0054.jpg",                  alt: "Breadboard circuit from electronics class",  ratio: "9/16",      left: 1060, top: 900,  width: 285, speed: 45 },
  { src: "/beyond/IMG-20220701-WA0019.jpg",                  alt: "Asleep over my backpack at the workshop",    ratio: "3/4",       left: 1050, top: 1600, width: 330, speed: -35 },
  { src: "/beyond/WhatsApp%20Image%202026-08-25%20at%2012.47.15%20AM.jpeg", alt: "Swimming medals hanging on the wall", ratio: "9/16", left: 1065, top: 2230, width: 280, speed: 50 },
  { src: "/beyond/IMG_0236.jpg",                             alt: "Resort pool lit up at night",                ratio: "3/4",       left: 1045, top: 2920, width: 340, speed: -40 },
  { src: "/beyond/IMG_6301.jpg",                             alt: "Suited up inside a race car",                ratio: "4/3",       left: 1040, top: 3560, width: 370, speed: 45 },
  // cruzadas: rozan el título, alternando izquierda / derecha / izquierda
  { src: "/beyond/IMG-20220710-WA0023.jpeg",                 alt: "Modelling a futuristic city in Blender",     ratio: "16/9",      left: 400,  top: 560,  width: 340, speed: 30 },
  { src: "/beyond/IMG_9152.jpg",                             alt: "The mountains back home",                    ratio: "4/3",       left: 690,  top: 1850, width: 330, speed: -30 },
  { src: "/beyond/IMG-20230528-WA0016.jpeg",                 alt: "Swim meet athlete accreditations",           ratio: "1/1",       left: 410,  top: 3050, width: 290, speed: 25 },
];

function RevealRow({ children, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const readViewport = () => ({
  vw: typeof document === "undefined" ? CANVAS_W : document.documentElement.clientWidth,
  vh: typeof window === "undefined" ? 900 : window.innerHeight,
});

/** Tamaño del viewport, para calcular a mano el recorrido del pin. */
function useViewport() {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    const update = () => setViewport(readViewport());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewport;
}

function MomentImage({ src, alt, ratio, className = "" }) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`w-full overflow-hidden rounded-md border border-black/5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function CollageTile({ moment, progress, scale }) {
  const { left, top, width, speed } = moment;
  const y = useTransform(progress, [0, 1], [(speed / 2) * scale, (-speed / 2) * scale]);

  return (
    <motion.div
      style={{
        left: pct(left, CANVAS_W),
        top: pct(top, CANVAS_H),
        width: pct(width, CANVAS_W),
        y,
      }}
      className="absolute z-10 will-change-transform"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <MomentImage {...moment} />
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(heroProgress, [0, 1], [0, 120]);
  const photoRotate = useTransform(heroProgress, [0, 1], [8, 2]);

  // ----- Collage "Beyond Work" (pin) -----
  const beyondRef = useRef(null);
  const { vw, vh } = useViewport();

  const canvasW = Math.min(vw, CANVAS_W);
  const canvasH = (canvasW * CANVAS_H) / CANVAS_W;
  const canvasScale = canvasW / CANVAS_W;
  // Recorrido: del borde superior del lienzo al inferior.
  const travel = Math.max(canvasH - vh, 0);
  // Alto de la sección = una pantalla (la que queda anclada) + el scroll que
  // consume el recorrido. SCROLL_FACTOR > 1 hace que las fotos suban más lento
  // que el scroll, reforzando la sensación de que la página se detuvo.
  const pinHeight = vh + travel * SCROLL_FACTOR;
  // Ligado al ancho del lienzo (no a vw) para que el título nunca invada los
  // carriles laterales donde viven las fotos.
  const titleSize = canvasW * 0.078;

  const { scrollYProgress: collageProgress } = useScroll({
    target: beyondRef,
    offset: ["start start", "end end"],
  });
  const canvasY = useTransform(collageProgress, [0, 1], [0, -travel]);

  // Ojo: el wrapper usa overflow-x-clip y no overflow-x-hidden — este último
  // convierte el div en contenedor de scroll y rompe el `sticky` del collage.
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f6] text-[#1D212A] overflow-x-clip">
      <Navbar />

      {/* ---------- Hero ---------- */}
      <section ref={heroRef} className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16 pt-36 md:pt-44 pb-24 md:pb-32 overflow-hidden">
        <div className="relative z-10">

          {/* Declaración tipográfica: Montserrat grande, una palabra por span */}
          <h1 className="mt-8 max-w-[62rem] font-medium tracking-tight text-[#1D212A] leading-[1.16] text-[clamp(1.4rem,3.4vw,2.6rem)]">
            {introWords.map(({ word, className }, i) => (
              <motion.span
                key={word + i}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.018, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-[0.26em] ${className ?? ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <div className="mt-16 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 text-[#385BF0]"
              >
                <MapPin size={16} />
                <span className="text-sm sm:text-base font-medium">Based in Dominican Republic</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-wrap gap-3 mt-8"
              >
                <a
                  href="https://drive.google.com/file/d/1ny2v_X2izvE4IQ45Ik6O7woCbufpNrao/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 border border-black/10 text-[#1D212A] transition-all duration-300 hover:border-[#385BF0] hover:text-[#385BF0]"
                >
                  <Download size={14} className="transition-transform group-hover:-translate-y-0.5" />
                  Resume · ES
                </a>
                <a
                  href="https://drive.google.com/file/d/19NE9FX1L1lhBtvPdnyx8TgrKfgnyd06N/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 border border-black/10 text-[#1D212A] transition-all duration-300 hover:border-[#385BF0] hover:text-[#385BF0]"
                >
                  <Download size={14} className="transition-transform group-hover:-translate-y-0.5" />
                  Resume · EN
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: photoY, rotate: photoRotate }}
              className="flex shrink-0 justify-center md:justify-end"
            >
              <div className="bg-white p-3 border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.14)] max-w-[240px] sm:max-w-[280px] transition-transform duration-500 hover:scale-105 hover:rotate-0">
                <img
                  src="/Me.webp"
                  alt="Caroline Pérez"
                  width={280}
                  height={280}
                  className="object-cover w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- Ticker band ---------- */}
      <section className="relative w-full bg-[#0A0C16] py-6 sm:py-8 overflow-hidden">
        <div aria-hidden="true" className="grain-overlay" />
        <div className="relative z-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div
            className="flex items-center w-max text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight whitespace-nowrap animate-ticker"
            style={{ animationDuration: "32s" }}
          >
            {Array(2)
              .fill(["UX/UI Designer", "Frontend Developer", "3D Artist", "Swimmer", "Software Engineer"])
              .flat()
              .map((word, i) => (
                <span key={i} className="flex items-center">
                  <span className={i % 2 === 0 ? "text-[#708AFB] px-4 sm:px-6" : "text-outline text-white/70 px-4 sm:px-6"}>
                    {word}
                  </span>
                  <span className="text-white/20 text-xl sm:text-2xl">✦</span>
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ---------- Experience & Education ---------- */}
      <section className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16 py-24 md:py-36">
        <div>
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/40 font-medium">
            02 Experience
          </span>
          <h2 className="mt-3 font-display italic text-3xl sm:text-4xl md:text-5xl tracking-tight mb-14 md:mb-20">
            Where I&rsquo;ve worked
          </h2>

          <div className="mb-24 md:mb-32">
            {experience.map((job, i) => (
              <RevealRow key={job.role + job.company} i={i}>
                <div className="py-8 md:py-10 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 justify-between">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#1D212A] transition-colors duration-300 group-hover:text-[#385BF0]">
                      {job.role}
                    </h3>
                    <span className="text-xs sm:text-sm text-black/40 whitespace-nowrap sm:pl-4">{job.date}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-[#385BF0] font-medium mb-2">{job.company}</p>
                    {job.desc && <p className="text-sm text-black/50 leading-relaxed max-w-2xl">{job.desc}</p>}
                  </div>
                </div>
              </RevealRow>
            ))}
          </div>

          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/40 font-medium">
            03 Education
          </span>
          <h2 className="mt-3 font-display italic text-3xl sm:text-4xl md:text-5xl tracking-tight mb-14 md:mb-20">
            Where I&rsquo;ve learned
          </h2>

          <div>
            {education.map((edu, i) => (
              <RevealRow key={edu.title} i={i}>
                <div className="py-8 md:py-10 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 justify-between">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight text-[#1D212A] transition-colors duration-300 group-hover:text-[#385BF0]">
                      {edu.title}
                    </h3>
                    <span className="text-xs sm:text-sm text-black/40 whitespace-nowrap sm:pl-4">{edu.date}</span>
                  </div>
                  <p className="mt-3 text-sm text-[#385BF0] font-medium">{edu.school}</p>
                </div>
              </RevealRow>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Beyond Work — desktop: sección anclada, sólo suben las fotos ---------- */}
      <section
        ref={beyondRef}
        aria-label="Beyond work"
        className="relative hidden w-full bg-[#f8f8f6] text-[#1D212A] md:block"
        style={{ height: `${pinHeight}px` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Título fijo: nunca se mueve mientras dura el recorrido */}
          <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center px-6">
            <h2
              style={{ fontSize: `${titleSize}px` }}
              className="text-center font-extrabold uppercase leading-[0.85] tracking-tight text-[#1D212A]"
            >
              <span className="block">Beyond</span>
              <span className="block">Work</span>
            </h2>
          </div>

          {/* Lienzo: se desplaza hacia arriba hasta que pasan todas las imágenes */}
          <motion.div
            style={{ y: canvasY, height: `${canvasH}px` }}
            className="absolute inset-x-0 top-0 z-10 mx-auto w-full max-w-[1440px] will-change-transform"
          >
            {moments.map((m) => (
              <CollageTile key={m.src} moment={m} progress={collageProgress} scale={canvasScale} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Beyond Work — mobile: lista apilada ---------- */}
      <section aria-label="Beyond work" className="px-4 sm:px-6 py-24 md:hidden">
        <h2 className="mb-12 font-extrabold uppercase leading-[0.9] tracking-tight text-[#1D212A] text-5xl sm:text-6xl">
          Beyond Work
        </h2>
        <ul className="flex flex-col items-center gap-8">
          {moments.map((m) => (
            <li key={m.src} className="w-full max-w-[22rem]">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <MomentImage {...m} />
              </motion.div>
            </li>
          ))}
        </ul>
      </section>

      <CallToAction />
    </div>
  );
}
