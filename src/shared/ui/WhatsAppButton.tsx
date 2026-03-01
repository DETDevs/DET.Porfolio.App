import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CONTACT_INFO } from "@/config/constants";

const EMAIL_URL = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent("Nuevo proyecto — Contacto desde la web")}`;

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
                className="relative bg-slate-800/95 backdrop-blur-sm border border-violet-500/30 rounded-2xl rounded-br-md px-4 py-3 shadow-[0_8px_32px_rgba(139,92,246,0.15)] max-w-[220px]"
              >
                <button
                  onClick={() => setDismissed(true)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label={t("whatsapp.close")}
                >
                  <X size={10} className="text-slate-300" />
                </button>
                <p className="text-xs text-slate-300 leading-relaxed">
                  👋
                  <span className="text-violet-300 font-semibold">
                    {t("whatsapp.tooltip_heading")}
                  </span>{" "}
                  {t("whatsapp.tooltip_body")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href={EMAIL_URL}
            onClick={() => {
              import("react-ga4").then((ga) => {
                ga.default.event({
                  category: "Leads",
                  action: "Clic Email",
                  label: "Floating Button",
                });
              });
            }}
            whileTap={{ scale: 0.95 }}
            className="relative group w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(139,92,246,0.4)] cursor-pointer"
            aria-label={t("whatsapp.aria")}
          >
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 group-hover:from-violet-400 group-hover:to-indigo-500 transition-all duration-300" />

            <motion.div
              className="absolute inset-0 rounded-full bg-violet-500/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <Mail className="w-7 h-7 text-white relative z-10 drop-shadow-sm" />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
