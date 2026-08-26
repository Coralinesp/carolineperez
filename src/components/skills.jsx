import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Matter from "matter-js";

/**
 * Colores vivos calibrados para el fondo claro #f8f8f6: nada demasiado pálido,
 * o la píldora se perdería contra el fondo. `ink` sólo se declara en las
 * oscuras, donde el texto tiene que ir en blanco.
 */
const INK = "#0A0C16";

const technologies = [
  { label: "React", color: "#38BDF8" },
  { label: "JavaScript", color: "#FACC15" },
  { label: "Figma", color: "#FF6B4A" },
  { label: "Blender", color: "#FF8A1F" },
  { label: "Tailwind", color: "#2DD4BF" },
  { label: "HTML/CSS", color: "#F72585", ink: "#FFFFFF" },
  { label: "C#", color: "#A855F7", ink: "#FFFFFF" },
  { label: "Supabase", color: "#34D399" },
  { label: "SQL", color: "#FB7185" },
  { label: "GitHub", color: "#1D212A", ink: "#FFFFFF" },
  { label: "C++", color: "#3B82F6", ink: "#FFFFFF" },
  { label: "VS Code", color: "#22D3EE" },
  { label: "Claude", color: "#E8845C" },
  { label: "Spline", color: "#EC4899", ink: "#FFFFFF" },
  { label: "Slack", color: "#7C3AED", ink: "#FFFFFF" },
];

/**
 * Las píldoras son nodos del DOM (así conservan tipografía y color reales) y
 * matter-js sólo aporta la simulación: cada frame copiamos la posición y el
 * ángulo del cuerpo al `transform` de su nodo.
 */
function FallingPills() {
  const sceneRef = useRef(null);
  const pillRefs = useRef([]);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const scene = sceneRef.current;
    if (!scene) return;

    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;
    let frame;
    const timers = [];

    const engine = Engine.create();
    engine.gravity.y = 1.1;

    const width = scene.clientWidth;
    const height = scene.clientHeight;

    // Paredes invisibles: suelo y laterales. Sin techo, para que entren desde arriba.
    const wall = { isStatic: true, restitution: 0.2 };
    Composite.add(engine.world, [
      Bodies.rectangle(width / 2, height + 40, width * 2, 80, wall),
      Bodies.rectangle(-40, height / 2, 80, height * 4, wall),
      Bodies.rectangle(width + 40, height / 2, 80, height * 4, wall),
    ]);

    // Medimos cada píldora ya renderizada en vez de estimar su ancho.
    const sizes = pillRefs.current.map((el) => ({
      w: el.offsetWidth,
      h: el.offsetHeight,
    }));

    const bodies = sizes.map((s) =>
      Bodies.rectangle(
        // margen de medio ancho para que no nazcan encajadas en una pared
        s.w / 2 + Math.random() * Math.max(width - s.w, 1),
        -60 - Math.random() * 120,
        s.w,
        s.h,
        {
          chamfer: { radius: s.h / 2 }, // esquinas redondeadas: ruedan como píldoras
          restitution: 0.32,
          friction: 0.45,
          frictionAir: 0.015,
          angle: (Math.random() - 0.5) * 0.7,
        }
      )
    );

    // Arrastrar con el cursor. Sólo con puntero fino: en táctil, matter bloquea
    // el scroll de la página al capturar los eventos.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) {
      const mouse = Mouse.create(scene);
      // matter engancha la rueda para hacer zoom; sin esto no se puede scrollear
      // la página con el cursor encima de la sección.
      mouse.element.removeEventListener("wheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      Composite.add(
        engine.world,
        MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.15, render: { visible: false } },
        })
      );
    }

    const runner = Runner.create();

    const draw = () => {
      bodies.forEach((body, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        const { x, y } = body.position;
        el.style.transform = `translate(${x - sizes[i].w / 2}px, ${
          y - sizes[i].h / 2
        }px) rotate(${body.angle}rad)`;
      });
      frame = requestAnimationFrame(draw);
    };

    // Sueltan de una en una cuando la sección entra en pantalla.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setReady(true);
        Runner.run(runner, engine);
        frame = requestAnimationFrame(draw);
        bodies.forEach((body, i) => {
          timers.push(setTimeout(() => Composite.add(engine.world, body), i * 110));
        });
      },
      { threshold: 0, rootMargin: "300px 0px 0px 0px" }
    );
    observer.observe(scene);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(engine.world, false);
    };
    // El tamaño del contenedor entra en el cálculo, así que reconstruimos al
    // cambiar de tamaño mediante la `key` que pone el padre.
  }, [reduced]);

  if (reduced) {
    return (
      <div className="flex flex-wrap justify-center gap-3 px-4 sm:px-6 md:px-10 lg:px-16">
        {technologies.map(({ label, color, ink }) => (
          <span
            key={label}
            style={{ backgroundColor: color, color: ink ?? INK }}
            className="rounded-full px-5 py-3 text-base font-bold uppercase tracking-tight sm:px-8 sm:py-4 sm:text-2xl md:px-10 md:py-5 md:text-3xl"
          >
            {label}
          </span>
        ))}
      </div>
    );
  }

  // El alto va ajustado a lo que ocupa el montón: todo lo que sobre por encima
  // queda en blanco. En móvil hace falta algo más, porque al ser estrecho apila
  // más filas.
  return (
    <div
      ref={sceneRef}
      className="relative h-[340px] w-full select-none overflow-hidden md:h-[360px]"
    >
      {technologies.map(({ label, color, ink }, i) => (
        <span
          key={label}
          ref={(el) => (pillRefs.current[i] = el)}
          style={{
            backgroundColor: color,
            color: ink ?? INK,
            // Antes de que empiece la simulación quedarían apiladas en la
            // esquina; las escondemos hasta el primer frame.
            opacity: ready ? 1 : 0,
          }}
          className="absolute left-0 top-0 cursor-grab whitespace-nowrap rounded-full px-5 py-3 text-base font-bold uppercase tracking-tight will-change-transform active:cursor-grabbing sm:px-8 sm:py-4 sm:text-2xl md:px-10 md:py-5 md:text-3xl"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export default function TechnicalArsenal() {
  const [sceneKey, setSceneKey] = useState(0);

  // El ancho del contenedor define paredes y posiciones de salida, así que al
  // redimensionar hay que rehacer la escena entera.
  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setSceneKey((k) => k + 1), 300);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  // Sin encabezado ni relleno superior: continúa el fondo claro del Statement
  // y las píldoras entran desde arriba, como si cayeran desde ese texto.
  return (
    <section aria-label="Technologies" className="relative w-full overflow-hidden bg-[#f8f8f6] pb-24 md:pb-32">
      <FallingPills key={sceneKey} />
    </section>
  );
}
