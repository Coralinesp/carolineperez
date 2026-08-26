import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { Instagram, Linkedin, Send } from 'lucide-react';
import Navbar from '../../components/navbar';
import CallToAction from '../../components/cierre';
import { CONTACT_EMAIL, socialLinks } from '../../data/contact';
import useTilt from '../../hooks/useTilt';


/** Lucide no trae Behance, así que la marca va a mano. */
function BehanceMark() {
  return (
    <span
      aria-hidden="true"
      className="grid h-[18px] w-[22px] place-items-center rounded-[5px] border-[1.5px] border-current text-[8px] font-bold leading-none"
    >
      Bē
    </span>
  );
}

const socials = [
  { label: "Behance", Icon: BehanceMark },
  { label: "LinkedIn", Icon: (props) => <Linkedin size={18} {...props} /> },
  { label: "Instagram", Icon: (props) => <Instagram size={18} {...props} /> },
].map((entry) => ({
  ...entry,
  href: socialLinks.find((link) => link.label === entry.label).href,
}));

/**
 * Intro del hero como declaración tipográfica: se escribe por segmentos para
 * poder resaltar partes, y luego se aplana a palabras sueltas para animarlas
 * una a una (cada palabra es inline-block, así el texto sigue re-fluyendo).
 */
const name = "Caroline Pérez";

const BEACH_PHOTO = "/beyond/d3ccb8ed-d2a6-49d2-948d-476388f5e4dc.jpg";

/** Foto que asoma al pasar el cursor por el país. La tarjeta va vertical (3/4)
 *  igual que el archivo, así object-cover no recorta nada. */
const PEEK_IMAGE = "/beyond/IMG-20230406-WA0184.jpg";
const PEEK_W = 210;
const PEEK_H = 280;

/** Grados máximos de inclinación de la foto en cada eje. */
const MAX_TILT = 15;

const intro = [
  { text: "A" },
  { text: "software engineer and UX/UI designer", highlight: true },
  { text: "based in the" },
  { text: "Dominican Republic,", peek: true },
  {
    text:
      "building the interfaces I design. " +
      "With a background in 3D and electronics, and a keen eye for detail. " +
      "Focused on crafting simple, accessible products that go from research to production.",
  },
];

/**
 * Cada palabra va en su propio inline-block para poder animarla y que el
 * párrafo siga re-fluyendo. El subrayado del resaltado se dibuja con
 * border-bottom en vez de text-decoration: un inline-block no hereda la
 * decoración del padre, y el borde sí cubre el padding, así el trazo queda
 * continuo entre palabras. Por eso las palabras resaltadas se separan con
 * padding (dentro del borde) y la última con margin (para que el trazo corte
 * justo al terminar la frase).
 */
const introSegments = (() => {
  let order = 0;
  return intro.map((segment) => {
    const words = segment.text.split(" ");
    return {
      ...segment,
      words: words.map((word, i) => ({
        word,
        order: order++,
        endsSegment: i === words.length - 1,
      })),
    };
  });
})();

/**
 * `logo` es opcional: si hay un archivo en public/logos/ se usa; si no, la
 * ficha cae al monograma de `mark`. `current` la pinta con el azul de acento.
 */
const experience = [
  {
    name: "Takum Studio",
    role: "UX/UI Designer",
    date: "Apr 2026 - Present",
    desc:
      "Redesign and development of modern web interfaces focused on UX/UI, built for performance, " +
      "maintainability and reusable components. AI-assisted development through prompt engineering " +
      "to speed up delivery and technical decision-making.",
    stack: "Figma (advanced prototyping) · Claude Code · Design Systems · WCAG",
    logo: "/logos/takum.webp",
    mark: "TK",
    current: true,
  },
  {
    name: "Botcity",
    role: "UI Designer Internship",
    date: "Nov 2025 - Mar 2026",
    desc:
      "Interactive interface design, UI prototypes using advanced Figma features, adaptation of " +
      "prototypes into functional solutions, and coordination of design processes.",
    stack: "Figma (advanced prototyping) · UX Research · Design Systems · WCAG",
    logo: "/logos/botcity.png",
    mark: "BC",
  },
  {
    name: "Arcode Dominicana",
    role: "Frontend Developer & UX/UI Designer",
    date: "Jan 2025 - Dec 2025",
    desc:
      "Development of interactive web interfaces, translating UI designs into functional " +
      "components, and design leadership.",
    stack: "React · HTML · CSS · JavaScript · Figma · Clickup",
    logo: "/logos/arcode.png",
    mark: "AD",
  },
  {
    name: "GL SILA",
    role: "Frontend Developer & UX/UI Designer",
    date: "Sep 2024 - Apr 2025",
    desc:
      "Full design and development of a responsive website using React, with a blog management " +
      "system implemented in Supabase.",
    stack: "React · HTML · CSS · JavaScript · Figma",
    logo: "/logos/glsila.png",
    mark: "GL",
  },
];

