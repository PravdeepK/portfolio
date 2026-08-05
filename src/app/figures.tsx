/**
 * Inline figures for the work records. Every figure is a plate in the document:
 * 1px strokes, mono labels, and one accent element carrying the point. Colours
 * come from the CSS variables so the figures stay tied to the page.
 */

const V = "var(--ink)";
const SOFT = "var(--rule-dark)";
const ACCENT = "var(--accent)";
const BAD = "var(--bad)";
const GOOD = "var(--good)";

function Plate({
  title,
  children,
  viewBox = "0 0 320 150",
}: {
  title: string;
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg
      className="figure__svg"
      viewBox={viewBox}
      role="img"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

/** Single measure, single hue, 0 to 100, with each target marked on its own bar. */
export function ScoreBars({
  rows,
  title,
}: {
  rows: { label: string; value: number; target?: number }[];
  title: string;
}) {
  const x0 = 62;
  const width = 214;
  const rowH = 34;
  const top = 26;

  return (
    <Plate title={title} viewBox={`0 0 320 ${top + rows.length * rowH + 20}`}>
      {/* Scale: 0 and 100 only. The 90 line is the band everyone aims at. */}
      <line
        x1={x0 + width * 0.9}
        y1={16}
        x2={x0 + width * 0.9}
        y2={top + rows.length * rowH - 8}
        stroke={SOFT}
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <text className="fig-label" x={x0 + width * 0.9} y={10} textAnchor="middle">
        90
      </text>

      {rows.map((row, i) => {
        const y = top + i * rowH;
        return (
          <g key={row.label}>
            <text className="fig-label" x={0} y={y + 11}>
              {row.label}
            </text>
            <rect
              x={x0}
              y={y}
              width={width}
              height={14}
              fill="var(--paper-3)"
            />
            <rect
              x={x0}
              y={y}
              width={(width * row.value) / 100}
              height={14}
              fill={ACCENT}
            />
            {row.target !== undefined && (
              <>
                <line
                  x1={x0 + (width * row.target) / 100}
                  y1={y - 3}
                  x2={x0 + (width * row.target) / 100}
                  y2={y + 17}
                  stroke={V}
                  strokeWidth="1.5"
                />
                <text
                  className="fig-label"
                  x={x0 + (width * row.target) / 100}
                  y={y + 28}
                  textAnchor="middle"
                >
                  target {row.target}
                </text>
              </>
            )}
            <text className="fig-value" x={x0 + width + 8} y={y + 12}>
              {row.value}
            </text>
          </g>
        );
      })}
    </Plate>
  );
}

/** Partial blocks are held in the buffer until their closing delimiter lands. */
export function StreamFigure() {
  return (
    <Plate title="Streamed blocks are buffered until each one closes, then rendered.">
      <text className="fig-label" x="0" y="10">
        socket
      </text>
      <text className="fig-label" x="108" y="10">
        buffer
      </text>
      <text className="fig-label" x="232" y="10">
        panel
      </text>

      {/* Chunks arriving */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={2 + i * 14}
          y={54 + (i % 2) * 12}
          width="9"
          height="6"
          fill={SOFT}
        />
      ))}
      <path d="M62 62 H100" stroke={V} strokeWidth="1" />
      <path d="M96 58 l5 4 -5 4" fill="none" stroke={V} strokeWidth="1" />

      {/* Buffer: two closed blocks, one still open */}
      <rect
        x="108"
        y="20"
        width="96"
        height="104"
        fill="none"
        stroke={SOFT}
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <rect x="118" y="32" width="76" height="12" fill="var(--paper-3)" />
      <rect x="118" y="52" width="76" height="12" fill="var(--paper-3)" />
      <rect
        x="118"
        y="72"
        width="52"
        height="12"
        fill="none"
        stroke={BAD}
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      <text className="fig-note" x="118" y="100">
        &lt;svg … still open
      </text>

      <path d="M204 62 H240" stroke={V} strokeWidth="1" />
      <path d="M236 58 l5 4 -5 4" fill="none" stroke={V} strokeWidth="1" />

      {/* Rendered panel */}
      <rect
        x="248"
        y="20"
        width="70"
        height="104"
        fill="none"
        stroke={V}
        strokeWidth="1"
      />
      <rect x="256" y="30" width="54" height="8" fill={ACCENT} />
      <rect x="256" y="44" width="42" height="6" fill={SOFT} />
      <rect x="256" y="56" width="50" height="6" fill={SOFT} />
      <rect x="256" y="70" width="54" height="26" fill="var(--paper-3)" />
      <rect x="256" y="102" width="36" height="6" fill={SOFT} />
    </Plate>
  );
}

