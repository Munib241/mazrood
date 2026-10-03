import { secrets } from "base44:runtime";

const STORE_DOMAIN = "mazrood.com";
const API_VERSION = "2025-01";
const MAX_HANDLES = 24;

// Fetches live product data (title, price, compare-at price, availability,
// images) from the Mazrood Shopify store via the public Storefront API.
// Public catalog data only — no auth guard needed; input is bounded and sanitized.
export default async function(req: Request): Promise<Response> {
  try {
    const token = secrets.get("SHOPIFY_STOREFRONT_TOKEN");
    if (!token) {
      return Response.json({ configured: false, products: [] });
    }

    const body = await req.json();
    const handles = Array.isArray(body?.handles) ? body.handles : [];
    const clean = handles
      .map((h) => String(h).trim().toLowerCase())
      .filter((h) => /^[a-z0-9-]{1,100}$/.test(h))
      .slice(0, MAX_HANDLES);

    if (clean.length === 0) {
      return Response.json({ configured: true, products: [] });
    }

    // One aliased query per handle (aliases must be alphanumeric).
    const selections = clean
      .map(
        (h, i) => `
        p${i}: product(handle: "${h}") {
          handle
          title
          availableForSale
          onlineStoreUrl
          featuredImage { url }
          images(first: 2) { edges { node { url } } }
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount } }
        }`
      )
      .join("\n");

    const res = await fetch(
      `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query: `{${selections}}` }),
      }
    );

    const data = await res.json();
    if (data?.errors) {
      return Response.json(
        { error: "Shopify request failed", products: [] },
        { status: 502 }
      );
    }

    const products = clean
      .map((h, i) => {
        const p = data?.data?.[`p${i}`];
        if (!p) return null;
        const price = parseFloat(p.priceRange?.minVariantPrice?.amount);
        const compareAt = parseFloat(
          p.compareAtPriceRange?.minVariantPrice?.amount
        );
        const width = (url) =>
          url ? `${url}${url.includes("?") ? "&" : "?"}width=900` : null;
        return {
          handle: p.handle,
          name: p.title,
          currency: p.priceRange?.minVariantPrice?.currencyCode || null,
          url: p.onlineStoreUrl || `https://${STORE_DOMAIN}/products/${p.handle}`,
          price: Number.isFinite(price) ? price : null,
          was:
            Number.isFinite(compareAt) && compareAt > price ? compareAt : null,
          img: width(p.featuredImage?.url),
          alt: width(p.images?.edges?.[1]?.node?.url),
          soldOut: p.availableForSale === false,
        };
      })
      .filter(Boolean);

    return Response.json({ configured: true, products });
  } catch (error) {
    return Response.json(
      { error: "Could not reach the store right now.", products: [] },
      { status: 500 }
    );
  }
}