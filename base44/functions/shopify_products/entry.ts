import { secrets } from "base44:runtime";

const STORE_DOMAIN = "mazrood-sa.myshopify.com";
const API_VERSION = "2025-01";
const MAX_ITEMS = 24;

// Fetches live catalog data (title, price, availability, images, variants)
// from the Mazrood Shopify store via the public Storefront API.
// Modes: by handles, by collection handle, or the shop's latest products.
// Public catalog data only — no auth guard needed; input is bounded and sanitized.

const PRODUCT_FIELDS = `
  handle
  productType
  title
  availableForSale
  onlineStoreUrl
  description
  featuredImage { url }
  images(first: 12) { edges { node { url } } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount } }
  variants(first: 100) {
    edges { node { id title availableForSale price { amount currencyCode } image { url } selectedOptions { name value } } }
  }
`;

const width = (url) =>
  url ? `${url}${url.includes("?") ? "&" : "?"}width=900` : null;

const mapProduct = (p) => {
  if (!p) return null;
  const price = parseFloat(p.priceRange?.minVariantPrice?.amount);
  const compareAt = parseFloat(p.compareAtPriceRange?.minVariantPrice?.amount);
  const gallery = (p.images?.edges || [])
    .map((e) => width(e.node?.url))
    .filter(Boolean);
  const pairs = (p.pairs?.references?.edges || [])
    .map((e) => mapProduct(e.node))
    .filter(Boolean);

  return {
    handle: p.handle,
    name: p.title,
    currency: p.priceRange?.minVariantPrice?.currencyCode || null,
    url: p.onlineStoreUrl || `https://${STORE_DOMAIN}/products/${p.handle}`,
    price: Number.isFinite(price) ? price : null,
    was: Number.isFinite(compareAt) && compareAt > price ? compareAt : null,
    img: width(p.featuredImage?.url) || gallery[0] || null,
    images: gallery,
    soldOut: p.availableForSale === false,
    description: p.description || null,
    variants: (p.variants?.edges || []).map((e) => ({
      id: e.node.id,
      title: e.node.title,
      price: parseFloat(e.node.price?.amount),
      currency: e.node.price?.currencyCode || null,
      soldOut: e.node.availableForSale === false,
      image: width(e.node.image?.url),
      options: (e.node.selectedOptions || []).map((o) => ({
        name: o.name,
        value: o.value,
      })),
    })),
    related: pairs.length ? pairs : null,
  };
};

