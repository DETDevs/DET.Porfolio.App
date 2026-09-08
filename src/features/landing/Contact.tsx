import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(event.currentTarget);
    const userName = formData.get("name") || "Cliente";
    const userProject = formData.get("project") || "Contacto";
    const userEmail = formData.get("email");

    formData.append("access_key", "269be25d-cf1c-4d7e-82cc-955f58e0b530");
    formData.append(
      "subject",
      ` Nuevo proyecto: ${userName} quiere hablar sobre "${userProject}"`,
    );
    formData.append("from_name", "DETDevs Portfolio");
    if (userEmail) {
      formData.append("replyto", userEmail as string);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        const formElement = event.target as HTMLFormElement;
        formElement.reset();

        import("react-ga4").then((ga) => {
          ga.default.event({
            category: "Leads",
            action: "Form Submit",
            label: "Contact Form",
          });
        });
      } else {
        console.error("Form submission error:", data);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission exception:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <Section id="contacto">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-14">
          <span className="text-[#a3e635] font-mono text-xs font-bold uppercase tracking-widest mb-3 block">
            {t("contact.eyebrow")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            variants={slideLeftVariants}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactMethods.map((method, i) =>
              method.href !== "#" ? (
                <motion.a
                  key={i}
                  href={method.href}
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-[2px] bg-[#121212] border border-zinc-800 hover:border-zinc-700 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-[2px] flex items-center justify-center shrink-0">
                    <method.icon className="text-[#a3e635] w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                      {method.label}
                    </div>
                    <div className="text-white text-sm font-medium">{method.value}</div>
                  </div>
                </motion.a>
              ) : (
                <motion.div
                  key={i}
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-[2px] bg-[#121212] border border-zinc-800"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-[2px] flex items-center justify-center shrink-0">
                    <method.icon className="text-[#a3e635] w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                      {method.label}
                    </div>
                    <div className="text-white text-sm font-medium">{method.value}</div>
                  </div>
                </motion.div>
              ),
            )}

            <motion.div
              variants={fadeUpVariants}
              className="p-5 rounded-[2px] bg-[#121212] border border-zinc-800"
            >
              <p className="text-sm text-white font-semibold mb-1">
                {t("contact.idea_heading")}
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {t("contact.idea_body")}
              </p>
            </motion.div>
          </motion.div>

          <motion.form
            variants={slideRightVariants}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 space-y-4"
            onSubmit={onSubmit}
          >
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: "none" }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block"
                >
                  {t("contact.label_name")}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder={t("contact.placeholder_name")}
                  className="w-full px-4 py-3 bg-[#121212] border border-zinc-800 rounded-[2px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#a3e635] transition-colors text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block"
                >
                  {t("contact.label_email")}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder={t("contact.placeholder_email")}
                  className="w-full px-4 py-3 bg-[#121212] border border-zinc-800 rounded-[2px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#a3e635] transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-project"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block"
              >
                {t("contact.label_service")}
              </label>
              <select
                id="contact-project"
                name="project"
                required
                className="w-full px-4 py-3 bg-[#121212] border border-zinc-800 rounded-[2px] text-white focus:outline-none focus:border-[#a3e635] transition-colors text-sm cursor-pointer"
              >
                <option value="" className="bg-[#121212] text-white">
                  {t("contact.select_service")}
                </option>
                <option value="facturacion" className="bg-[#121212] text-white">
                  {t("contact.option_billing")}
                </option>
                <option value="logistica" className="bg-[#121212] text-white">
                  {t("contact.option_logistics")}
                </option>
                <option value="web" className="bg-[#121212] text-white">
                  {t("contact.option_web")}
                </option>
                <option value="app" className="bg-[#121212] text-white">
                  {t("contact.option_mobile")}
                </option>
                <option value="custom" className="bg-[#121212] text-white">
                  {t("contact.option_custom")}
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 block"
              >
                {t("contact.label_message")}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                placeholder={t("contact.placeholder_message")}
                className="w-full px-4 py-3 bg-[#121212] border border-zinc-800 rounded-[2px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#a3e635] transition-colors text-sm resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : t("contact.send")}
                {!isSubmitting && <Send size={14} />}
              </Button>

              {submitStatus === "success" && (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-[2px]">
                  <CheckCircle2 size={14} />
                  <span>¡Mensaje enviado con éxito!</span>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-[2px]">
                  <AlertCircle size={14} />
                  <span>Hubo un error al enviar el mensaje.</span>
                </div>
              )}
            </div>
          </motion.form>
        </div>
      </motion.div>
    </Section>
  );
};
