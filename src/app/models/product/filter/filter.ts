export interface Category {
  id: number;
  categoryId: number;
  name: string;
}

export interface Brand {
  id: number;
  brandId: number;
  name: string;
}

export interface Filter {
  categories: Category[];
  brands: Brand[];
}

export interface FilterInput {
  categories: string;
  brands: string;
}
