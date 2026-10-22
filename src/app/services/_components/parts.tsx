import Link from "next/link";
import { REVIEW_HREF, EMAIL, servicePages, servicePath, type Crumb } from "./site";

export function SectionHead({ index, title, id, note }: { index: string; title: string; id: string; note?: string }) {
  return (
    <div className="section__head">
      <span className="section__index">{index}</span>
      <h2 id={id}>{title}</h2>
      {note && <p className="section__note">{note}</p>}
    </div>
  );
}

/** Visible trail. The last crumb is the current page and isn't a link. */
export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((crumb, index) =>
          index === trail.length - 1 ? (
            <li key={crumb.path} aria-current="page">
              {crumb.name}
            </li>
          ) : (
            <li key={crumb.path}>
              <Link href={crumb.path}>{crumb.name}</Link>
            </li>
          )
        )}
      </ol>
    </nav>
  );
}

export function ReviewButton({ small = false }: { small?: boolean }) {
  return (
    <a className={`btn btn--solid${small ? " btn--small" : ""}`} href={REVIEW_HREF}>
      Get a free website review
    </a>
  );
}

/** The closing panel on every page: what the free review is, and how to ask for one. */
export function ReviewCta({ index }: { index: string }) {
  return (
    <section className="section" id="review" aria-labelledby="review-title">
      <SectionHead index={index} title="Free website review" id="review-title" />
      <div className="lift">
        <div className="panel notch contact">
          <p className="contact__lead">
            Want a second opinion on your <em>site?</em>
          </p>
          <p className="contact__copy">
            Send me your website address. I&apos;ll run it through PageSpeed Insights on mobile and desktop, use it on
            a phone the way a customer would, and email back what I&apos;d fix first. There&apos;s no obligation to hire
            me afterwards.
          </p>
          <div className="contact__actions">
            <ReviewButton />
            <a className="contact__email" href={REVIEW_HREF}>
              {EMAIL}
            </a>
            {/* TODO: Cal.com link */}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Links to the other service pages, with descriptive anchor text. */
export function RelatedServices({ current, index }: { current?: string; index: string }) {
  const others = servicePages.filter((page) => page.slug !== current);
  return (
    <section className="section" id="related" aria-labelledby="related-title">
      <SectionHead index={index} title="Other services" id="related-title" />
      <ul className="svc-cards">
        {others.map((page) => (
          <li className="lift" key={page.slug}>
            <div className="panel notch svc-card">
              <h3>
                <Link href={servicePath(page.slug)}>{page.name}</Link>
              </h3>
              <p>{page.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
