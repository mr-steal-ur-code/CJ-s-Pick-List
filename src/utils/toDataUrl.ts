const toDataUrl = async (file: File) => {
  try {
    const reader = new FileReader();

    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    reader.readAsDataURL(file);
    const dataUrl = await dataUrlPromise;

    return dataUrl;
  } catch (error) {
    console.warn("Failed to read file:", error);
    return null;
  }
};

export default toDataUrl;