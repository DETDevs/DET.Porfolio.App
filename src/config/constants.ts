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
        title: "Sistema POS Restaurante",
        category: "Facturación",
        description: "Sistema punto de venta completo con gestión de mesas, cocina en tiempo real y facturación electrónica.",
        tags: ["Facturación", "Inventario", "Reportes"],
        image: "from-violet-600 to-purple-900",
    },
    {
        id: 2,
        title: "E-Commerce Fashion",
        category: "Web",
        description: "Tienda online con catálogo dinámico, pasarela de pagos y panel administrativo.",
        tags: ["Web", "Pagos", "Admin Panel"],
        image: "from-blue-600 to-cyan-900",
    },
    {
        id: 3,
        title: "App Delivery",
        category: "Móvil",
        description: "Aplicación de delivery con tracking en tiempo real, notificaciones push y sistema de calificaciones.",
        tags: ["iOS", "Android", "Geolocalización"],
        image: "from-emerald-600 to-teal-900",
    },
    {
        id: 4,
        title: "Dashboard Logístico",
        category: "KPIs",
        description: "Panel de control para empresa de logística con métricas de rendimiento y rutas optimizadas.",
        tags: ["KPIs", "Reportes", "Automatización"],
        image: "from-orange-600 to-red-900",
    },
    {
        id: 5,
        title: "CRM Inmobiliaria",
        category: "Gestión",
        description: "Sistema de gestión de clientes y propiedades con pipeline de ventas y seguimiento automático.",
        tags: ["Clientes", "Pedidos", "Reportes"],
        image: "from-pink-600 to-rose-900",
    },
    {
        id: 6,
        title: "Plataforma Educativa",
        category: "Web",
        description: "LMS con videoconferencias, evaluaciones automatizadas y certificados digitales.",
        tags: ["Web", "Usuarios", "Contenido"],
        image: "from-indigo-600 to-violet-900",
    },
];

export const DIFFERENTIATORS: Differentiator[] = [
    {
        icon: Zap,
        title: "Entrega Rápida",
        desc: "MVPs funcionales en semanas, no meses. Iteramos contigo desde el día uno.",
        stat: "2-4",
        statLabel: "semanas para MVP",
    },
    {
        icon: Shield,
        title: "Código Blindado",
        desc: "Arquitectura segura, pruebas automatizadas y documentación completa en cada entrega.",
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
        title: "MVP / Startup",
        prices: {
            monthly: "$$$$",
            annual: "$$$$",
            project: "$$$$",
        },
        desc: "Lanza tu idea rápido. Web corporativa o Landing de producto.",
        features: [
            "Diseño Mobile First",
            "Hosting Configurado",
            "Formulario de Contacto",
            "SEO Básico",
            "1 Revisión de diseño",
            "Entrega en 2-3 semanas",
        ],
        highlight: false,
    },
    {
        id: 'growth',
        title: "Sistemas & Gestión",
        prices: {
            monthly: "$$$$",
            annual: "$$$$",
            project: "$$$$",
        },
        desc: "Automatiza tu operación diaria. Sistemas a tu medida.",
        features: [
            "Sistema de Facturación",
            "Control de Inventario",
            "Gestión de Clientes",
            "Reportes Mensuales",
            "Soporte 24/7",
            "Backups Diarios",
            "Capacitación incluida",
        ],
        highlight: true,
    },
    {
        id: 'enterprise',
        title: "Ingeniería Custom",
        prices: {
            monthly: "Cotizar",
            annual: "Cotizar",
            project: "Cotizar",
        },
        desc: "Arquitecturas complejas para alto volumen de datos.",
        features: [
            "Arquitectura a medida",
            "Apps Móviles Full",
            "Auditoría de Seguridad",
            "Infraestructura Dedicada",
            "SLA Garantizado",
            "Equipo asignado",
            "Consultoría estratégica",
        ],
        highlight: false,
    },
];

export const CONTACT_INFO = {
    email: "hola@detdevs.com",
    phone: "+505 8714-0989",
    location: "Managua, Nicaragua",
};