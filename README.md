# 🟣 DETDevs — Portfolio

Sitio web corporativo de **DETDevs Engineering**, construido con React, Tailwind CSS v4 y Framer Motion.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?logo=framer&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)

---

## 🚀 Stack Tecnológico

| Categoría   | Tecnología               |
| ----------- | ------------------------ |
| Framework   | React 19                 |
| Bundler     | Vite 7                   |
| Lenguaje    | TypeScript 5.9           |
| Estilos     | Tailwind CSS v4 (plugin) |
| Animaciones | Framer Motion 12         |
| Iconos      | Lucide React             |
| Tipografía  | Inter (Google Fonts)     |

---

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── constants.ts          # Datos centralizados (servicios, proyectos, planes, contacto)
├── core/
│   └── types/index.ts        # Interfaces TypeScript compartidas
├── features/
│   ├── landing/
│   │   ├── Hero.tsx           # Sección principal con parallax y CTAs
│   │   ├── Services.tsx       # 8 servicios orientados a negocio
│   │   ├── Projects.tsx       # Portafolio de 6 proyectos con gradientes
│   │   ├── WhyUs.tsx          # Diferenciadores con contadores animados
│   │   ├── Pricing.tsx        # Planes con tabs animadas (mensual/anual/proyecto)
│   │   └── Contact.tsx        # Formulario de contacto + testimonial
│   └── layout/
│       ├── Navbar.tsx         # Navegación fija con smooth scroll
│       └── Footer.tsx         # Pie de página
├── shared/
│   ├── hooks/
│   │   └── useScrollReveal.ts # Hook + variantes de animación reutilizables
│   └── ui/
│       ├── Button.tsx         # Botón reutilizable con variantes
│       └── Section.tsx        # Wrapper de sección con scroll-margin
├── App.tsx                    # Root con lazy loading
├── main.tsx                   # Entry point
└── index.css                  # Estilos base + scrollbar custom
```

---

## ⚡ Optimizaciones de Rendimiento

- **Lazy Loading** — Secciones debajo del fold se cargan bajo demanda (`React.lazy` + `Suspense`)
- **Code Splitting** — Cada sección genera su propio chunk en el build
- **CSS Hover** — Transiciones hover con CSS puro en vez de Framer Motion (menos re-renders)
- **GPU Optimizado** — Blur reducido en efectos de fondo, `will-change: transform` donde aplica
- **Smooth Scroll** — Navegación con anchor tags nativos + `scroll-behavior: smooth`

---

## 🛠️ Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 🎨 Secciones

| Sección       | Descripción                                                           |
| ------------- | --------------------------------------------------------------------- |
| **Hero**      | Título con parallax, badge animado y CTAs                             |
| **Servicios** | 8 cards de servicios orientados a negocio (facturación, inventarios…) |
| **Proyectos** | Grid de 6 proyectos con gradientes, tags y hover effects              |
| **WhyUs**     | 4 diferenciadores con estadísticas animadas (counter)                 |
| **Pricing**   | 3 planes con tabs animadas para mensual/anual/proyecto completo       |
| **Contacto**  | Formulario, info de contacto y testimonial                            |

---

## 📄 Licencia

Uso privado — **DETDevs Engineering** © 2026
