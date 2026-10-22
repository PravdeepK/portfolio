import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { Breadcrumb, RelatedServices, ReviewButton, ReviewCta, SectionHead } from "./parts";
import { HOME_CRUMB, SERVICES_CRUMB, serviceJsonLd, servicePages, servicePath, type Faq } from "./site";

/** Everything a service subpage has around its copy: trail, heading, FAQ, related links, review panel, structured data. */
export function ServiceShell({
  slug,
  title,
  description,
  heading,
  lead,
  faqs,
  children,
}: {
  slug: string;
  /** The metadata title, reused as the WebPage name in the JSON-LD. */
  title: string;
  description: string;
  heading: string;
  lead: React.ReactNode;
  /** Rendered as <details> and as FAQPage JSON-LD from this one list. */
  faqs?: Faq[];
  children: React.ReactNode;
}) {
  const page = servicePages.find((p) => p.slug === slug)!;
  const path = servicePath(slug);

  return (
    <main className="wrap" id="main">
      <Breadcrumb trail={[HOME_CRUMB, SERVICES_CRUMB, { name: page.name, path }]} />

      <header className="svc-head">
        <h1>{heading}</h1>
        <p className="svc-head__lead">{lead}</p>
        <div className="intro__links">
          <ReviewButton />
          <Link className="btn" href="/services">
            All website services
          </Link>
        </div>
      </header>

      <div className="svc-article lift">
        <article className="panel notch prose">{children}</article>
      </div>

      {faqs && (
        <section className="section" id="faq" aria-labelledby="faq-title">
          <SectionHead index="01" title="Questions owners ask" id="faq-title" />
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
      )}

      <RelatedServices current={slug} index={faqs ? "02" : "01"} />
      <ReviewCta index={faqs ? "03" : "02"} />

      <JsonLd data={serviceJsonLd({ path, title, name: page.name, description, faqs })} />
    </main>
  );
}
