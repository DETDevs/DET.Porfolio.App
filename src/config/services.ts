import { POS_PRICE } from "./constants";

export interface ServiceSceneData {
  id: string;
  tag: string;
  title: string;
  price: string;
  desc: string;
  image: string;
  link: string;
  category: "pos" | "cartera" | "citas" | "logistics" | "web";
}

export const BASE_SERVICES: ServiceSceneData[] = [
  {
    id: "01",
    tag: "Punto de Venta",
    title: "Punto de Venta (POS)",
    price: `$${POS_PRICE}/mes por sucursal`,
    desc: "Cobro rápido con pagos mixtos y dólares, control de caja por turno y cajero, inventario y reportes de ventas.",
    image: "/assets/project/pos/caja_POS.png",
    link: "#planes",
    category: "pos",
  },
  {
    id: "02",
    tag: "Cartera de Cobro",
    title: "Cartera de Cobro",
    price: "$25/mes por negocio",
    desc: "Cargá consumos a cuenta de empleados con carnet de código de barras y generá el reporte de deducción para planilla.",
    image: "/assets/project/pos/historial_POS.png",
    link: "#planes",
    category: "cartera",
  },
  {
    id: "03",
    tag: "Citas en línea",
    title: "Agenda de Citas",
    price: "$30/mes",
    desc: "Reservas en línea para tus clientes, agenda por profesional y confirmación automática.",
    image: "/assets/project/bookingwebsite/project.png",
    link: "#planes",
    category: "citas",
  },
  {
    id: "04",
    tag: "Delivery",
    title: "Delivery",
    price: "Comisión por entrega",
    desc: "Despacho en tiempo real con mapa, repartidores y seguimiento de pedidos.",
    image: "/assets/project/webtrack/dash_webtrack.png",
    link: "#planes",
    category: "logistics",
  },
  {
    id: "05",
    tag: "Páginas web",
    title: "Páginas web a la medida",
    price: "Desde $300",
    desc: "Sitio profesional para tu negocio, con hosting incluido y soporte mensual.",
    image: "/assets/project/DulcesMomentos/project.png",
    link: "#planes",
    category: "web",
  },
];
