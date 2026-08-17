// src/lib/imageLoader.ts
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If it's an external image, return it directly
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // For Unsplash images, we can optimize with their CDN
    if (src.includes('unsplash.com')) {
      const url = new URL(src);
      url.searchParams.set('w', width.toString());
      if (quality) {
        url.searchParams.set('q', quality.toString());
      }
      return url.toString();
    }
    return src;
  }
  
  // For local images, use Next.js built-in loader
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}