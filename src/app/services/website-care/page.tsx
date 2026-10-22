import Link from "next/link";
import { PixelFigure } from "../../pixel/PixelFigure";
import { ServiceShell } from "../_components/ServiceShell";
import { pageMetadata, servicePath } from "../_components/site";

const SLUG = "website-care";
const TITLE = "Website Care and Maintenance in Ontario | Built by Prav";
const DESCRIPTION =
  "Website care for Ontario small businesses: content edits, software updates, and hosting and domain help, so your hours, prices and photos stay accurate.";

export const metadata = pageMetadata({ path: servicePath(SLUG), title: TITLE, description: DESCRIPTION });

export default function WebsiteCarePage() {
  return (
    <ServiceShell
      slug={SLUG}
      title={TITLE}
      description={DESCRIPTION}
      heading="Website care: edits, updates and hosting help"
      lead="Most small-business sites need small changes every so often: new hours, a holiday closure, a price, a photo. Website care is me making those changes so the site stays accurate without you learning how it works."
    >
      <h2>What care covers</h2>
      <ul>
        <li>Content edits: text, prices, photos, staff, opening hours and holiday notices.</li>
        <li>
          Keeping the site&apos;s software up to date, including framework and security updates, and fixing anything
          an update breaks.
        </li>
        <li>Hosting help: checking the site is up, the HTTPS certificate renews, and forms still deliver.</li>
        <li>Domain and DNS: renewals, pointing the domain, and the email records that come with it.</li>
        <li>
          On the Standard plan, a monthly speed check in PageSpeed Insights, so a heavy new photo doesn&apos;t quietly
          undo the work from launch.
        </li>
      </ul>

      <h2>Plans</h2>
      <p>Both plans are month to month, and you can cancel any time.</p>
      <h3>Basic: $75 CAD a month</h3>
      <ul>
        <li>Software and security updates.</li>
        <li>Backups.</li>
        <li>Uptime monitoring.</li>
        <li>Up to 30 minutes of content edits a month.</li>
        <li>A reply within 2 business days.</li>
      </ul>
      <h3>Standard: $150 CAD a month</h3>
      <ul>
        <li>Everything in Basic.</li>
        <li>Up to 2 hours of content edits a month.</li>
        <li>A monthly speed check.</li>
        <li>A reply within 1 business day.</li>
      </ul>

      <h2>How an edit reaches the site</h2>
      <p>
        The owner of Rosehill Design Build had no interest in learning a content editor, so we set up a shared Notion
        board. A change goes on the board as a card, I make it and deploy it, and the card moves to done. That turned
        out faster for both of us than training someone on an editor.
      </p>
      <figure className="plate">
        <PixelFigure scene="workflow" />
        <figcaption>From the owner to the live site</figcaption>
      </figure>
      <p>
        The trade-off is real: even a new phone number has to come through me. If you&apos;d rather make some edits
        yourself, say so before the build and we&apos;ll plan for it.
      </p>

      <h2>Hosting and domains</h2>
      <h3>Hosting</h3>
      <p>
        Sites I build are hosted on Vercel. HTTPS is set up automatically, and a change can go to a preview link before
        it goes live, so you can check an edit on your own phone first.
      </p>
      <h3>Domains and email</h3>
      <p>
        Your domain should stay registered in your business&apos;s name, with a login you control. I work inside your
        account at GoDaddy or whichever registrar you use. Before any DNS change I check the email records first,
        because a careless change there stops mail arriving.
      </p>

      <h2>Sites I didn&apos;t build</h2>
      <p>
        I can look after a site someone else built, but I&apos;ll look at it first. During the free review I check how
        it&apos;s built and hosted, and tell you whether I can maintain it properly. If it&apos;s an outdated WordPress
        install, the <Link href={servicePath("wordpress-migration")}>WordPress migration</Link> page explains the options,
        and if it&apos;s slow, start with <Link href={servicePath("speed-and-seo")}>speed and local SEO</Link>.
      </p>
    </ServiceShell>
  );
}
