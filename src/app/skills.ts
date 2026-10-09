/**
 * The skills list. Shared for the same reason as projects.tsx: the page renders
 * it and layout.tsx feeds it to the structured data as knowsAbout.
 */
export const skillGroups = [
  {
    label: "Front-end",
    items: [
      "React",
      "Next.js (App Router)",
      "TypeScript",
      "JavaScript",
      "Framer Motion",
      "RTK Query",
      "HTML/CSS",
      "React Native (Expo)",
    ],
  },
  {
    label: "Back-end and APIs",
    items: [
      "Node.js",
      "REST",
      "WebSockets",
      "Firebase (Auth, Firestore)",
      "FastAPI",
      "Claude API (text and vision)",
      "OAuth",
    ],
  },
  {
    label: "AI / ML",
    items: [
      "Python",
      "TensorFlow",
      "Keras",
      "PyTorch",
      "scikit-learn",
      "pandas",
      "NumPy",
      "RAG",
      "AI agents",
      "prompt engineering",
      "logistic regression",
      "MLP classifiers",
      "XGBoost",
      "AWS SageMaker",
    ],
  },
  {
    label: "Tools and platforms",
    items: [
      "Git",
      "Vercel",
      "Railway",
      "LaunchDarkly",
      "Jira",
      "Xcode",
      "Raspberry Pi",
      "Claude Code",
      "Cursor",
    ],
  },
];
