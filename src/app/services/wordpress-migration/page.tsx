import Link from "next/link";
import { ServiceShell } from "../_components/ServiceShell";
import { pageMetadata, servicePath } from "../_components/site";

const SLUG = "wordpress-migration";
const TITLE = "WordPress Migration for Ontario Businesses | Built by Prav";
const DESCRIPTION =
  "Moving an outdated WordPress or PHP site to a fast, modern stack. I rebuild every page, redirect old URLs and check your email setup first. Ontario businesses.";

export const metadata = pageMetadata({ path: servicePath(SLUG), title: TITLE, description: DESCRIPTION });

export default function WordPressMigrationPage() {
  return (
    <ServiceShell
      slug={SLUG}
      title={TITLE}
      description={DESCRIPTION}
      heading="Moving an outdated WordPress site to a faster stack"
      lead="WordPress runs a large share of the web and it's a reasonable tool. The trouble starts when a site hasn't been maintained for a few years and every update feels risky."
    >
      <h2>Signs it&apos;s time to move</h2>
      <ul>
        <li>
          Your host has emailed about an outdated PHP version. PHP 7.4 stopped getting security fixes in November 2022,
          and some older small-business sites still run on it.
        </li>
        <li>There are plugin updates waiting that nobody wants to click, because the last one broke the layout.</li>
        <li>
          The theme or page builder loads its scripts and styles on every page, so the site is slow on phones even
          with small images.
        </li>
        <li>Changing a price takes longer than it should because the page builder fights every edit.</li>
      </ul>

      <h2>When staying on WordPress is the better call</h2>
      <p>
        If you publish blog posts every week, run a WooCommerce shop with hundreds of products, or have staff who edit
        the site daily and like the dashboard, WordPress is probably still the right home. In that case the better job
        is cleaning up the site you have: updating PHP and plugins, removing what isn&apos;t used, and fixing the{" "}
        <Link href={servicePath("speed-and-seo")}>speed and search problems</Link>. One of the sites I&apos;ve built, Rising
        Sun Montessori School, runs on WordPress with Elementor.
      </p>

      <h2>How the move works</h2>
      <h3>List every page and address</h3>
      <p>
        I crawl the current site and record every URL, page title and image, plus each form and where its submissions
        go. Nothing gets dropped by accident, and the list becomes the redirect map later.
      </p>
      <h3>Rebuild on a modern stack</h3>
      <p>
        The new site is built with Next.js and served from Vercel. Most pages are generated ahead of time, so a visit
        doesn&apos;t wait on a database or on PHP, and there are no plugins to keep patching. Contact and quote forms
        are rebuilt so submissions still reach your inbox.
      </p>
      <h3>Redirect the old URLs</h3>
      <p>
        Every old address that changes gets a permanent (301) redirect to its new page. That keeps links from other
        websites working, and it tells Google where each page went, which helps your search rankings carry over.
      </p>
      <h3>Switch the domain, then cancel the old hosting</h3>
      <p>
        Once you&apos;ve approved the new site, I point the domain at it. The old WordPress hosting stays on for a
        couple of weeks in case anything was missed, and then you can cancel it. If your email runs through the same
        host, I check those settings before touching anything, so mail keeps arriving.
      </p>

      <h2>What changes for you</h2>
      <p>
        You won&apos;t log into a WordPress dashboard anymore. Edits come to me, or we plan a way for you to make them
        yourself during the build.
        {/* TODO: confirm the self-editing option you offer after a migration (CMS or not) */} The habit of installing
        a plugin for every new feature goes away too. A new feature gets built into the site, and once it&apos;s there,
        it doesn&apos;t need a monthly update.
      </p>
      <p>
        After launch, <Link href={servicePath("website-care")}>website care</Link> covers the edits and updates, so the new
        site doesn&apos;t end up where the old one did.
      </p>
    </ServiceShell>
  );
}
