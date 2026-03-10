export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Vestidos" | "Blusas" | "Faldas" | "Abrigos" | "Accesorios";
  priceARS: number;
  shortDescription: string;
  description: string;
  tags: string[];
  images: string[];
  availableSizes: Array<"Único" | "XS" | "S" | "M" | "L" | "XL">;
};

export const products: Product[] = [
  {
    id: "IMA-VD-001",
    slug: "vestido-aurora-floral",
    name: "Vestido Aurora Floral",
    category: "Vestidos",
    priceARS: 48900,
    shortDescription: "Caída suave, cuello en V y estampa floral delicada.",
    description:
      "Un vestido pensado para días de luz: tejido liviano, cintura marcada y una estampa floral sutil. Ideal para eventos, salidas y looks románticos. Terminación premium y corte favorecedor.",
    tags: ["Nuevo", "Floral", "Edición limitada"],
    images: ["/products/prenda1.png", "/products/floral-ivory.svg"],
    availableSizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "IMA-BL-002",
    slug: "blusa-jardin-de-seda",
    name: "Blusa Jardín de Seda",
    category: "Blusas",
    priceARS: 35900,
    shortDescription: "Textura satinada, mangas leves y brillo elegante.",
    description:
      "Blusa de inspiración romántica con textura satinada y caída elegante. Combina perfecto con jeans claros o faldas de tiro alto. Diseñada para elevar cualquier outfit.",
    tags: ["Satin", "Best seller"],
    images: ["/products/prenda2.png", "/products/floral-peony.svg"],
    availableSizes: ["XS", "S", "M", "L"],
  },
  {
    id: "IMA-FD-003",
    slug: "falda-petalo-midi",
    name: "Falda Pétalo Midi",
    category: "Faldas",
    priceARS: 39900,
    shortDescription: "Tiro alto, línea A y movimiento súper femenino.",
    description:
      "Falda midi de tiro alto con línea A. Su estructura liviana genera movimiento y un look estilizado. Perfecta para combinar con tops y blusas minimalistas.",
    tags: ["Midi", "Elegante"],
    images: ["/products/prenda3.png", "/products/floral-lilac.svg"],
    availableSizes: ["XS", "S", "M", "L"],
  },
  {
    id: "IMA-AB-004",
    slug: "abrigo-bruma-rosa",
    name: "Abrigo Bruma Rosa",
    category: "Abrigos",
    priceARS: 89900,
    shortDescription: "Sastrero, suave al tacto, para capas con estilo.",
    description:
      "Abrigo sastrero con inspiración clásica y paleta rosada. Pensado para combinar con prendas neutras o florales y elevar el look sin esfuerzo.",
    tags: ["Sastrería", "Temporada"],
    images: ["/products/prenda4.png", "/products/floral-ivory.svg"],
    availableSizes: ["S", "M", "L", "XL"],
  },
  {
    id: "IMA-AC-005",
    slug: "pañuelo-botanica",
    name: "Pañuelo Botánica",
    category: "Accesorios",
    priceARS: 15900,
    shortDescription: "Aporta color y textura: cuello, pelo o bolso.",
    description:
      "Pañuelo con estampa botánica y tacto suave. Ideal para sumar un detalle floral a cualquier look: en el cuello, en el pelo o atado al bolso.",
    tags: ["Accesorio", "Regalo"],
    images: ["/products/prenda5.png", "/products/floral-peony.svg"],
    availableSizes: ["Único"],
  },
  {
    id: "IMA-VD-006",
    slug: "vestido-lirio-minimal",
    name: "Vestido Lirio Minimal",
    category: "Vestidos",
    priceARS: 52500,
    shortDescription: "Minimal, romántico y súper combinable.",
    description:
      "Vestido minimal con detalles románticos sutiles. Corte limpio, tela liviana y terminaciones pensadas para durar. Un básico elevado para tu guardarropa.",
    tags: ["Minimal", "Esencial"],
    images: ["/products/prenda6.png", "/products/floral-rose.svg"],
    availableSizes: ["XS", "S", "M", "L"],
  },
];

export const featuredProducts: Product[] = products.slice(0, 5);

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug) ?? null;
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id) ?? null;
}

export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

