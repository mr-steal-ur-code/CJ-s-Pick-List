const resizeDataUri = (url: any, maxWidth = 500, maxHeight = 500, quality = "1") => {
  const img = new Image();
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      let newWidth = originalWidth;
      let newHeight = originalHeight;

      if (originalWidth > maxWidth || originalHeight > maxHeight) {
        const aspectRatio = originalWidth / originalHeight;

        if (aspectRatio > 1) { // Wider image
          newWidth = maxWidth;
          newHeight = newWidth / aspectRatio;
        } else { // Taller image
          newHeight = maxHeight;
          newWidth = newHeight * aspectRatio;
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      ctx && ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    img.onerror = reject;
  });
};

export default resizeDataUri;