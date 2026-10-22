import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "./pixel/Header";

/**
 * No canonical: a 404 shouldn't point search engines anywhere, only let them follow the links out.
 * Next already adds <meta name="robots" content="noindex"> to every 404 and follow is the default,
 * so robots is cleared here instead of set, or the page ends up with two robots tags.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: null,
};

export default function NotFound() {
  return (
    <>
      <Header home="/" />

      <main className="wrap" id="top">
        <section className="section" aria-labelledby="not-found-title">
          <div className="section__head">
            <span className="section__index">404</span>
          </div>
          <div className="lift">
            <div className="panel notch contact">
              <h1 className="contact__lead" id="not-found-title">
                Nothing <em>here.</em>
              </h1>
              <p className="contact__copy">
                This page doesn&apos;t exist. The link might be old, or the address has a typo. My work is on the
                homepage, and the services page covers freelance website projects.
              </p>
              <div className="contact__actions">
                <Link className="btn btn--solid" href="/">
                  Back to the homepage
                </Link>
                <Link className="btn" href="/services">
                  Website services &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <p>Built by Pravdeep Kullar</p>
          <p>Ontario, Canada · 2026</p>
        </div>
      </footer>
    </>
  );
}
