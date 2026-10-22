import Link from "next/link";
import { projects } from "../projects";
import { Avatar } from "../pixel/Avatar";
import { JsonLd } from "./_components/JsonLd";
import { Breadcrumb, ReviewButton, ReviewCta, SectionHead } from "./_components/parts";
import {
  AREA_SERVED,
  BRAND,
  BUSINESS_ID,
  EMAIL,
  GITHUB,
  HOME_CRUMB,
  LINKEDIN,
  PERSON_ID,
  SERVICES_CRUMB,
  SITE,
  breadcrumbJsonLd,
  pageMetadata,
  servicePages,
  servicePath,
  webPageJsonLd,
} from "./_components/site";

const PATH = "/services";
const TITLE = "WordPress to Modern Site Migration, Ontario | Built by Prav";
const DESCRIPTION =
  "I move Ontario small businesses off slow WordPress sites onto fast custom sites with no plugins to update. Old URLs redirected. Redesigns too. Free site review.";

export const metadata = pageMetadata({ path: PATH, title: TITLE, description: DESCRIPTION });

const problems = [
  {
    label: "Endless plugin updates",
    body: "A WordPress site has a core, a theme and a handful of plugins, and each one needs updates. Most reported WordPress vulnerabilities are in plugins. An update that breaks the layout is common enough that some owners stop updating at all.",
  },
  {
    label: "Slow on phones",
    body: "A lot of visitors to a local business site are on a phone, sometimes on mobile data. If the page takes several seconds to show anything, some of them leave before they see what you do.",
  },
  {
    label: "Unclear next step",
    body: "If a visitor has to hunt for your phone number or the quote form, some will call the next business in the search results instead. The thing you want them to do should be visible without scrolling.",
  },
  {
    label: "Hard to edit",
    body: "Changing your hours shouldn't mean logging into a page builder nobody has the password for, or waiting a week on whoever built the site years ago.",
  },
  {
    label: "Missing from local search",
    body: "Page titles that don't say what you do or where, no mention of the area you serve, and slow load times all make it harder for Google to show you to people searching nearby.",
  },
];

const steps = [
  {
    title: "Free review",
    body: "You send your website address. I check its speed on mobile and desktop, use it on a phone, look at how it shows up in Google, and email back what I'd fix first.",
  },
  {
    title: "Plan and quote",
    body: "We talk through what the site needs to do and which pages it needs. You get a page list and a written quote before anything is built.",
  },
  {
    title: "Build",
    body: "I build the new site on a private preview link, so you can click through it on your own phone and send changes before it goes live.",
  },
  {
    title: "Launch and care",
    body: "I point your domain at the new site, redirect the old addresses, and check it in Google Search Console. After launch I can keep handling edits and updates.",
  },
];

/** Rendered as <details> and as FAQPage JSON-LD from this one list, so the two always match. */
const faqs = [
  {
    question: "What's in the free website review?",
    answer:
      "I run your site through Google PageSpeed Insights on mobile and desktop, use it on a phone the way a customer would, check how your pages show up in Google search results, and note anything that makes it hard to call you or ask for a quote. You get a short summary by email with what I'd fix first. There's no obligation to hire me afterwards.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "WordPress migrations and redesigns start at $2,500 CAD. The final price depends on how many pages the site needs and which features it has, and the quote is fixed after the free review, before work starts. A speed and SEO tune-up is included in every migration and redesign, and on its own it starts at $750 CAD.",
  },
  {
    question: "How long does it take?",
    answer:
      "Usually 2 to 4 weeks from the free review to launch, depending on how quickly the content and photos come in.",
  },
  {
    question: "How does payment work?",
    answer:
      "A 50% deposit to start and the other 50% at launch. After launch, care plans are $75 or $150 CAD a month, month to month.",
  },
  {
    question: "Will a new website hurt my Google ranking?",
    answer:
      "It shouldn't, if the move is handled carefully. I keep pages that already rank at the same address where I can, set up permanent (301) redirects for any address that changes, and submit the new sitemap in Google Search Console after launch. Rankings can wobble for a few weeks while Google recrawls the site.",
  },
  {
    question: "Can I edit the site myself after launch?",
    answer:
      "Yes, as an optional paid add-on, quoted separately. After launch you get your own login to a simple editing dashboard, similar to WordPress, where you can update text, swap images and add posts. You can't install plugins or change the layout, so nothing breaks and nothing needs updating. Some owners would rather not edit at all. Rosehill sends changes through a shared Notion board and I make them, which is faster for both of us but means even a new phone number goes through me.",
  },
  {
    question: "Do I have to move off WordPress?",
    answer:
      "Not if your WordPress site is fast, up to date and easy for you to edit. If that's the case, I'll tell you in the free review. Moving pays off when the site is slow on phones, the plugins are years out of date, or simple changes keep breaking the layout.",
  },
  {
    question: "Do I need a whole new website, or just some fixes?",
    answer:
      "Not always a new one. If the review shows the problem is a heavy video, oversized images or a phone number buried in the footer, fixing those on your current site can be enough, and I'll tell you that. A redesign makes sense when the fixes would cost close to a rebuild anyway.",
  },
];

