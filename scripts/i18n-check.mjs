// Compara lo que el código pide traducir contra lo que hay en el diccionario.
//
// El diccionario se indexa por el texto en inglés, así que una traducción se
// queda huérfana en cuanto se retoca el original. Eso no rompe nada — `t()`
// devuelve la clave y la frase sale en inglés — pero tampoco se nota, y una
// página medio traducida es peor que uno sin traducir. Este script lo saca.
//
// Uso: npm run i18n:check
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import es from "../src/i18n/es.js";
import untranslated from "../src/i18n/untranslated.js";

const SRC = "src";
const SAME_IN_BOTH = new Set(untranslated);

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name !== "ui") walk(path, out);
    } else if (/\.(jsx?|tsx?)$/.test(name)) {
      out.push(path);
    }
  }
  return out;
};

// Campos de los ficheros de datos que el render pasa por t().
const DATA_FIELDS = {
  "src/components/projects/projects.jsx": ["title", "description", "industry", "toolkit"],
  "src/app/about/page.jsx": ["role", "date", "desc", "stack", "alt"],
  "src/components/workshowcase.jsx": ["alt", "category"],
  "src/components/navbar.jsx": ["label"],
};

// Props de JSX cuyo valor literal acaba pasando por t() dentro del componente.
// No se ven como llamadas a t() en ningún sitio, así que sin esta lista pasan
// desapercibidas: es lo que dejó "Experience", "Education" y "Certifications"
// sin traducir hasta que alguien lo vio en pantalla.
const JSX_PROPS = {
  "src/app/about/page.jsx": ["title", "lead"],
};

// En el fuente los saltos van escapados; al importar el diccionario ya vienen
// resueltos. Sin esto, "Beyond\nWork" nunca casaría consigo mismo.
const resolveEscapes = (key) => key.split("\\n").join("\n");

const used = new Set();

for (const path of walk(SRC)) {
  const src = readFileSync(path, "utf8");
  for (const m of src.matchAll(/(?<![A-Za-z])t\("([^"]*)"\)/g)) used.add(resolveEscapes(m[1]));
  for (const m of src.matchAll(/(?<![A-Za-z])t\('([^']*)'\)/g)) used.add(resolveEscapes(m[1]));
}

for (const [path, fields] of Object.entries(DATA_FIELDS)) {
  const src = readFileSync(path, "utf8");
  for (const field of fields) {
    // El lookahead descarta el primer trozo de las descripciones partidas con
    // `+`: ese trozo suelto no existe en tiempo de ejecución, sólo el entero.
    // Comillas dobles o simples: navbar declara sus etiquetas con simples.
    const single = new RegExp(`${field}:\\s*(?:"([^"]*)"|'([^']*)')(?!\\s*\\+)`, "g");
    for (const m of src.matchAll(single)) used.add(m[1] ?? m[2]);

    const joined = new RegExp(`${field}:\\s*\\n?\\s*((?:"[^"]*"\\s*\\+\\s*\\n?\\s*)+"[^"]*")`, "g");
    for (const m of src.matchAll(joined)) {
      used.add([...m[1].matchAll(/"([^"]*)"/g)].map((q) => q[1]).join(""));
    }
  }
}

for (const [path, props] of Object.entries(JSX_PROPS)) {
  const src = readFileSync(path, "utf8");
  for (const prop of props) {
    for (const m of src.matchAll(new RegExp(`\\b${prop}="([^"]*)"`, "g"))) used.add(m[1]);
  }
}

const translated = new Set(Object.keys(es));
const real = [...used].filter((k) => /[A-Za-zÀ-ÿ]/.test(k));

const missing = real.filter((k) => !translated.has(k) && !SAME_IN_BOTH.has(k));
const sameInBoth = real.filter((k) => SAME_IN_BOTH.has(k));
const orphans = [...translated].filter((k) => !used.has(k));

const show = (k) => JSON.stringify(k.slice(0, 100));

console.log(`traducidas   ${real.length - missing.length - sameInBoth.length}`);
console.log(`iguales      ${sameInBoth.length}  (nombres propios, stacks, fechas)`);
console.log(`pendientes   ${missing.length}`);
console.log(`huérfanas    ${orphans.length}`);

if (missing.length) {
  console.log("\nSin traducir (saldrán en inglés):");
  for (const k of missing) console.log(`  · ${show(k)}`);
}
if (orphans.length) {
  console.log("\nEn el diccionario pero ya no se usan (probable texto retocado):");
  for (const k of orphans) console.log(`  · ${show(k)}`);
}

process.exit(missing.length || orphans.length ? 1 : 0);
