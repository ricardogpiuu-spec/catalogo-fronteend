import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import "./modal.css";

export default function PersonalizarProduto({ produto, voltar }) {
  const [elements, setElements] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [pos, setPos] = useState({ x: 80, y: 90 });
  const [size, setSize] = useState({ width: 120, height: 120 });
  const selectedElement = elements.find((el) => el.id === selectedId);
  const [editingId, setEditingId] = useState(null);
  const idRef = useRef(0);
  const textRefs = useRef({});

  const mockupRef = useRef(null);
  const activeElement =
    elements.find((el) => el.id === selectedId) ||
    elements.find((el) => el.type === "text") ||
    null;
  // 🔥 preview imagem
  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    // adiciona imagem como elemento
    setElements((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "image",
        src: url,
        x: 90,
        y: 90,
        width: 120,
        height: 120,
        rotation: 0,
      },
    ]);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (elements.length === 0) {
      addTexto();
    }
  }, []);

  // 🔥 atualizar elemento
  const updateElement = (id, newProps) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newProps } : el)),
    );
  };

  // 🔥 gerar imagem FINAL (print da tela)
  const gerarImagemFinal = async () => {
    const canvas = await html2canvas(mockupRef.current, {
      scale: 3,
      useCORS: true, // 🔥 ESSENCIAL PRA CLOUDINARY
      backgroundColor: "#ffffff",
    });

    return canvas.toDataURL("image/png");
  };

  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const baixarImagem = async () => {
    const imagem = await gerarImagemFinal();

    const link = document.createElement("a");
    link.download = "mockup.png";
    link.href = imagem;
    link.click();
  };
  const uploadImagemFinal = async (base64) => {
    const formData = new FormData();

    formData.append("file", base64);
    formData.append("upload_preset", "catalogo_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dyvec4jx4/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    return data.secure_url; // 🔥 URL FINAL
  };
  const formatarPreco = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // 🔥 enviar whatsapp
  const enviarWhats = async () => {
    try {
      const imagemBase64 = await gerarImagemFinal();

      const urlImagem = await uploadImagemFinal(imagemBase64);

      const textos = elements
        .filter((el) => el.type === "text")
        .map((el) => el.text)
        .join(", ");

      const mensagem = `🛍️ Pedido Personalizado

📦 Produto: ${produto.title}
💰 Preço: ${formatarPreco(produto.preco)}

✍️ Texto: ${textos || "Sem texto"}

📸 Mockup:
${urlImagem}`;

      window.open(
        `https://wa.me/5563991111158?text=${encodeURIComponent(mensagem)}`,
      );
    } catch (err) {
      console.error("Erro ao enviar:", err);
      alert("Erro ao gerar imagem 😢");
    }
  };
  // 🔥 adicionar texto
  const addTexto = () => {
    const id = Date.now() + Math.random();

    const novo = {
      id,
      type: "text",
      text: "",
      x: 70,
      y: 40,
      width: 180,
      height: 50,
      rotation: 0,
      fontSize: 20,
      color: "#000000",
      fontFamily: "Arial",
      fontWeight: "normal",
      textAlign: "center",
    };

    setElements((prev) => [...prev, novo]);
    setSelectedId(id);

    // 🔥 espera renderizar e foca
    setTimeout(() => {
      textRefs.current[id]?.focus();
    }, 0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedId) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        setElements((prev) => prev.filter((el) => el.id !== selectedId));
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8", // 🔥 cor suave
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <button
        onClick={voltar}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "8px 14px",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          zIndex: 30,
        }}
      >
        ⬅ Voltar
      </button>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "600",
          color: "#333",
        }}
      >
        {produto.title}
      </h2>

      <br />
      <br />

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            cursor: "pointer",
          }}
        />
      </div>

      <br />
      <br />

      {/* 🔥 CONTROLES DO TEXTO */}

      <div
        style={{
          background: "#ffffff",
          padding: "12px",
          borderRadius: "10px",
          marginBottom: "15px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {activeElement ? (
          <>
            {/* 🔠 TAMANHO */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "12px", color: "#555" }}>
                Tamanho: {activeElement.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="80"
                value={activeElement.fontSize}
                onChange={(e) =>
                  updateElement(activeElement.id, {
                    fontSize: parseInt(e.target.value),
                  })
                }
                style={{
                  width: "120px",
                  accentColor: "#2196f3",
                }}
              />
            </div>

            {/* 🎨 COR */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "12px", color: "#555" }}>Cor</label>
              <input
                type="color"
                value={activeElement.color}
                onChange={(e) =>
                  updateElement(activeElement.id, {
                    color: e.target.value,
                  })
                }
                style={{
                  width: "40px",
                  height: "35px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* 🔤 FONTE */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "12px", color: "#555" }}>Fonte</label>
              <select
                value={activeElement.fontFamily}
                onChange={(e) =>
                  updateElement(activeElement.id, {
                    fontFamily: e.target.value,
                  })
                }
                style={{
                  padding: "6px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                <option>Arial</option>
                <option>Verdana</option>
                <option>Courier New</option>
                <option>Georgia</option>
                <option>Impact</option>
              </select>
            </div>

            {/* 🔥 NEGRITO */}
            <button
              onClick={() =>
                updateElement(activeElement.id, {
                  fontWeight:
                    activeElement.fontWeight === "bold" ? "normal" : "bold",
                })
              }
              style={{
                padding: "8px 12px",
                background:
                  activeElement.fontWeight === "bold" ? "#2196f3" : "#eee",
                color: activeElement.fontWeight === "bold" ? "#fff" : "#333",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              B
            </button>
          </>
        ) : (
          <p style={{ color: "#777", fontSize: "13px" }}>
            👉 Selecione um texto para editar
          </p>
        )}
      </div>

      <div
        style={{
          background: "#fafafa",
          padding: "12px",
          borderRadius: "10px",
          marginBottom: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        {/* 🔄 ROTAÇÃO */}
        <div>
          <label style={{ fontSize: "13px", color: "#555" }}>
            🔄 Rotação: {rotation}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(e.target.value)}
            style={{
              width: "100%",
              accentColor: "#2196f3",
              cursor: "pointer",
            }}
          />
        </div>

        {/* 🔍 ZOOM */}
        <div>
          <label style={{ fontSize: "13px", color: "#555" }}>
            🔍 Zoom: {zoom}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            style={{
              width: "100%",
              accentColor: "#4caf50",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}></h2>

        <button
          className="btn-texto"
          onClick={addTexto}
          style={{
            padding: "10px 20px",
            background: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            lineHeight: "1",
          }}
        >
          ⬇️ Adicionar um texto
        </button>
      </div>
      <br />
      <div
        style={{
          overflow: "hidden",
          border: "1px solid #ccc",
          borderRadius: "10px",
          display: "inline-block",
          touchAction: "none",
        }}
      >
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            onClick={baixarImagem}
            style={{
              padding: "12px 25px",
              background: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            💾 Salvar
          </button>
        </div>

        {/* 🧱 MOCKUP EDITÁVEL */}
        <div
          ref={mockupRef}
          style={{
            width: 320,
            height: 320,
            position: "relative",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* 🔥 GRID PROFISSIONAL */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* CANECA */}
          <img
            src={produto.imagem}
            style={{
              width: "260px",
              objectFit: "contain",

              top: "50%",
              left: "50%",
              transform: "translate(-50%, -35%)",
              position: "absolute",
            }}
          />

          {/* ELEMENTOS */}
          {elements.map((el) => (
            <Rnd
              key={el.id}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              bounds="parent"
              onMouseDown={() => setSelectedId(el.id)}
              onDragStop={(e, d) => {
                let x = d.x;
                let y = d.y;

                // 🔥 SNAP CENTRO
                if (Math.abs(x - 90) < 20) x = 90;
                if (Math.abs(y - 110) < 20) y = 110;

                updateElement(el.id, { x, y });
              }}
              onResizeStop={(e, dir, ref, delta, pos) => {
                updateElement(el.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  x: pos.x,
                  y: pos.y,
                });
              }}
            >
              {el.type === "image" && (
                <img
                  src={el.src}
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    borderRadius: "10px",
                  }}
                />
              )}

              {el.type === "text" && (
                <div
                  ref={(elRef) => (textRefs.current[el.id] = elRef)}
                  contentEditable
                  translate="no"
                  suppressContentEditableWarning
                  onFocus={() => {
                    setSelectedId(el.id);
                    setEditingId(el.id); // 🔥 entrou em edição
                  }}
                  onBlur={(e) => {
                    setEditingId(null); // 🔥 saiu da edição
                    updateElement(el.id, {
                      text: e.currentTarget.innerText,
                    });
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    fontSize: el.fontSize,
                    color: el.color,
                    fontFamily: el.fontFamily,
                    fontWeight: el.fontWeight,
                    textAlign: el.textAlign,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    border: editingId === el.id ? "2px solid #2196f3" : "none",
                    // 🔥 SEM FUNDO
                    background: "transparent",

                    borderRadius: "6px",
                    cursor: "text",
                    outline: "none",

                    transition: "0.2s",
                  }}
                >
                  {el.text}
                </div>
              )}
            </Rnd>
          ))}
        </div>
      </div>

      <br />
      <br />

      <br />
      <br />
      <button
        onClick={enviarWhats}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "14px 20px",
          background: "#25D366",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
          zIndex: 20,
        }}
      >
        📲 Enviar para WhatsApp
      </button>

      <br />
      <br />
    </div>
  );
}
