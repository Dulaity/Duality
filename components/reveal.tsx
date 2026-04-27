"use client";

import type { HTMLAttributes, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

type RevealTag = "article" | "div" | "main" | "section";

type RevealProps = {
  as?: RevealTag;
  delay?: number;
} & HTMLAttributes<HTMLElement>;

export function Reveal({
  as = "div",
  delay = 0,
  className,
  children,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => {
        setVisible(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    const fallback = window.setTimeout(() => {
      setVisible(true);
    }, 900);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.clearTimeout(fallback);
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px 18% 0px",
      },
    );

    observer.observe(node);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const combinedClassName = `reveal${visible ? " reveal-in" : ""}${className ? ` ${className}` : ""}`;
  const combinedStyle = {
    ...style,
    transitionDelay: `${delay}ms`,
  };

  if (as === "section") {
    return (
      <section
        ref={ref as RefObject<HTMLElement>}
        className={combinedClassName}
        style={combinedStyle}
        {...rest}
      >
        {children}
      </section>
    );
  }

  if (as === "article") {
    return (
      <article
        ref={ref as RefObject<HTMLElement>}
        className={combinedClassName}
        style={combinedStyle}
        {...rest}
      >
        {children}
      </article>
    );
  }

  if (as === "main") {
    return (
      <main
        ref={ref as RefObject<HTMLElement>}
        className={combinedClassName}
        style={combinedStyle}
        {...rest}
      >
        {children}
      </main>
    );
  }

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      className={combinedClassName}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}
