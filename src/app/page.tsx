import { projects } from "./projects";
import { skillGroups } from "./skills";
import { Avatar } from "./pixel/Avatar";
import { CopyEmail } from "./pixel/CopyEmail";
import { Header } from "./pixel/Header";
import { PixelRoom } from "./pixel/PixelRoom";

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
  { years: "Feb 2026–now", company: "Nx Growth Partners", role: "Forward Deployed Engineer" },
  { years: "2026", company: "Rosehill Design Build", role: "Freelance Web Developer" },
  { years: "Jan–Aug 2026", company: "Humber Polytechnic", role: "Graduate certificate, artificial intelligence with machine learning" },
  { years: "Jul 2024–Dec 2025", company: "Mentera", role: "Full-Stack Developer" },
  { years: "Jan–Jul 2024", company: "Rebelsnow", role: "Web Developer Intern" },
  { years: "Sept 2023–Aug 2025", company: "Humber Polytechnic", role: "Diploma, computer programming" },
];

const alsoList = ["Meta Front-End Developer certification.", "Meta UI/UX Design certification."];

const specs = [
  { term: "Now", value: "Forward deployed engineer at Nx Growth Partners" },
  { term: "Previously", value: "Full-stack developer at Mentera" },
  { term: "Based in", value: "Ontario, Canada" },
];

const EMAIL = "pravdeepkk@gmail.com";
const GITHUB = "https://github.com/PravdeepK";
const LINKEDIN = "https://www.linkedin.com/in/pravdeepk/";

