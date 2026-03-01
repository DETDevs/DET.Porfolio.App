import {
    FileText, Package, Users, ClipboardList,
    BarChart3, FileBarChart, Globe, Smartphone,
    Zap, Shield, HeadsetIcon, Rocket,
} from 'lucide-react';
import type { ServiceItem, PricingPlan, Project, Differentiator } from '../core/types';

export const SERVICES: ServiceItem[] = [
    {
        icon: FileText,
        title: "Sistema de Facturación",
        desc: "Generá facturas automáticas, llevá control de lo que vendés, y tené tus números claros.",
    },
    {
        icon: Package,
        title: "Gestión de Inventarios",
        desc: "Control total de stock, alertas de reabastecimiento y seguimiento de productos.",
    },
    {
        icon: Users,
        title: "Gestión de Clientes",
        desc: "Llevá un registro ordenado de tus clientes, lo que han comprado, y nunca pierdas un contacto.",
    },
    {
        icon: ClipboardList,
        title: "Gestión de Pedidos",
        desc: "Flujo completo desde la orden hasta la entrega, con seguimiento en cada etapa.",
    },
    {
        icon: BarChart3,
        title: "Resumen de tu Negocio",
        desc: "Mirá cómo va tu negocio de un vistazo: ventas del día, productos más vendidos, ganancias.",
    },
    {
        icon: FileBarChart,
        title: "Reportes Avanzados",
        desc: "Genera reportes personalizados de ventas, operaciones y rendimiento empresarial.",
    },
    {
        icon: Globe,
        title: "Páginas Web",
        desc: "Sitios web corporativos, landings y tiendas online con diseño moderno y responsive.",
    },
    {
        icon: Smartphone,
        title: "Apps Móviles",
        desc: "Aplicaciones nativas para iOS y Android que conectan tu negocio con tus clientes.",
    },
];

import mopetcoHero from '../assets/LandingMopetco/Hero.png';
import mopetcoGallery from '../assets/LandingMopetco/Gallery.png';
import mopetcoServiceDetail from '../assets/LandingMopetco/ServiceDetail.png';
import mopetcoServices from '../assets/LandingMopetco/Services.png';
import mopetcoContact from '../assets/LandingMopetco/contact.png';

import bookingServices from '../assets/BookingMopetco/Services.png';
import bookingStep1 from '../assets/BookingMopetco/Step1Booking.png';
import bookingStep2 from '../assets/BookingMopetco/Step2Booking.png';
import bookingStep3 from '../assets/BookingMopetco/Step3Booking.png';
import bookingStep4 from '../assets/BookingMopetco/Step4Booking.png';

import boHome from '../assets/BackOfficeBookingMopetco/Home.png';
import boReservaList from '../assets/BackOfficeBookingMopetco/ReservaList.png';
import boCalendar from '../assets/BackOfficeBookingMopetco/calendar.png';
import boMakeReserva from '../assets/BackOfficeBookingMopetco/makeReserva.png';
import boGroomers from '../assets/BackOfficeBookingMopetco/groomers.png';
import boClientes from '../assets/BackOfficeBookingMopetco/clientes.png';
import boAgendaDeHoy from '../assets/BackOfficeBookingMopetco/AgendaDeHoy.png';
import boSettings from '../assets/BackOfficeBookingMopetco/Settings.png';
import boProfile from '../assets/BackOfficeBookingMopetco/profile.png';

export const PROJECTS: Project[] = [
    {
        id: 1,
        title: "Landing Page Mopetco",
        category: "Web",
        description: "Sitio web corporativo para empresa de servicios petroleros con diseño premium, SEO optimizado y formulario de contacto integrado.",
        tags: ["Web", "SEO", "Diseño"],
        image: "from-blue-600 to-cyan-900",
        gallery: [mopetcoHero, mopetcoGallery, mopetcoServiceDetail, mopetcoServices, mopetcoContact],
    },
    {
        id: 2,
        title: "Sistema de Booking Mopetco",
        category: "Gestión",
        description: "Plataforma de reservas y gestión de citas con calendario interactivo, notificaciones automáticas y panel administrativo.",
        tags: ["Reservas", "Calendario", "Admin Panel"],
        image: "from-emerald-600 to-teal-900",
        gallery: [bookingServices, bookingStep1, bookingStep2, bookingStep3, bookingStep4],
    },
    {
        id: 3,
        title: "Bakery POS Integral",
        category: "Facturación",
        description: "Sistema punto de venta completo: facturación electrónica, inventario en tiempo real, control de caja (Cash In/Out) y gestión de pedidos.",
        tags: ["Facturación", "Inventario", "Pedidos", "Caja"],
        image: "from-violet-600 to-purple-900",
    },
    {
        id: 4,
        title: "AgroTrack Dashboard Logístico",
        category: "Gestión",
        description: "Panel de control para cooperativa agrícola con métricas de producción, trazabilidad de lotes y reportes exportables.",
        tags: ["Dashboard", "Gestión", "Reportes"],
        image: "from-orange-600 to-red-900",
    },
    {
        id: 5,
        title: "PideLo App de Delivery",
        category: "App",
        description: "Aplicación móvil de delivery con tracking en tiempo real, notificaciones push, pasarela de pagos y panel de restaurantes.",
        tags: ["App Móvil", "Delivery", "Pagos"],
        image: "from-pink-600 to-rose-900",
    },
    {
        id: 6,
        title: "BackOffice Booking Mopetco",
        category: "Gestión",
        description: "Panel administrativo centralizado para gestionar citas, clientes y servicios del sistema de booking en tiempo real.",
        tags: ["BackOffice", "Dashboard", "Gestión de Citas"],
        image: "from-blue-600 to-indigo-900",
        gallery: [boHome, boReservaList, boCalendar, boMakeReserva, boGroomers, boClientes, boAgendaDeHoy, boSettings, boProfile],
    },
];

