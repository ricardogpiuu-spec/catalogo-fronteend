import { useState } from "react";
import "./modal.css";

export function EditModal({ produto, closeModal }: any) {
  const temPromocao =
    produto?.precoAntigo && Number(produto.precoAntigo) > Number(produto.preco);

  const [title, setTitle] = useState(produto?.title || "");

  // preço atual
  const [preco, setPreco] = useState(String(produto?.preco || ""));

  // preço antigo
  const [precoAntigo, setPrecoAntigo] = useState(
    temPromocao ? String(produto?.precoAntigo) : "",
  );

  const [promocaoAtiva, setPromocaoAtiva] = useState(temPromocao);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(produto?.imagens?.[0] || "");
  const [loading, setLoading] = useState(false);

  const [badge, setBadge] = useState("");
  const [textoOferta, setTextoOferta] = useState("");

  const handleFileChange = (e: any) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const submit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("preco", preco);
      formData.append("badge", badge);
      formData.append("textoOferta", textoOferta);

      if (promocaoAtiva) {
        formData.append("precoAntigo", precoAntigo);
      } else {
        formData.append("precoAntigo", "");
      }

      if (file) {
        formData.append("file", file);
      }

      await fetch(
        `https://catalogo-backend-9xqq.onrender.com/produtos/${produto.id}`,
        {
          method: "PUT",
          body: formData,
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
            <input
              placeholder="Preço Antigo"
              value={precoAntigo}
              readOnly={promocaoAtiva}
            />

            <input
              placeholder="Preço Promocional"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </>
        ) : (
          <>
            <input
              placeholder="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </>
        )}

        <div className="box-promocao">
          {promocaoAtiva ? (
            <button
              className="btn-remover"
              type="button"
              onClick={() => {
                setPromocaoAtiva(true);

                setPreco(precoAntigo); // valor novo recebe valor antigo

                setPrecoAntigo(precoAntigo);
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

        <input type="file" onChange={handleFileChange} />

        {preview && <img src={preview} className="preview-img" />}

        <button className="editar-produto" onClick={submit} disabled={loading}>
          {loading ? "⏳ Salvando..." : "🚀 Salvar"}
        </button>
      </div>
    </div>
  );
}
