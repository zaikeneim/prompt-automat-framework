// data/sections.js
// Single source of truth for SECTIONS and LABELS.
// Import with:
//   import { SECTIONS, LABELS } from './data/sections.js'   (HTML)
//   import { SECTIONS, LABELS } from '../data/sections.js'  (JSX)

export const SECTIONS = [
  {
    letter: "A", color: "#E74C3C", bg: "#FDE8E8",
    title: "Act as…, Bot Persona",
    description: "Define the bot persona of the AI assistant just in a few words.",
    placeholder: "e.g. Act as a senior Java architect with 20 years of experience in enterprise systems…",
    doTitle: "Be very specific in your description.",
    doExamples: [
      "Act as a sensitive elderly psychotherapist …",
      "Act as a patient support staff …",
      "Act as a professional journalist …",
      "Act as a pebble, a car in love with its driver …",
      "Act as a 4th grader math tutor …",
      "Act as a csh-terminal on the mac …",
    ],
    dontTitle: "Don't describe a behaviour that the AI exhibits anyway.",
    dontExamples: ["Act as a helpful AI …"],
  },
  {
    letter: "U", color: "#E67E22", bg: "#FEF3E2",
    title: "User Persona, Audience",
    description: "Describe the audience, their background, the expected level of knowledge of the recipients in a few words.",
    placeholder: "e.g. Explain it like to a senior backend engineer familiar with Spring Boot and microservices…",
    doTitle: "Describe the audience.",
    doExamples: [
      "Explain it like to someone with an MSc in software engineering …",
      "… like to a 5-year-old child",
      "… to the owner of the Tesla model S …",
    ],
    dontTitle: "Don't be unspecific about the audience.",
    dontExamples: ["… tell me …", "… to the user …"],
  },
  {
    letter: "T", color: "#F1C40F", bg: "#FEF9E7",
    title: "Targeted Action",
    description: "Use a meaningful verb and objects describing the transformation from input to output or the way the model should produce or create the output.",
    placeholder: "e.g. Summarize the key differences between Java 17 and Java 21, focusing on virtual threads and pattern matching…",
    doTitle: "Describe the task.",
    doExamples: [
      "… summarize …", "… list …", "… translate …", "… classify …",
      "… explain …", "… extract …", "… format …", "… comment …",
      "… document the code …",
    ],
    dontTitle: 'Avoid using verbs like "answer".',
    dontExamples: ["… answer the question …", "… write a …", "… give me …"],
  },
  {
    letter: "O", color: "#2ECC71", bg: "#E8F8F0",
    title: "Output Definition",
    description: "The output can be described in a separate section in great detail.",
    placeholder: "e.g. A comparison table with columns: Feature, Java 17, Java 21, Migration Notes…",
    doTitle: "Describe the output.",
    doExamples: [
      "… a list of steps …", "… a formula …", "… a table …",
      "… python code …", "… a JSON …",
      "… a floating-point number between 0.0 and 1.0 …",
      "… a recipe with a list of ingredients for 4 persons …",
      "… a list of two-letter ISO country codes …",
      "… an iambic pentameter …",
    ],
    dontTitle: "Don't be too general.",
    dontExamples: ["… an answer …", "… a text …", "… a few …"],
  },
  {
    letter: "M", color: "#3498DB", bg: "#E8F4FD",
    title: "Mode / Tonality / Style",
    description: "Define the way the model should convey the message. This can help with conversational utterances and text output for human users.",
    placeholder: "e.g. Use a confident, technical tone. Be concise but thorough. Avoid filler words…",
    doTitle: "Describe the mode/tone/style.",
    doExamples: [
      "… empathetic …", "… confident …", "… aggressive …", "… moaning …",
      "… sarcastic …", "… witty …", "… stuttering …",
      "… Hemingway style …", "… like in a legal text …",
    ],
    dontTitle: "Don't describe a behaviour the AI tries to exhibit anyway.",
    dontExamples: ["… friendly …", "… neutral …", "… smart …", "… intelligent …"],
  },
  {
    letter: "A", color: "#9B59B6", bg: "#F3E8FD",
    title: "Atypical Cases",
    description: "Handle edge cases for prompts used in applications or repeated requests.",
    placeholder: "e.g. If the Java version is not specified, assume Java 21. If a feature doesn't exist in the target version, note the minimum version required…",
    doTitle: "Describe atypical, edge cases.",
    doExamples: [
      '… list movies in a table. If "director" or "release date" is missing, put "-". If the title is unknown, skip it.',
      "… if the answer is not in the provided context, tell the user you can't answer …",
      '… if the category is not "offer", "confirmation", "receipt", set it as "NULL" …',
      "… if the question is off-topic, say you can only discuss John Deere tractors …",
      "… if the user gives feedback instead of a question, do xyz …",
    ],
    dontTitle: "Don't forget to say what to do if an assumption is wrong.",
    dontExamples: [
      "… answer only on your knowledge … > and if you don't know?",
      "… translate English to French … > what if input is already French?",
    ],
  },
  {
    letter: "T", color: "#1ABC9C", bg: "#E8FAF6",
    title: "Topic Whitelisting",
    description: "When building a conversational system, you may want to restrict which topics the model can discuss.",
    placeholder: "e.g. Answer only questions about Java, JVM internals, build tools (Maven/Gradle), and related frameworks…",
    doTitle: "List permitted conversation topics.",
    doExamples: [
      "… answer only questions regarding the CRB2004, its features and operations. Comment on user feedback and tell the user about your capabilities.",
    ],
    dontTitle: "Don't tell the model what NOT to talk about — the list won't be exhaustive.",
    dontExamples: [
      "… don't talk about politics, religion, race … > but talking about hacking is fine?",
    ],
  },
];

export const LABELS = [
  "Bot Persona",
  "Audience",
  "Task",
  "Output Format",
  "Tone & Style",
  "Edge Cases",
  "Topic Scope",
];
