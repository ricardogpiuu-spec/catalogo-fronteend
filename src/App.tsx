//import { useState } from 'react'
import { useState } from "react";
import "./App.css";
import { Card } from "./componentes/card/card";
import { useProdutoData } from "./hooks/useProdutoData";

import { CreateModal } from "./componentes/create-modal/create-modal";
import { EditModal } from "./componentes/create-modal/EditModal";
import PersonalizarProduto from "./componentes/create-modal/PersonalizarProduto";

function App() {
  const { data, isLoading, error } = useProdutoData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "true";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [produtoEdit, setProdutoEdit] = useState<any>(null);
  //const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar</p>;

  return (
    <div className="container">
      {!produtoSelecionado ? (
        <>
          <h1>Catalogo Camila Personalizado</h1>

          <div className="card-grid">
            {data?.map((produtoData) => (
              <Card
                key={produtoData.id}
                id={produtoData.id} // 🔥 ESSENCIAL
                preco={produtoData.preco}
                title={produtoData.title}
                imagem={produtoData.imagem}
                onEdit={() => setProdutoEdit(produtoData)}
                isAdmin={isAdmin} // 🔥 AQUI
                // 🔥 NOVO BOTÃO
                onClick={() => setProdutoSelecionado(produtoData)}
              />
            ))}
          </div>
          {isAdmin && isModalOpen && <CreateModal closeModal={closeModal} />}
          {isAdmin && <button onClick={openModal}>Novo</button>}

          {/* 🔥 MODAL DE EDITAR */}

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
