"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

/** Off the homepage the section links point back to it, since the sections only exist there. */
export function Header({ home = "" }: { home?: string }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="bar lift">
      <div className="bar__inner panel notch">
        <a className="wordmark" href={home || "#top"}>
          Pravdeep Kullar <small>Developer</small>
        </a>
        <nav aria-label="Main">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`${home}#${id}`}
              className={active === id ? "is-active" : undefined}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </a>
          ))}
          <Link href="/services">Services</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
