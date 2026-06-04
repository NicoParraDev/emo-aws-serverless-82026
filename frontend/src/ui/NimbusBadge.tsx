import "./nimbus-components.css";

interface NimbusBadgeProps {
  label: string;
  variant?: "teal" | "amber" | "magenta";
}

export function NimbusBadge({ label, variant = "teal" }: NimbusBadgeProps) {
  return (
    <span className={`nimbus-badge nimbus-badge--${variant}`}>{label}</span>
  );
}
