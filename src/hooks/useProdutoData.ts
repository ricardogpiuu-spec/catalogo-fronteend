import axios, { type AxiosPromise } from "axios";
//import type { ProdutoData } from "../interface/ProdutoData";
import { useQuery } from "@tanstack/react-query";

const API_URL = "https://catalogo-backend-9xqq.onrender.com";

const fetchData = async () => {
  const response = await axios.get(API_URL + "/produtos");
  return response.data;
};

export function useProdutoData() {
   return useQuery({
    queryKey: ["produto-data"],
    queryFn: fetchData,

    staleTime: 1000 * 60 * 5,      // 5 min cache
    gcTime: 1000 * 60 * 10,        // guarda cache 10 min
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
