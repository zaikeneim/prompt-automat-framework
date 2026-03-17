import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { SECTIONS, LABELS } from "../data/sections.js";

// ── Module-level constants ────────────────────────────────────────────────────

// Hoisted: stable, never change between renders.
const LETTERS = "AUTOMAT".split("");
const COLORS  = SECTIONS.map(s => s.color);

// Keyframes and * reset kept here so the component works in isolation
// (e.g. Storybook, unit tests) without the CSS file being linked.
// The host page / index.html should also link automat-framework.css for
// the font import, body background, and ::placeholder styles.
const GLOBAL_CSS = `
  @keyframes fadeSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
  * { box-sizing: border-box; }
  textarea::placeholder { color: #aaa; }
`;

// ── Helper functions ──────────────────────────────────────────────────────────

function cleanExample(text) {
  return text.replace(/^…\s*/g, '').replace(/\s*…$/g, '').trim();
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

export default function AUTOMATFramework() {
  const [values, setValues]           = useState(() => SECTIONS.map(() => ""));
  const [activeIndex, setActiveIndex] = useState(null);
  const [showPrompt, setShowPrompt]   = useState(false);
  const [copied, setCopied]           = useState(false);
  const promptRef = useRef(null);

  // Functional update: no stale-closure risk, stable reference.
  const handleChange = useCallback((i, val) => {
    setValues(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  }, []);

  // Functional update inside useCallback; `values` not in deps.
  const handleAppendExample = useCallback((si, rawText) => {
    const clean = cleanExample(rawText);
    let outcome;
    setValues(prev => {
      const current = prev[si].trim();
      if (current && current.toLowerCase().includes(clean.toLowerCase())) {
        outcome = 'duplicate';
        return prev;
      }
      let newVal;
      if (current) {
        const lc = current.slice(-1);
        if (['.', '!', '?', ';', ':'].includes(lc)) newVal = current + ' ' + capitalize(clean);
        else if (lc === ',')                          newVal = current + ' ' + clean;
        else                                          newVal = current + '. ' + capitalize(clean);
      } else {
        newVal = capitalize(clean);
      }
      outcome = 'added';
      const next = [...prev];
      next[si] = newVal;
      return next;
    });
    setActiveIndex(si);
    return outcome;
  }, []);

  const filledCount = values.filter(v => v.trim()).length;

  // Re-computed only when `values` changes.
  const prompt = useMemo(() => {
    const parts = [];
    values.forEach((v, i) => { if (v.trim()) parts.push(`## ${LABELS[i]}\n${v.trim()}`); });
    return parts.join("\n\n");
  }, [values]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  const handleReset = useCallback(() => {
    setValues(SECTIONS.map(() => ""));
    setShowPrompt(false);
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (showPrompt && promptRef.current) {
      promptRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showPrompt]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f5f0 0%, #eee9e0 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#1a1a2e", marginRight: 8 }}>The</span>
            {LETTERS.map((l, i) => <LetterBadge key={i} letter={l} color={COLORS[i]} size={38} />)}
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
              }}>{prompt}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
