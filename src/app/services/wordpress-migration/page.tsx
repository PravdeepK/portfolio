import Link from "next/link";
import { ServiceShell } from "../_components/ServiceShell";
import { pageMetadata, servicePath, type Faq } from "../_components/site";

const SLUG = "wordpress-migration";
const TITLE = "WordPress Migration for Ontario Businesses | Built by Prav";
const DESCRIPTION =
  "Move your Ontario business off WordPress onto a fast custom site with no plugin or security updates. Every old URL redirected, email checked first.";

export const metadata = pageMetadata({ path: servicePath(SLUG), title: TITLE, description: DESCRIPTION });

const faqs: Faq[] = [
  {
    question: "Why move off WordPress?",
    answer:
      "So the site stops needing constant upkeep. A WordPress site has a core, a theme and plugins that all need updates, and those updates are where most security problems and broken layouts come from. A custom site has none of them, loads faster on phones, and has fewer parts that can fail.",
  },
  {
    question: "Will I lose my Google rankings?",
    answer:
      "It shouldn't happen. Every old URL gets a permanent (301) redirect to its new page, so links from other websites keep working and Google knows where each page went. After launch I submit the new sitemap in Google Search Console. Rankings can move around for a few weeks while Google recrawls the site.",
  },
  {
    question: "Can I still edit my site?",
    answer:
      "Yes, as an optional paid add-on, quoted separately. After launch you get your own login to a simple editing dashboard, similar to WordPress, where you can update text, swap images and add posts. You can't install plugins or change the layout, so nothing breaks and nothing needs updating. If you'd rather not edit at all, edits come to me.",
  },
];

export default function WordPressMigrationPage() {
  return (
    <ServiceShell
      slug={SLUG}
      title={TITLE}
      description={DESCRIPTION}
      heading="Move your business off WordPress"
      lead="If your WordPress site is slow on phones, needs plugin updates every month, and breaks when the wrong one gets clicked, I rebuild it as a fast custom site that needs none of that. Every page, form and old link comes across."
      faqs={faqs}
    >
      <h2>What changes when you move</h2>
      <h3>No plugin or security updates</h3>
      <p>
        The new site has no WordPress core, theme or plugins, so there&apos;s no list of updates waiting every month
        and no update that breaks the layout.
      </p>
      <h3>Faster load times</h3>
      <p>
        Pages are built ahead of time and sent from servers close to your visitors, so a page doesn&apos;t wait on a
        database before it shows up. That matters most on a phone on mobile data.
      </p>
      <h3>Fewer things that can break</h3>
      <p>
        No plugins means no plugin conflicts, and there&apos;s no WordPress login page for bots to guess passwords on.
      </p>
      <h3>Better Core Web Vitals</h3>
      <p>
        Core Web Vitals are the scores Google collects from real visitors on how fast your page loads, how quickly it
        reacts to a tap, and whether it jumps around while loading. A lighter site usually does better on all three,
        and I measure them before and after so you can compare.
      </p>

      <h2>Can I still edit my site?</h2>
      <p>
        Yes, if you want to. Self-editing is an optional paid add-on, quoted separately. After launch you get your
        own login to a simple editing dashboard, similar to WordPress, where you can update text, swap images and add
        posts. You can&apos;t install plugins or change the layout, so nothing breaks and nothing needs updating.
      </p>
      <p>
        If you&apos;d rather not edit at all, edits come to me, and{" "}
        <Link href={servicePath("website-care")}>website care</Link> covers them each month.
      </p>

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

      <h2>How the move works</h2>
      <h3>List every page and address</h3>
      <p>
        I crawl the current site and record every URL, page title and image, plus each form and where its submissions
        go. Nothing gets dropped by accident, and the list becomes the redirect map later.
      </p>
      <h3>Rebuild every page</h3>
      <p>
        I rebuild each page on a private preview link you can click through on your own phone. Contact and quote forms
        are rebuilt so submissions still reach your inbox.
      </p>
      <h3>Redirect the old URLs</h3>
      <p>
        Every old address that changes gets a permanent (301) redirect to its new page. That keeps links from other
        websites working, and it tells Google where each page went, which helps your search rankings carry over.
      </p>
      <h3>Check email and DNS, then switch the domain</h3>
      <p>
        If your email runs through the same host or the same DNS records, I check those settings before touching
        anything, so mail keeps arriving. Once you&apos;ve approved the new site, I point the domain at it.
      </p>
      <h3>Keep the old hosting for a couple of weeks</h3>
      <p>
        The old WordPress hosting stays on for a couple of weeks after the switch in case anything was missed, and
        then you can cancel it.
      </p>

      <h2>Why it works: Next.js, TypeScript and Vercel</h2>
      <p>
        The new site is built with Next.js, a framework for fast websites, and written in TypeScript, which catches
        many mistakes before the site goes live. It&apos;s hosted on Vercel, which serves each page from servers close
        to the visitor. Most pages are generated ahead of time, so a visit doesn&apos;t wait on a database or on PHP.
      </p>

      <h2>When moving isn&apos;t worth it</h2>
      <p>
        If you publish posts every day, run a WooCommerce shop with hundreds of products, or have staff who live in
        the WordPress dashboard, WordPress may still be the right home. I&apos;ll tell you that in the free review
        rather than sell you a move you don&apos;t need.
      </p>
    </ServiceShell>
  );
}
