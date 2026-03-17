import { useState, useRef, useEffect, useCallback } from "react";

const SECTIONS = [
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
    doExamples: ["… summarize …","… list …","… translate …","… classify …","… explain …","… extract …","… format …","… comment …","… document the code …"],
    dontTitle: 'Avoid using verbs like "answer".',
    dontExamples: ["… answer the question …","… write a …","… give me …"],
  },
  {
    letter: "O", color: "#2ECC71", bg: "#E8F8F0",
    title: "Output Definition",
    description: "The output can be described in a separate section in great detail.",
    placeholder: "e.g. A comparison table with columns: Feature, Java 17, Java 21, Migration Notes…",
    doTitle: "Describe the output.",
    doExamples: ["… a list of steps …","… a formula …","… a table …","… python code …","… a JSON …","… a floating-point number between 0.0 and 1.0 …","… a recipe with a list of ingredients for 4 persons …","… a list of two-letter ISO country codes …","… an iambic pentameter …"],
    dontTitle: "Don't be too general.",
    dontExamples: ["… an answer …","… a text …","… a few …"],
  },
  {
    letter: "M", color: "#3498DB", bg: "#E8F4FD",
    title: "Mode / Tonality / Style",
    description: "Define the way the model should convey the message. This can help with conversational utterances and text output for human users.",
    placeholder: "e.g. Use a confident, technical tone. Be concise but thorough. Avoid filler words…",
    doTitle: "Describe the mode/tone/style.",
    doExamples: ["… empathetic …","… confident …","… aggressive …","… moaning …","… sarcastic …","… witty …","… stuttering …","… Hemingway style …","… like in a legal text …"],
    dontTitle: "Don't describe a behaviour the AI tries to exhibit anyway.",
    dontExamples: ["… friendly …","… neutral …","… smart …","… intelligent …"],
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
    doExamples: ["… answer only questions regarding the CRB2004, its features and operations. Comment on user feedback and tell the user about your capabilities."],
    dontTitle: "Don't tell the model what NOT to talk about — the list won't be exhaustive.",
    dontExamples: ["… don't talk about politics, religion, race … > but talking about hacking is fine?"],
  },
];

const LABELS = ["Bot Persona","Audience","Task","Output Format","Tone & Style","Edge Cases","Topic Scope"];

function cleanExample(text) {
  return text.replace(/^…\s*/g, '').replace(/\s*…$/g, '').trim();
}
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const LetterBadge = ({ letter, color, size = 40 }) => (
  <div style={{
    width: size, height: size, minWidth: size, borderRadius: "50%",
    background: color, display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 800, fontSize: size * 0.5,
    fontFamily: "'DM Serif Display', Georgia, serif",
    boxShadow: `0 3px 12px ${color}55`,
  }}>{letter}</div>
);

