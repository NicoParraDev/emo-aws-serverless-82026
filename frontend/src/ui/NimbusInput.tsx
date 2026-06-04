import "./nimbus-components.css";

interface NimbusInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function NimbusInput({
  value,
  onChange,
  onEnter,
  placeholder,
  disabled,
}: NimbusInputProps) {
  return (
    <div className="nimbus-input-wrap">
      <input
        className="nimbus-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        placeholder={placeholder}
        disabled={disabled}
      />
      <span className="nimbus-input__cursor" aria-hidden />
    </div>
  );
}