export const DIFFERENTIATORS: Differentiator[] = [
    {
        icon: Zap,
        title: "Entrega Rápida",
        desc: "Mientras otros cotizan, nosotros ya vamos por la mitad.",
        stat: "3-5",
        statLabel: "semanas para entrega",
    },
    {
        icon: Shield,
        title: "Código Blindado",
        desc: "Código que no se cae el viernes a las 5pm.",
        stat: "100%",
        statLabel: "test coverage",
    },
    {
        icon: HeadsetIcon,
        title: "Soporte Continuo",
        desc: "No desaparecemos después de entregar. Soporte técnico y mantenimiento incluido.",
        stat: "24/7",
        statLabel: "disponibilidad",
    },
    {
        icon: Rocket,
        title: "Escalabilidad",
        desc: "Sistemas diseñados para crecer contigo. Desde 10 hasta 10,000 usuarios sin reescribir.",
        stat: "∞",
        statLabel: "potencial de escala",
    },
];

export const PLANS: PricingPlan[] = [
    {
        id: 'starter',
        title: "Tu Sitio Web",
        implementationPrice: "desde $300",
        prices: {
            monthly: "$30",
            semiannual: "$26",
            annual: "$23",
        },
        desc: "Todo lo que necesitás para vender online, sin Excel ni dolores de cabeza.",
        devFeatures: [
            "Diseño moderno y adaptable",
            "Formulario de contacto + WhatsApp",
            "Entrega en 3-5 semanas",
            "2 meses de mantenimiento incluidos",
        ],
        membershipFeatures: [
            "Tu sitio siempre online",
            "Soporte cuando lo necesités",
            "Respaldos y seguridad",
        ],
        highlight: false,
        disclaimer: "Después de los 2 meses incluidos: $30/mes",
        cta: "Solicitar mi sitio",
    },
    {
        id: 'essential',
        title: "Esencial",
        implementationPrice: "",
        prices: {
            monthly: "$49",
            semiannual: "$42",
            annual: "$37",
        },
        desc: "Lo justo para dejar el cuaderno y empezar a controlar tu negocio.",
        devFeatures: [
            "Implementación incluida",
            "Facturación + inventario básico",
            "Dashboard de tu negocio",
            "Hasta 3 usuarios incluidos",
        ],
        membershipFeatures: [
            "Soporte cuando lo necesités",
            "Actualizaciones de seguridad",
            "Respaldos incluidos",
        ],
        highlight: false,
        disclaimer: "$42/mes × 6 meses. Luego $49/mes sin compromiso.",
        cta: "Empezar ahora",
    },
    {
        id: 'growth',
        title: "Profesional",
        implementationPrice: "",
        prices: {
            monthly: "$75",
            semiannual: "$64",
            annual: "$56",
        },
        desc: "Dejá de hacer todo a mano: tu operación merece un sistema profesional.",
        devFeatures: [
            "Implementación incluida",
            "Facturación + inventario + reportes",
            "Capacitación + manual de uso",
            "Hasta 6 usuarios incluidos",
            "Entrega en 4-8 semanas",
        ],
        membershipFeatures: [
            "Soporte cuando lo necesités",
            "Actualizaciones de seguridad",
            "Corrección de errores incluida",
        ],
        highlight: true,
        disclaimer: "$64/mes × 6 meses. Luego $75/mes sin compromiso.",
        cta: "Comenzar implementación",
    },
    {
        id: 'enterprise',
        title: "Solución a Medida",
        implementationPrice: "",
        prices: {
            monthly: "Cotizar",
            semiannual: "Cotizar",
            annual: "Cotizar",
        },
        desc: "Tu problema es único; tu solución también debería serlo.",
        devFeatures: [
            "Software 100% a tu medida",
            "Conectamos con tus otros sistemas",
            "Diseñado según tus necesidades",
        ],
        membershipFeatures: [
            "Atención prioritaria",
            "Sistema siempre disponible",
            "Crece con tu negocio",
        ],
        highlight: false,
        cta: "Solicitar cotización",
    },
];
export const CONTACT_INFO = {
    email: "contacto@detdevs.com",
    phone: "+505 8806-8133",
    location: "Managua, Nicaragua",
};