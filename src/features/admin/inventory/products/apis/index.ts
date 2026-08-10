import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

export interface ProductStock {
  product_id: number;
  stock: number;
}

export function useProductStock(id: number | null) {
  return useQuery<ProductStock>({
    queryKey: ["inventory", "products", id, "stock"],
    queryFn: async () => {
      const { data } = await api.get<ProductStock>(`/inventory/products/${id}/stock/`);
      return data;
    },
    enabled: !!id,
  });
}
