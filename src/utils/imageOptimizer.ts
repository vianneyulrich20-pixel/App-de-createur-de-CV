/**
 * Client-side image optimizer for CV avatar uploads.
 * Prevents memory bloat, crashes, and HTML2Canvas rendering issues
 * by resizing images to standard avatar dimensions (max 480x480) with clean JPEG/WebP compression.
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  grayscale?: boolean;
}

export function optimizeAvatarImage(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const { maxWidth = 480, maxHeight = 480, quality = 0.88, grayscale = false } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      return reject(new Error("Le fichier sélectionné n'est pas une image valide."));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Impossible de lire le fichier image."));
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        reject(new Error("Impossible de décoder l'image sélectionnée."));
      };

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            return reject(new Error("Impossible d'initialiser le moteur de rendu 2D."));
          }

          if (grayscale) {
            ctx.filter = "grayscale(100%)";
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Export as clean JPEG data URL
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(optimizedDataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
