import { useState } from "react";
import { useProdutoDataMutate } from "../../hooks/useProdutoDataMutate";
import { uploadImage } from "../../uploadImage/uploadImage";
import "./modal.css";

interface ModalProps {
  closeModal(): void;
}

export function CreateModal({ closeModal }: ModalProps) {
  const [title, setTitle] = useState("");
  const [preco, setPreco] = useState("");
  const [precoAntigo, setPrecoAntigo] = useState("");
  const [promocaoAtiva, setPromocaoAtiva] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const { mutate, status } = useProdutoDataMutate();

  const isLoading = status === "pending";
  const [badge, setBadge] = useState("");
  const [textoOferta, setTextoOferta] = useState("");

  const handleFileChange = (e: any) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const formatarNumero = (valor: string) => {
    valor = valor.replace(",", ".");

    if (!/^\d*\.?\d*$/.test(valor)) return;

    return valor;
  };

  const submit = async () => {
    if (!title || !preco || !file) {
      alert("Preencha título, preço e imagem.");
      return;
    }

    let imageUrl = "";

    if (file) {
      imageUrl = await uploadImage(file);
    }

    mutate(
      {
        title,
        preco: Number(preco),
        imageUrl,
        precoAntigo: promocaoAtiva ? Number(precoAntigo) : 0,
        badge,
        textoOferta,
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>
          ✖
        </button>

        <h2 className="titulo-modal">➕ Adicionar Novo Item</h2>

        <input
          placeholder="Nome do Produto"
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
              onChange={(e) => {
                const valor = formatarNumero(e.target.value);
                if (valor !== undefined) setPreco(valor);
              }}
            />
          </>
        ) : (
          <input
            placeholder="Preço"
            value={preco}
            onChange={(e) => {
              const valor = formatarNumero(e.target.value);
              if (valor !== undefined) setPreco(valor);
            }}
          />
        )}

        <div className="box-promocao">
          {promocaoAtiva ? (
            <button
              type="button"
              className="btn-remover"
              onClick={() => {
                setPromocaoAtiva(false);
                setPreco(precoAntigo || preco);
                setPrecoAntigo("");
              }}
            >
              ❌ Remover Promoção
            </button>
          ) : (
            <button
              type="button"
              className="btn-ativar"
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
  <option value="⭐ Lançamento">⭐ Lançamento</option>
</select>

       <select
  value={textoOferta}
  onChange={(e) => setTextoOferta(e.target.value)}
>
  <option value="">Selecione Texto Oferta</option>
  <option value="⏰ Oferta termina hoje">⏰ Oferta termina hoje</option>
   <option value="⏰ Oferta termina amanhã">⏰ Oferta termina amanhã</option>
  <option value="🚀 Aproveite agora">🚀 Aproveite agora</option>
  <option value="📦 Envio imediato">📦 Envio imediato</option>
  <option value="💎 Edição limitada">💎 Edição limitada</option>
</select>
        <input type="file" onChange={handleFileChange} />

        {preview && <img src={preview} className="preview-img" />}

        <button className="postar" onClick={submit} disabled={isLoading}>
          {isLoading ? "⏳ Postando..." : "🚀 Postar Produto"}
        </button>
      </div>
    </div>
  );
}
