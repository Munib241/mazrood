import { useEffect, useRef, useState } from "react";

// Official MAZROOD™ reference artwork — black wordmark on a white field.
// We strip the background pixel-by-pixel, tint the letterforms brand blue
// (#000f9f) and trim the margins, so the logo shows on any surface with a
// fully transparent background and matches the reference 1:1.
const SRC =
  "https://media.base44.com/images/public/6abfc987ea748e49e7475c82/e6b656e38_Screenshot2026-10-06at55142PM.png";
const BRAND_R = 0;
const BRAND_G = 15;
const BRAND_B = 159;

export default function WordmarkLogo({ className, alt = "MAZROOD™" }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = SRC;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      let data;
      try {
        data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch {
        return;
      }
      const px = data.data;
      const { width: w0, height: h0 } = canvas;
      let minX = w0, minY = h0, maxX = 0, maxY = 0;
      for (let i = 0; i < px.length; i += 4) {
        const lum =
          (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
        const alpha = Math.round(px[i + 3] * (1 - lum));
        px[i] = BRAND_R;
        px[i + 1] = BRAND_G;
        px[i + 2] = BRAND_B;
        px[i + 3] = alpha;
        if (alpha > 8) {
          const x = (i / 4) % w0;
          const y = Math.floor(i / 4 / w0);
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      const trimmed = ctx.getImageData(minX, minY, w, h);
      canvas.width = w;
      canvas.height = h;
      ctx.putImageData(trimmed, 0, 0);
      setReady(true);
    };
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={`${className} ${ready ? "block" : "invisible"}`}
      style={{ width: "auto" }}
    />
  );
}