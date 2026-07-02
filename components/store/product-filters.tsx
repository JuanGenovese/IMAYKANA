import { CategoryIconRow } from "@/components/store/category-icon-row";

interface ProductFiltersProps {
  categories: { id: number; categoria: string }[];
  activeCategory?: string;
}

export function ProductFilters({ categories, activeCategory }: ProductFiltersProps) {
  return (
    <CategoryIconRow
      categories={categories}
      activeCategory={activeCategory}
    />
  );
}