/** Summaries written for business owners. The homepage entries carry more build detail. */
const featured = [
  {
    number: "04",
    summary:
      "Rosehill is a design-build contractor in Ontario. Their old site was a template, and on a phone it opened on a white screen while the hero video loaded. I rebuilt it as a Next.js site on Vercel, compressed the video with ffmpeg, set up the domain and DNS, and added the tags that make a shared link show a proper preview.",
    noteLabel: "Still unfinished",
    note: "The hero video is still the slowest thing on the page, even after the compression and the R2 fallback.",
    results: [
      { value: "90", label: "PageSpeed, mobile" },
      { value: "100", label: "PageSpeed, desktop" },
      { value: "100", label: "SEO score" },
    ],
    resultsSource: "Google PageSpeed Insights, August 2026.",
  },
  {
    number: "05",
    summary:
      "Rising Sun is a WASC-accredited Montessori school teaching transitional kindergarten through middle school. The people reading the site are parents choosing a school, so the navigation follows the four programs, with campus and gallery pages for parents who want to see a classroom before they visit one. It's built on WordPress and Elementor, so I know these sites inside out before I move one.",
    noteLabel: "Trade-off",
    note: "Applications hand off to Transparent Classroom, which the school already runs, and tours are booked by email. Building either on the site would have meant keeping a second copy of records the school already has.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...webPageJsonLd({ path: PATH, title: TITLE, description: DESCRIPTION }),
      about: { "@id": BUSINESS_ID },
      mainEntity: { "@id": BUSINESS_ID },
    },
    breadcrumbJsonLd([HOME_CRUMB, SERVICES_CRUMB]),
    {
      "@type": "ProfessionalService",
      "@id": BUSINESS_ID,
      name: BRAND,
      url: `${SITE}${PATH}`,
      email: EMAIL,
      description: DESCRIPTION,
      logo: `${SITE}/icon-512.png`,
      image: `${SITE}/icon-512.png`,
      areaServed: AREA_SERVED,
      address: {
        "@type": "PostalAddress",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      serviceType: servicePages.map((page) => page.name),
      sameAs: [LINKEDIN, GITHUB],
      // Named inline: the full Person node is on the homepage only.
      founder: { "@type": "Person", "@id": PERSON_ID, name: "Pravdeep Kullar", url: SITE },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Website services",
        itemListElement: servicePages.map((page) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE}${servicePath(page.slug)}#service`,
            name: page.name,
            url: `${SITE}${servicePath(page.slug)}`,
          },
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE}${PATH}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ],
};

