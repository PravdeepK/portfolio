/**
 * The work records. Kept in its own module because layout.tsx builds the
 * structured data from the same list the page renders, and two copies drift.
 */
import {
  CommerceFigure,
  EnrollFigure,
  ModelsFigure,
  SocketFigure,
  StreamFigure,
  TimetableFigure,
  VerificationFigure,
  WorkflowFigure,
} from "./figures";

export type Project = {
  number: string;
  title: string;
  category: string;
  ticket?: string;
  description: string;
  /** What broke, what it cost, or where it stands. */
  detail?: string;
  noteLabel?: string;
  meta: string[];
  figure?: React.ReactNode;
  caption?: string;
  /** Omit while a project has nowhere public to point yet. */
  href?: string;
  linkLabel?: string;
  status?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    title: "Forward deployed engineering",
    category: "Nx Growth Partners",
    description:
      "Nx Growth Partners is a custom software and AI development agency. I work directly with client teams to understand the business problem, scope it into a clear first milestone, and coordinate NxGP's senior engineers through build and delivery. The work is AI agents, copilots, RAG and knowledge systems, custom web and mobile apps, and integrations into the stack a client already runs.",
    meta: ["AI agents", "RAG", "Claude API", "Next.js", "React Native"],
  },
  {
    number: "02",
    title: "Tera",
    category: "Mentera",
    description:
      "Mentera is an AI platform for private practices and medspas. Tera is the assistant inside it, and staff lean on it in the middle of a working day. I built the Canvas side panel, where the artifacts Tera streams back (markdown, code, HTML, SVG, Mermaid and React) render as they arrive instead of as a wall of chat text. HTML and React run in a sandboxed iframe, and the assistant needed backend changes to support it, which I made alongside the backend owner. I also built the config-driven integration detail drawer that covers 35 integrations.",
    detail:
      "Content arrives in pieces, and drawing a piece before it's finished makes the panel flicker. Each block now waits until it's whole before any of it renders. The code that does the waiting is ugly. The flickering stopped.",
    noteLabel: "The hard part",
    figure: <StreamFigure />,
    caption: "Fig. 02 · Buffer, then render",
    meta: [
      "React",
      "Next.js",
      "TypeScript",
      "RTK Query",
      "LaunchDarkly",
      "WebSocket",
      "Vercel",
    ],
    href: "https://mentera.ai",
    linkLabel: "Visit Mentera",
  },
  {
    number: "03",
    title: "Making sites fast and findable",
    category: "Mentera and Rosehill",
    description:
      "Two of the sites I've worked on had the same problem: a heavy hero video in front of everything else. On the Next.js marketing site for Mentera I compressed the hero video, migrated images to next/image, deferred GTM, switched to next/font/local, and lazy-loaded 21 Framer Motion components. On Rosehill the video was large enough that I compressed it with ffmpeg and added a Cloudflare R2 fallback for delivery.",
    detail:
      "The Mentera pass targeted 75+ on desktop and 65+ on mobile PageSpeed.",
    noteLabel: "The target",
    meta: [
      "Next.js",
      "next/image",
      "next/font",
      "Framer Motion",
      "ffmpeg",
      "Cloudflare R2",
    ],
  },
  {
    number: "04",
    title: "Rosehill Design Build",
    category: "Client work",
    description:
      "Rosehill is a design build contractor in the GTA. Their old site was a template, and on a phone it opened on a white screen because of the hero video. I rebuilt it as a Next.js marketing site on Vercel and handled the domain and DNS setup. The video got ffmpeg compression and a Cloudflare R2 fallback, and it's still the slowest thing on the page. I added OG tags so sharing a link stopped looking broken, plus GTM and cookie consent, and ran the feedback rounds with the client's COO.",
    detail:
      "The owner had no interest in learning a CMS, so changes came to me through a Notion board and I made them myself. That was faster for both of us, and it means a new phone number still has to come through me.",
    noteLabel: "Trade-off",
    figure: <WorkflowFigure />,
    caption: "Fig. 04 · How an edit reaches the site",
    meta: [
      "Next.js",
      "Vercel",
      "ffmpeg",
      "Cloudflare R2",
      "GTM",
      "GoDaddy DNS",
      "Notion",
    ],
    href: "https://www.rosehilldesignbuild.com/",
    linkLabel: "Open live site",
  },
  {
    number: "05",
    title: "Rising Sun Montessori School",
    category: "Client work",
    description:
      "Rising Sun is a WASC accredited Montessori school in El Dorado Hills, California, teaching transitional kindergarten through middle school. The people reading the site are parents choosing a school, so the navigation is built on the four programs instead of on the school: each grade band has its own page, and the campus and gallery pages are there because parents want to see a classroom before they agree to visit one.",
    detail:
      "Enrollment doesn't happen on the site. Applications hand off to Transparent Classroom, which the school already runs, and a tour is booked by emailing the office, because tours are Wednesday mornings only and one person keeps that calendar. Two of the three things a parent came to do finish somewhere I don't control. Building either one on the site would have meant keeping a second copy of records the school already has.",
    noteLabel: "Trade-off",
    figure: <EnrollFigure />,
    caption: "Fig. 05 · What a parent came to do",
    meta: ["WordPress", "Elementor", "Transparent Classroom"],
    href: "https://risingsunmontessori.org/",
    linkLabel: "Open live site",
  },
  {
    number: "06",
    title: "Rebelsnow",
    category: "Web developer intern",
    description:
      "I interned at Rebelsnow from January to July 2024, building and shipping client e-commerce websites from the client's requirements through to deployment. That meant the pages customers land on and the parts they buy through: the catalog, the cart, checkout and payment.",
    detail:
      "Checkout got the most testing, because it's the one place where a bug costs the store a sale instead of just looking wrong.",
    noteLabel: "Where the risk was",
    figure: <CommerceFigure />,
    caption: "Fig. 06 · Storefront chain",
    meta: [
      "React",
      "Next.js",
      "Node.js",
      "REST APIs",
      "Jest",
      "React Testing Library",
    ],
    href: "https://www.rebel-snow.com/",
    linkLabel: "Visit the store",
  },
  {
    number: "07",
    title: "FakeWordle",
    category: "Personal project",
    description:
      "fakewordle.com is Wordle, except you play it against someone else. You open a room, send someone the code, and race them in real time with a chat running alongside. Accounts and past games are saved in Firebase Auth and Firestore, Claude Haiku generates the words, and it connects to Google and Outlook calendars over OAuth.",
    detail:
      "I ran the live game straight off the database to begin with, which meant a write for every letter a player typed, and you could feel the delay. Moving the match onto its own live server fixed it, and the database only stores the result now.",
    noteLabel: "What went wrong",
    figure: <SocketFigure />,
    caption: "Fig. 07 · Where the state lives",
    meta: [
      "Next.js 15",
      "Firebase Auth",
      "Firestore",
      "WebSocket on Railway",
      "Claude Haiku",
      "OAuth",
    ],
    href: "https://www.fakewordle.com",
    linkLabel: "Play a game",
    secondaryHref: "https://github.com/PravdeepK/wordle-clone",
    secondaryLabel: "Source",
  },
  {
    number: "08",
    title: "Schedule to calendar",
    category: "Personal project",
    description:
      "Every semester I typed my class timetable into a calendar by hand. Now I upload a photo of the timetable, Claude vision parses it, and I get back Google Calendar and Outlook events.",
    detail:
      "The model was the easy part. A timetable is a grid where position carries the meaning: where a class sits tells you when it is, so parsing the text alone throws away half the information.",
    noteLabel: "The hard part",
    figure: <TimetableFigure />,
    caption: "Fig. 08 · Cell to event",
    meta: ["Next.js", "Claude vision API", "ICS", "Vercel"],
    href: "https://schedule-to-calendar-two.vercel.app",
    linkLabel: "Try the tool",
    secondaryHref: "https://github.com/PravdeepK/schedule-to-calendar",
    secondaryLabel: "Source",
  },
  {
    number: "09",
    title: "Cineplex ticket watcher",
    category: "Personal project",
    description:
      "A bot that monitors Cineplex for movie ticket on-sale times and sends a push notification so I can grab tickets quickly. It runs always-on and headless on a Raspberry Pi 4 with Raspberry Pi OS Lite (64-bit), managed over SSH.",
    meta: ["Raspberry Pi 4", "Raspberry Pi OS Lite", "SSH", "Push notifications"],
  },
  {
    number: "10",
    title: "Countdown widgets",
    category: "Personal project, iOS",
    description:
      "An iOS app with countdown widgets for the Home Screen. The app is Expo SDK 54, React Native 0.81, React 19, TypeScript and Expo Router. The widgets are SwiftUI with WidgetKit and AppIntents, and a local native Swift module handles the storage the app and widgets share. I build and sideload it through Xcode.",
    meta: [
      "Expo SDK 54",
      "React Native 0.81",
      "TypeScript",
      "SwiftUI",
      "WidgetKit",
      "Xcode",
    ],
  },
  {
    number: "11",
    title: "Health risk classifier",
    category: "Capstone, AIGC 5005",
    description:
      "One of my two capstones. It takes health data and predicts risk, and the point of the project was putting a plain statistical model up against a small neural network on the same data to see what the extra complexity actually bought.",
    detail:
      "I prepared the data and ran the comparison between the two models, then built the interface for it, because a page of numbers in a notebook is not something you can put in front of anyone outside the program.",
    noteLabel: "My part",
    figure: <ModelsFigure />,
    caption: "Fig. 11 · Same inputs, two models",
    meta: ["Python", "PyTorch", "scikit-learn", "FastAPI", "Next.js"],
    status: "Not public yet",
  },
  {
    number: "12",
    title: "HuntigoX",
    category: "Capstone, AIGC 5505",
    description:
      "Fake job postings are a real problem for people applying for work in Canada. HuntigoX checks the employer behind a listing before anyone applies: it confirms the business is real and registered, then scores the posting against the patterns that show up in scams. The compliance side is built around Canadian hiring rules.",
    detail:
      "I built what candidates and employers actually see, including the verification steps and the scorecard at the end of them. On the model side I worked on spotting the patterns that mark a listing as suspect.",
    noteLabel: "My part",
    figure: <VerificationFigure />,
    caption: "Fig. 12 · Verification output, illustrative",
    meta: ["React", "Next.js", "TypeScript", "Python", "REST APIs"],
    status: "Not public yet",
  },
];

