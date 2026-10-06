// Official MAZROOD™ wordmark: sharp live text in Archivo Black Expanded
// (weight 900, width 125%), always brand blue #000f9f. The ™ sits raised
// above the D's top-right corner, matching the reference artwork.
export default function WordmarkLogo({ alt = "MAZROOD™" }) {
  return (
    <span
      role="img"
      aria-label={alt}
      className="relative inline-block select-none font-logo text-[20px] font-black leading-none tracking-[0.01em] text-brand-blue [font-stretch:125%] md:text-[24px] lg:text-[20px] xl:text-[26px]"
    >
      MAZROOD
      <span
        aria-hidden="true"
        className="absolute bottom-full right-0 translate-x-[40%] text-[0.28em] leading-none tracking-normal [font-stretch:100%]"
      >
        TM
      </span>
    </span>
  );
}