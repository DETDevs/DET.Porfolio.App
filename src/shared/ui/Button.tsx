import type { ButtonProps } from "../../core/types";

export const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type = "button",
}: ButtonProps) => {
  const baseStyle =
    "px-5 py-3 rounded-full font-medium transition-[background-color,transform,border-color] duration-200 flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer active:scale-[0.98] hover:scale-[1.02]";

  const styles = {
    primary:
      "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
    outline:
      "border border-violet-500/40 text-violet-300 hover:bg-violet-500/10",
    ghost: "bg-transparent hover:bg-white/5 text-slate-300",
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
