import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";

// Product photography that settles onto the card with a subtle fade as
// soon as it has loaded — nothing pops onto the page. The fade lives on
// the wrapper so it never fights the card's hover-zoom transition.
export default function FadeImage({ src, alt, className, ...rest }) {
  const [ready, setReady] = useState(false);
  // A new photo starts hidden again, so a fresh image fades in on its own.
  useEffect(() => setReady(false), [src]);

  return (
    <span
      className={`absolute inset-0 block transition-opacity duration-700 ease-out ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        onLoad={() => setReady(true)}
        onError={() => setReady(true)}
        className={className}
        {...rest}
      />
    </span>
  );
}