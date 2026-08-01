import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MasterStar from "../components/MasterStar";
import NURWordmark from "../components/NURWordmark";
import "../styles/orbit-scan.css";

type Direction = "mind" | "work" | "body" | "money" | "life";
type Signal = "overwhelmed" | "stuck" | "scattered" | "numb" | "urgent";
type Friction = "options" | "energy" | "fear" | "structure" | "alone";

type ScanState = {
  direction: Direction | null;
  signal: Signal | null;
  friction: Friction | null;
  sentence: string;
};

const directions: Array<{ value: Direction; label: string; detail: string }> = [
  { value: "mind", label: "My mind", detail: "thoughts, focus, emotional noise" },
  { value: "work", label: "My work", detail: "career, project, execution" },
  { value: "body", label: "My body", detail: "energy, care, physical rhythm" },
  { value: "money", label: "My money", detail: "income, debt, financial movement" },
  { value: "life", label: "My life direction", detail: "identity, decision, next chapter" },
];

const signals: Array<{ value: Signal; label: string }> = [
  { value: "overwhelmed", label: "Everything feels too loud" },
  { value: "stuck", label: "I know the problem but cannot move" },
  { value: "scattered", label: "My energy is split everywhere" },
  { value: "numb", label: "I cannot feel what matters" },
  { value: "urgent", label: "Something needs to change now" },
];

const frictions: Array<{ value: Friction; label: string }> = [
  { value: "options", label: "Too many options" },
  { value: "energy", label: "Not enough energy" },
  { value: "fear", label: "Fear of choosing wrong" },
  { value: "structure", label: "No clear structure" },
  { value: "alone", label: "I am carrying it alone" },
];

const directionMoves: Record<Direction, string> = {
  mind: "Open a blank note and write the one thought that keeps returning. Do not solve it; name it in one sentence.",
  work: "Choose one deliverable that can exist by tonight. Reduce it until it fits inside a 25-minute sprint.",
  body: "Choose one physical signal to respect today: water, food, medicine, movement, rest, or an appointment.",
  money: "Write the exact amount you need next and the single action most likely to move money toward you today.",
  life: "Write the decision as two doors. Under each, write what it protects and what it costs.",
};

const frictionRules: Record<Friction, { rule: string; boundary: string }> = {
  options: {
    rule: "Use the reversible-door rule: choose the option you can test without permanently trapping yourself.",
    boundary: "No researching a sixth option before testing one of the first five.",
  },
  energy: {
    rule: "Shrink the move until it can be done with the energy you actually have, not the energy you wish you had.",
    boundary: "Stop after one completed movement; completion is the signal, not exhaustion.",
  },
  fear: {
    rule: "Choose the action that creates evidence. Evidence reduces fear faster than more thinking.",
    boundary: "No irreversible commitment today; only a contained experiment.",
  },
  structure: {
    rule: "Give the next move a start time, an end time, and a visible output.",
    boundary: "A task without a visible output does not count as the next move.",
  },
  alone: {
    rule: "Turn the hidden burden into one specific request another person can answer yes or no to.",
    boundary: "Do not explain your whole life before making the request.",
  },
};

const signalNames: Record<Signal, string> = {
  overwhelmed: "signal overload",
  stuck: "blocked movement",
  scattered: "fragmented attention",
  numb: "protective shutdown",
  urgent: "compressed urgency",
};

const directionNames: Record<Direction, string> = {
  mind: "mind",
  work: "work",
  body: "body",
  money: "money",
  life: "life direction",
};

const CHECKOUT_URL = import.meta.env.VITE_FOUNDING_ORBIT_CHECKOUT_URL?.trim();
const CONTACT_EMAIL = import.meta.env.VITE_FOUNDING_ORBIT_CONTACT_EMAIL?.trim() || "am.statementforge@gmail.com";

