/**
 * Textos que se escriben igual en inglés y en español, y que por eso no llevan
 * entrada en el diccionario.
 *
 * Existe para que `npm run i18n:check` distinga entre "esto no hace falta
 * traducirlo" y "esto se quedó sin traducir". Sin la lista, los nombres propios
 * y los stacks aparecerían siempre como pendientes y el aviso dejaría de mirarse.
 */
const untranslated = [
  "UX/UI",
  "Frontend",
  "BMO 3D",
  "Figma",
  "Blender",
  "Blender, Adobe Illustrator",
  "Blender, fSpy",
  "Figma, Canva",
  "Figma, Design Systems, User Flows",
  "Figma, Google Sheets",
  "Figma, Prototyping, UX Research",
  "Figma, React, Tailwind CSS",
  "Figma (advanced prototyping) · Claude Code · Design Systems · WCAG",
  "Figma (advanced prototyping) · UX Research · Design Systems · WCAG",
  "React · HTML · CSS · JavaScript · Figma",
  "React · HTML · CSS · JavaScript · Figma · Clickup",
  "React, JavaScript, Figma, Tailwind CSS",
  "React, OpenWeather API, Tailwind CSS, V0",
  "React, Tailwind CSS, Figma, Canva",
  "React, Tailwind CSS, Figma, Framer Motion",
  "React, Tailwind CSS, Figma, Lucide Icons",
  "React, Tailwind CSS, V0, Lucide Icons",
  "React, VS Code, Canva",
  "React, Vite, V0, Tailwind CSS",
  "React Esencial",
  "C# .NET Básico",
  "Jun 2025",
  "Jun 2026",
  "Sep 2025",
  "Nov 2025 - Mar 2026",
];

export default untranslated;
