import Link from "next/link";
import { ServiceShell } from "../_components/ServiceShell";
import { pageMetadata, servicePath } from "../_components/site";

const SLUG = "website-redesign";
const TITLE = "Small Business Website Redesign in Ontario | Built by Prav";
const DESCRIPTION =
  "I redesign outdated small-business websites in Ontario into fast, mobile-friendly sites built around calls and quote requests, without losing search traffic.";

export const metadata = pageMetadata({ path: servicePath(SLUG), title: TITLE, description: DESCRIPTION });

export default function WebsiteRedesignPage() {
  return (
    <ServiceShell
      slug={SLUG}
      title={TITLE}
      description={DESCRIPTION}
      heading="Small-business website redesign"
      lead="A redesign is worth paying for when the current site is costing you calls. Usually that means it's slow on a phone, or it's hard to tell how to get in touch."
    >
      <h2>When a redesign makes sense</h2>
      <p>
        Not every old site needs replacing. If yours loads quickly and people can find your number, a few targeted
        fixes cost less, and the <Link href={servicePath("speed-and-seo")}>speed and local SEO work</Link> covers that. A
        rebuild makes sense when the problem is in the foundation:
      </p>
      <ul>
        <li>
          The site sits on a template or page builder that loads a lot of code you don&apos;t use, and no amount of
          image compression gets it fast on a phone.
        </li>
        <li>The layout breaks on small screens, so phone visitors pinch and zoom to read your services.</li>
        <li>Updating a page takes a developer, or a login nobody has anymore.</li>
        <li>
          The business has changed and the site hasn&apos;t. You&apos;ve added services or changed your name, and the
          site still describes the old version.
        </li>
      </ul>

      <h2>What I do in a redesign</h2>
      <h3>Start from what a visitor came to do</h3>
      <p>
        For most small businesses that&apos;s one or two actions: call, book, or ask for a quote. I plan every page
        around making that action easy to find on a phone, usually with the phone number and the main button visible
        before any scrolling.
      </p>
      <h3>Build it to load fast</h3>
      <p>
        I build most sites with Next.js and host them on Vercel, which serves pages from servers close to the visitor.
        Images are resized for each screen and compressed, fonts load without holding up the text, and anything heavy
        waits until the rest of the page is ready. The Rosehill Design Build site I rebuilt scores 90 on mobile and 100
        on desktop in Google PageSpeed Insights, measured in August 2026.
      </p>
      <h3>Keep what Google already knows about you</h3>
      <p>
        If your old pages already show up in search, I keep their addresses where I can and set up permanent redirects
        where I can&apos;t. Page titles and descriptions get rewritten to say what you do and where you work, and I add
        structured data so Google can read your business details directly.
      </p>
      <h3>Launch without downtime</h3>
      <p>
        The new site is built on a private preview link while the old one stays up. Once you&apos;ve approved it, I
        switch the domain over. Visitors see the old site until the change reaches them and the new one after, with no
        gap in between.
      </p>

      <h2>What I&apos;ll need from you</h2>
      <p>
        Access to wherever your domain is registered, your logo, and any photos you want to use. If the text on your
        current site still describes the business well, I&apos;ll reuse it. If it doesn&apos;t, we go through what
        needs to change during planning.
      </p>
      <p>
        Copywriting and photography aren&apos;t included. You supply the text and photos, and I tidy up the text you
        give me and lay it out on the pages. Where you don&apos;t have photos, we can use AI-generated images instead.
      </p>

      <h2>What a redesign won&apos;t fix</h2>
      <p>
        A faster, clearer site gets more of your existing visitors to call. It won&apos;t create visitors on its own.
        If very few people find the site in the first place, the bigger lever is usually your Google Business Profile
        and your reviews, which live outside the website. I&apos;ll say which one matters more for you in the free
        review.
      </p>
    </ServiceShell>
  );
}
