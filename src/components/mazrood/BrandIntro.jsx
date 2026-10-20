// Crawlable brand intro — real text directly under the hero, English first
// and the Arabic line right below it, marked lang="ar" dir="rtl".
export default function BrandIntro() {
  return (
    <section
      aria-label="About Mazrood"
      className="relative border-b border-[hsl(var(--border))] py-16 md:py-24"
    >
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <p className="font-body text-[0.95rem] font-light leading-relaxed text-[hsl(var(--foreground))] opacity-85 md:text-base">
          Mazrood is a Saudi casual formal brand, founded in Riyadh in 2016.
          Shop shirts, knitwear, jackets and everyday essentials. Shown at
          Riyadh Fashion Week.
        </p>
        <p
          lang="ar"
          dir="rtl"
          className="mt-5 font-body text-[0.95rem] font-light leading-loose text-[hsl(var(--foreground))] opacity-70 md:text-base"
        >
          مزرود علامة سعودية للأزياء الكاجوال الفورمال، تأسست في الرياض عام
          2016. تسوق القمصان والتريكو والجاكيتات والأساسيات اليومية.
        </p>
      </div>
    </section>
  );
}