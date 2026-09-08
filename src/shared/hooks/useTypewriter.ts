import { useState, useEffect } from "react";

export function useTypewriter(text: string, enabled: boolean = true, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }

    let currentIndex = 0;
    setDisplayedText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      currentIndex++;
      setDisplayedText(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, enabled, speed]);

  return { displayedText, isComplete };
}
