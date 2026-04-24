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

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const { mutate, status } = useProdutoDataMutate();

  const isLoading = status === "pending";
  const [badge, setBadge] = useState("");
  const [textoOferta, setTextoOferta] = useState("");

  const handleFileChange = async (e: any) => {
    const lista = Array.from(e.target.files || []) as File[];

    let novas = [...files, ...lista];

    if (novas.length > 4) {
      novas = novas.slice(0, 4);
      alert("Máximo 4 imagens");
    }

    setFiles(novas);

    const previews = novas.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const removerImagem = (index: number) => {
    const novosFiles = files.filter((_, i) => i !== index);
    const novosPreview = preview.filter((_, i) => i !== index);

    setFiles(novosFiles);
    setPreview(novosPreview);
  };
  // SUBIR IMAGEM
  const subirImagem = (index: number) => {
    if (index === 0) return;

    const novosFiles = [...files];
    const novosPreview = [...preview];

    [novosFiles[index - 1], novosFiles[index]] = [
      novosFiles[index],
      novosFiles[index - 1],
    ];

    [novosPreview[index - 1], novosPreview[index]] = [
      novosPreview[index],
      novosPreview[index - 1],
    ];

    setFiles(novosFiles);
    setPreview(novosPreview);
  };

  // DESCER IMAGEM
  const descerImagem = (index: number) => {
    if (index === files.length - 1) return;

    const novosFiles = [...files];
    const novosPreview = [...preview];

    [novosFiles[index + 1], novosFiles[index]] = [
      novosFiles[index],
      novosFiles[index + 1],
    ];

    [novosPreview[index + 1], novosPreview[index]] = [
      novosPreview[index],
      novosPreview[index + 1],
    ];

    setFiles(novosFiles);
    setPreview(novosPreview);
  };

  const formatarNumero = (valor: string) => {
    valor = valor.replace(",", ".");

    if (!/^\d*\.?\d*$/.test(valor)) return;

    return valor;
  };

  const submit = async () => {
    if (!title || !preco || files.length === 0) {
      alert("Preencha título, preço e imagens.");
      return;
    }

    try {
      // sobe todas imagens
      const imagens = await Promise.all(files.map((file) => uploadImage(file)));
      console.log(imagens);

      mutate(
        {
          title,
          preco: Number(preco),
          precoAntigo: promocaoAtiva ? Number(precoAntigo) : 0,
          imagens, // array correto
          badge,
          textoOferta,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        },
      );
    } catch {
      alert("Erro ao enviar imagens");
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>
          ✖
        </button>

        <h2 className="titulo-modal">➕ Novo Produto</h2>

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
          <option value="⏰ Oferta termina amanhã">
            ⏰ Oferta termina amanhã
          </option>
          <option value="🚀 Aproveite agora">🚀 Aproveite agora</option>
          <option value="📦 Envio imediato">📦 Envio imediato</option>
          <option value="💎 Edição limitada">💎 Edição limitada</option>
        </select>
        {/* 🔥 aceita 4 imagens */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />

        <p>
          1ª imagem = Principal <br />
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

        <button className="postar" onClick={submit} disabled={isLoading}>
          {isLoading ? "⏳ Enviando..." : "🚀 Postar Produto"}
        </button>
      </div>
    </div>
  );
}
