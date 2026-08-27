import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { ArrowUpRight, Laptop } from 'lucide-react';
// Componentes internos
import Navbar from "./components/navbar";
import Skills from './components/skills';
import WorkShowcase from './components/workshowcase';
import CallToAction from './components/cierre';
import AnimatedSplitText from './components/AnimatedSplitText';
import Statement from './components/Statement';
import { useLenis } from './components/SmoothScroll';
import useMediaQuery from './hooks/useMediaQuery';
import useNearViewport from './hooks/useNearViewport';
// Import diferido: asi el runtime de Spline queda en su propio chunk y el
// telefono, que nunca lo monta, tampoco lo descarga.
const Spline = lazy(() => import('@splinetool/react-spline'));

function App() {
  const [showButton, setShowButton] = useState(false);
  const location = useLocation();
  const lenisRef = useLenis();

  // La escena 3D solo se monta en desktop...
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // ...y solo cuando el hero esta cerca. Al entrar por /#work la pagina arranca
  // desplazada hasta el showcase, con el hero muy por encima: sin esto se
  // descargaba y se inicializaba el runtime de Spline (~973 kB y un contexto
  // WebGL) durante el propio scroll de entrada, que es el tiron que se nota.
  const heroRef = useRef(null);
  const heroNear = useNearViewport(heroRef);
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        if (lenisRef?.current) {
          lenisRef.current.scrollTo(el, { offset: -80 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [location, lenisRef]);
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f6] text-[#1D212A] selection:bg-indigo-500/30">
      
      <Navbar />
      <main className="relative z-10 flex flex-col items-center">
        {/* Wrapper que acota el rango de "pin" del hero a solo Hero + Statement */}
        <div className="relative w-full">
          {/* Hero Section con 3D integrado */}
          <section ref={heroRef} className="hero-section min-h-screen w-full sticky top-0 z-0 flex flex-col md:flex-row items-center justify-center md:justify-end px-4 pt-16 pb-8 sm:px-6 md:px-10 lg:px-16 overflow-hidden">
            {/* Columna Izquierda: Escena 3D Spline (full-bleed en desktop).
                En movil no se monta: en vertical la escena queda recortada, se
                come 60vh del hero y arrastra la marca de agua por encima. */}
            {isDesktop && heroNear && (
              <div className="w-full h-[60vh] md:h-auto relative md:absolute md:inset-y-0 md:left-0 md:w-1/2 z-10 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full scale-110 md:scale-125 translate-y-10 md:translate-y-20 origin-center">
                  <Suspense fallback={null}>
                    <Spline
                      scene="https://prod.spline.design/mKcp412gK4944JjS/scene.splinecode"
                    />
                  </Suspense>
                </div>
              </div>
            )}
            {/* Parche sobre la marca de agua de Spline.
                Todo va en unidades relativas porque la insignia escala con el
                lienzo, que es la mitad del ancho de la ventana; en px se queda
                corto en pantallas grandes.
                La esquina de abajo a la izquierda va cortada en diagonal: la
                insignia se apoya justo encima del cartel de WORK, que está
                inclinado, así que una caja recta lo bastante ancha para taparla
                entera se comía la punta del cartel. El corte es paralelo a su
                borde superior, así que el parche puede llegar a la izquierda sin
                bajar nunca por debajo de él. */}
            <div
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 18% 100%, 0 82%)" }}
              className="hidden md:block absolute top-0 left-[25%] w-[29%] h-[9vw] bg-[#f8f8f6] z-20 pointer-events-none"
            />
            {/* Columna Derecha: Nombre y Título */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-copy text-right w-full md:w-1/2 md:ml-auto z-20 pointer-events-none mt-8 md:mt-0"
            >
              <p className="hero-kicker text-indigo-400 font-medium tracking-widest uppercase mb-2">
                Software Engineer
              </p>
              <h1 className="hero-title text-5xl md:text-7xl font-extrabold tracking-tight">
                Caroline Pérez
              </h1>

              {/* Sustituye a la escena 3D en movil, en voz baja */}
              {!isDesktop && (
                <p className="mt-8 flex items-center justify-end gap-2 text-xs font-normal normal-case tracking-normal text-black/35">
                  <Laptop size={14} className="shrink-0" aria-hidden="true" />
                  There&rsquo;s a 3D scene here &mdash; best viewed on a laptop.
                </p>
              )}
            </motion.div>
          </section>
          {/* Statement inmersivo */}
          <Statement />
        </div>
        {/* Contenedor de Secciones */}
        <div className="w-full">
          <Skills />
          <div className="space-y-24 md:space-y-32 py-24 md:py-36">
            {/* Servicios y proyectos comparten sección: la tarjeta elegida
                viaja de una zona a la otra y necesita medir ambas. */}
            <div id="work"><WorkShowcase /></div>
          </div>
          <div id="contact"><CallToAction /></div>
        </div>
      </main>
    </div>
  );
}
export default App;