export default function ServicesPage() {
  return (
    <main className="wrap" id="main">
      <Breadcrumb trail={[HOME_CRUMB, SERVICES_CRUMB]} />

      <section className="intro svc-hero" aria-labelledby="hero-title">
        <div>
          <h1 id="hero-title">
            Move your business off WordPress, <em>onto a fast custom site</em>
          </h1>
          <p className="intro__context">No plugin updates, no security patches, and pages that load quickly on a phone.</p>
          <p className="intro__context">
            I&apos;m Pravdeep, a freelance web developer in Ontario. I rebuild slow, high-maintenance WordPress sites as
            custom sites and redirect every old address, so Google and your customers can still find each page. If
            your site isn&apos;t on WordPress, I redesign those too.
          </p>
          <div className="intro__links">
            <ReviewButton />
            <Link className="btn" href={servicePath("wordpress-migration")}>
              How the move works &rarr;
            </Link>
          </div>
        </div>

        <div className="lift">
          <div className="sheet panel notch">
            <div className="sheet__head">
              <Avatar />
              <div>
                <p className="sheet__name">Pravdeep Kullar</p>
                <p className="sheet__role">Freelance web developer</p>
              </div>
            </div>
            <dl>
              <div>
                <dt>For</dt>
                <dd>Small businesses in Ontario</dd>
              </div>
              <div>
                <dt>Built with</dt>
                <dd>Next.js and TypeScript on Vercel</dd>
              </div>
              <div>
                <dt>First step</dt>
                <dd>A free review of your current site</dd>
              </div>
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

      <section className="section" id="problems" aria-labelledby="problems-title">
        <SectionHead
          index="01"
          title="What usually goes wrong"
          id="problems-title"
          note="Most sites I look at have one or two of these. None of them are emergencies, and they're the first things I check in a free review."
        />
        <div className="lift">
          <div className="panel notch rows svc-rows">
            {problems.map((problem) => (
              <div className="rows__item" key={problem.label}>
                <h3 className="rows__code">{problem.label}</h3>
                <p>{problem.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="services" aria-labelledby="services-title">
        <SectionHead
          index="02"
          title="Services"
          id="services-title"
          note="Most projects start with the move off WordPress. The other three support it, or cover sites that aren't on WordPress."
        />
        <ul className="svc-cards">
          {servicePages.map((page, index) => (
            <li className={index === 0 ? "lift svc-cards__main" : "lift"} key={page.slug}>
              <div className="panel notch svc-card">
                <span className="label">
                  {String(index + 1).padStart(2, "0")}
                  {index === 0 && " · Main service"}
                </span>
                <h3>
                  <Link href={servicePath(page.slug)}>{page.name}</Link>
                </h3>
                <p>{page.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" id="work" aria-labelledby="work-title">
        <SectionHead
          index="03"
          title="Recent client sites"
          id="work-title"
          note="Two sites with different jobs: one is for a contractor who wants quote requests, the other is for parents choosing a school."
        />
        <div className="quests">
          {featured.map((item) => {
            const project = projects.find((p) => p.number === item.number);
            if (!project) return null;
            return (
              <div className="lift" key={item.number}>
                <article className="quest panel notch">
                  <div className="quest__bar">
                    <span className="label">{project.category}</span>
                  </div>
                  <div className="quest__body">
                    <div>
                      <h3>{project.title}</h3>
                      <p className="quest__desc">{item.summary}</p>
                      {item.results && (
                        <>
                          <ul className="svc-results" aria-label={`${project.title} results`}>
                            {item.results.map((result) => (
                              <li key={result.label}>
                                <strong>{result.value}</strong>
                                <span>{result.label}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="svc-results__source">{item.resultsSource}</p>
                        </>
                      )}
                      <div className="note">
                        <h4>{item.noteLabel}</h4>
                        <p>{item.note}</p>
                      </div>
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
                      <Link className="btn btn--small" href={`/#project-${project.number}`}>
                        Full {project.title} write-up
                      </Link>
                      {project.href && (
                        <a className="btn btn--solid btn--small" href={project.href} target="_blank" rel="noreferrer">
                          Visit the {project.title} site &#8599;
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" id="process" aria-labelledby="process-title">
        <SectionHead
          index="04"
          title="How it works"
          id="process-title"
          note="Usually 2 to 4 weeks from the free review to launch, depending on how quickly the content and photos come in."
        />
        <ol className="svc-steps">
          {steps.map((step) => (
            <li className="lift" key={step.title}>
              <div className="panel notch">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" id="pricing" aria-labelledby="pricing-title">
        <SectionHead index="05" title="Pricing" id="pricing-title" />
        <div className="lift">
          <div className="panel notch svc-price">
            <p className="svc-price__amount">
              <small>WordPress migrations and redesigns</small>
              Starting at $2,500 CAD
            </p>
            <div>
              <p>Every site is quoted after the free review, because the price depends on a few things:</p>
              <ul>
                <li>How many pages the site needs</li>
                <li>Whether the text and photos are ready or still need work</li>
                <li>Whether content is moving off WordPress or another site builder</li>
                <li>Extras like online booking, quote forms or a blog</li>
              </ul>
              <p>
                The final price depends on the page count and features, and the quote is fixed before work starts.
                Payment is a 50% deposit to start and the other 50% at launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq" aria-labelledby="faq-title">
        <SectionHead index="06" title="Questions owners ask" id="faq-title" />
        <div className="lift">
          <div className="panel notch svc-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ReviewCta index="07" />

      <JsonLd data={jsonLd} />
    </main>
  );
}
