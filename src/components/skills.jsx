const technologies = [
  "Blender",
  "React",
  "Figma",
  "JavaScript",
  "Claude",
  "C++",
  "Tailwind",
  "VS Code",
  "SQL",
  "C#",
  "GitHub",
  "Supabase",
  "HTML/CSS",
  "Slack",
];

const accentIndexes = new Set([1, 4, 8, 11]);

function TickerRow({ items, direction, duration, size }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className={`flex items-center w-max ${size} font-extrabold uppercase tracking-tight whitespace-nowrap animate-ticker`}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {doubled.map((tech, i) => {
          const isAccent = accentIndexes.has(i % items.length);
          return (
            <span key={`${tech}-${i}`} className="flex items-center">
              <span
                className={
                  isAccent
                    ? "text-[#708AFB] px-4 sm:px-6"
                    : "text-outline text-white/70 px-4 sm:px-6"
                }
              >
                {tech}
              </span>
              <span className="text-white/20 text-2xl sm:text-3xl">✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function TechnicalArsenal() {
  return (
    <section className="relative w-full bg-[#0A0C16] py-24 md:py-32 overflow-hidden">
      <div aria-hidden="true" className="grain-overlay" />

      <div
        aria-hidden="true"
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #385BF0, transparent 70%)" }}
      />

      <div className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-16 flex items-end justify-between mb-14 md:mb-20">
        <div>
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 font-medium">
            01 Toolkit
          </span>
          <h2 className="mt-3 font-display italic text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Technologies &amp; Frameworks
          </h2>
        </div>
        <span className="hidden sm:block text-sm text-white/40 max-w-[220px] text-right leading-relaxed">
          Herramientas que uso a diario para diseñar, construir y dar vida a cada proyecto.
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-2 sm:gap-4">
        <TickerRow items={technologies} direction="left" duration={38} size="text-4xl sm:text-6xl md:text-7xl" />
        <TickerRow items={technologies} direction="right" duration={44} size="text-3xl sm:text-5xl md:text-6xl" />
      </div>
    </section>
  );
}
