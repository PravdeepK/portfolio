/**
 * The work records. Kept in its own module because layout.tsx builds the
 * structured data from the same list the page renders, and two copies drift.
 */
import {
  CommerceFigure,
  EnrollFigure,
  ModelsFigure,
  ScoreBars,
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
    title: "Tera",
    category: "Mentera",
    description:
      "Mentera is an AI platform for private practices and medspas. Tera is the assistant inside it, and staff lean on it in the middle of a working day. I build the parts they touch, most recently the panel where everything Tera produces gets rendered as it streams in, instead of arriving as a wall of chat text.",
    detail:
      "Content arrives in pieces, and drawing a piece before it's finished makes the panel flicker. Each block now waits until it's whole before any of it renders. The code that does the waiting is ugly. The flickering stopped.",
    noteLabel: "The hard part",
    figure: <StreamFigure />,
    caption: "Fig. 01 · Buffer, then render",
    meta: ["React", "Next.js", "TypeScript", "WebSocket", "Vercel"],
    href: "https://mentera.ai",
    linkLabel: "Visit Mentera",
  },
  {
    number: "02",
    title: "Making sites fast and findable",
    category: "Mentera and Rosehill",
    description:
      "Two of the sites I've worked on had the same two problems: they were slow on a phone, and search engines weren't reading them properly. A heavy hero video was the biggest culprit on both. I worked through the video and the images, the fonts, and the scripts sitting in front of the first thing you see, then the metadata and page structure that search engines read.",
    detail:
      "Mentera scores 96 on a phone and 100 on desktop. Rosehill scores 90 and 100, with a perfect score for search. On a slow connection the main content lands in about two seconds, and neither page jumps around while it loads.",
    noteLabel: "Where it landed",
    figure: (
      <ScoreBars
        title="PageSpeed scores: Mentera 96 on mobile and 100 on desktop, Rosehill 90 on mobile and 100 on desktop."
        rows={[
          { label: "Mentera, mobile", value: 96 },
          { label: "Mentera, desktop", value: 100 },
          { label: "Rosehill, mobile", value: 90 },
          { label: "Rosehill, desktop", value: 100 },
        ]}
      />
    ),
    caption: "Fig. 02 · PageSpeed, both sites",
    meta: ["Core Web Vitals", "SEO", "Next.js", "Vercel"],
  },
  {
    number: "03",
    title: "Rosehill Design Build",
    category: "Client work",
    description:
      "Rosehill is a design build contractor in the GTA. Their old site was a template, and on a phone it opened on a white screen because of the hero video. I rebuilt the site, pointed their domain at the new one, and fixed the previews so sharing a link stopped looking broken. Most of the win came from the video, which is still the slowest thing on the page.",
    detail:
      "The owner had no interest in learning a CMS, so changes came to me through a Notion board and I made them myself. That was faster for both of us, and it means a new phone number still has to come through me.",
    noteLabel: "Trade-off",
    figure: (
      <WorkflowFigure />
    ),
    caption: "Fig. 03 · How an edit reaches the site",
    meta: ["Next.js", "Vercel", "GoDaddy DNS", "Notion"],
    href: "https://www.rosehilldesignbuild.com/",
    linkLabel: "Open live site",
  },
  {
    number: "04",
    title: "Rising Sun Montessori School",
    category: "Client work",
    description:
      "Rising Sun is a WASC accredited Montessori school in El Dorado Hills, California, teaching transitional kindergarten through middle school. The people reading the site are parents choosing a school, so the navigation is built on the four programs instead of on the school: each grade band has its own page, and the campus and gallery pages are there because parents want to see a classroom before they agree to visit one.",
    detail:
      "Enrollment doesn't happen on the site. Applications hand off to Transparent Classroom, which the school already runs, and a tour is booked by emailing the office, because tours are Wednesday mornings only and one person keeps that calendar. Two of the three things a parent came to do finish somewhere I don't control. Building either one on the site would have meant keeping a second copy of records the school already has.",
    noteLabel: "Trade-off",
    figure: <EnrollFigure />,
    caption: "Fig. 04 · What a parent came to do",
    meta: ["WordPress", "Elementor", "Transparent Classroom"],
    href: "https://risingsunmontessori.org/",
    linkLabel: "Open live site",
  },
  {
    number: "05",
    title: "Rebelsnow",
    category: "E-commerce platform",
    description:
      "Rebelsnow sells clothing online. I spent a year on the storefront, remote, building the pages customers land on and the parts they buy through: the catalog, the cart, checkout and payment.",
    detail:
      "Checkout got the most testing, because it's the one place where a bug costs the store a sale instead of just looking wrong.",
    noteLabel: "Where the risk was",
    figure: <CommerceFigure />,
    caption: "Fig. 05 · Storefront chain",
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
    number: "06",
    title: "FakeWordle",
    category: "Personal project",
    description:
      "fakewordle.com is Wordle, except you play it against someone else. You open a room, send someone the code, and race them in real time with a chat running alongside. Accounts and past games are saved, and Claude writes the word lists.",
    detail:
      "I ran the live game straight off the database to begin with, which meant a write for every letter a player typed, and you could feel the delay. Moving the match onto its own live server fixed it, and the database only stores the result now.",
    noteLabel: "What went wrong",
    figure: <SocketFigure />,
    caption: "Fig. 06 · Where the state lives",
    meta: [
      "Next.js 15",
      "Firebase Auth",
      "Firestore",
      "WebSocket on Railway",
      "Claude API",
    ],
    href: "https://www.fakewordle.com",
    linkLabel: "Play a game",
    secondaryHref: "https://github.com/PravdeepK/wordle-clone",
    secondaryLabel: "Source",
  },
  {
    number: "07",
    title: "Schedule to calendar",
    category: "Personal project",
    description:
      "Every semester I typed my class timetable into a calendar by hand. Now I upload a screenshot of the timetable and get back a calendar file that imports straight into Google Calendar or Outlook.",
    detail:
      "The model was the easy part. A timetable is a grid where position carries the meaning: where a class sits tells you when it is, so parsing the text alone throws away half the information.",
    noteLabel: "The hard part",
    figure: <TimetableFigure />,
    caption: "Fig. 07 · Cell to event",
    meta: ["Next.js", "Claude vision API", "ICS"],
    href: "https://schedule-to-calendar-two.vercel.app",
    linkLabel: "Try the tool",
    secondaryHref: "https://github.com/PravdeepK/schedule-to-calendar",
    secondaryLabel: "Source",
  },
  {
    number: "08",
    title: "Health risk classifier",
    category: "Capstone, AIGC 5005",
    description:
      "One of my two capstones. It takes health data and predicts risk, and the point of the project was putting a plain statistical model up against a small neural network on the same data to see what the extra complexity actually bought.",
    detail:
      "I prepared the data and ran the comparison between the two models, then built the interface for it, because a page of numbers in a notebook is not something you can put in front of anyone outside the program.",
    noteLabel: "My part",
    figure: <ModelsFigure />,
    caption: "Fig. 08 · Same inputs, two models",
    meta: ["Python", "PyTorch", "scikit-learn", "FastAPI", "Next.js"],
    status: "Not public yet",
  },
  {
    number: "09",
    title: "HuntigoX",
    category: "Capstone, AIGC 5505",
    description:
      "Fake job postings are a real problem for people applying for work in Canada. HuntigoX checks the employer behind a listing before anyone applies: it confirms the business is real and registered, then scores the posting against the patterns that show up in scams. The compliance side is built around Canadian hiring rules.",
    detail:
      "I built what candidates and employers actually see, including the verification steps and the scorecard at the end of them. On the model side I worked on spotting the patterns that mark a listing as suspect.",
    noteLabel: "My part",
    figure: <VerificationFigure />,
    caption: "Fig. 09 · Verification output, illustrative",
    meta: ["React", "Next.js", "TypeScript", "Python", "REST APIs"],
    status: "Not public yet",
  },
];