/** Storefront chain, with the tested flow marked. */
export function CommerceFigure() {
  const nodes = ["Catalog", "Product", "Cart", "Checkout"];
  return (
    <Plate title="Catalog through checkout, reading from REST APIs, with checkout under test.">
      {nodes.map((node, i) => {
        const x = i * 80;
        const isLast = i === nodes.length - 1;
        return (
          <g key={node}>
            <rect
              x={x}
              y="34"
              width="66"
              height="30"
              fill="none"
              stroke={isLast ? ACCENT : V}
              strokeWidth={isLast ? "1.5" : "1"}
            />
            <text
              className="fig-label"
              x={x + 33}
              y="53"
              textAnchor="middle"
              style={{ fill: isLast ? ACCENT : V }}
            >
              {node}
            </text>
            {i < nodes.length - 1 && (
              <path
                d={`M${x + 66} 49 H${x + 78}`}
                stroke={SOFT}
                strokeWidth="1"
              />
            )}
            <path
              d={`M${x + 33} 64 V96`}
              stroke={SOFT}
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </g>
        );
      })}

      <rect x="0" y="96" width="306" height="24" fill="var(--paper-3)" />
      <text className="fig-label" x="8" y="111">
        rest api · products · auth · orders
      </text>

      <text className="fig-label" x="240" y="20" style={{ fill: ACCENT }}>
        jest + rtl
      </text>
      <path d="M262 24 V32" stroke={ACCENT} strokeWidth="1" />
    </Plate>
  );
}

/** Live state on the socket, one write to Firestore at the end. */
export function SocketFigure() {
  return (
    <Plate title="Match state runs over the socket server; only the final result is written to Firestore.">
      <rect x="0" y="30" width="72" height="28" fill="none" stroke={V} />
      <text className="fig-label" x="36" y="48" textAnchor="middle">
        player a
      </text>

      <rect x="0" y="86" width="72" height="28" fill="none" stroke={V} />
      <text className="fig-label" x="36" y="104" textAnchor="middle">
        player b
      </text>

      <rect x="118" y="52" width="84" height="40" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <text className="fig-label" x="160" y="70" textAnchor="middle" style={{ fill: ACCENT }}>
        socket
      </text>
      <text className="fig-label" x="160" y="82" textAnchor="middle" style={{ fill: ACCENT }}>
        railway
      </text>

      <path d="M72 44 H100 V64 H114" fill="none" stroke={ACCENT} strokeWidth="1" />
      <path d="M72 100 H100 V80 H114" fill="none" stroke={ACCENT} strokeWidth="1" />

      <rect x="248" y="52" width="70" height="40" fill="none" stroke={V} />
      <text className="fig-label" x="283" y="70" textAnchor="middle">
        firestore
      </text>
      <text className="fig-label" x="283" y="82" textAnchor="middle">
        result
      </text>
      <path d="M202 72 H244" stroke={V} strokeWidth="1" />
      <path d="M240 68 l5 4 -5 4" fill="none" stroke={V} strokeWidth="1" />
      <text className="fig-label" x="206" y="64">
        once
      </text>

      {/* The path that was wrong: a write per keystroke. */}
      <path
        d="M36 30 V16 H283 V48"
        fill="none"
        stroke={BAD}
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <text className="fig-note" x="60" y="12" style={{ fill: BAD }}>
        a write every keystroke
      </text>
      <path d="M186 10 l11 11 M197 10 l-11 11" stroke={BAD} strokeWidth="1.2" />
    </Plate>
  );
}