const education = [
  {
    name: "UNAPEC",
    role: "Software Engineering",
    date: "2023 - 2026",
    logo: "/logos/unapec.png",
    mark: "UN",
  },
  {
    name: "Instituto Politécnico Loyola",
    role: "Electronics, High School",
    date: "2019 - 2022",
    logo: "/logos/ipl.svg",
    mark: "IPL",
  },
];

/** De la más reciente a la más antigua. */
const certifications = [
  {
    name: "Epic Games",
    role: "User Interface in Game Design",
    date: "Jun 2026",
    logo: "/logos/epicgames.png",
    mark: "EG",
  },
  {
    name: "ITLA",
    role: "C# .NET Básico",
    date: "Apr 2026",
    logo: "/logos/itla.png",
    mark: "ITLA",
  },
  {
    name: "Coursera",
    role: "WCAG Compliance: Web Accessibility Best Practices",
    date: "Jan 2026",
    logo: "/logos/coursera.png",
    mark: "CO",
  },
  {
    name: "Microsoft",
    role: "Foundations of Coding Front-End",
    date: "Dec 2025",
    logo: "/logos/microsoft.png",
    mark: "MS",
  },
  {
    name: "LinkedIn",
    role: "React Esencial",
    date: "Sep 2025",
    logo: "/logos/linkedin.png",
    mark: "IN",
  },
  {
    name: "Coursera",
    role: "Google UX Design Certificate",
    date: "Jun 2025",
    logo: "/logos/coursera.png",
    mark: "GU",
  },
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
const CANVAS_H = 3820;
/** Cuánto scroll cuesta el recorrido: >1 hace que las fotos suban más lento. */
const SCROLL_FACTOR = 1.1;

const pct = (value, total) => `${(value / total) * 100}%`;

const moments = [
  // carril izquierdo
  { src: "/beyond/00521698-557B-4C80-902B-4D015C9139A2.jpg", alt: "Colour-pencil portrait study",              ratio: "9/16",      left: 55,   top: 0,    width: 280, speed: 40 },
  { src: "/beyond/IMG-20210929-WA0047.jpg",                  alt: "Acrylic study of Van Gogh’s Starry Night",  ratio: "1081/1280", left: 40,   top: 690,  width: 340, speed: -45 },
  { src: "/beyond/IMG-20211125-WA0013.jpg",                  alt: "Soldered LED board resting on my hand",     ratio: "9/16",      left: 65,   top: 1280, width: 275, speed: 35 },
  { src: "/beyond/IMG_9434.jpg",                             alt: "At the American Museum of Natural History", ratio: "3/4",       left: 45,   top: 1960, width: 335, speed: -40 },
  { src: "/beyond/Swim.webp",                                alt: "The olympic pool where I used to train",    ratio: "694/811",   left: 35,   top: 2600, width: 355, speed: 45 },
  { src: "/beyond/IMG_0693.jpg",                             alt: "Third place at Oracle’s Back to the Cloud", ratio: "3/4",       left: 50,   top: 3210, width: 330, speed: -35 },
  // carril derecho
  { src: "/beyond/20211031_223337.jpg",                      alt: "LEDs lit up on a breadboard at night",      ratio: "3/4",       left: 1045, top: 250,  width: 345, speed: -50 },
  { src: "/beyond/IMG-20211105-WA0054.jpg",                  alt: "Breadboard circuit from electronics class", ratio: "9/16",      left: 1060, top: 900,  width: 285, speed: 45 },
  { src: "/beyond/WhatsApp%20Image%202026-08-25%20at%2012.47.15%20AM.jpeg", alt: "Swimming medals hanging on the wall", ratio: "900/1471", left: 1055, top: 1600, width: 300, speed: -35 },
  { src: "/beyond/IMG_0236.jpg",                             alt: "Resort pool lit up at night",               ratio: "3/4",       left: 1045, top: 2290, width: 340, speed: 50 },
  { src: BEACH_PHOTO,                                        alt: "Sunset over the beach back home",           ratio: "3/4",       left: 1050, top: 2950, width: 345, speed: -40 },
  // cruzadas: rozan el título, una por la izquierda y otra por la derecha
  { src: "/beyond/IMG_6301.jpg",                             alt: "Suited up inside a race car",               ratio: "4/3",       left: 400,  top: 560,  width: 330, speed: 30 },
  { src: "/beyond/IMG-20230528-WA0016.jpeg",                 alt: "Swim meet athlete accreditations",          ratio: "1/1",       left: 700,  top: 2150, width: 300, speed: -25 },
];

function EntryCard({ entry, i }) {
  const { name, role, date, desc, stack, mark, logo, logoFill, current } = entry;

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-black/[0.06] bg-white px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#385BF0]/25 hover:shadow-[0_14px_34px_rgba(29,33,42,0.07)] sm:px-6 sm:py-6"
    >
      {/* Ficha 96x56: cuadrada se le queda corta a los logos que son wordmark
          (Takum), y los monogramas se ven bien igual centrados en ella. */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* `logoFill` es para logos que traen su propio fondo sólido (Dra Karla):
            llenan la ficha en vez de flotar recortados sobre el blanco. */}
        <span
          className={`grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border transition-colors duration-300 ${
            logo
              ? `border-black/[0.06] bg-white ${logoFill ? "" : "p-2"}`
              : `border-transparent text-sm font-extrabold tracking-tight text-white ${
                  current ? "bg-[#385BF0]" : "bg-[#1D212A] group-hover:bg-[#385BF0]"
                }`
          }`}
        >
          {logo ? (
            // max-h/max-w y no h-full/w-full: acotan la imagen a la caja en vez
            // de forzarla a llenarla, que es lo que la desbordaba.
            <img
              src={logo}
              alt={`${name} logo`}
              className={
                logoFill ? "h-full w-full object-cover" : "max-h-full max-w-full object-contain"
              }
              loading="lazy"
            />
          ) : (
            <span aria-hidden="true">{mark}</span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="text-base font-bold tracking-tight text-[#1D212A] sm:text-lg">{name}</h3>
            <span className="shrink-0 text-xs text-black/40 sm:text-sm">{date}</span>
          </div>
          <p className="mt-0.5 text-sm text-black/45 sm:text-base">{role}</p>
        </div>
      </div>

      {(desc || stack) && (
        <div className="mt-4 sm:ml-[7.25rem]">
          {desc && <p className="text-sm leading-relaxed text-black/45">{desc}</p>}
          {stack && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[#385BF0]">
              {stack}
            </p>
          )}
        </div>
      )}
    </motion.li>
  );
}

/** Columna de título fija + lista de fichas al lado. */
function EntryGroup({ title, lead, entries }) {
  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-16 xl:gap-24">
      {/* El tamaño del título está atado al ancho de esta columna: "CERTIFICATIONS"
          es una sola palabra de 14 letras y no puede partirse, así que con un
          clamp más grande se salía encima de las fichas. */}
      <div className="lg:sticky lg:top-28 lg:h-fit lg:w-[34%] lg:self-start">
        <h2 className="font-extrabold uppercase tracking-tight leading-[0.95] text-[#1D212A] text-[clamp(2rem,3vw,3rem)]">
          {title}
        </h2>
        {lead && <p className="mt-6 max-w-md text-sm leading-relaxed text-black/45 sm:text-base">{lead}</p>}
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {entries.map((entry, i) => (
          <EntryCard key={entry.name + entry.role} entry={entry} i={i} />
        ))}
      </ul>
    </div>
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

  // Inclinación 3D de la foto al mover el mouse (mismo efecto que las tarjetas
  // de Services).
  const tilt = useTilt({ max: MAX_TILT });
  const photoRotate = useTransform(heroProgress, [0, 1], [8, 2]);

  // ----- Preview que asoma al pasar el cursor por "Dominican Republic" -----
  const [peeking, setPeeking] = useState(false);
  const [peekEnabled, setPeekEnabled] = useState(false);
  const peekX = useMotionValue(0);
  const peekY = useMotionValue(0);
  const peekSpringX = useSpring(peekX, { damping: 30, stiffness: 250, mass: 0.5 });
  const peekSpringY = useSpring(peekY, { damping: 30, stiffness: 250, mass: 0.5 });

  // Sólo con puntero real: en táctil no hay hover y el preview quedaría colgado.
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const update = () => setPeekEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // El offset va en el propio valor y no con clases -translate-*: Framer escribe
  // `transform` inline y pisaría cualquier translate de Tailwind.
  const handlePeekMove = (e) => {
    peekX.set(e.clientX - PEEK_W / 2);
    peekY.set(e.clientY - PEEK_H - 28);
  };

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

          {/* Nombre a gran escala: Montserrat extrabold en mayúsculas */}
          <h1 className="w-full font-extrabold uppercase tracking-tight leading-[0.9] text-[#1D212A] text-[clamp(2.5rem,9vw,8rem)]">
            {name.split(" ").map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.22em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <div className="mt-14 md:mt-20 flex flex-col gap-12 md:flex-row md:items-start md:gap-14 lg:gap-20">
            <div className="md:w-[60%] lg:w-[62%]">
              {/* Declaración: una palabra por span, resaltado con subrayado azul */}
              <p className="font-medium tracking-tight text-[#1D212A] leading-[1.22] text-[clamp(1.15rem,2.1vw,1.9rem)]">
                {introSegments.map((segment, si) => {
                  const words = segment.words.map(({ word, order, endsSegment }) => (
                    <motion.span
                      key={order}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.35 + order * 0.016, ease: [0.22, 1, 0.36, 1] }}
                      className={[
                        "inline-block",
                        segment.highlight && !endsSegment ? "pr-[0.26em]" : "mr-[0.26em]",
                        segment.highlight ? "border-b-[0.055em] border-[#385BF0]" : "",
                        segment.bold ? "font-bold" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {word}
                    </motion.span>
                  ));

                  if (!segment.peek) return <Fragment key={si}>{words}</Fragment>;

                  // Envoltura inline (no inline-block): su caja abarca las dos
                  // palabras y el espacio entre ellas, así el cursor no “sale”
                  // al cruzar de una a otra y el preview no parpadea.
                  return (
                    <span
                      key={si}
                      className="cursor-help transition-colors duration-300 hover:text-[#385BF0]"
                      onMouseEnter={() => setPeeking(true)}
                      onMouseLeave={() => setPeeking(false)}
                      onMouseMove={handlePeekMove}
                    >
                      {words}
                    </span>
                  );
                })}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
              >
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#1D212A] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#385BF0]"
                >
                  Write a message
                  <Send
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>

                <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
                  {socials.map(({ label, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#1D212A]/70 transition-colors duration-300 hover:text-[#385BF0]"
                      >
                        <Icon />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: photoY }}
              className="flex flex-1 justify-center [perspective:1100px] md:justify-end"
            >
              {/* El giro 3D vive aquí y no en el padre para no pelearse con el
                  parallax de scroll. Las clases hover:scale/rotate de Tailwind
                  no servirían: Framer escribe `transform` inline y las pisa. */}
              <motion.div
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
                style={{
                  rotate: photoRotate,
                  rotateX: tilt.rotateX,
                  rotateY: tilt.rotateY,
                  scale: tilt.scale,
                  transformStyle: "preserve-3d",
                }}
                className="relative w-full max-w-[300px] border border-black/5 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.14)] sm:max-w-[340px]"
              >
                {/* Marco de proporción fija + overflow-hidden: es lo que permite
                    recortar. El zoom se ajusta con scale, y el origin lo centra
                    en la cara en vez de en el medio de la foto. */}
                <div className="aspect-[3/4] w-full overflow-hidden [transform:translateZ(35px)]">
                  <img
                    src="/Me.jpg"
                    alt="Caroline Pérez"
                    width={675}
                    height={900}
                    className="h-full w-full origin-[50%_36%] scale-[1.45] object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Brillo que sigue al cursor, para vender la inclinación */}
                <motion.div
                  aria-hidden="true"
                  style={{ opacity: tilt.glareOpacity, background: tilt.glare }}
                  className="pointer-events-none absolute inset-3 mix-blend-soft-light"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ---------- Experience & Education ---------- */}
      <section className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16 py-24 md:py-36">
        <EntryGroup
          title="Experience"
          lead="Between freelance work and product teams, I've spent the last years designing and shipping interfaces: web apps, blogs and brand sites. Most of it sits between design and frontend, which is where I like it."
          entries={experience}
        />

        <div className="mt-24 md:mt-36">
          <EntryGroup title="Education" entries={education} />
        </div>

        <div className="mt-24 md:mt-36">
          <EntryGroup title="Certifications" entries={certifications} />
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

      {/* Fuera del <section> del hero, que tiene overflow-hidden */}
      {peekEnabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 overflow-hidden rounded-2xl shadow-2xl"
          style={{ x: peekSpringX, y: peekSpringY, width: PEEK_W, height: PEEK_H }}
          animate={{ opacity: peeking ? 1 : 0, scale: peeking ? 1 : 0.85 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={PEEK_IMAGE} alt="" className="h-full w-full object-cover" />
        </motion.div>
      )}
    </div>
  );
}
