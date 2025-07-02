import type { Brand } from "./filter/brand";
import type { Category } from "./filter/category";

export type Filter = {
  categories: Category[];
  brands: Brand[];
};
