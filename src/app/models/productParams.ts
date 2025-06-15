export type ProductParams = {
  pageNumber: number;
  pageSize: number;
  orderBy: string;
  searchTerm?: string;
  brands: string[];
  types: string[];
};
