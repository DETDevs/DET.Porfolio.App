import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section } from "@/shared/ui/Section";
import { Button } from "@/shared/ui/Button";
import { CONTACT_INFO } from "@/config/constants";
import {
  useScrollReveal,
  fadeUpVariants,
  staggerContainer,
  slideLeftVariants,
  slideRightVariants,
} from "@/shared/hooks/useScrollReveal";

export const Contact = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollReveal(0.1);

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: Phone,
      label: t("contact.phone_label"),
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone}`,
    },
    {
      icon: MapPin,
      label: t("contact.location_label"),
      value: CONTACT_INFO.location,
      href: "#",
    },
  ];

  return (
    <Section id="contacto">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-14">
          <span className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            {t("contact.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            variants={slideLeftVariants}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactMethods.map((method, i) =>
              method.href !== "#" ? (
                <motion.a
                  key={i}
                  href={method.href}
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-violet-500/30 transition-[border-color,transform] duration-300 group hover:translate-x-1.5"
                >
                  <div className="w-12 h-12 bg-violet-900/30 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-violet-900/50 transition-colors">
                    <method.icon className="text-violet-400 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">
                      {method.label}
                    </div>
                    <div className="text-white font-medium">{method.value}</div>
                  </div>
                </motion.a>
              ) : (
                <motion.div
                  key={i}
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50"
                >
                  <div className="w-12 h-12 bg-violet-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <method.icon className="text-violet-400 w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">
                      {method.label}
                    </div>
                    <div className="text-white font-medium">{method.value}</div>
                  </div>
                </motion.div>
              ),
            )}

            <motion.div
              variants={fadeUpVariants}
              className="p-6 rounded-2xl bg-linear-to-br from-violet-900/20 to-slate-900/50 border border-violet-500/20"
            >
              <p className="text-sm text-white font-semibold mb-1">
                {t("contact.idea_heading")}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("contact.idea_body")}
              </p>
            </motion.div>
          </motion.div>

          <motion.form
            variants={slideRightVariants}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              import("react-ga4").then((ga) => {
                ga.default.event({
                  category: "Leads",
                  action: "Form Submit",
                  label: "Contact Form",
                });
              });
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs text-slate-400 uppercase tracking-wider mb-2 block"
                >
                  {t("contact.label_name")}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder={t("contact.placeholder_name")}
                  className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs text-slate-400 uppercase tracking-wider mb-2 block"
                >
                  {t("contact.label_email")}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder={t("contact.placeholder_email")}
                  className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-project"
                className="text-xs text-slate-400 uppercase tracking-wider mb-2 block"
              >
                {t("contact.label_project")}
              </label>
              <select
                id="contact-project"
                className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors text-sm appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">
                  {t("contact.select_default")}
                </option>
                <option value="facturacion" className="bg-slate-900">
                  {t("contact.option_billing")}
                </option>
                <option value="inventario" className="bg-slate-900">
                  {t("contact.option_inventory")}
                </option>
                <option value="web" className="bg-slate-900">
                  {t("contact.option_web")}
                </option>
                <option value="app" className="bg-slate-900">
                  {t("contact.option_app")}
                </option>
                <option value="custom" className="bg-slate-900">
                  {t("contact.option_custom")}
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="text-xs text-slate-400 uppercase tracking-wider mb-2 block"
              >
                {t("contact.label_message")}
              </label>
              <textarea
                id="contact-message"
                rows={5}
                placeholder={t("contact.placeholder_message")}
                className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors text-sm resize-none"
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              {t("contact.send")} <Send size={16} />
            </Button>
          </motion.form>
        </div>
      </motion.div>
    </Section>
  );
};
