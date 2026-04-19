import axios, { type AxiosPromise } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { useState } from "react";

const API_URL = "https://catalogo-backend-9xqq.onrender.com";

const postData = async (data: {
  title: string;
  preco: number;
  precoAntigo: number;
  file?: File;
  imageUrl?: string;
}): AxiosPromise<any> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("preco", data.preco.toString());
  formData.append("precoAntigo", data.precoAntigo.toString());

  if (data.file) {
    formData.append("file", data.file);
  }

  if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl);
  }

  return axios.post(API_URL + "/produtos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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
