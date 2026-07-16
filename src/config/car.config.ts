import { automarketBrand } from "./brands/automarket-durango";
import type { BrandConfig } from "./types";

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  PLANTILLA "COCHE DE LA SEMANA" — ficha animada de un vehículo.       │
 * │  Edita solo este archivo para publicar un coche nuevo.               │
 * │                                                                       │
 * │  Foto: pon la imagen en public/cars/ y su ruta en `photo`            │
 * │  (p.ej. "cars/golf.jpg"). Si la dejas en null, se muestra un         │
 * │  marcador de posición con la marca.                                  │
 * └─────────────────────────────────────────────────────────────────────┘
 */
export interface CarConfig {
  fps: number;
  width: number;
  height: number;
  durationInSeconds: number;
  brand: BrandConfig;
  /** Ruta bajo public/ de la foto del coche, o null para el marcador. */
  photo: string | null;
  badge: string;
  model: string;
  /** Línea bajo el modelo, p.ej. "2019 · 78.000 km". */
  details: string;
  price: string;
  /** Chips de características (3–4 recomendado). */
  specs: string[];
  cta: string;
}

export const carConfig: CarConfig = {
  fps: 30,
  width: 1080,
  height: 1920,
  durationInSeconds: 7,
  brand: automarketBrand,

  photo: null, // ← pon "cars/tu-foto.jpg" (archivo en public/cars/)
  badge: "Coche de la semana",
  model: "Volkswagen Golf",
  details: "2019 · 78.000 km · Diésel",
  price: "14.900 €",
  specs: ["Automático", "5 puertas", "Garantía 12 meses"],
  cta: "Escríbenos por DM",
};
