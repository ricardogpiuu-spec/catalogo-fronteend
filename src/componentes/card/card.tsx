import "./card.css";
import { FaWhatsapp } from "react-icons/fa";
import { useDeleteProduto } from "../../hooks/useDeleteProduto";

interface CardProps {
  id?: string;
  preco: number;
  title: string;
  imagem: string;
  onEdit?: () => void;
  isAdmin?: boolean; // 🔥 NOVO
  onClick?: () => void; // 🔥 ADICIONA
}

export function Card({
  id,
  preco,
  imagem,
  title,
  onEdit,
  isAdmin,
  onClick,
}: CardProps) {
  const numero = "5563991111158";

  const { mutate: deleteProduto } = useDeleteProduto();

  const mensagem = `Olá! Quero comprar este produto 👇

📦 ${title}
💰 R$ ${Number(preco).toFixed(2)}

Veja a imagem:

📸 ${imagem}`;

  const whatsappLink = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;

  const handleDelete = () => {
    if (!id) {
      console.log("ID não encontrado");
      return;
    }

    if (confirm("Tem certeza que deseja excluir?")) {
      deleteProduto(id);
    }
  };

  return (
    <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="image-container">
        <img src={imagem} alt={title} />

        {/* 🔥 container dos botões */}
        {isAdmin && (
          <div className="actions">
            <button
              className="btn-delete-overlay"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              🗑️
            </button>

            <button
              className="btn-edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      <h2>{title}</h2>

      <p>
        <b className="preco">Valor:  </b> <b className="preconumero"> R$ {Number(preco).toFixed(2)}</b>
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        className="btn-whatsapp"
        onClick={(e) => e.stopPropagation()}
      >
        <FaWhatsapp /> Comprar agora
      </a>

      <p className="info-extra">✔️ Compra segura</p>
      <p className="info-extra">🚚 Enviamos para todo Brasil</p>
    </div>
  );
}
