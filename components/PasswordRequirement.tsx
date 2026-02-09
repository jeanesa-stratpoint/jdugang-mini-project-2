import { Check } from "lucide-react";

interface PasswordRequirementProps {
  label: string;
  met: boolean;
  variant?: "dark" | "light";
}

export default function PasswordRequirement({
  label,
  met,
  variant = "light",
}: PasswordRequirementProps) {
  const colors = {
    dark: {
      active: "text-[#85BFBB]",
      inactive: "text-white/40",
      iconColor: "currentColor",
    },
    light: {
      active: "text-[#1F4F46] font-bold",
      inactive: "text-[#1F4F46]/60",
      iconColor: "#1F4F46",
    },
  };

  const currentTheme = colors[variant];

  return (
    <div
      className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
        met ? currentTheme.active : currentTheme.inactive
      }`}
    >
      {met ? (
        <Check
          size={14}
          strokeWidth={3}
          className={variant === "light" ? "" : ""}
        />
      ) : (
        <div className="w-2 h-2 rounded-full border border-current opacity-60" />
      )}
      {label}
    </div>
  );
}
