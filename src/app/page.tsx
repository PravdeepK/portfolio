"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { projects } from "./projects";
import { skillGroups } from "./skills";

const coursework = [
  {
    code: "AIGC 5500 · Deep learning",
    body: "Fully connected variational autoencoder on CIFAR-10. The torchvision mirror was crawling, so I wrote a parallel downloader and pulled the archive myself. The reconstructions came back as coloured blur, which is what a fully connected encoder does to 32x32 colour images. The assignment was about the VAE and not the architecture, so I left it and wrote up why a convolutional encoder would fix it.",
  },
  {
    code: "AIGC 5502 · Computer vision",
    body: "ResNet18 cat and dog classifier with best-epoch checkpointing and MPS support, plus a set of image processing labs.",
  },
  {
    code: "AIGC 5501 · NLP",
    body: "Toxic comment detection on the Jigsaw dataset for the midterm, using SVM over Word2Vec and Doc2Vec embeddings. Earlier work covered named entity recognition, TF-IDF, and LSTM sentiment analysis.",
  },
  {
    code: "AIGC 5504 · Big data and RL",
    body: "A VAR and Hive assignment, a GAN in TensorFlow and Keras generating synthetic patient vitals, and a Thompson Sampling lab.",
  },
  {
    code: "AIGC 5503 · Data mining",
    body: "Market basket analysis with Apriori, and seasonal decomposition on time series. Group presentation reviewing the ReCANet paper on repeat consumption in recommender systems.",
  },
];

const experience = [
  {
    years: "Feb 2026–now",
    company: "Nx Growth Partners",
    role: "Forward Deployed Engineer",
  },
  {
    years: "2026",
    company: "Rosehill Design Build",
    role: "Freelance Web Developer",
  },
  {
    years: "Jan–Aug 2026",
    company: "Humber Polytechnic",
    role: "Graduate certificate, artificial intelligence with machine learning",
  },
  {
    years: "Jul 2024–Dec 2025",
    company: "Mentera",
    role: "Full-Stack Developer",
  },
  {
    years: "Jan–Jul 2024",
    company: "Rebelsnow",
    role: "Web Developer Intern",
  },
  {
    years: "Sept 2023–Aug 2025",
    company: "Humber Polytechnic",
    role: "Diploma, computer programming",
  },
];

const alsoList = [
  "Computer engineering technology. Humber Polytechnic.",
  "Meta Front-End Developer certification.",
  "Meta UI/UX Design certification.",
];

const specs = [
  { term: "Now", value: "Forward deployed engineer at Nx Growth Partners" },
  { term: "Previously", value: "Full-stack developer at Mentera" },
  { term: "Based in", value: "Ontario, Canada" },
];

const sections = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

const EMAIL = "pravdeepkk@gmail.com";

function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true" className="arrow">
      {diagonal ? "↗" : "↓"}
    </span>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Rail({
  index,
  label,
  note,
  id,
}: {
  index: string;
  label: string;
  note?: string;
  id?: string;
}) {
  return (
    <div className="rail">
      <span className="rail__index">{index}</span>
      <h2 className="rail__label" id={id}>
        {label}
      </h2>
      {note && <p className="rail__note">{note}</p>}
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <a className="wordmark" href="#top">
          Pravdeep Kullar
          <span className="wordmark__role">Developer</span>
        </a>
        <nav aria-label="Main">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "is-active" : undefined}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Claude API",
  "RAG",
  "AI agents",
  "FastAPI",
  "Firebase",
  "PyTorch",
  "scikit-learn",
  "and whatever the problem needs",
];

/** Line one: the intro, played once, landing on the sign-off. */
function IntroLine({ onDone }: { onDone: () => void }) {
  return (
    <TypeAnimation
      aria-hidden="true"
      sequence={[
        "Hi, I'm Pravdeep,",
        1400,
        "I'm a forward deployed engineer and full-stack developer.",
        1400,
        "Welcome to my website!",
        1200,
        onDone,
      ]}
      wrapper="span"
      speed={60}
      cursor={false}
    />
  );
}

