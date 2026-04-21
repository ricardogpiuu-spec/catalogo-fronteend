export interface ProdutoData {
  id?: string; // Mongo é string
  title: string;
   imagens: string[]; // igual backend
  preco: number; // igual backend
  precoAntigo: number; // igual backend
  badge: string;
  textoOferta: string;
}