const ClickableExample = ({ text, sectionIndex, onAppend }) => {
  const [flash, setFlash] = useState(null);
  const handleClick = () => {
    const result = onAppend(sectionIndex, text);
    setFlash(result);
    setTimeout(() => setFlash(null), 700);
  };
  return (
    <div
      onClick={handleClick} title="Click to add to prompt"
      style={{
        fontSize: 13, lineHeight: 1.5, padding: "4px 6px", paddingLeft: 22,
        fontFamily: "'IBM Plex Mono', monospace", borderRadius: 6,
        cursor: "pointer", transition: "all 0.2s", margin: "2px -6px",
        position: "relative",
        background: flash === 'added' ? '#2e7d32' : flash === 'duplicate' ? '#ffcdd2' : 'transparent',
        color: flash === 'added' ? '#fff' : flash === 'duplicate' ? '#c62828' : '#1a5e2a',
      }}
      onMouseEnter={e => { if (!flash) { e.currentTarget.style.background = '#d4edda'; e.currentTarget.style.color = '#145a24'; }}}
      onMouseLeave={e => { if (!flash) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a5e2a'; }}}
    >
      <span style={{
        position: 'absolute', left: 6, top: 3, fontWeight: 700, fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        color: flash === 'added' ? '#fff' : '#2e7d3288',
      }}>{flash === 'added' ? '✓' : '+'}</span>
      {text}
    </div>
  );
};

const DontExample = ({ text }) => (
  <div style={{
    fontSize: 13, lineHeight: 1.5, padding: "4px 6px", paddingLeft: 22,
    fontFamily: "'IBM Plex Mono', monospace", color: "#8b1a1a",
    position: "relative", margin: "2px -6px",
  }}>
    <span style={{
      position: 'absolute', left: 6, top: 4, fontWeight: 700, fontSize: 11,
      color: '#c6282888', fontFamily: "'DM Sans', sans-serif",
    }}>✗</span>
    {text}
  </div>
);

const SectionCard = ({ section, value, onChange, index, isActive, onFocus, onAppendExample }) => {
  const [expanded, setExpanded] = useState(false);
  const taRef = useRef(null);

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto';
      taRef.current.style.height = Math.max(taRef.current.scrollHeight, 72) + 'px';
    }
  }, [value]);

  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      border: isActive ? `2px solid ${section.color}` : "2px solid #e8e8e8",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: isActive ? `0 8px 32px ${section.color}22, 0 2px 8px rgba(0,0,0,0.06)` : "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "20px 24px 16px",
        background: `linear-gradient(135deg, ${section.bg}88, ${section.bg}33)`,
        borderBottom: "1px solid #f0f0f0",
      }}>
        <LetterBadge letter={section.letter} color={section.color} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: "#1a1a2e", fontFamily: "'DM Serif Display', Georgia, serif" }}>{section.title}</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 4, lineHeight: 1.5 }}>{section.description}</div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#fff", background: section.color,
          borderRadius: 20, padding: "3px 10px", letterSpacing: "0.05em",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>{index + 1} / 7</div>
      </div>

      <div style={{ padding: "16px 24px" }}>
        <textarea ref={taRef} value={value} onChange={e => onChange(e.target.value)} onFocus={onFocus}
          placeholder={section.placeholder} rows={3}
          style={{
            width: "100%", border: "1.5px solid #e0e0e0", borderRadius: 10,
            padding: "12px 14px", fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6, resize: "vertical", outline: "none", transition: "border-color 0.2s",
            background: isActive ? "#fff" : "#fafafa", color: "#1a1a2e", boxSizing: "border-box",
            borderColor: isActive ? section.color : "#e0e0e0",
          }}
        />
      </div>

      <div style={{ padding: "0 24px 16px" }}>
        <button onClick={() => setExpanded(!expanded)} style={{
          background: "none", border: "none", cursor: "pointer", fontSize: 13,
          color: section.color, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          display: "flex", alignItems: "center", gap: 6, padding: "4px 0",
        }}>
          <span style={{ display: "inline-block", fontSize: 12, transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
          {expanded ? "Hide" : "Show"} examples & tips{expanded ? "" : " — click to add ✨"}
        </button>

        {expanded && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, animation: "fadeSlide 0.3s ease" }}>
            <div style={{ background: "#f0faf0", borderRadius: 10, padding: "12px 14px", border: "1px solid #c8e6c9" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#2e7d32", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <span style={{ fontSize: 14 }}>✓</span> {section.doTitle}
              </div>
              {section.doExamples.map((ex, j) => (
                <ClickableExample key={j} text={ex} sectionIndex={index} onAppend={onAppendExample} />
              ))}
            </div>
            <div style={{ background: "#fef0f0", borderRadius: 10, padding: "12px 14px", border: "1px solid #ffcdd2" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c62828", marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <span style={{ fontSize: 14 }}>✗</span> {section.dontTitle}
              </div>
              {section.dontExamples.map((ex, j) => <DontExample key={j} text={ex} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AUTOMATFramework() {
  const [values, setValues] = useState(SECTIONS.map(() => ""));
  const [activeIndex, setActiveIndex] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const promptRef = useRef(null);

  const handleChange = (i, val) => {
    const next = [...values]; next[i] = val; setValues(next);
  };

  const handleAppendExample = useCallback((si, rawText) => {
    const clean = cleanExample(rawText);
    const current = values[si].trim();
    if (current && current.toLowerCase().includes(clean.toLowerCase())) return 'duplicate';
    let newVal;
    if (current) {
      const lc = current.slice(-1);
      if (['.','!','?',';',':'].includes(lc)) newVal = current + ' ' + capitalize(clean);
      else if (lc === ',') newVal = current + ' ' + clean;
      else newVal = current + '. ' + capitalize(clean);
    } else { newVal = capitalize(clean); }
    const next = [...values]; next[si] = newVal; setValues(next);
    setActiveIndex(si);
    return 'added';
  }, [values]);

  const filledCount = values.filter(v => v.trim()).length;

  const buildPrompt = () => {
    const parts = [];
    values.forEach((v, i) => { if (v.trim()) parts.push(`## ${LABELS[i]}\n${v.trim()}`); });
    return parts.join("\n\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildPrompt()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => { setValues(SECTIONS.map(() => "")); setShowPrompt(false); setActiveIndex(null); };

  useEffect(() => {
    if (showPrompt && promptRef.current) promptRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showPrompt]);

  const letters = "AUTOMAT".split("");
  const colors = SECTIONS.map(s => s.color);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f5f0 0%, #eee9e0 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes fadeSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #aaa; }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#1a1a2e", marginRight: 8 }}>The</span>
            {letters.map((l, i) => <LetterBadge key={i} letter={l} color={colors[i]} size={38} />)}
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#1a1a2e", marginLeft: 8 }}>Framework</span>
          </div>
          <p style={{ color: "#666", fontSize: 15, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Compose structured AI prompts step by step. Fill in each section, then generate your complete prompt.
          </p>
        </div>
        <div style={{ margin: "24px 0 32px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 8, background: "#e0dcd4", borderRadius: 100, overflow: "hidden" }}>
            <div style={{
              width: `${(filledCount / 7) * 100}%`, height: "100%", borderRadius: 100,
              background: "linear-gradient(90deg, #E74C3C, #E67E22, #F1C40F, #2ECC71, #3498DB, #9B59B6, #1ABC9C)",
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#888" }}>{filledCount}/7</span>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {SECTIONS.map((s, i) => (
          <SectionCard key={i} section={s} value={values[i]} onChange={val => handleChange(i, val)}
            index={i} isActive={activeIndex === i} onFocus={() => setActiveIndex(i)}
            onAppendExample={handleAppendExample} />
        ))}
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={handleReset} style={{
          padding: "14px 32px", borderRadius: 12, border: "2px solid #ccc", background: "#fff",
          color: "#666", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>Reset All</button>
        <button onClick={() => setShowPrompt(true)} disabled={filledCount === 0} style={{
          padding: "14px 40px", borderRadius: 12, border: "none",
          background: filledCount === 0 ? "#ccc" : "linear-gradient(135deg, #E74C3C, #9B59B6, #1ABC9C)",
          color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: filledCount === 0 ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em",
          boxShadow: filledCount > 0 ? "0 4px 20px rgba(155,89,182,0.3)" : "none",
        }}>Generate Prompt ✨</button>
      </div>

      {showPrompt && filledCount > 0 && (
        <div ref={promptRef} style={{ maxWidth: 780, margin: "0 auto 60px", padding: "0 24px", animation: "popIn 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
          <div style={{ background: "#1a1a2e", borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #2a2a4e" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
                <span style={{ color: "#888", fontSize: 13, fontWeight: 600, marginLeft: 8, fontFamily: "'IBM Plex Mono', monospace" }}>Generated Prompt</span>
              </div>
              <button onClick={handleCopy} style={{
                background: copied ? "#27c93f" : "#2a2a4e", border: "none", color: "#fff",
                padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>{copied ? "✓ Copied!" : "Copy"}</button>
            </div>
            <div style={{ padding: 24, maxHeight: 500, overflowY: "auto" }}>
              <pre style={{
                color: "#e0e0e0", fontSize: 14, fontFamily: "'IBM Plex Mono', monospace",
                lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0,
              }}>{buildPrompt()}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
