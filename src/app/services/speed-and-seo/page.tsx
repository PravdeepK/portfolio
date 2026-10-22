import Link from "next/link";
import { PixelFigure } from "../../pixel/PixelFigure";
import { ServiceShell } from "../_components/ServiceShell";
import { pageMetadata, servicePath } from "../_components/site";

const SLUG = "speed-and-seo";
const TITLE = "Website Speed and Local SEO in Ontario | Built by Prav";
const DESCRIPTION =
  "Core Web Vitals, mobile speed and local search basics for Ontario small businesses. I measure your site in PageSpeed Insights, fix what slows it, then re-test.";

export const metadata = pageMetadata({ path: servicePath(SLUG), title: TITLE, description: DESCRIPTION });

export default function SpeedAndSeoPage() {
  return (
    <ServiceShell
      slug={SLUG}
      title={TITLE}
      description={DESCRIPTION}
      heading="Website speed and local SEO for small businesses"
      lead="Google measures how fast your site loads for real visitors on real phones, and uses it as one of many ranking signals. The bigger reason to care is simpler: a slow page loses people before they read it."
    >
      <h2>What Core Web Vitals measure</h2>
      <p>
        Core Web Vitals are three numbers Google collects from Chrome users who visit your site. You can see yours in
        PageSpeed Insights or in Google Search Console.
      </p>
      <h3>Largest Contentful Paint (LCP)</h3>
      <p>
        How long until the biggest thing on the screen, usually a photo or the headline, has loaded. Google counts 2.5
        seconds or less as good.
      </p>
      <h3>Interaction to Next Paint (INP)</h3>
      <p>
        How quickly the page reacts when someone taps a button or opens a menu. Good is 200 milliseconds or less. INP
        replaced the older First Input Delay metric in March 2024.
      </p>
      <h3>Cumulative Layout Shift (CLS)</h3>
      <p>
        How much the page jumps around while it loads, like a button moving just as you go to tap it. Good is a score
        of 0.1 or less.
      </p>

      <h2>What usually slows a small-business site</h2>
      <p>
        On the sites I&apos;ve worked on, the cause is rarely subtle. A hero video in front of everything else is the
        most common one. Rosehill Design Build&apos;s old site never finished loading on a phone. On the new Next.js
        site, the hero video is compressed with ffmpeg, served with a Cloudflare R2 fallback, and loads after the rest
        of the page, so nothing waits on it. It scores 90 on mobile and 100 on desktop in PageSpeed Insights (August
        2026).
      </p>
      <figure className="plate">
        <PixelFigure scene="speed" />
        <figcaption>What loads first, before and after</figcaption>
      </figure>
      <p>
        Other regulars are photos uploaded straight from a camera at several megabytes each, chat widgets and tracking
        scripts that load before your content, and page builders that ship code for features the page doesn&apos;t
        use.
      </p>

      <h2>Local search basics</h2>
      <h3>Your Google Business Profile</h3>
      <p>
        The map results for a search like &quot;roofer near me&quot; come mostly from Google Business Profiles, not
        from websites. If you haven&apos;t claimed yours, that&apos;s usually the most useful hour you can spend on
        local search. The website supports the profile: the profile links to it, and it helps when the two agree.
      </p>
      <h3>Name, area and phone that match everywhere</h3>
      <p>
        Your business name, service area and phone number should read the same on the website, the profile and
        directories like Yelp. If you work from home and don&apos;t publish an address, list the area you serve
        instead.
      </p>
      <h3>Pages that say what you do and where</h3>
      <p>
        Every page gets a title and description that name the service and the area, for example &quot;Kitchen
        renovations in Ontario&quot; instead of &quot;Home&quot;. I also add structured data, a small block of code
        that gives Google your business name, service area and contact details directly.
      </p>

      <h2>The speed and SEO tune-up</h2>
      <p>
        On its own, this is a fixed-price tune-up starting at $750 CAD. It&apos;s also included in every{" "}
        <Link href={servicePath("wordpress-migration")}>WordPress migration</Link> and{" "}
        <Link href={servicePath("website-redesign")}>website redesign</Link>. The tune-up covers:
      </p>
      <ul>
        <li>A PageSpeed Insights audit on mobile and desktop.</li>
        <li>Fixing what slows the site down.</li>
        <li>The local SEO basics above.</li>
        <li>Setting up Google Search Console.</li>
        <li>A re-test, with a short before-and-after report.</li>
      </ul>
      <p>
        You also get a short list of anything I couldn&apos;t fix without a rebuild. If that list is long, a redesign may
        cost less than patching.
      </p>
    </ServiceShell>
  );
}
