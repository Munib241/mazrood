import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const handleOf = (url) => url.split("/").filter(Boolean).pop();

// Formats a price in the store's own currency (e.g. "SAR 150.00", "$78.84").
export const formatPrice = (amount, currency) => {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

// Hydrates the static product list with live Shopify data (name, price,
// availability, images) once the storefront connection is configured.
// Until then the static catalog keeps showing as-is.
export default function useShopifyProducts(staticProducts) {
  const [products, setProducts] = useState(staticProducts);

  useEffect(() => {
    let cancelled = false;
    const handles = staticProducts.map((p) => handleOf(p.url)).slice(0, 24);

    base44.functions
      .invoke("shopify_products", { handles })
      .then((res) => {
        const live = res?.data?.products;
        if (cancelled || !Array.isArray(live) || live.length === 0) return;
        const byHandle = new Map(live.map((p) => [p.handle, p]));
        setProducts(
          staticProducts.map((p) => {
            const l = byHandle.get(handleOf(p.url));
            return l
              ? {
                  ...p,
                  name: l.name ?? p.name,
                  price: l.price ?? p.price,
                  was: l.was ?? p.was,
                  img: l.img ?? p.img,
                  alt: l.alt ?? p.alt,
                  currency: l.currency ?? p.currency,
                  soldOut: Boolean(l.soldOut),
                }
              : p;
          })
        );
      })
      .catch(() => {
        /* Shopify not connected yet — keep the static catalog on screen */
      });

    return () => {
      cancelled = true;
    };
  }, [staticProducts]);

  return products;
}