export default function OrbitScan() {
  const [step, setStep] = useState(0);
  const [scan, setScan] = useState<ScanState>({ direction: null, signal: null, friction: null, sentence: "" });

  const result = useMemo(() => {
    if (!scan.direction || !scan.signal || !scan.friction) return null;
    const friction = frictionRules[scan.friction];
    return {
      title: `Your ${directionNames[scan.direction]} is carrying ${signalNames[scan.signal]}.`,
      movement: directionMoves[scan.direction],
      rule: friction.rule,
      boundary: friction.boundary,
    };
  }, [scan]);

  function choose<K extends keyof ScanState>(key: K, value: ScanState[K]) {
    setScan(current => ({ ...current, [key]: value }));
  }

  function next() {
    setStep(current => Math.min(3, current + 1));
  }

  function back() {
    setStep(current => Math.max(0, current - 1));
  }

  function restart() {
    setScan({ direction: null, signal: null, friction: null, sentence: "" });
    setStep(0);
  }

  const checkoutHref = CHECKOUT_URL || `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Founding Orbit access")}&body=${encodeURIComponent("I completed the NUR Orbit Scan and want Founding Orbit access at $99/year. Please send the payment link.")}`;

  return (
    <main className="orbit-scan-page">
      <header className="orbit-scan-nav">
        <Link to="/" className="orbit-scan-brand" aria-label="Return to NUR home">
          <span className="orbit-scan-brand-star"><MasterStar variant="brand" /></span>
          <NURWordmark variant="brand" />
        </Link>
        <span className="orbit-scan-time">private · 3 minutes</span>
      </header>

      <section className="orbit-scan-shell" aria-live="polite">
        <div className="orbit-scan-progress" aria-label={`Step ${step + 1} of 4`}>
          {[0, 1, 2, 3].map(index => <span key={index} className={index <= step ? "active" : ""} />)}
        </div>

        {step === 0 && (
          <section className="orbit-scan-card">
            <p className="orbit-scan-kicker">free orbit scan</p>
            <h1>What part of your life is asking to move?</h1>
            <p className="orbit-scan-copy">Choose the direction carrying the most pressure. NUR will turn it into one contained movement—not a motivational speech.</p>
            <div className="orbit-scan-options direction-options">
              {directions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={scan.direction === option.value ? "selected" : ""}
                  onClick={() => choose("direction", option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.detail}</span>
                </button>
              ))}
            </div>
            <button className="orbit-scan-primary" type="button" disabled={!scan.direction} onClick={next}>Continue <span>→</span></button>
          </section>
        )}

        {step === 1 && (
          <section className="orbit-scan-card">
            <p className="orbit-scan-kicker">name the signal</p>
            <h1>What does the pressure feel like?</h1>
            <p className="orbit-scan-copy">Pick the closest signal. It does not need to be perfect; it needs to be honest enough to work with.</p>
            <div className="orbit-scan-options">
              {signals.map(option => (
                <button key={option.value} type="button" className={scan.signal === option.value ? "selected" : ""} onClick={() => choose("signal", option.value)}>{option.label}</button>
              ))}
            </div>
            <div className="orbit-scan-actions">
              <button className="orbit-scan-secondary" type="button" onClick={back}>Back</button>
              <button className="orbit-scan-primary" type="button" disabled={!scan.signal} onClick={next}>Continue <span>→</span></button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="orbit-scan-card">
            <p className="orbit-scan-kicker">find the friction</p>
            <h1>What keeps the movement from happening?</h1>
            <div className="orbit-scan-options">
              {frictions.map(option => (
                <button key={option.value} type="button" className={scan.friction === option.value ? "selected" : ""} onClick={() => choose("friction", option.value)}>{option.label}</button>
              ))}
            </div>
            <label className="orbit-scan-note">
              <span>One sentence you do not want to lose <small>(optional)</small></span>
              <textarea value={scan.sentence} maxLength={240} onChange={event => choose("sentence", event.target.value)} placeholder="The thing underneath all of this is…" />
            </label>
            <div className="orbit-scan-actions">
              <button className="orbit-scan-secondary" type="button" onClick={back}>Back</button>
              <button className="orbit-scan-primary" type="button" disabled={!scan.friction} onClick={next}>Reveal my movement <span>→</span></button>
            </div>
          </section>
        )}

        {step === 3 && result && (
          <section className="orbit-scan-card orbit-scan-result">
            <div className="orbit-scan-result-star" aria-hidden="true"><MasterStar variant="success" /></div>
            <p className="orbit-scan-kicker">your first movement</p>
            <h1>{result.title}</h1>
            {scan.sentence && <blockquote>“{scan.sentence}”</blockquote>}

            <div className="orbit-scan-result-grid">
              <article>
                <span>01 · do this</span>
                <p>{result.movement}</p>
              </article>
              <article>
                <span>02 · use this rule</span>
                <p>{result.rule}</p>
              </article>
              <article>
                <span>03 · protect this boundary</span>
                <p>{result.boundary}</p>
              </article>
            </div>

            <aside className="orbit-scan-offer">
              <div>
                <p className="orbit-scan-offer-label">founding orbit · first 50</p>
                <h2>Do not let this become another insight you lose.</h2>
                <p>Keep your signals, movements, journal, plans, and evolving systems in one private continuity layer.</p>
                <ul>
                  <li>Durable private Orbit</li>
                  <li>Talk → Journal → Plan continuity</li>
                  <li>Founding price locked for year one</li>
                </ul>
              </div>
              <div className="orbit-scan-price">
                <strong>$99</strong><span>/ year</span>
                <a className="orbit-scan-buy" href={checkoutHref} target={CHECKOUT_URL ? "_blank" : undefined} rel={CHECKOUT_URL ? "noreferrer" : undefined}>
                  Keep my Orbit alive <span>→</span>
                </a>
                {!CHECKOUT_URL && <small>Opens a pre-filled request for the secure payment link.</small>}
                <Link className="orbit-scan-free" to="/?sheet=signup&source=orbit-scan">Create a free Orbit instead</Link>
              </div>
            </aside>

            <button className="orbit-scan-restart" type="button" onClick={restart}>Run another scan</button>
          </section>
        )}
      </section>

      <footer className="orbit-scan-footer">
        <span>Your answers stay in this browser unless you choose to create an Orbit.</span>
        <Link to="/">Neural Upgrade Rewiring</Link>
      </footer>
    </main>
  );
}
