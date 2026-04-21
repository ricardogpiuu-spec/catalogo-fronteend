// App.tsx
import { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./componentes/card/card";
import { useProdutoData } from "./hooks/useProdutoData";
import type { ProdutoData } from "./interface/ProdutoData";
import { CreateModal } from "./componentes/create-modal/create-modal";
import { EditModal } from "./componentes/create-modal/EditModal";
import PersonalizarProdutoimagem from "./componentes/create-modal/PersonalizarProdutoimagem";

function App() {
  const { data, isLoading, error } = useProdutoData();
  //const [produtoSelecionadoimagem, setProdutoSelecionadoimagem] = useState(null);
const [busca, setBusca] = useState("");
const [categoria, setCategoria] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState<ProdutoData | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoData | null>(null);

  const params = new URLSearchParams(window.location.search);
  const isAdmin = params.get("admin") === "true";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const produtosFiltrados = data?.filter((produto: ProdutoData) => {
  const nome = produto.title.toLowerCase();
  const buscaTexto = busca.toLowerCase();

  const bateBusca = nome.includes(buscaTexto);

  const bateCategoria =
    categoria === "Todos"
      ? true
      : categoria === "Promoções"
      ? produto.precoAntigo > produto.preco
      : nome.includes(categoria.toLowerCase());

  return bateBusca && bateCategoria;
});

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
          <header className="topo">
            <span className="hero-badge">✨ Personalizados Exclusivos</span>

            <img
    src="/logo-camila.jpeg"
    alt="Camila Personalizados"
    className="logo-topo"
  />

           

            <a
              href="https://api.whatsapp.com/send?phone=5563991111158"
              target="_blank"
              rel="noreferrer"
              className="hero-btn"
            >
              💬 Fazer Pedido no WhatsApp
            </a>
          </header>

          <section className="banner-home">
            ✨ Produtos personalizados com amor 💖
          </section>
           

          <section className="hero-top">
            <input
  type="text"
  placeholder="🔍 Buscar produto..."
  className="buscar"
  value={busca}
  onChange={(e) => setBusca(e.target.value)}
/>

            <div className="categorias">
  <button onClick={() => setCategoria("Todos")}>Todos</button>
  <button onClick={() => setCategoria("Caneca")}>Canecas</button>
  <button onClick={() => setCategoria("Copo")}>Copos</button>
  <button onClick={() => setCategoria("Kit")}>Kits</button>
  <button onClick={() => setCategoria("Promoções")}>
    Promoções
  </button>
</div>

            <div className="banner-rotativo">
              🔥 Promoção termina hoje às 23:59
            </div>

            <div className="hero-info">
              <span>✔️ Compra Segura</span>
              <span>🚚 Entrega Rápida</span>
              <span>⭐ Atendimento Premium</span>
            </div>
          </section>

          <div className="card-grid">
            {produtosFiltrados?.map && data.map((produtoData: ProdutoData) => (
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
              + Novo Produto
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
        <PersonalizarProdutoimagem
          produto={produtoSelecionado}
          voltar={() => setProdutoSelecionado(null)}
        />
      )}

      <a
        href="https://wa.me/5563991111158"
        target="_blank"
        rel="noreferrer"
        className="zap-fixo"
      >
        💬
      </a>
    </div>
  );
}

export default App;
