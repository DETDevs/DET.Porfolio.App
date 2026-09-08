import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  const subTagline = t("footer.sub_tagline").split("\n");

  return (
    <footer className="border-t border-zinc-800 bg-[#050505] py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto mb-10 pb-6 border-b border-zinc-850">
        <p className="text-center text-sm leading-relaxed">
          <span className="text-zinc-200 font-mono text-xs uppercase tracking-wider">
            {t("footer.tagline")}
          </span>
          <br />
          <span className="text-zinc-500 text-xs mt-1 block">
            {subTagline[0]}
            <br />
            {subTagline[1]}
          </span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-bold text-lg uppercase text-white flex items-center gap-2 tracking-tight">
          <div className="w-2 h-2 bg-[#a3e635]" />
          DETDevs
        </div>
        <div className="text-xs text-zinc-500 font-mono text-center md:text-right">
          © {new Date().getFullYear()} DETDevs.
          <br />
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};
