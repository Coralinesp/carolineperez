import { useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

const SPRING = { stiffness: 220, damping: 22, mass: 0.5 };

/**
 * Inclinación 3D que sigue al cursor.
 *
 * Guarda la posición del puntero cruda (-0.5 a 0.5 en cada eje) y deriva de ahí
 * los valores animados con muelle, para que el giro persiga al cursor con
 * inercia en vez de saltar.
 *
 * El nodo que reciba `rotateX`/`rotateY` necesita un ancestro con `perspective`
 * y, si quiere profundidad interna, `transformStyle: "preserve-3d"` propio. Ojo:
 * un `overflow-hidden` en ese mismo nodo aplana el 3D y anula los translateZ de
 * sus hijos.
 */
export default function useTilt({
  max = 15,
  hoverScale = 1.04,
  glareColor = "rgba(255,255,255,0.85)",
  glareOpacity: maxGlare = 0.55,
} = {}) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const hovering = useMotionValue(0);

  // rotateX invertido: con el cursor abajo debe hundirse el borde inferior.
  const rotateX = useSpring(useTransform(pointerY, (v) => -v * max), SPRING);
  const rotateY = useSpring(useTransform(pointerX, (v) => v * max), SPRING);
  const scale = useSpring(useTransform(hovering, [0, 1], [1, hoverScale]), SPRING);

  const glareOpacity = useSpring(useTransform(hovering, [0, 1], [0, maxGlare]), SPRING);
  const glareX = useSpring(useTransform(pointerX, (v) => 50 + v * 90), SPRING);
  const glareY = useSpring(useTransform(pointerY, (v) => 50 + v * 90), SPRING);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor}, rgba(255,255,255,0) 60%)`;

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
    hovering.set(1);
  };

  const onMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    hovering.set(0);
  };

  return { rotateX, rotateY, scale, glare, glareOpacity, onMouseMove, onMouseLeave };
}
