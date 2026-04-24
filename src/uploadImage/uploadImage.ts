export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "card_produto");
  formData.append("cloud_name", "dyvec4jx4");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dyvec4jx4/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json();

  return data.secure_url;
}
