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
      formData.append("precoAntigo", data.precoAntigo);
      formData.append("imageUrl", data.imageUrl);
       formData.append("badge", data.badge);
       formData.append("textoOferta", data.textoOferta);

      return axios.put(`${API_URL}/produtos/${data.id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produto-data"] });
    },
  });
}
