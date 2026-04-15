import { ReactNode, useRef, useEffect, useState } from "react";

const SectionFadeIn = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-80px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in-section${visible ? " is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionFadeIn;
