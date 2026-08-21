"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  CommerceFigure,
  EnrollFigure,
  ModelsFigure,
  QuoteFigure,
  ScoreBars,
  SocketFigure,
  StreamFigure,
  TimetableFigure,
  VerificationFigure,
  WorkflowFigure,
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
    title: "Tera",
    category: "Mentera",
    description:
      "Mentera is an AI platform for private practices and medspas. Tera is the assistant inside it, and staff lean on it in the middle of a working day. I build the parts they touch, most recently the panel where everything Tera produces gets rendered as it streams in, instead of arriving as a wall of chat text.",
    detail:
      "Content arrives in pieces, and drawing a piece before it's finished makes the panel flicker. Each block now waits until it's whole before any of it renders. The code that does the waiting is ugly. The flickering stopped.",
    noteLabel: "The hard part",
    figure: <StreamFigure />,
    caption: "Fig. 01 · Buffer, then render",
    meta: ["React", "Next.js", "TypeScript", "WebSocket", "Vercel"],
    href: "https://mentera.ai",
    linkLabel: "Visit Mentera",
  },
  {
    number: "02",
    title: "Making sites fast and findable",
    category: "Mentera and Rosehill",
    description:
      "Two of the sites I've worked on had the same two problems: they were slow on a phone, and search engines weren't reading them properly. A heavy hero video was the biggest culprit on both. I worked through the video and the images, the fonts, and the scripts sitting in front of the first thing you see, then the metadata and page structure that search engines read.",
    detail:
      "Mentera scores 96 on a phone and 100 on desktop. Rosehill scores 90 and 100, with a perfect score for search. On a slow connection the main content lands in about two seconds, and neither page jumps around while it loads.",
    noteLabel: "Where it landed",
    figure: (
      <ScoreBars
        title="PageSpeed scores: Mentera 96 on mobile and 100 on desktop, Rosehill 90 on mobile and 100 on desktop."
        rows={[
          { label: "Mentera, mobile", value: 96 },
          { label: "Mentera, desktop", value: 100 },
          { label: "Rosehill, mobile", value: 90 },
          { label: "Rosehill, desktop", value: 100 },
        ]}
      />
    ),
    caption: "Fig. 02 · PageSpeed, both sites",
    meta: ["Core Web Vitals", "SEO", "Next.js", "Vercel"],
  },
  {
    number: "03",
    title: "Rosehill Design Build",
    category: "Client work",
    description:
      "Rosehill is a design build contractor in the GTA. Their old site was a template, and on a phone it opened on a white screen because of the hero video. I rebuilt the site, pointed their domain at the new one, and fixed the previews so sharing a link stopped looking broken. Most of the win came from the video, which is still the slowest thing on the page.",
    detail:
      "The owner had no interest in learning a CMS, so changes came to me through a Notion board and I made them myself. That was faster for both of us, and it means a new phone number still has to come through me.",
    noteLabel: "Trade-off",
    figure: (
      <WorkflowFigure />
    ),
    caption: "Fig. 03 · How an edit reaches the site",
    meta: ["Next.js", "Vercel", "GoDaddy DNS", "Notion"],
    href: "https://www.rosehilldesignbuild.com/",
    linkLabel: "Open live site",
  },
  {
    number: "04",
    title: "CH Logistics",
    category: "Client work",
    description:
      "CH Logistics is a freight carrier in Burlington that runs loads across every Canadian province and territory and the 48 contiguous states. Quoting happened on the phone, so the site had to do the two things a phone call was doing: explain the six services, from full truckload down to temperature-controlled, and take a quote request with enough on it to price a load. The form asks for origin, destination, and service type, because that's the minimum dispatch needs before they can answer.",
    detail:
      "A quote request arrives as an email and nothing marks it as answered. The 24 hour reply the confirmation screen promises holds because someone is watching that inbox, not because the site enforces it. At their volume that's cheaper than a CRM, and it's the first thing I'd replace if the volume changes.",
    noteLabel: "Trade-off",
    figure: <QuoteFigure />,
    caption: "Fig. 04 · Where a quote goes",
    meta: ["Next.js", "TypeScript", "Route handlers", "Vercel"],
    href: "https://www.chlogistics.ca/",
    linkLabel: "Open live site",
  },
  {
    number: "05",
    title: "Rising Sun Montessori School",
    category: "Client work",
    description:
      "Rising Sun is a WASC accredited Montessori school in El Dorado Hills, California, teaching transitional kindergarten through middle school. The people reading the site are parents choosing a school, so the navigation is built on the four programs instead of on the school: each grade band has its own page, and the campus and gallery pages are there because parents want to see a classroom before they agree to visit one.",
    detail:
      "Enrollment doesn't happen on the site. Applications hand off to Transparent Classroom, which the school already runs, and a tour is booked by emailing the office, because tours are Wednesday mornings only and one person keeps that calendar. Two of the three things a parent came to do finish somewhere I don't control. Building either one on the site would have meant keeping a second copy of records the school already has.",
    noteLabel: "Trade-off",
    figure: <EnrollFigure />,
    caption: "Fig. 05 · What a parent came to do",
    meta: ["WordPress", "Elementor", "Transparent Classroom"],
    href: "https://risingsunmontessori.org/",
    linkLabel: "Open live site",
  },
  {
    number: "06",
    title: "Rebelsnow",
    category: "E-commerce platform",
    description:
      "Rebelsnow sells clothing online. I spent a year on the storefront, remote, building the pages customers land on and the parts they buy through: the catalog, the cart, checkout and payment.",
    detail:
      "Checkout got the most testing, because it's the one place where a bug costs the store a sale instead of just looking wrong.",
    noteLabel: "Where the risk was",
    figure: <CommerceFigure />,
    caption: "Fig. 06 · Storefront chain",
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
    number: "07",
    title: "FakeWordle",
    category: "Personal project",
    description:
      "fakewordle.com is Wordle, except you play it against someone else. You open a room, send someone the code, and race them in real time with a chat running alongside. Accounts and past games are saved, and Claude writes the word lists.",
    detail:
      "I ran the live game straight off the database to begin with, which meant a write for every letter a player typed, and you could feel the delay. Moving the match onto its own live server fixed it, and the database only stores the result now.",
    noteLabel: "What went wrong",
    figure: <SocketFigure />,
    caption: "Fig. 07 · Where the state lives",
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
    number: "08",
    title: "Schedule to calendar",
    category: "Personal project",
    description:
      "Every semester I typed my class timetable into a calendar by hand. Now I upload a screenshot of the timetable and get back a calendar file that imports straight into Google Calendar or Outlook.",
    detail:
      "The model was the easy part. A timetable is a grid where position carries the meaning: where a class sits tells you when it is, so parsing the text alone throws away half the information.",
    noteLabel: "The hard part",
    figure: <TimetableFigure />,
    caption: "Fig. 08 · Cell to event",
    meta: ["Next.js", "Claude vision API", "ICS"],
    href: "https://schedule-to-calendar-two.vercel.app",
    linkLabel: "Try the tool",
    secondaryHref: "https://github.com/PravdeepK/schedule-to-calendar",
    secondaryLabel: "Source",
  },
  {
    number: "09",
    title: "Health risk classifier",
    category: "Capstone, AIGC 5005",
    description:
      "One of my two capstones. It takes health data and predicts risk, and the point of the project was putting a plain statistical model up against a small neural network on the same data to see what the extra complexity actually bought.",
    detail:
      "I prepared the data and ran the comparison between the two models, then built the interface for it, because a page of numbers in a notebook is not something you can put in front of anyone outside the program.",
    noteLabel: "My part",
    figure: <ModelsFigure />,
    caption: "Fig. 09 · Same inputs, two models",
    meta: ["Python", "PyTorch", "scikit-learn", "FastAPI", "Next.js"],
    status: "Not public yet",
  },
  {
    number: "10",
    title: "HuntigoX",
    category: "Capstone, AIGC 5505",
    description:
      "Fake job postings are a real problem for people applying for work in Canada. HuntigoX checks the employer behind a listing before anyone applies: it confirms the business is real and registered, then scores the posting against the patterns that show up in scams. The compliance side is built around Canadian hiring rules.",
    detail:
      "I built what candidates and employers actually see, including the verification steps and the scorecard at the end of them. On the model side I worked on spotting the patterns that mark a listing as suspect.",
    noteLabel: "My part",
    figure: <VerificationFigure />,
    caption: "Fig. 10 · Verification output, illustrative",
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
                I&apos;m a developer at Mentera, an AI platform for private
                practices and medspas. My current project is the canvas panel
                for Tera, our assistant, which renders whatever the model
                streams back over a WebSocket. Before that I spent a year at
                Rebelsnow building client sites.
              </p>
              <p>
                I&apos;m finishing a graduate certificate in AI and machine
                learning at Humber, which has mostly been useful for knowing
                what a model can and can&apos;t be asked to do.
              </p>
              <p>
                Outside of work I build things I want to use myself. A
                multiplayer Wordle clone with real-time rooms, auth, and a
                socket server I deployed myself. A tool that reads a screenshot
                of my class timetable and hands back a calendar file. Making the
                interface not feel slow is usually the interesting part.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="work" className="section">
          <Rail
            index="02"
            label="Selected work"
            note="Ten projects. Some were paid, the rest I built because I wanted the thing to exist."
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