/** Line two: the skills, cycling for as long as the page is open. */
function SkillsLine() {
  return (
    <TypeAnimation
      aria-hidden="true"
      sequence={SKILLS.flatMap((skill) => [skill, 1400])}
      wrapper="span"
      speed={60}
      cursor={false}
      repeat={Infinity}
    />
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(EMAIL);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Copied" : "Copy address"}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${EMAIL} copied to clipboard` : ""}
      </span>
    </button>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const fade = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <Header />

      <main id="top" className="doc">
        <section className="masthead" aria-labelledby="hero-title">
          <motion.div className="greeting-stack" {...fade(0.05)}>
            <p className="sr-only">
              Hi, I&apos;m Pravdeep. Welcome to my website. I work in{" "}
              {SKILLS.join(", ")}.
            </p>
            <p className="greeting">
              {reduceMotion ? (
                <span aria-hidden="true">Welcome to my website!</span>
              ) : (
                <IntroLine onDone={() => setIntroDone(true)} />
              )}
              {!reduceMotion && !introDone && (
                <span className="greeting__cursor" aria-hidden="true" />
              )}
            </p>
            <p className="greeting greeting--skills">
              {reduceMotion ? (
                <span aria-hidden="true">{SKILLS.join(", ")}</span>
              ) : (
                introDone && <SkillsLine />
              )}
              {!reduceMotion && introDone && (
                <span className="greeting__cursor" aria-hidden="true" />
              )}
            </p>
          </motion.div>

          <motion.h1 id="hero-title" {...fade(0.12)}>
            I do a bit of everything, <em>and I do it well.</em>
          </motion.h1>

          <motion.p className="masthead__context" {...fade(0.2)}>
            Forward Deployed Engineer at Nx Growth Partners. Previously a
            full-stack developer at Mentera, an AI platform for private
            practices and medspas. I hold a graduate certificate in AI with machine learning
            from Humber.
          </motion.p>

          <motion.div className="masthead__links" {...fade(0.26)}>
            <a className="button button--solid" href="#work">
              Selected work <Arrow diagonal={false} />
            </a>
            <a
              className="button"
              href="https://github.com/PravdeepK"
              target="_blank"
              rel="me noreferrer"
            >
              GitHub <Arrow />
            </a>
            <a
              className="button"
              href="https://www.linkedin.com/in/pravdeepk/"
              target="_blank"
              rel="me noreferrer"
            >
              LinkedIn <Arrow />
            </a>
          </motion.div>

          <motion.div className="masthead__rule" {...fade(0.32)} />

          <motion.dl className="spec" {...fade(0.38)}>
            {specs.map(({ term, value }) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div>
              <dt>Status</dt>
              <dd>
                <span className="status-chip">Open to new work</span>
              </dd>
            </div>
          </motion.dl>
        </section>

        <section id="about" className="section">
          <Rail index="01" label="About" note="Written by me, not a model." />
          <div>
            <Reveal>
              <p className="about__lead">
                The problems I like are the ones where the model isn&apos;t the
                hard part.
              </p>
            </Reveal>
            <Reveal delay={0.06} className="about__copy">
              <p>
                I&apos;m a Forward Deployed Engineer and full-stack developer
                with over 2 years of hands-on experience in React, Next.js,
                TypeScript and Node.js, plus Python on the ML side. At
                Nx Growth Partners I work directly with client teams to scope AI
                and software problems into clear milestones and ship them.
                Before that I was a full-stack developer at Mentera, an AI
                platform for private practices and medspas, where I built
                features for the product, including the Canvas panel for Tera,
                its assistant, which renders the artifacts Tera streams back.
                Earlier I interned at Rebelsnow building client
                e-commerce sites.
              </p>
              <p>
                I hold a graduate certificate in AI with machine learning from
                Humber, which was mostly useful for knowing what a model can
                and can&apos;t be asked to do. I have working Claude API
                integrations for text and vision, and I use Claude Code and
                Cursor every day.
              </p>
              <p>
                Outside of work I build things I want to use myself. A
                multiplayer Wordle clone with real-time rooms, auth, and a
                socket server I deployed myself. A tool that reads a photo of my
                class timetable and hands back calendar events. A Raspberry Pi
                that watches Cineplex for ticket on-sale times. Countdown
                widgets for the iOS Home Screen. Making the interface not feel
                slow is usually the interesting part.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="work" className="section">
          <Rail
            index="02"
            label="Selected work"
            note="Twelve projects. Some were paid, the rest I built because I wanted the thing to exist."
          />
          <div className="records">
            {projects.map((project) => (
              <Reveal key={project.number}>
                <article
                  className={`record${project.href ? "" : " record--static"}`}
                  onClick={(event) => {
                    if (!project.href) return;
                    // Real links keep their own behaviour.
                    if ((event.target as HTMLElement).closest("a, button"))
                      return;
                    // A drag that selected text in this record is a read, not
                    // a click. Selections elsewhere on the page don't count.
                    const selection = window.getSelection();
                    if (
                      selection &&
                      !selection.isCollapsed &&
                      selection.anchorNode &&
                      event.currentTarget.contains(selection.anchorNode)
                    )
                      return;
                    window.open(project.href, "_blank", "noopener,noreferrer");
                  }}
                >
                  <p className="record__meta">
                    <span>{project.number}</span>
                    <span className="sep" aria-hidden="true">
                      /
                    </span>
                    <span>{project.category}</span>
                    {project.ticket && (
                      <>
                        <span className="sep" aria-hidden="true">
                          /
                        </span>
                        <span className="ticket">{project.ticket}</span>
                      </>
                    )}
                  </p>

                  <h3 className="record__title">
                    {project.href ? (
                      <a
                        className="record__link"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title}, ${project.linkLabel}, opens in a new tab`}
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>

                  <div
                    className={`record__body${
                      project.figure ? "" : " record__body--wide"
                    }`}
                  >
                    <div>
                      <p className="record__description">
                        {project.description}
                      </p>
                      {project.detail && (
                        <div className="record__note">
                          <h4>{project.noteLabel ?? "Note"}</h4>
                          <p>{project.detail}</p>
                        </div>
                      )}
                    </div>
                    {project.figure && (
                      <figure className="figure">
                        {project.figure}
                        <figcaption>{project.caption}</figcaption>
                      </figure>
                    )}
                  </div>

                  <p className="record__foot">
                    <span className="stackline">
                      {project.meta.map((tag, index) => (
                        <span key={tag}>
                          {index > 0 && (
                            <span className="sep" aria-hidden="true">
                              {" · "}
                            </span>
                          )}
                          {tag}
                        </span>
                      ))}
                    </span>
                    {project.href && (
                      <span className="record__cta" aria-hidden="true">
                        {project.linkLabel} <Arrow />
                      </span>
                    )}
                    {!project.href && project.status && (
                      <span className="record__status">{project.status}</span>
                    )}
                    {project.secondaryHref && (
                      <a
                        className="record__secondary"
                        href={project.secondaryHref}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.secondaryLabel} <Arrow />
                      </a>
                    )}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="skills-label">
          <Rail index="03" label="Skills" id="skills-label" />
          <div className="course-list">
            {skillGroups.map((group, index) => (
              <Reveal key={group.label} delay={index * 0.04}>
                <div className="course-list__row">
                  <span className="course-code">{group.label}</span>
                  <p>{group.items.join(", ")}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="coursework-label">
          <Rail
            index="04"
            label="Coursework"
            id="coursework-label"
            note="Humber Polytechnic, January to August 2026. Model work run locally on an M4 MacBook through the MPS backend."
          />
          <div className="course-list">
            {coursework.map((item, index) => (
              <Reveal key={item.code} delay={index * 0.04}>
                <div className="course-list__row">
                  <span className="course-code">{item.code}</span>
                  <p>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="history-label">
          <Rail index="05" label="Where I've been" id="history-label" />
          <div>
            <div className="ledger">
              {experience.map((item, index) => (
                <Reveal key={item.company + item.years} delay={index * 0.05}>
                  <div className="ledger__row">
                    <p className="ledger__year">{item.years}</p>
                    <h3>{item.company}</h3>
                    <p className="ledger__role">{item.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="also">
              <h3>Also</h3>
              <ul>
                {alsoList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="section contact">
          <Rail index="06" label="Contact" />
          <div>
            <Reveal>
              <h2>
                Got something you want <em>built?</em>
              </h2>
              <p className="contact__copy">
                I&apos;m open to frontend and full-stack roles, and I take
                freelance work. If the idea isn&apos;t figured out yet
                that&apos;s fine, I&apos;d rather hear it early. Email is the
                fastest way to reach me.
              </p>
              <div className="contact__actions">
                <a className="contact__email" href={`mailto:${EMAIL}`}>
                  {EMAIL} <Arrow />
                </a>
                <CopyEmail />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer>
        <div className="doc footer__inner">
          <p>Built by Pravdeep Kullar</p>
          <div className="footer__links">
            <a
              href="https://github.com/PravdeepK"
              target="_blank"
              rel="me noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/pravdeepk/"
              target="_blank"
              rel="me noreferrer"
            >
              LinkedIn
            </a>
            <a href="#top">Back to top ↑</a>
          </div>
          <p>Ontario, Canada · 2026</p>
        </div>
      </footer>
    </>
  );
}
