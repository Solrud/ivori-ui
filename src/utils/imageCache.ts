// Global in-memory cache for loaded and preloaded images
export const imageCache = new Set<string>();

export function markImageCached(url: string | null | undefined): void {
  if (!url) return;
  imageCache.add(url);
}

export function isImageCached(url: string | null | undefined): boolean {
  if (!url) return false;
  return imageCache.has(url);
}

export function preloadImage(url: string | null | undefined): Promise<boolean> {
  if (!url) return Promise.resolve(false);
  if (imageCache.has(url)) return Promise.resolve(true);

  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.src = url;

    if (img.complete && img.naturalWidth > 0) {
      imageCache.add(url);
      resolve(true);
      return;
    }

    img.onload = () => {
      imageCache.add(url);
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };
  });
}
