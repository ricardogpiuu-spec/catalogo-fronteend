import { useState } from "react";

import "./modal.css";

export function EditModal({ produto, closeModal }: any) {
  const [title, setTitle] = useState(produto.title);
  const [preco, setPreco] = useState(produto.preco);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(produto.imagem);

  const handleFileChange = (e: any) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const submit = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("preco", preco.toString());

    if (file) {
      formData.append("file", file);
    }

    await fetch(`https://catalogo-backend-9xqq.onrender.com/produtos/${produto.id}`, {
      method: "PUT",
      body: formData,
    });

    closeModal();
    window.location.reload(); // 🔥 atualiza tela
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-body" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Produto</h2>

        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input value={preco} onChange={(e) => setPreco(e.target.value)} />

        <input type="file" onChange={handleFileChange} />

        {preview && <img src={preview} style={{ width: 120 }} />}

        <button onClick={submit}>Editar</button>
      </div>
    </div>
  );
}
