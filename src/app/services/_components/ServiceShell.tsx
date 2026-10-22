import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { Breadcrumb, RelatedServices, ReviewButton, ReviewCta } from "./parts";
import { HOME_CRUMB, SERVICES_CRUMB, serviceJsonLd, servicePages, servicePath } from "./site";

/** Everything a service subpage has around its copy: trail, heading, related links, review panel, structured data. */
export function ServiceShell({
  slug,
  title,
  description,
  heading,
  lead,
  children,
}: {
  slug: string;
  /** The metadata title, reused as the WebPage name in the JSON-LD. */
  title: string;
  description: string;
  heading: string;
  lead: React.ReactNode;
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

      <RelatedServices current={slug} index="01" />
      <ReviewCta index="02" />

      <JsonLd data={serviceJsonLd({ path, title, name: page.name, description })} />
    </main>
  );
}
