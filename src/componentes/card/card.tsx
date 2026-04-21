import "./card.css";
import { FaWhatsapp } from "react-icons/fa";
import { useDeleteProduto } from "../../hooks/useDeleteProduto";

interface CardProps {
  id?: string;
  preco: number;
  precoAntigo: number;
  title: string;
  imagem: string;
  badge?: string;
  textoOferta?:string;
  onEdit?: () => void;
  isAdmin?: boolean; // 🔥 NOVO
  onClick?: () => void; // 🔥 ADICIONA
}

export function Card({
  id,
  preco,
  precoAntigo,
  imagem,
  title,
  badge,
  textoOferta,
  onEdit,
  isAdmin,
  onClick,
}: CardProps) {
  const desconto =
    precoAntigo && precoAntigo > preco
      ? Math.round(((precoAntigo - preco) / precoAntigo) * 100)
      : 0;
  //const estoqueBaixo = true;
  const numero = "5563991111158";

  const { mutate: deleteProduto } = useDeleteProduto();

  const mensagem = `Olá! Quero comprar este produto 👇

📦 ${title}
💰 R$ ${Number(preco).toFixed(2)}
R$ ${Number(precoAntigo).toFixed(2)}
${badge ? badge + "\n" : ""}
${textoOferta ? textoOferta + "\n" : ""}
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
    <div className="card" onClick={onClick} style={{ cursor: "pointer"}}>
      {" "}
      {/*onClick={onClick}  style={{ cursor: "pointer" }}*/}
      <div className="image-container">
      <img src={imagem} alt={title} loading="lazy" />

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
   <div className="preco-box">

  {badge && (
    <span className="badge-urgente">
      {badge}
    </span>
  )}

  {precoAntigo > preco ? (
    <>
      <span className="badge-off">
        -{desconto}% OFF
      </span>

      <span className="preco-antigo">
        De: R$ {Number(precoAntigo).toFixed(2).replace(".", ",")}
      </span>

      <span className="preconumero promo">
        Para: R$ {Number(preco).toFixed(2).replace(".", ",")}
      </span>
    </>
  ) : (
    <span className="preco-normal">
      Valor: R$ {Number(preco).toFixed(2).replace(".", ",")}
    </span>
  )}

  {textoOferta && (
    <span className="oferta-hoje">
      {textoOferta}
    </span>
  )}

</div>

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