export default async function(req: Request): Promise<Response> {
  try {
    const token = secrets.get("SHOPIFY_STOREFRONT_TOKEN");
    if (!token) {
      return Response.json({ configured: false, products: [] });
    }

    const body = await req.json();

    // Mode 1: specific handles (product pages / hydrated sections).
    const handles = Array.isArray(body?.handles) ? body.handles : [];
    const clean = handles
      .map((h) => String(h).trim().toLowerCase())
      .filter((h) => /^[a-z0-9-]{1,100}$/.test(h))
      .slice(0, MAX_ITEMS);

    // Optional category keywords (e.g. "hoodie,sweater") matched against
    // each product's type and title inside a collection.
    const typeKeys = (typeof body?.type === "string" ? body.type : "")
      .toLowerCase()
      .split(",")
      .map((k) => k.trim())
      .filter((k) => /^[a-z &-]{2,30}$/.test(k))
      .slice(0, 5);

    // Mode 4 input: catalog search term — matched against product name and category.
    const searchTerm =
      typeof body?.search === "string" ? body.search.trim().toLowerCase() : "";

    // Cursor pagination: collections and the latest-products feed return one
    // page at a time; the caller passes the cursor of the last item it has.
    // Shopify cursors are opaque base64 strings — only safe characters pass.
    const rawCursor =
      typeof body?.cursor === "string" ? body.cursor.trim() : "";
    const cursor = /^[A-Za-z0-9+/=_-]{1,300}$/.test(rawCursor)
      ? rawCursor
      : "";
    const limit = Math.min(Math.max(parseInt(body?.limit, 10) || 24, 4), 48);

    let query;
    if (body?.collections === true) {
      query = `{
        cols: collections(first: 60) {
          edges { node { handle title } }
        }
      }`;
    } else if (body?.menu === true) {
      // "Main Menu 2026" is the live menu; "main-menu" stays as a fallback.
      query = `{
        m0: menu(handle: "main-menu-2026") {
          items {
            title url type resource { ... on Collection { handle } }
            items { title url type resource { ... on Collection { handle } } }
          }
        }
        m1: menu(handle: "main-menu") {
          items {
            title url type resource { ... on Collection { handle } }
            items { title url type resource { ... on Collection { handle } } }
          }
        }
      }`;
    } else if (clean.length > 0) {
      // Each product also carries its "Pairs with" metafield
      // (custom.pairs_with) with the full data of the referenced pieces.
      const selections = clean
        .map(
          (h, i) => `
        p${i}: product(handle: "${h}") {
          ${PRODUCT_FIELDS}
          pairs: metafield(namespace: "custom", key: "pairs_with") {
            references(first: 12) { edges { node { ... on Product { ${PRODUCT_FIELDS} } } } }
          }
        }`
        )
        .join("\n");
      query = `{${selections}}`;
    } else if (searchTerm && /^[a-z0-9 &-]{2,60}$/.test(searchTerm)) {
      // Mode 4: search — the live catalog, matched by name or category below.
      query = `{
        s0: products(first: 100, sortKey: CREATED_AT, reverse: true) {
          edges { node { ${PRODUCT_FIELDS} } }
        }
      }`;
    } else {
      // Mode 2: one collection; Mode 3: the shop's latest products.
      const rawCollection =
        typeof body?.collection === "string"
          ? body.collection.trim().toLowerCase()
          : "";
      if (rawCollection && /^[a-z0-9-]{1,100}$/.test(rawCollection)) {
        query = `{
          c0: collectionByHandle(handle: "${rawCollection}") {
            title
            products(first: ${typeKeys.length ? 100 : limit}${cursor ? `, after: "${cursor}"` : ""}, filters: { available: true }) { edges { cursor node { ${PRODUCT_FIELDS} } } pageInfo { hasNextPage } }
          }
        }`;
      } else {
        query = `{
          s0: products(first: ${limit}${cursor ? `, after: "${cursor}"` : ""}, sortKey: CREATED_AT, reverse: true) { edges { cursor node { ${PRODUCT_FIELDS} } } pageInfo { hasNextPage } }
        }`;
      }
    }

    const res = await fetch(
      `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(10000),
      }
    );

    const data = await res.json();
    if (data?.errors) {
      return Response.json(
        { error: "Shopify request failed", products: [] },
        { status: 502 }
      );
    }

    let products = [];
    let title = null;
    let nextCursor = null;
    let hasMore = false;
    if (data?.data?.m0) {
      // Drops links to unpublished collections — they would open empty.
      const mapItem = (n) => {
        if (!n || !n.title) return null;
        if (n.type === "COLLECTION" && !n.resource?.handle) return null;
        const out = {
          title: String(n.title),
          url: typeof n.url === "string" ? n.url : null,
          handle: n.resource?.handle || null,
        };
        const kids = Array.isArray(n.items) ? n.items.map(mapItem).filter(Boolean) : [];
        if (kids.length > 0) out.items = kids;
        return out;
      };
      const items = (data.data.m0.items || data.data.m1.items || [])
        .map(mapItem)
        .filter(Boolean);
      return Response.json({ configured: true, menu: items });
    }
    if (data?.data?.cols) {
      const collections = (data.data.cols.edges || [])
        .map((e) => e.node)
        .filter((c) => c && c.handle && c.title)
        .map((c) => ({ handle: c.handle, title: c.title }));
      return Response.json({ configured: true, collections });
    }
    if (searchTerm && data?.data?.s0) {
      // Every word must appear in the product's name or category.
      const words = searchTerm.split(/\s+/).filter(Boolean);
      products = (data.data.s0.edges || [])
        .map((e) => e.node)
        .filter((n) => n?.availableForSale !== false)
        .filter((n) => {
          const hay = `${n?.title || ""} ${n?.productType || ""}`.toLowerCase();
          return words.every((w) => hay.includes(w));
        })
        .slice(0, 12)
        .map((n) => mapProduct(n))
        .filter(Boolean);
    } else if (clean.length > 0) {
      products = clean
        .map((_, i) => mapProduct(data?.data?.[`p${i}`]))
        .filter(Boolean);
    } else if (data?.data?.c0) {
      title = data.data.c0.title || null;
      const edges = data.data.c0.products?.edges || [];
      const pageInfo = data.data.c0.products?.pageInfo || {};
      // Typed category views load one bounded fetch; plain collections
      // page by cursor as the shopper scrolls.
      if (typeKeys.length === 0) {
        nextCursor = edges.length ? edges[edges.length - 1].cursor : null;
        hasMore = Boolean(pageInfo.hasNextPage) && Boolean(nextCursor);
      }
      // Shopify's stock filter isn't always applied, so sold-out items are
      // also dropped here — grids only ever show what can be bought.
      products = edges
        .map((e) => e.node)
        .filter((n) => n?.availableForSale !== false)
        .filter(
          (n) =>
            typeKeys.length === 0 ||
            typeKeys.some((k) =>
              `${n?.productType || ""} ${n?.title || ""}`.toLowerCase().includes(k)
            )
        )
        .slice(0, limit)
        .map((n) => mapProduct(n))
        .filter(Boolean);
    } else {
      const edges = data?.data?.s0?.edges || [];
      const pageInfo = data?.data?.s0?.pageInfo || {};
      nextCursor = edges.length ? edges[edges.length - 1].cursor : null;
      hasMore = Boolean(pageInfo.hasNextPage) && Boolean(nextCursor);
      products = edges
        .map((e) => e.node)
        .filter((n) => n?.availableForSale !== false)
        .map((n) => mapProduct(n))
        .filter(Boolean);
    }

    console.log(
      "catalog page:",
      products.length,
      "hasMore:",
      hasMore,
      "cursor:",
      nextCursor ? nextCursor.slice(0, 24) : null
    );
    return Response.json({ configured: true, title, products, nextCursor, hasMore });
  } catch (error) {
    return Response.json(
      { error: "Could not reach the store right now.", products: [] },
      { status: 500 }
    );
  }
}