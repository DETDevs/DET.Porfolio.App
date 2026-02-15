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
        desc: "Automatiza tu facturación electrónica con reportes en tiempo real y cumplimiento fiscal.",
    },
    {
        icon: Package,
        title: "Gestión de Inventarios",
        desc: "Control total de stock, alertas de reabastecimiento y seguimiento de productos.",
    },
    {
        icon: Users,
        title: "Gestión de Clientes",
        desc: "CRM completo para administrar relaciones, historial y comunicación con tus clientes.",
    },
    {
        icon: ClipboardList,
        title: "Gestión de Pedidos",
        desc: "Flujo completo desde la orden hasta la entrega, con seguimiento en cada etapa.",
    },
    {
        icon: BarChart3,
        title: "Dashboards & KPIs",
        desc: "Indicadores clave de rendimiento y paneles visuales para tomar mejores decisiones.",
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

export const PROJECTS: Project[] = [
    {
        id: 1,
        title: "Landing Page Mopetco",
        category: "Web",
        description: "Sitio web corporativo para empresa de servicios petroleros con diseño premium, SEO optimizado y formulario de contacto integrado.",
        tags: ["Web", "SEO", "Diseño"],
        image: "from-blue-600 to-cyan-900",
    },
    {
        id: 2,
        title: "Sistema de Booking Mopetco",
        category: "Gestión",
        description: "Plataforma de reservas y gestión de citas con calendario interactivo, notificaciones automáticas y panel administrativo.",
        tags: ["Reservas", "Calendario", "Admin Panel"],
        image: "from-emerald-600 to-teal-900",
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
        title: "AgroTrack — Dashboard Logístico",
        category: "KPIs",
        description: "Panel de control para cooperativa agrícola con métricas de producción, trazabilidad de lotes y reportes exportables.",
        tags: ["KPIs", "Reportes", "Trazabilidad"],
        image: "from-orange-600 to-red-900",
    },
    {
        id: 5,
        title: "PideLo — App de Delivery",
        category: "Móvil",
        description: "Aplicación móvil de delivery con tracking en tiempo real, notificaciones push, pasarela de pagos y panel de restaurantes.",
        tags: ["iOS", "Android", "Geolocalización"],
        image: "from-pink-600 to-rose-900",
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
        prices: {
            monthly: "$30",
            semiannual: "$26",
            annual: "$23",
        },
        desc: "Todo lo que necesitás para vender online, sin Excel, sin dolor de cabeza.",
        features: [
            "Diseño moderno y adaptable",
            "Carga rápida y estable 24/7",
            "Botón directo a WhatsApp",
            "Formulario de contacto",
            "Dominio y Hosting incluido",
            "Entrega en 3-5 semanas",
        ],
        highlight: false,
    },
    {
        id: 'growth',
        title: "Sistemas & Gestión",
        prices: {
            monthly: "$65",
            semiannual: "$55",
            annual: "$49",
        },
        desc: "Dejá de hacer todo a mano. Tu operación merece un sistema de verdad.",
        features: [
            "Sistema de Facturación",
            "Control de inventario en tiempo real",
            "Gestión de clientes y proveedores",
            "Reportes automáticos",
            "Soporte técnico + backups",
            "Capacitación + manual de uso",
        ],
        highlight: true,
    },
    {
        id: 'enterprise',
        title: "Solución a Medida",
        prices: {
            monthly: "Cotizar",
            semiannual: "Cotizar",
            annual: "Cotizar",
        },
        desc: "Tu problema es único. Tu solución también debería serlo.",
        features: [
            "Software 100% Personalizado (Web/App)",
            "Diseño según necesidades reales",
            "Integraciones con otros sistemas",
            "Seguridad y escalabilidad máxima",
            "Soporte y mantenimiento",
            "Capacitación + manual de uso",
        ],
        highlight: false,
    },
];
export const CONTACT_INFO = {
    email: "contacto@detdevs.com",
    phone: "+505 8714-0989",
    location: "Managua, Nicaragua",
};