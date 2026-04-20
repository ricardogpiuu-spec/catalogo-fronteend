import axios, { type AxiosPromise } from "axios";
import type { ProdutoData } from "../interface/ProdutoData";
import { useQuery } from "@tanstack/react-query";

const API_URL = "https://catalogo-backend-9xqq.onrender.com";

const fetchData = async (): AxiosPromise<ProdutoData[]> => {
  return axios.get(API_URL + "/produtos");
};

export function useProdutoData() {
  const query = useQuery({
    queryFn: fetchData,
    queryKey: ["produto-data"],
    retry: 2,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
