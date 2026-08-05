"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  CommerceFigure,
  ModelsFigure,
  ScoreBars,
  SocketFigure,
  StreamFigure,
  TimetableFigure,
  VerificationFigure,
} from "./figures";

type Project = {
  number: string;
  title: string;
  category: string;
  ticket?: string;
  description: string;
  /** What broke, what it cost, or where it stands. */
  detail?: string;
  noteLabel?: string;
  meta: string[];
  figure?: React.ReactNode;
  caption?: string;
  /** Omit while a project has nowhere public to point yet. */
  href?: string;
  linkLabel?: string;
  status?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const projects: Project[] = [
  {
    number: "01",
    title: "Tera canvas panel",
    category: "Mentera",
    ticket: "MS-161",
    description:
      "Tera answered everything as a wall of chat text. I built a side panel that catches its output and renders it as it streams in over the WebSocket: markdown, code, raw HTML, SVG, Mermaid and React.",
    detail:
      "Half an SVG is not valid SVG. The panel buffers by block type and hands a block over once its closing delimiter arrives. The buffering code is ugly. The flickering stopped.",
    noteLabel: "What was hard",
    figure: <StreamFigure />,
    caption: "Fig. 01 · Buffer, then render",
    meta: ["React", "Next.js", "TypeScript", "WebSocket", "Vercel"],
    href: "https://mentera.ai",
    linkLabel: "Visit Mentera",
  },
  {
    number: "02",
    title: "96 on mobile",
    category: "Mentera",
    description:
      "The marketing site was slow on phones and the hero video was most of the reason. I compressed it, moved around thirty images to next/image, self-hosted the fonts, deferred Google Tag Manager, and switched Framer Motion to LazyMotion.",
    detail:
      "2.3 second LCP on throttled 4G, no layout shift. Measured 4 August 2026 on Lighthouse 13.",
    noteLabel: "Result",
    figure: (
      <ScoreBars
        title="Mentera marketing site: 96 on mobile against a target of 65, 100 on desktop against a target of 75."
        rows={[
          { label: "Mobile", value: 96, target: 65 },
          { label: "Desktop", value: 100, target: 75 },
        ]}
      />
    ),
    caption: "Fig. 02 · PageSpeed against target",
    meta: ["Next.js", "next/image", "LazyMotion", "Vercel"],
    href: "https://mentera.ai",
    linkLabel: "See the site",
  },
  {
    number: "03",
    title: "Rosehill Design Build",
    category: "Client work",
    description:
      "Rosehill is a design build contractor in the GTA. Their old site was a template carrying a hero video far too large for mobile data, so the first thing a client saw on their phone was a white screen. I rebuilt it in Next.js, pointed the GoDaddy DNS at Vercel, and wrote proper OG tags so their link previews stopped looking broken. Most of the win came from the video, which is still the largest paint on mobile at 3.2 seconds.",
    detail:
      "The owner had no interest in learning a CMS, so feedback ran through a Notion board and I made the edits myself. That was faster for both of us, and it means the site still comes back to me when a phone number changes.",
    noteLabel: "Trade-off",
    figure: (
      <ScoreBars
        title="Rosehill: 90 on mobile, 100 on desktop, 100 for SEO."
        rows={[
          { label: "Mobile", value: 90 },
          { label: "Desktop", value: 100 },
          { label: "SEO", value: 100 },
        ]}
      />
    ),
    caption: "Fig. 03 · Lighthouse, 4 August 2026",
    meta: ["Next.js", "Vercel", "GoDaddy DNS", "Notion"],
    href: "https://www.rosehilldesignbuild.com/",
    linkLabel: "Open live site",
  },
  {
    number: "04",
    title: "Rebelsnow",
    category: "E-commerce platform",
    description:
      "A year on the storefront, remote, from January 2024 to January 2025. I built the product and promotional landing pages, then the reusable pieces underneath them: checkout, payments, and catalog management.",
    detail:
      "Checkout got the most test coverage. It's the one flow where a bug costs the store money instead of just looking wrong.",
    noteLabel: "How it was tested",
    figure: <CommerceFigure />,
    caption: "Fig. 04 · Storefront chain",
    meta: [
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "Jest",
      "React Testing Library",
    ],
    href: "https://www.rebel-snow.com/",
    linkLabel: "Visit the store",
  },
  {
    number: "05",
    title: "FakeWordle",
    category: "Personal project",
    description:
      "fakewordle.com is Wordle, except you play it against someone else. Firebase handles accounts and history, a small WebSocket server on Railway runs the live match, and Claude generates the word lists.",
    detail:
      "Firestore was the wrong tool for the match loop. Every keystroke that mattered was a write and you could feel the lag. I moved the in-match state onto the socket server and only wrote the final result to Firestore, which fixed it.",
    noteLabel: "What went wrong",
    figure: <SocketFigure />,
    caption: "Fig. 05 · Where the state lives",
    meta: [
      "Next.js 15",
      "Firebase Auth",
      "Firestore",
      "WebSocket on Railway",
      "Claude API",
    ],
    href: "https://www.fakewordle.com",
    linkLabel: "Play a game",
    secondaryHref: "https://github.com/PravdeepK/wordle-clone",
    secondaryLabel: "Source",
  },
  {
    number: "06",
    title: "Schedule to calendar",
    category: "Personal project",
    description:
      "I got tired of typing my class timetable into a calendar every semester. This reads a screenshot with Claude's vision API and hands back an ICS file.",
    detail:
      "The model was the easy part. Timetables are grids where the position of a cell carries the meaning, so the parsing had to keep where something sat as well as what it said.",
    noteLabel: "What was hard",
    figure: <TimetableFigure />,
    caption: "Fig. 06 · Cell to event",
    meta: ["Next.js", "Claude vision API", "ICS"],
    href: "https://schedule-to-calendar-two.vercel.app",
    linkLabel: "Try the tool",
    secondaryHref: "https://github.com/PravdeepK/schedule-to-calendar",
    secondaryLabel: "Source",
  },
  {
    number: "07",
    title: "Health risk classifier",
    category: "Capstone, AIGC 5005",
    description:
      "My capstone. It classifies health risk and compares logistic regression against a multilayer perceptron, with a FastAPI backend and a Next.js frontend.",
    detail:
      "I did the data prep and the evaluation, then built the frontend, because a confusion matrix in a notebook is not a demo anyone outside the program can read.",
    noteLabel: "My part",
    figure: <ModelsFigure />,
    caption: "Fig. 07 · Same inputs, two models",
    meta: ["Python", "PyTorch", "scikit-learn", "FastAPI", "Next.js"],
    status: "Not public yet",
  },
  {
    number: "08",
    title: "HuntigoX",
    category: "Capstone, trust and safety",
    description:
      "A job board that checks the employer before a candidate applies. It cross-checks business registration and document data against the listing, scores the posting for anomalies, and handles the Canadian compliance side, including LMIA reference checks and PIPEDA-conscious data handling.",
    detail:
      "I built the candidate and employer interfaces, including the verification flow and the scorecard evaluators see. On the ML side I worked on the anomaly detection and the legitimacy scoring behind those results.",
    noteLabel: "My part",
    figure: <VerificationFigure />,
    caption: "Fig. 08 · Verification output, illustrative",
    meta: ["React", "Next.js", "TypeScript", "Python", "REST APIs"],
    status: "Not public yet",
  },
];

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
    years: "2026–now",
    company: "Mentera",
    role: "Software Developer",
  },
  {
    years: "Jan–Aug 2026",
    company: "Humber Polytechnic",
    role: "Graduate certificate, artificial intelligence with machine learning",
  },
  {
    years: "2024–2025",
    company: "Rebelsnow",
    role: "Software Developer",
  },
];

