import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MdEmail } from "react-icons/md";
import { FaLinkedin, FaBehance, FaInstagram } from "react-icons/fa";
import Spline from '@splinetool/react-spline';

// Componentes internos
import Navbar from "./components/navbar";
import Skills from './components/skills';
import Services from './components/services';
import SelectedWorks from './components/works';
import CallToAction from './components/cierre';
import AnimatedSplitText from './components/AnimatedSplitText';
import Statement from './components/Statement';
import { useLenis } from './components/SmoothScroll';

function App() {
  const [showButton, setShowButton] = useState(false);
  const location = useLocation();
  const lenisRef = useLenis();

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
          <section className="hero-section min-h-screen w-full sticky top-0 z-0 flex flex-col md:flex-row items-center justify-between md:justify-end px-4 pt-16 pb-8 sm:px-6 md:px-10 lg:px-16 overflow-hidden">

            {/* Columna Izquierda: Escena 3D Spline (full-bleed en desktop) */}
            <div className="w-full h-[60vh] md:h-auto relative md:absolute md:inset-y-0 md:left-0 md:w-1/2 z-10 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full scale-110 md:scale-125 translate-y-10 md:translate-y-20 origin-center">
                <Spline
                  scene="https://prod.spline.design/mKcp412gK4944JjS/scene.splinecode"
                />
              </div>
            </div>

            {/* Cuadrante decorativo sobre la marca de agua de Spline */}
            <div className="hidden md:block absolute top-0 left-[30%] w-[24%] h-28 lg:h-32 bg-[#f8f8f6] z-20 pointer-events-none" />

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
            </motion.div>

          </section>

          {/* Statement inmersivo */}
          <Statement />
        </div>

        {/* Contenedor de Secciones */}
        <div className="w-full">
          <Skills />
          <div className="space-y-24 md:space-y-32 py-24 md:py-36">
            <Services />
            <div id="work"><SelectedWorks /></div>
          </div>
          <div id="contact"><CallToAction /></div>
        </div>
      </main>

      {/* Footer inmersivo — continúa el cierre oscuro del CTA */}
      <footer className="relative z-10 w-full bg-[#0A0C16] text-white px-4 sm:px-6 md:px-10 lg:px-16 pt-16 pb-10 border-t border-white/10">
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/10">
            <span className="font-display italic text-4xl sm:text-6xl md:text-7xl tracking-tight text-white">
              Caroline Pérez
            </span>

            <div className="flex flex-col items-start md:items-end gap-4">
              <a
                href="mailto:perezcruzcaroline@gmail.com"
                className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#708AFB]/20 transition-colors">
                  <MdEmail size={18} />
                </div>
                <span className="text-sm font-medium">perezcruzcaroline@gmail.com</span>
              </a>

              <div className="flex items-center gap-4">
                {[
                  { icon: <FaLinkedin size={18} />, href: "https://linkedin.com/in/..." },
                  { icon: <FaBehance size={18} />, href: "https://behance.net/..." },
                  { icon: <FaInstagram size={18} />, href: "https://instagram.com/..." }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 text-white/50 hover:bg-[#708AFB]/20 hover:text-white transition-all hover:-translate-y-0.5"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-white/30">
            <span>© {new Date().getFullYear()} Caroline Pérez · Creative Engineer</span>
            <span>Designed &amp; built in Santo Domingo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;