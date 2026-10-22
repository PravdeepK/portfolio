import "./services.css";
import { ServicesFooter } from "./_components/ServicesFooter";
import { ServicesHeader } from "./_components/ServicesHeader";

export default function ServicesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ServicesHeader />
      {children}
      <ServicesFooter />
    </>
  );
}
