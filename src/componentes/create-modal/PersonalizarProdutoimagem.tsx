import "./personalizar.css";
import { FaWhatsapp, FaStar, FaShieldAlt, FaTruck } from "react-icons/fa";
import { useState,useEffect } from "react";

interface Props {
  produto: any;
  voltar: () => void;
}


export default function PersonalizarProdutoimagem({ produto, voltar }: Props) {
  const [imagemAtual, setImagemAtual] = useState(produto.imagens?.[0]);
const grande = imagemAtual?.replace(
  "/upload/",
  "/upload/f_auto/q_auto/w_700/"
);


  const numero = "5563991111158";

  const mensagem = `Olá! Quero comprar 👇

${produto.title}
R$ ${produto.preco}`;

  const whatsappLink = `https://wa.me/${numero}?text=${encodeURIComponent(
    mensagem,
  )}`;
  useEffect(() => {
  const img = new Image();
  img.src = grande;
}, [grande]);

  return (
    <div className="produto-page">
      <button className="btn-voltar" onClick={voltar}>
        ← Voltar
      </button>

      <div className="produto-box">
        {/* GALERIA */}
        <div className="galeria">
          <img src={grande} className="imagem-principal" loading="eager" />

           <div className="miniaturas">
          {produto.imagens?.map((img: string, index: number) => {
            const mini = img.replace(
              "/upload/",
              "/upload/f_auto/q_auto/w_80/h_80/c_fill/"
            );

            return (
              <img
                key={index}
                src={mini}
                onClick={() => setImagemAtual(img)}
                className={imagemAtual === img ? "miniativa" : "" }
                  loading="lazy"
              />
            );
          })}
        </div>
      </div>

        {/* INFO */}
        <div className="info-produto">
          <span className="badge-top">
            {produto.badge || "🔥 Últimas Unidades"}
          </span>

          <h1>{produto.title}</h1>

          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>(127 avaliações)</span>
          </div>

          {produto.precoAntigo > produto.preco && (
            <p className="preco-antigo">
              De: R$ {produto.precoAntigo.toFixed(2)}
            </p>
          )}

          <h2 className="preco-atual">R$ {produto.preco.toFixed(2)}</h2>

          <p className="parcelado">
            ou 3x de R$ {(produto.preco / 3).toFixed(2)}
          </p>

          <p className="oferta">
            {produto.textoOferta || "⏰ Promoção termina hoje"}
          </p>

          <div className="vantagens">
            <p>
              <FaTruck /> Entrega rápida
            </p>

            <p>
              <FaShieldAlt /> Compra segura
            </p>
          </div>

          <a href={whatsappLink} target="_blank" className="btn-comprar">
            <FaWhatsapp /> Comprar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
