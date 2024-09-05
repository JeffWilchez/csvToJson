export const uploadFile = async (file) => {
  const API_HOST = import.meta.env.VITE_API_HOST;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return [new Error(`Error uploading file: ${res.statusText}`)];

    const json = await res.json();
    
    return [null, json.data, json.message];
  } catch (error) {
    if (error instanceof Error) return [error];
  }

  return [new Error("Unknown error")];
};
