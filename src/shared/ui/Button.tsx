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
    "px-5 py-3 rounded-[2px] font-mono text-xs uppercase tracking-wider font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FD14F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] active:scale-[0.98]";

  const styles = {
    primary:
      "bg-[#8FD14F] hover:bg-[#5FA22B] text-black shadow-sm",
    secondary:
      "bg-transparent hover:bg-zinc-900 text-white border border-zinc-700 shadow-sm",
    outline:
      "border border-[#8FD14F] text-[#8FD14F] hover:bg-[#8FD14F]/10",
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
