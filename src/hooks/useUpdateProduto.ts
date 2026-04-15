import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "https://catalogo-backend-9xqq.onrender.com";

export function useUpdateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("preco", data.preco);
      formData.append("imageUrl", data.imageUrl);

      return axios.put(`${API_URL}/produtos/${data.id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produto-data"] });
    },
  });
}
