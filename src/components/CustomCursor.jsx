import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  // Criticamente amortiguado (damping = 2*sqrt(k*m)) y con el triple de
  // frecuencia que antes: el punto sigue teniendo algo de arrastre, que es la
  // gracia, pero sin quedarse atras del puntero real.
  const springX = useSpring(cursorX, { damping: 30, stiffness: 900, mass: 0.25 });
  const springY = useSpring(cursorY, { damping: 30, stiffness: 900, mass: 0.25 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    const updateEnabled = () => setEnabled(mq.matches);
    updateEnabled();
    mq.addEventListener("change", updateEnabled);
    return () => mq.removeEventListener("change", updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target;
      setIsPointer(Boolean(target.closest("a, button, [role='button'], input, textarea, select")));
    };

    window.addEventListener("mousemove", move);
    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{ scale: isPointer ? 1.8 : 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-3 h-3 rounded-full bg-[#385BF0]"
      />
    </motion.div>
  );
}
