import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const WHATSAPP_URL = "https://wa.me/50587140989";

export const WhatsAppButton = () => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible || dismissed) return;
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    return () => clearTimeout(timer);
  }, [isVisible, dismissed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
        >
          <AnimatePresence>
            {showTooltip && !dismissed && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative bg-[#121212] border border-zinc-800 rounded-[2px] px-3.5 py-2.5 shadow-md max-w-[220px]"
              >
                <button
                  onClick={() => setDismissed(true)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-800 hover:bg-zinc-700 rounded-[2px] flex items-center justify-center transition-colors cursor-pointer border border-zinc-700"
                  aria-label={t("whatsapp.close")}
                >
                  <X size={10} className="text-zinc-400" />
                </button>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <span className="text-[#a3e635] font-semibold block mb-0.5">
                    {t("whatsapp.tooltip_heading")}
                  </span>{" "}
                  {t("whatsapp.tooltip_body")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              import("react-ga4").then((ga) => {
                ga.default.event({
                  category: "Leads",
                  action: "Clic WhatsApp",
                  label: "Floating Button",
                });
              });
            }}
            whileTap={{ scale: 0.95 }}
            className="relative w-12 h-12 rounded-[2px] bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors duration-200"
            aria-label={t("whatsapp.aria")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white relative z-10"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
