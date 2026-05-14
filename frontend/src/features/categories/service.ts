import { api } from "@/lib/api";
import type { CategorySummary } from "@/features/events/types";

export const categoryService = {
  list: () => api.get<CategorySummary[]>("/categories"),
};
