import "./nimbus-components.css";

interface NimbusButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function NimbusButton({
  children,
  onClick,
  disabled,
  type = "button",
}: NimbusButtonProps) {
  return (
    <button
      type={type}
      className="nimbus-btn"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="nimbus-btn__shine" aria-hidden />
      <span className="nimbus-btn__label">{children}</span>
    </button>
  );
}
