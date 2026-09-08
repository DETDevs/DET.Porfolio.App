import type { ButtonProps } from "@/core/types";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type = "button",
}: ButtonProps) => {
  const baseStyle =
    "px-5 py-3 rounded-[2px] font-mono text-xs uppercase tracking-wider font-bold transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-[#a3e635] hover:bg-[#b5ff14] text-black shadow-sm",
    secondary:
      "bg-transparent hover:bg-zinc-900 text-white border border-zinc-700 shadow-sm",
    outline:
      "border border-[#a3e635] text-[#a3e635] hover:bg-[#a3e635]/10",
    ghost: "bg-transparent hover:bg-white/5 text-zinc-300",
  };

  return (
    <button
      className={`${baseStyle} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};
