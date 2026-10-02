// Decorative ultra-thin surveyor lines. Purely visual — hidden from assistive tech.
export default function PrecisionRules() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 hidden md:block">
      {/* vertical rules at 1/3 and 2/3 */}
      <div className="precision-rule absolute top-0 bottom-0 left-1/3 w-px opacity-40" />
      <div className="precision-rule absolute top-0 bottom-0 left-2/3 w-px opacity-40" />
      {/* horizontal rule under nav */}
      <div className="precision-rule absolute left-0 right-0 top-[72px] h-px opacity-60" />
    </div>
  );
}