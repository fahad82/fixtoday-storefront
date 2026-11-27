// src/lib/imageLoader.ts
// Picks a picture size that fits where it is shown, so a product card downloads
// a small picture instead of the full-size upload.
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const q = quality || 75;

  if (src.startsWith('http://') || src.startsWith('https://')) {
    let url: URL;
    try {
      url = new URL(src);
    } catch {
      return src;
    }

    // ImageKit (where product pictures are uploaded): resize on their CDN.
    // ImageKit also picks WebP/AVIF for browsers that support it.
    if (url.hostname.endsWith('imagekit.io') && !url.searchParams.has('tr')) {
      return `${src}${src.includes('?') ? '&' : '?'}tr=w-${width},q-${q}`;
    }

    // Unsplash: resize on their CDN.
    if (url.hostname.endsWith('unsplash.com')) {
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', q.toString());
      return url.toString();
    }

    // Cloudinary: add a resize step to the delivery URL.
    if (url.hostname === 'res.cloudinary.com' && url.pathname.includes('/upload/')) {
      url.pathname = url.pathname.replace('/upload/', `/upload/w_${width},q_${q},f_auto/`);
      return url.toString();
    }

    // Other hosts cannot resize; use the picture as it is.
    return src;
  }

  // For local images, use Next.js built-in loader
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
