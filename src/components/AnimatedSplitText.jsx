import { useEffect, useRef, useState, useMemo } from 'react';
import { animate, stagger } from '@motionone/dom';

const useIntersection = (options) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
};

export default function TechUXAnimatedText({ onAnimationEnd }) {
  // 1. Contenido enfocado en Ingeniería de Software y Especialidad UX
  const rawText = "I’m a software engineer focused on building functional and modern digital experiences. I specialize in integrating engineering principles with user-centered design to develop intuitive interfaces that combine technical precision with high visual impact.";
  
  const [ref, isVisible] = useIntersection({ threshold: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const scopeRef = useRef(null);

  // 2. Palabras clave de Ingeniería y UX para resaltar
  const words = useMemo(() => {
    const highlights = ["software", "engineer", "functional", "user-centered", "design", "precision"];
    return rawText.split(' ').map((word, i) => ({
      id: i,
      text: word,
      isHighlight: highlights.includes(word.replace(/[,.]/g, ''))
    }));
  }, [rawText]);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      animate(
        ".animate-word",
        { opacity: [0, 1], transform: ['translateY(15px)', 'translateY(0)'] },
        { 
          delay: stagger(0.04), 
          duration: 0.6, 
          easing: [0.17, 0.67, 0.83, 0.67] 
        }
      ).finished.then(() => {
        setHasAnimated(true);
        if (onAnimationEnd) onAnimationEnd();
      });
    }
  }, [isVisible, hasAnimated, onAnimationEnd]);

  return (
    <p
      ref={ref}
      className="text-[#1D212A] text-justify sm:text-center text-sm sm:text-lg md:text-xl lg:text-2xl font-light max-w-5xl leading-relaxed"
      aria-label={rawText}
    >
      <span ref={scopeRef} aria-hidden="true">
        {words.map((word) => (
          <span
            key={word.id}
            className="animate-word inline-block mr-[0.25em]"
            style={{ 
              opacity: 0, 
              color: word.isHighlight ? '#4459E1' : 'inherit', 
              fontWeight: word.isHighlight ? '500' : 'inherit'
            }}
          >
            {word.text}
          </span>
        ))}
      </span>
    </p>
  );
}