import { useState } from "react";
import { uploadImage } from "../../uploadImage/uploadImage";
import "./modal.css";

export function EditModal({ produto, closeModal }: any) {
  const temPromocao =
    produto?.precoAntigo && Number(produto.precoAntigo) > Number(produto.preco);

  const [title, setTitle] = useState(produto?.title || "");
  const [preco, setPreco] = useState(String(produto?.preco || ""));
  const [precoAntigo, setPrecoAntigo] = useState(
    temPromocao ? String(produto?.precoAntigo) : "",
  );

  const [promocaoAtiva, setPromocaoAtiva] = useState(temPromocao);

  const [loading, setLoading] = useState(false);

  const [imagens, setImagens] = useState<string[]>(produto?.imagens || []);

  const [preview, setPreview] = useState<string[]>(produto?.imagens || []);

  const [badge, setBadge] = useState(produto?.badge || "");
  const [textoOferta, setTextoOferta] = useState(produto?.textoOferta || "");

  // ADICIONAR NOVAS IMAGENS
  const handleFileChange = async (e: any) => {
    const lista = Array.from(e.target.files || []) as File[];

    const total = imagens.length + lista.length;

    if (total > 4) {
      alert("Máximo 4 imagens");
      return;
    }

    try {
      const novasUrls = await Promise.all(
        lista.map((file) => uploadImage(file)),
      );

      setImagens([...imagens, ...novasUrls]);
      setPreview([...preview, ...novasUrls]);
    } catch {
      alert("Erro ao enviar imagens");
    }

    e.target.value = "";
  };

  // REMOVER
  const removerImagem = (index: number) => {
    const novas = imagens.filter((_, i) => i !== index);

    setImagens(novas);
    setPreview(novas);
  };

  // SUBIR
  const subirImagem = (index: number) => {
    if (index === 0) return;

    const novas = [...imagens];

    [novas[index - 1], novas[index]] = [novas[index], novas[index - 1]];

    setImagens(novas);
    setPreview(novas);
  };

  // DESCER
  const descerImagem = (index: number) => {
    if (index === imagens.length - 1) return;

    const novas = [...imagens];

    [novas[index + 1], novas[index]] = [novas[index], novas[index + 1]];

    setImagens(novas);
    setPreview(novas);
  };

  const submit = async () => {
    try {
      setLoading(true);

      await fetch(
        `https://catalogo-backend-9xqq.onrender.com/produtos/${produto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            preco: Number(preco),
            precoAntigo: promocaoAtiva ? Number(precoAntigo) : 0,
            badge,
            textoOferta,
            imagens, // array completo
          }),
        },
      );

      closeModal();
      window.location.reload();
    } catch {
      alert("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>
          ✖
        </button>

        <h2 className="editar-modal">✏️ Editar Produto</h2>

        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {promocaoAtiva ? (
          <>
            <input placeholder="Preço Antigo" value={precoAntigo} readOnly />

            <input
              placeholder="Preço Promocional"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </>
        ) : (
          <input
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        )}

        <div className="box-promocao">
          {promocaoAtiva ? (
            <button
              className="btn-remover"
              type="button"
              onClick={() => {
                setPromocaoAtiva(false);
                setPreco(precoAntigo);
                setPrecoAntigo("");
              }}
            >
              ❌ Remover Promoção
            </button>
          ) : (
            <button
              className="btn-ativar"
              type="button"
              onClick={() => {
                setPromocaoAtiva(true);
                setPrecoAntigo(preco);
              }}
            >
              🔥 Ativar Promoção
            </button>
          )}
        </div>

        <select value={badge} onChange={(e) => setBadge(e.target.value)}>
          <option value="">Selecione Badge</option>
          <option value="🔥 Últimas Unidades">🔥 Últimas Unidades</option>
          <option value="⚡ Promoção Relâmpago">⚡ Promoção Relâmpago</option>
          <option value="🚚 Frete Grátis Hoje">🚚 Frete Grátis Hoje</option>
          <option value="💥 Oferta Especial">💥 Oferta Especial</option>
          <option value="⭐ Mais Vendido">⭐ Mais Vendido</option>
        </select>

        <select
          value={textoOferta}
          onChange={(e) => setTextoOferta(e.target.value)}
        >
          <option value="">Selecione Texto Oferta</option>
          <option value="⏰ Oferta termina hoje">⏰ Oferta termina hoje</option>
          <option value="🚀 Aproveite agora">🚀 Aproveite agora</option>
          <option value="📦 Envio imediato">📦 Envio imediato</option>
          <option value="💎 Edição limitada">💎 Edição limitada</option>
          <option value="🔒 Compra Segura">🔒 Compra Segura</option>
        </select>

        {/* INPUT IMAGENS */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />

        <p>
          1ª imagem = CAPA <br />
          2ª,3ª,4ª = Miniaturas
        </p>

        <div className="preview-box">
          {preview.map((img, i) => (
            <div key={i} className="item-preview">
              <img src={img} className="preview-img" />

              <small>{i === 0 ? "CAPA" : `MINI ${i}`}</small>

              <div className="acoes-preview">
                <button onClick={() => subirImagem(i)}>⬆</button>

                <button onClick={() => descerImagem(i)}>⬇</button>

                <button onClick={() => removerImagem(i)}>🗑</button>
              </div>
            </div>
          ))}
        </div>

        <button className="editar-produto" onClick={submit} disabled={loading}>
          {loading ? "⏳ Salvando..." : "🚀 Salvar"}
        </button>
      </div>
    </div>
  );
}
