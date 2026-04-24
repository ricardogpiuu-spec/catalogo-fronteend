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
          {/* TOPO PREMIUM */}
          <header className="hero-premium">
            <div className="hero-left">
              <span className="hero-mini-badge">
                ✨ Personalizados Exclusivos
              </span>

              <img
                src="/logo-camila.jpeg"
                alt="Cartolina Personalizados"
                className="hero-logo"
              />

              <p>
                A Camila Personalizados leva criatividade, exclusividade e
                carinho para suas comemorações. Produtos personalizados feitos
                com muito amor para transformar seu evento em um momento único,
                do jeitinho que você imaginou.
              </p>

              <p>
                É só escolher o tema que teremos o maior prazer em criar
                especialmente para você! ✨
              </p>

              <div className="hero-beneficios">
                <span>🚚 Enviamos para todo Brasil</span>
                <span>⚡ Produção rápida</span>
                <span>💬 Atendimento imediato</span>
              </div>

              <div className="hero-buttons">
                <a
                  href="https://wa.me/5563991111158"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-zap"
                >
                  💬 WhatsApp
                </a>

                <a href="#produtos" className="btn-produtos">
                  🛍 Ver Produtos
                </a>

                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-insta"
                >
                  📸 Instagram
                </a>
              </div>
            </div>

            <div className="hero-right">
              <img
                src="/topo-produto.jpeg"
                alt="Produto destaque"
                className="hero-image"
              />
            </div>
          </header>

          {/* BUSCA */}
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
          </section>
          <section className="sobre-loja">
  <div className="sobre-box">
    <div className="sobre-coluna">
      <h2>Quem Somos</h2>

      <p>Oi!!</p>

      <p>
        Sou Camila Alves, a pessoa por trás da
        Camila Personalizados. 💖
      </p>

      <p>
        Criamos produtos personalizados com
        carinho para tornar aniversários,
        festas e momentos especiais ainda
        mais inesquecíveis.
      </p>

      <p>
        Cada detalhe é feito com amor,
        dedicação e cuidado para entregar
        algo único do jeitinho que você
        imaginou.
      </p>

      <p>
        Nosso objetivo é levar alegria,
        beleza e praticidade para sua
        comemoração.
      </p>
    </div>

    <div className="sobre-coluna">
      <h2>Políticas da Loja</h2>

      <ul>
        <li>📍 Não possuímos loja física.</li>
        <li>💬 Atendimento 100% online.</li>
        <li>💰 Pedido mínimo conforme produto.</li>
        <li>📝 Produção mediante confirmação.</li>
        <li>💳 Sinal para iniciar produção.</li>
        <li>🚚 Enviamos para todo Brasil.</li>
        <li>🎨 Produtos personalizados sob encomenda.</li>
      </ul>

      <div className="sobre-destaque">
        Montado com carinho para cada cliente ✨
      </div>

      <a href="#" className="btn-voltar-topo">
        VOLTAR AO INÍCIO
      </a>
    </div>

    <div className="sobre-foto">
      <img
        src="/fotocamila.jpeg"
        alt="Camila Alves"
      />
    </div>
  </div>
</section>
<section className="comprar-section">
  <div className="comprar-grid">
 <div className="sobre-coluna">
    {/* COMO COMPRAR */}
    <div className="comprar-card">
      <h2>Como Comprar</h2>

      <p>
        Consulte nosso catálogo de produtos e
        nos informe pelo WhatsApp o código
        daqueles que deseja adquirir com as
        quantidades.
      </p>

      <p>
        Na página de cada produto você encontra
        mais detalhes e modelos disponíveis.
      </p>

      <p className="mini-msg">
        (Novos temas em construção ✨)
      </p>
 <div className="sobre-foto">
        <img
        src="/kit.jpeg"
        alt="Camila Personalizado"
       
      />
</div>
      <a
        href="https://wa.me/5563991111158"
        target="_blank"
        rel="noreferrer"
        className="btn-comprar-zap"
      >
        💬 Falar no WhatsApp
      </a>
      </div>
    </div>

    {/* PAGAMENTO */}
    <div className="comprar-card">
      <div className="sobre-coluna">
      <h2>WhatsApp / Pagamento</h2>

      <div className="formas-box">
        <span>💰 PIX</span>
        <span>💳 Cartão de Crédito</span>
      </div>

      <p>
        <strong>PIX:</strong> 50% do valor na
        confirmação do pedido e os outros
        50% no dia da entrega.
      </p>

      <p>
        <strong>Cartão:</strong> Pagamento na
        confirmação do pedido com parcelamento
        em até 3x (com acréscimo das taxas).
      </p>

      <p>
        Se desejar pagar com cartão, avise-nos
        para enviarmos o link de pagamento.
      </p>
    </div>
</div>
    {/* MARCA */}
    <div className="comprar-card marca-card">
       <div className="sobre-coluna">
      <h2>Camila Personalizado</h2>

      <div className="formas-box">
        <span>💰 PIX</span>
        <span>💳 Cartão</span>
      </div>

      <img
        src="/lembrasa.jpeg"
        alt="Camila Personalizado"
        className="marca-foto"
      />
    </div>
</div>
  </div>
</section>

          {/* PRODUTOS */}
          <div className="card-grid" id="produtos">
            {produtosFiltrados?.map((produtoData: ProdutoData) => (
              <Card
                key={produtoData.id}
                id={produtoData.id}
                preco={produtoData.preco}
                precoAntigo={produtoData.precoAntigo}
                title={produtoData.title}
                imagens={produtoData.imagens}
                badge={produtoData.badge}
                textoOferta={produtoData.textoOferta}
                onEdit={() => setProdutoEdit(produtoData)}
                isAdmin={isAdmin}
                onClick={() => setProdutoSelecionado(produtoData)}
              />
            ))}
          </div>

          {/* MODAIS */}
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

      {/* WHATS FIXO */}
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