const alsoList = [
  "Diploma, computer programming. Humber Polytechnic, GPA 3.9.",
  "Computer engineering technology. Humber Polytechnic.",
  "Meta Front-End Developer certification.",
  "Meta UI/UX Design certification.",
];

const specs = [
  { term: "Now", value: "Software developer at Mentera" },
  { term: "Studying", value: "AI and machine learning at Humber Polytechnic" },
  {
    term: "Working on",
    value: "The canvas panel for Tera, Mentera's assistant",
  },
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
  "PostgreSQL",
  "Firebase",
  "FastAPI",
  "Python",
  "PyTorch",
  "scikit-learn",
  "Claude API",
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
        "I'm a full-stack developer.",
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
            My day job is at Mentera, an AI platform for private practices and
            medspas. I&apos;m also finishing a graduate certificate in AI and
            machine learning at Humber.
          </motion.p>

          <motion.div className="masthead__links" {...fade(0.26)}>
            <a className="button button--solid" href="#work">
              Selected work <Arrow diagonal={false} />
            </a>
            <a
              className="button"
              href="https://github.com/PravdeepK"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <Arrow />
            </a>
            <a
              className="button"
              href="https://linkedin.com/in/pravdeepk"
              target="_blank"
              rel="noreferrer"
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
                I&apos;m a software developer at Mentera, an AI platform for
                private practices and medspas. I work on the frontend, mostly on
                the parts people touch directly. Most recently that&apos;s the
                canvas panel: the assistant streams its output over a WebSocket
                and the panel renders whatever comes back.
              </p>
              <p>
                Before Mentera I spent a year at Rebelsnow and built client
                sites. The Humber certificate has been useful mostly for knowing
                what a model can&apos;t do, which saves a lot of time when
                someone asks for it anyway.
              </p>
              <p>
                Outside of work I build things I want to use myself. A
                multiplayer Wordle clone. A tool that reads a screenshot of my
                class timetable and hands back a calendar file. Making the
                interface not feel slow is usually the interesting part.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="work" className="section">
          <Rail
            index="02"
            label="Selected work"
            note="Eight projects. Some were paid, the rest I built because I wanted the thing to exist."
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
                    {project.href ? (
                      <span className="record__cta" aria-hidden="true">
                        {project.linkLabel} <Arrow />
                      </span>
                    ) : (
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

        <section className="section" aria-labelledby="coursework-label">
          <Rail
            index="03"
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
          <Rail index="04" label="Where I've been" id="history-label" />
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
          <Rail index="05" label="Contact" />
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
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/pravdeepk"
              target="_blank"
              rel="noreferrer"
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
