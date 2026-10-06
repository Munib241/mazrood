// Official MAZROOD™ wordmark — rendered as clean, sharp text in Archivo Black,
// always in brand blue #000f9f, so it stays pixel-perfect at every size.
export default function WordmarkLogo({ alt = "MAZROOD™" }) {
  return (
    <span
      className="font-logo text-brand-blue inline-flex items-baseline text-[22px] leading-none tracking-[-0.02em] select-none md:text-[28px]"
      aria-label={alt}
      role="img"
    >
      MAZROOD
      <span className="ml-[0.15em] align-super text-[0.34em] tracking-normal">
        ™
      </span>
    </span>
  );
}