/** Position in the grid carries the meaning, so parsing has to keep it. */
export function TimetableFigure() {
  const cols = [0, 1, 2, 3, 4];
  const rows = [0, 1, 2, 3];
  return (
    <Plate title="A timetable cell keeps its row and column, which become the time and the room.">
      <text className="fig-label" x="0" y="10">
        screenshot
      </text>
      {rows.map((r) =>
        cols.map((c) => {
          const hit = r === 2 && c === 3;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * 28}
              y={20 + r * 26}
              width="26"
              height="24"
              fill={hit ? ACCENT : "none"}
              stroke={hit ? ACCENT : SOFT}
              strokeWidth="1"
            />
          );
        })
      )}

      <path d="M148 84 H190" stroke={V} strokeWidth="1" />
      <path d="M186 80 l5 4 -5 4" fill="none" stroke={V} strokeWidth="1" />
      <text className="fig-label" x="169" y="76" textAnchor="middle">
        position
      </text>

      <text className="fig-label" x="198" y="10">
        ics event
      </text>
      <rect x="198" y="20" width="120" height="104" fill="none" stroke={V} />
      <rect x="198" y="20" width="4" height="104" fill={ACCENT} />
      <text className="fig-value" x="212" y="48">
        AIGC 5500
      </text>
      <text className="fig-note" x="212" y="70">
        Wed 14:00 to 16:00
      </text>
      <text className="fig-note" x="212" y="88">
        Room D221
      </text>
    </Plate>
  );
}

/** The verification output a candidate sees. Illustrative, not live data. */
export function VerificationFigure() {
  const checks = [
    ["Business registration", "Matched"],
    ["Document authenticity", "Matched"],
    ["Posting pattern", "Clear"],
    ["LMIA reference", "Valid"],
  ];

  return (
    <Plate
      title="Verification scorecard: business registration matched, documents matched, posting pattern clear, LMIA reference valid, legitimacy score 94 of 100."
      viewBox="0 0 320 172"
    >
      <text className="fig-label" x="0" y="10">
        verification scan
      </text>
      <rect
        x="256"
        y="0"
        width="64"
        height="15"
        fill="none"
        stroke={GOOD}
        strokeWidth="1"
      />
      <text
        className="fig-label"
        x="288"
        y="11"
        textAnchor="middle"
        style={{ fill: GOOD }}
      >
        verified
      </text>

      {checks.map(([label, value], i) => {
        const y = 38 + i * 22;
        return (
          <g key={label}>
            <text className="fig-label" x="0" y={y}>
              {label}
            </text>
            <text
              className="fig-label"
              x="320"
              y={y}
              textAnchor="end"
              style={{ fill: GOOD }}
            >
              ✓ {value}
            </text>
            <line
              x1="0"
              y1={y + 7}
              x2="320"
              y2={y + 7}
              stroke={SOFT}
              strokeWidth="1"
            />
          </g>
        );
      })}

      <text className="fig-label" x="0" y="142">
        legitimacy score
      </text>
      <text className="fig-value" x="320" y="142" textAnchor="end">
        94 / 100
      </text>
      <rect x="0" y="152" width="320" height="6" fill="var(--paper-3)" />
      <rect x="0" y="152" width="300.8" height="6" fill={GOOD} />
    </Plate>
  );
}

/** Two models on the same inputs. */
export function ModelsFigure() {
  const inputs = [0, 1, 2, 3];
  return (
    <Plate title="Logistic regression compared against a multilayer perceptron on the same inputs.">
      <text className="fig-label" x="0" y="10">
        logistic regression
      </text>
      {inputs.map((i) => (
        <g key={i}>
          <circle cx="10" cy={34 + i * 24} r="5" fill="none" stroke={V} />
          <path d={`M16 ${34 + i * 24} L84 82`} stroke={SOFT} strokeWidth="1" />
        </g>
      ))}
      <circle cx="90" cy="82" r="7" fill="none" stroke={V} strokeWidth="1.5" />

      <line x1="140" y1="16" x2="140" y2="140" stroke={SOFT} strokeDasharray="2 4" />

      <text className="fig-label" x="176" y="10" style={{ fill: ACCENT }}>
        multilayer perceptron
      </text>
      {inputs.map((i) => (
        <circle key={i} cx="186" cy={34 + i * 24} r="5" fill="none" stroke={V} />
      ))}
      {[0, 1, 2].map((h) => (
        <g key={h}>
          <circle cx="252" cy={46 + h * 24} r="5" fill="none" stroke={ACCENT} />
          {inputs.map((i) => (
            <path
              key={i}
              d={`M192 ${34 + i * 24} L246 ${46 + h * 24}`}
              stroke={SOFT}
              strokeWidth="0.6"
            />
          ))}
          <path d={`M258 ${46 + h * 24} L306 82`} stroke={SOFT} strokeWidth="0.6" />
        </g>
      ))}
      <circle cx="312" cy="82" r="7" fill="none" stroke={ACCENT} strokeWidth="1.5" />
    </Plate>
  );
}
