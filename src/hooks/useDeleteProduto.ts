import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "https://catalogo-backend-9xqq.onrender.com";

const deleteProduto = async (id: string) => {
  return axios.delete(`${API_URL}/produtos/${id}`);
};

export function useDeleteProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produto-data"] });
    },
  });
}
