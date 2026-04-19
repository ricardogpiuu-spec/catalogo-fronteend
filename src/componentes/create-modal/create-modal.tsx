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
  const [precoAntigo, setPrecoantigo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const { mutate, status } = useProdutoDataMutate();

  const isLoading = status === "pending";

  const handleFileChange = (e: any) => {
    const selected = e.target.files[0];
    setFile(selected);

    // preview da imagem 👇
    setPreview(URL.createObjectURL(selected));
  };

  const submit = async () => {
    let imageUrl = "";

    // 🔥 envia pro Cloudinary primeiro
    if (file) {
      imageUrl = await uploadImage(file);
    }

    mutate(
      {
        title,
        preco: Number(preco),
        imageUrl,
        precoAntigo: Number(precoAntigo),
      },
      {
        onSuccess: () => {
          closeModal(); // 🔥 FECHA AQUI DIRETO
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
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Preço"
          value={preco}
          onChange={(e) => {
            let value = e.target.value;

            // ❌ remove vírgula
            value = value.replace(",", ".");

            // ❌ permite só números e ponto
            if (!/^\d*\.?\d*$/.test(value)) return;

            setPreco(value);
          }}
        />
        <input
          placeholder="Preço Antigo"
          value={precoAntigo}
          onChange={(e) => {
            let value = e.target.value;

            // ❌ remove vírgula
            value = value.replace(",", ".");

            // ❌ permite só números e ponto
            if (!/^\d*\.?\d*$/.test(value)) return;

            setPrecoantigo(value);
          }}
        />

        <input type="file" onChange={handleFileChange} />

        {/* 🔥 preview estilo Shopee */}
        {preview && <img src={preview} className="preview-img" />}

        <button className="postar" onClick={submit} disabled={isLoading}>
          {isLoading ? "⏳ Postando..." : "🚀 Postar Produto"}
        </button>
      </div>
    </div>
  );
}
