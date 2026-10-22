import Link from "next/link";
import { ThemeToggle } from "../../pixel/ThemeToggle";

const links = [
  { href: "/services", label: "Services", current: true },
  { href: "/#work", label: "Work", current: false },
  { href: "/#contact", label: "Contact", current: false },
];

/** The services version of the top bar: same panel, page links instead of in-page anchors. */
export function ServicesHeader() {
  return (
    <header className="bar lift">
      <div className="bar__inner panel notch">
        <Link className="wordmark" href="/">
          Built by Prav <small>Websites</small>
        </Link>
        <nav aria-label="Main">
          {links.map(({ href, label, current }) => (
            <Link key={href} href={href} className={current ? "is-active" : undefined}>
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
