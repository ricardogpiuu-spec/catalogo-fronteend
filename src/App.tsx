// App.tsx
import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./componentes/card/card";
import { useProdutoData } from "./hooks/useProdutoData";
import type { ProdutoData } from "./interface/ProdutoData";
import { CreateModal } from "./componentes/create-modal/create-modal";
import { EditModal } from "./componentes/create-modal/EditModal";
import PersonalizarProduto from "./componentes/create-modal/PersonalizarProduto";

function App() {
  const { data, isLoading, error } = useProdutoData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState<ProdutoData | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoData | null>(null);

  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "true";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
  fetch("https://catalogo-backend-9xqq.onrender.com/produtos");
}, []);

 if (isLoading) {
  return (
    <div className="loading-page">
      <div className="spinner"></div>
      <h2>Carregando Catálogo...</h2>
    </div>
  );
}
  if (error) return <p>Erro ao carregar</p>;

  return (
    <div className="container">
      {!produtoSelecionado ? (
        <>
          <h1>Catalogo Camila Personalizado</h1>

          <div className="card-grid">
            {data?.map((produtoData: ProdutoData) => (
              <Card
                key={produtoData.id}
                id={produtoData.id}
                preco={produtoData.preco}
                precoAntigo={produtoData.precoAntigo}
                title={produtoData.title}
                imagem={produtoData.imagem}
                badge={produtoData.badge}
                textoOferta={produtoData.textoOferta}
                onEdit={() => setProdutoEdit(produtoData)}
                isAdmin={isAdmin}
                onClick={() => setProdutoSelecionado(produtoData)}
              />
            ))}
          </div>

          {isAdmin && isModalOpen && <CreateModal closeModal={closeModal} />}

          {isAdmin && (
            <button className="novo" onClick={openModal}>
              Adicionar Novo item
            </button>
          )}

          {produtoEdit && (
            <EditModal
              produto={produtoEdit}
              closeModal={() => setProdutoEdit(null)}
            />
          )}
        </>
      ) : (
        <PersonalizarProduto
          produto={produtoSelecionado}
          voltar={() => setProdutoSelecionado(null)}
        />
      )}
    </div>
  );
}

export default App;
