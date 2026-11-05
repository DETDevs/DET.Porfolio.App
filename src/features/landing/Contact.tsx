import { useLayoutEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Section } from "@/shared/ui/Section";
import { SectionTitle } from "@/shared/ui/MaskedTitle";
import { CONTACT_INFO } from "@/config/constants";

gsap.registerPlugin(ScrollTrigger);

export const Contact = () => {
  const { t, i18n } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLSpanElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { reduce } = context.conditions as {
          motion: boolean;
          reduce: boolean;
        };

        const blocks = root.querySelectorAll<HTMLElement>(".contact-reveal");
        const shine = shineRef.current;

        if (reduce) {
          gsap.set(blocks, { clearProps: "all" });
          if (shine) gsap.set(shine, { xPercent: -130, opacity: 0 });
          return;
        }

        gsap.set(blocks, { y: 24, opacity: 0 });
        if (shine) gsap.set(shine, { xPercent: -130, opacity: 0.9 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            once: true,
          },
        });

        tl.to(
          blocks,
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          0.18,
        );

        if (shine) {
          tl.to(
            shine,
            {
              xPercent: 260,
              duration: 0.85,
              ease: "power2.out",
            },
            0.42,
          );
        }
      },
      root,
    );

    return () => mm.revert();
  }, [i18n.language]);

  const contactMethods = [
    ...(CONTACT_INFO.email
      ? [
          {
            label: "Correo",
            value: CONTACT_INFO.email,
            href: `mailto:${CONTACT_INFO.email}`,
          },
        ]
      : []),
    {
      label: t("contact.phone_label", "Teléfono"),
      value: CONTACT_INFO.phone,
      href: `tel:${CONTACT_INFO.phone}`,
    },
    {
      label: t("contact.location_label", "Ubicación"),
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
      `Nuevo proyecto: ${userName} quiere hablar sobre "${userProject}"`,
    );
    formData.append("from_name", "NEXOL Portfolio");
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
    <Section
      id="contacto"
      aria-labelledby="cta-titulo"
      sectionClassName="relative overflow-hidden bg-azul-tinta text-rosa-niebla"
    >
      <div ref={rootRef} className="w-full">
        <div className="flex flex-wrap gap-12 lg:gap-16 items-start">
          {/* ========================================================= */}
          {/* Columna Izquierda: Título grande, WhatsApp en rosa y Datos */}
          {/* ========================================================= */}
          <div className="flex-[1.15_1_420px] min-w-0 flex flex-col gap-6">
            <SectionTitle
              id="cta-titulo"
              segments={[
                { text: t("contact.title", "Contanos de tu negocio.") },
              ]}
              className="m-0 font-bricolage text-[clamp(44px,6.2vw,112px)] font-extrabold text-rosa-niebla tracking-[-0.04em] leading-[0.96]"
            />

            <p className="contact-reveal m-0 text-texto-azul text-[clamp(16px,1.1vw,19px)] max-w-[540px] leading-[1.55]">
              {t(
                "contact.subtitle",
                "Te respondemos por WhatsApp con una propuesta clara, sin compromiso.",
              )}
            </p>

            {/* Botón de WhatsApp en Rosa Niebla (alto 60 px) con brillo que cruza una sola vez */}
            <a
              id="contact-whatsapp-btn"
              href={`https://wa.me/50587140989?text=${encodeURIComponent(
                t(
                  "footer.cta_whatsapp_msg",
                  "Hola NEXOL, me gustaría recibir asesoría para mi negocio.",
                ),
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                import("react-ga4").then((ga) => {
                  ga.default.event({
                    category: "Leads",
                    action: "Clic WhatsApp Contact Main",
                    label: "Contact Section CTA",
                  });
                });
              }}
              className="contact-reveal relative overflow-hidden self-start inline-flex items-center gap-3 min-h-[60px] px-7 rounded-[12px] bg-rosa-niebla hover:bg-blanco text-azul-tinta font-semibold text-[17px] no-underline transition-colors"
            >
              <span
                ref={shineRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-[20deg] bg-gradient-to-r from-transparent via-blanco/80 to-transparent"
              />
              <MessageCircle
                size={20}
                className="relative z-10 text-azul-tinta shrink-0"
              />
              <span className="relative z-10">
                {t("contact.whatsapp_cta", "Escribinos por WhatsApp")}
              </span>
            </a>

            {/* Datos de contacto */}
            <dl className="contact-reveal m-0 mt-3 flex flex-col gap-3.5 text-[15px]">
              {contactMethods.map((method, i) => (
                <div key={i}>
                  <dt className="font-mono text-xs text-texto-azul-muted">
                    {method.label}
                  </dt>
                  <dd className="m-0 mt-1 text-rosa-niebla">
                    {method.href !== "#" ? (
                      <a
                        href={method.href}
                        className="text-rosa-niebla hover:text-esmeralda-clara no-underline transition-colors"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <span>{method.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ========================================================= */}
          {/* Columna Derecha: Formulario en tarjeta Rosa Niebla        */}
          {/* ========================================================= */}
          <div className="contact-reveal flex-[1_1_480px] min-w-0 bg-rosa-niebla text-azul-tinta rounded-[24px] p-6 sm:p-8">
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                style={{ display: "none" }}
              />

              <label
                htmlFor="contact-name"
                className="flex flex-col gap-1.5 text-sm font-medium text-azul-tinta"
              >
                <span>{t("contact.label_name", "Nombre completo")}</span>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  placeholder={t("contact.placeholder_name", "Juan Pérez")}
                  className="min-h-[48px] px-3.5 bg-blanco border-[1.5px] border-borde-campo rounded-[10px] text-azul-tinta placeholder:text-texto-secundario-muted/60 focus:outline-none focus:border-esmeralda-oscura focus:ring-2 focus:ring-esmeralda-oscura/20 transition-all text-sm font-normal"
                />
              </label>

              <label
                htmlFor="contact-email"
                className="flex flex-col gap-1.5 text-sm font-medium text-azul-tinta"
              >
                <span>{t("contact.label_email", "Correo electrónico")}</span>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder={t(
                    "contact.placeholder_email",
                    "juan@tuempresa.com",
                  )}
                  className="min-h-[48px] px-3.5 bg-blanco border-[1.5px] border-borde-campo rounded-[10px] text-azul-tinta placeholder:text-texto-secundario-muted/60 focus:outline-none focus:border-esmeralda-oscura focus:ring-2 focus:ring-esmeralda-oscura/20 transition-all text-sm font-normal"
                />
              </label>

              <label
                htmlFor="contact-project"
                className="sm:col-span-2 flex flex-col gap-1.5 text-sm font-medium text-azul-tinta"
              >
                <span>
                  {t("contact.label_service", "¿Qué servicio te interesa?")}
                </span>
                <select
                  id="contact-project"
                  name="project"
                  required
                  defaultValue=""
                  className="min-h-[48px] px-3.5 bg-blanco border-[1.5px] border-borde-campo rounded-[10px] text-azul-tinta focus:outline-none focus:border-esmeralda-oscura focus:ring-2 focus:ring-esmeralda-oscura/20 transition-all text-sm font-normal cursor-pointer"
                >
                  <option value="" disabled>
                    {t("contact.select_service", "Seleccioná un servicio")}
                  </option>
                  <option value="pos">NEXOL POS</option>
                  <option value="cobros">NEXOL Cobros</option>
                  <option value="citas">NEXOL Citas</option>
                  <option value="delivery">NEXOL Delivery</option>
                  <option value="web">Página web o sistema a la medida</option>
                </select>
              </label>

              <label
                htmlFor="contact-message"
                className="sm:col-span-2 flex flex-col gap-1.5 text-sm font-medium text-azul-tinta"
              >
                <span>{t("contact.label_message", "Contanos tu idea")}</span>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder={t(
                    "contact.placeholder_message",
                    "Describí brevemente tu proyecto y qué problema querés resolver.",
                  )}
                  className="p-3.5 bg-blanco border-[1.5px] border-borde-campo rounded-[10px] text-azul-tinta placeholder:text-texto-secundario-muted/60 focus:outline-none focus:border-esmeralda-oscura focus:ring-2 focus:ring-esmeralda-oscura/20 transition-all text-sm font-normal resize-y"
                />
              </label>

              <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="justify-self-start inline-flex items-center justify-center min-h-[52px] px-[26px] rounded-[12px] bg-esmeralda-oscura hover:bg-esmeralda-hover text-blanco text-[16px] font-semibold transition-colors cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-esmeralda-oscura"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </button>

                {submitStatus === "success" && (
                  <div className="inline-flex items-center gap-2 text-badge-verde-text text-xs font-semibold font-mono bg-badge-verde-bg px-3.5 py-2 rounded-lg">
                    <CheckCircle2 size={15} />
                    <span>
                      ¡Mensaje enviado con éxito! Te contactaremos pronto.
                    </span>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="inline-flex items-center gap-2 text-rose-700 text-xs font-semibold font-mono bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-lg">
                    <AlertCircle size={15} />
                    <span>
                      Ocurrió un error. Por favor intentá por WhatsApp.
                    </span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
};
