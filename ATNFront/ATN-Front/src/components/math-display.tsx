import { useEffect, useRef } from "react";

interface MathDisplayProps {
  latex: string;
  className?: string;
  block?: boolean;
}

export function MathDisplay({
  latex,
  className = "",
  block = false,
}: MathDisplayProps) {
  const mathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKaTeX = async () => {
      if (typeof window === "undefined" || !mathRef.current) return;

      // Load KaTeX CSS
      if (!document.querySelector('link[href*="katex"]')) {
        const katexCSS = document.createElement("link");
        katexCSS.rel = "stylesheet";
        katexCSS.href =
          "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.css";
        document.head.appendChild(katexCSS);
      }

      // Load KaTeX JS
      if (!window.katex) {
        const katexScript = document.createElement("script");
        katexScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.js";
        document.head.appendChild(katexScript);
        await new Promise((resolve) => {
          katexScript.onload = resolve;
        });
      }

      // Render the math
      if (window.katex && latex) {
        try {
          window.katex.render(latex, mathRef.current, {
            displayMode: block,
            throwOnError: false,
            errorColor: "#ef4444",
            macros: {
              "\\f": "f(x)",
            },
          });
        } catch (error) {
          console.warn("KaTeX rendering error:", error);
          if (mathRef.current) {
            mathRef.current.textContent = latex;
          }
        }
      }
    };

    loadKaTeX();
  }, [latex, block]);

  return <div ref={mathRef} className={className} />;
}
