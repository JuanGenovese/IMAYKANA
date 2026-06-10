
import type { Producto } from "../productos";
import type { Imagen } from "../imagenes";
import type { TalleXCategoria } from "../talles-x-categoria";
import type { Talle } from "../talles";
import type { Categoria } from "../categorias";
import type { Estado } from "../estados";

export type ProductoConRelaciones = Producto & {
  imagenes: Imagen[];
  talleXCategoria: TalleXCategoria & {
    talle: Talle;
    categoria: Categoria;
  };
  estado: Estado;
};