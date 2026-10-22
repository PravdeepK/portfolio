import Link from "next/link";
import { GITHUB, LINKEDIN, servicePages, servicePath } from "./site";

export function ServicesFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner svc-footer">
        <p>Built by Prav, Pravdeep Kullar</p>
        <nav className="footer__links" aria-label="Services">
          <Link href="/services">All services</Link>
          {servicePages.map((page) => (
            <Link key={page.slug} href={servicePath(page.slug)}>
              {page.name}
            </Link>
          ))}
        </nav>
        <div className="footer__links">
          <a href={GITHUB} target="_blank" rel="me noreferrer">
            GitHub
          </a>
          <a href={LINKEDIN} target="_blank" rel="me noreferrer">
            LinkedIn
          </a>
          <a href="#main">Back to top &uarr;</a>
        </div>
        <p>Ontario, Canada · 2026</p>
      </div>
    </footer>
  );
}
