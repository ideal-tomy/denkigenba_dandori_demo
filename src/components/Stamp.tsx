type Props = {
  lines: string[];
  variant?: "round" | "square";
  tone?: "red" | "navy";
};

export function Stamp({ lines, variant = "round", tone = "red" }: Props) {
  return (
    <div className={`stamp stamp-${variant} stamp-${tone}`} aria-hidden>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}
