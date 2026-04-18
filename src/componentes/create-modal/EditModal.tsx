import { useState } from "react";

import "./modal.css";

export function EditModal({ produto, closeModal }: any) {
  const [title, setTitle] = useState(produto.title);
  const [preco, setPreco] = useState(produto.preco);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(produto.imagem);
  const [loading, setLoading] = useState(false);
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
      formData.append("preco", preco.toString());

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
    } catch (error) {
      alert("Erro ao editar produto");
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

        <input
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <input type="file" onChange={handleFileChange} />

        {preview && <img src={preview} className="preview-img" />}

        <button className="editar-produto" onClick={submit} disabled={loading}>
          {loading ? "⏳ Salvando..." : "🚀 Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
