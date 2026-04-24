import axios, { type AxiosPromise } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "https://catalogo-backend-9xqq.onrender.com";

const postData = async (data:any) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("preco", data.preco);
  formData.append("precoAntigo", data.precoAntigo);
  formData.append("badge", data.badge);
  formData.append("textoOferta", data.textoOferta);

  data.imagens.forEach((img:string) => {
    formData.append("imagens", img);
  });

  return axios.post(API_URL + "/produtos", formData);
};

export function useProdutoDataMutate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postData,
    retry: 2,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produto-data"] });
    },
  });
}