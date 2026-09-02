import { useState, useCallback, useRef } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface ScrambleOptions {
  speed?: number; // Milisegundos entre fotogramas
  steps?: number; // Cantidad de fotogramas totales por transicion
}

export const useScramble = (options: ScrambleOptions = {}) => {
  const { speed = 30, steps = 20 } = options;
  const [displayText, setDisplayText] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scrambleTo = useCallback(
    (fromText: string, toText: string): Promise<void> => {
      return new Promise((resolve) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsAnimating(true);

        let currentStep = 0;

        timerRef.current = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;

          // Ajuste del tamaño de la cadena intermedia
          const intermediateLength = Math.round(
            fromText.length + (toText.length - fromText.length) * progress,
          );

          // Generación del texto aleatorio
          const randomString = Array.from({
            length: Math.max(0, intermediateLength),
          })
            .map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
            .join("");

          setDisplayText(randomString);

          if (currentStep >= steps) {
            if (timerRef.current) clearInterval(timerRef.current);
            setDisplayText("");
            setIsAnimating(false);
            resolve();
          }
        }, speed);
      });
    },
    [speed, steps],
  );

  const cancelAnimation = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setDisplayText("");
    setIsAnimating(false);
  }, []);

  return { displayText, isAnimating, scrambleTo, setDisplayText, cancelAnimation };
};