function SectionHead({ index, title, id, note }: { index: string; title: string; id: string; note?: string }) {
  return (
    <div className="section__head">
      <span className="section__index">{index}</span>
      <h2 id={id}>{title}</h2>
      {note && <p className="section__note">{note}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <Header />

      <main className="wrap" id="top">
        <p className="sr-only">
          Hi, I&apos;m Pravdeep. I&apos;m a forward deployed engineer and full-stack developer. Welcome to my
          website. I work in React, Next.js, TypeScript, Node.js, Python, Claude API, RAG, AI agents, FastAPI,
          Firebase, PyTorch, scikit-learn, and whatever the problem needs.
        </p>
        <PixelRoom />

        <section className="intro" aria-labelledby="hero-title">
          <div>
            <h1 id="hero-title">
              I do a bit of everything, <em>and I do it well.</em>
            </h1>
            <p className="intro__context">
              Forward Deployed Engineer at Nx Growth Partners. Previously a full-stack developer at Mentera, an AI
              platform for private practices and medspas. I hold a graduate certificate in AI with machine learning
              from Humber.
            </p>
            <div className="intro__links">
              <a className="btn btn--solid" href="#work">
                Selected work &darr;
              </a>
              <a className="btn" href={GITHUB} target="_blank" rel="me noreferrer">
                GitHub &#8599;
              </a>
              <a className="btn" href={LINKEDIN} target="_blank" rel="me noreferrer">
                LinkedIn &#8599;
              </a>
            </div>
          </div>

          <div className="lift">
            <div className="sheet panel notch">
              <div className="sheet__head">
                <Avatar />
                <div>
                  <p className="sheet__name">Pravdeep Kullar</p>
                  <p className="sheet__role">Forward deployed and full-stack engineer</p>
                </div>
              </div>
              <dl>
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
              </dl>
            </div>
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-title">
          <SectionHead index="01" title="About" id="about-title" note="Written by me, not a model." />
          <div className="lift">
            <div className="panel notch prose">
              <p className="prose__lead">The problems I like are the ones where the model isn&apos;t the hard part.</p>
              <p>
                I&apos;m a Forward Deployed Engineer and full-stack developer with over 2 years of hands-on experience
                in React, Next.js, TypeScript and Node.js, plus Python on the ML side. At Nx Growth Partners I work
                directly with client teams to scope AI and software problems into clear milestones and ship them.
                Before that I was a full-stack developer at Mentera, an AI platform for private practices and medspas,
                where I built features for the product, including the Canvas panel for Tera, its assistant, which
                renders the artifacts Tera streams back. Earlier I interned at Rebelsnow building client e-commerce
                sites.
              </p>
              <p>
                I hold a graduate certificate in AI with machine learning from Humber, which was mostly useful for
                knowing what a model can and can&apos;t be asked to do. I have working Claude API integrations for text
                and vision, and I use Claude Code and Cursor every day.
              </p>
              <p>
                Outside of work I build things I want to use myself. A multiplayer Wordle clone with real-time rooms,
                auth, and a socket server I deployed myself. A tool that reads a photo of my class timetable and hands
                back calendar events. A Raspberry Pi that watches Cineplex for ticket on-sale times. Countdown widgets
                for the iOS Home Screen. Making the interface not feel slow is usually the interesting part.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="work" aria-labelledby="work-title">
          <SectionHead
            index="02"
            title="Selected work"
            id="work-title"
            note="Twelve projects. Some were paid, the rest I built because I wanted the thing to exist."
          />
          <div className="quests">
            {projects.map((project) => (
              <div className="lift" key={project.number}>
                <article className="quest panel notch" id={`project-${project.number}`}>
                  <div className="quest__bar">
                    <span className="label">
                      {project.number} / {project.category}
                    </span>
                    {project.ticket && <span className="label">{project.ticket}</span>}
                  </div>
                  <div className={`quest__body${project.figure ? "" : " quest__body--wide"}`}>
                    <div>
                      <h3>
                        {project.href ? (
                          <a
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
                      <p className="quest__desc">{project.description}</p>
                      {project.detail && (
                        <div className="note">
                          <h4>{project.noteLabel ?? "Note"}</h4>
                          <p>{project.detail}</p>
                        </div>
                      )}
                    </div>
                    {project.figure && (
                      <figure className="plate">
                        {project.figure}
                        <figcaption>{project.caption}</figcaption>
                      </figure>
                    )}
                  </div>
                  <div className="quest__foot">
                    <ul className="inventory" aria-label="Stack">
                      {project.meta.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <div className="quest__actions">
                      {project.secondaryHref && (
                        <a className="btn btn--small" href={project.secondaryHref} target="_blank" rel="noreferrer">
                          {project.secondaryLabel} &#8599;
                        </a>
                      )}
                      {project.href && (
                        <a className="btn btn--solid btn--small" href={project.href} target="_blank" rel="noreferrer">
                          {project.linkLabel} &#8599;
                        </a>
                      )}
                      {!project.href && project.status && <span className="quest__status">{project.status}</span>}
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-title">
          <SectionHead index="03" title="Skills" id="skills-title" />
          <div className="lift">
            <div className="panel notch rows rows--skills">
              {skillGroups.map((group) => (
                <div className="rows__item" key={group.label}>
                  <span className="rows__code">{group.label}</span>
                  <ul className="inventory">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="coursework" aria-labelledby="coursework-title">
          <SectionHead
            index="04"
            title="Coursework"
            id="coursework-title"
            note="Humber Polytechnic, January to August 2026. Model work run locally on an M4 MacBook through the MPS backend."
          />
          <div className="lift">
            <div className="panel notch rows">
              {coursework.map((item) => (
                <div className="rows__item" key={item.code}>
                  <span className="rows__code">{item.code}</span>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="history" aria-labelledby="history-title">
          <SectionHead index="05" title="Where I've been" id="history-title" />
          <div className="lift">
            <div className="panel notch ledger">
              {experience.map((item) => (
                <div className="ledger__row" key={item.company + item.years}>
                  <p className="ledger__year">{item.years}</p>
                  <h3>{item.company}</h3>
                  <p className="ledger__role">{item.role}</p>
                </div>
              ))}
              <div className="ledger__also">
                <h3>Also</h3>
                <ul>
                  {alsoList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-title">
          <SectionHead index="06" title="Contact" id="contact-title" />
          <div className="lift">
            <div className="panel notch contact">
              <p className="contact__lead">
                Got something you want <em>built?</em>
              </p>
              <p className="contact__copy">
                I&apos;m open to frontend and full-stack roles, and I take freelance work. If the idea isn&apos;t
                figured out yet that&apos;s fine, I&apos;d rather hear it early. Email is the fastest way to reach me.
              </p>
              <div className="contact__actions">
                <a className="contact__email" href={`mailto:${EMAIL}`}>
                  {EMAIL} &#8599;
                </a>
                <CopyEmail email={EMAIL} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <p>Built by Pravdeep Kullar</p>
          <div className="footer__links">
            <a href={GITHUB} target="_blank" rel="me noreferrer">
              GitHub
            </a>
            <a href={LINKEDIN} target="_blank" rel="me noreferrer">
              LinkedIn
            </a>
            <a href="#top">Back to top &uarr;</a>
          </div>
          <p>Ontario, Canada · 2026</p>
        </div>
      </footer>
    </>
  );
}
