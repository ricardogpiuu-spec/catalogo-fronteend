export async function uploadImage(file: File) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "card_produto");
  data.append("cloud_name", "dyvec4jx4");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dyvec4jx4/image/upload",
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();

  return json.secure_url; // 🔥 URL da imagem
}