import { secrets } from "base44:runtime";

const STORE_DOMAIN = "mazrood-sa.myshopify.com";
const API_VERSION = "2025-01";

// Creates a Shopify cart (one or more lines) and returns the checkoutUrl.
// Cart creation is a public Storefront operation; the caller only supplies
// bounded variant ids and quantities — checkout and payment stay on Shopify.
export default async function(req: Request): Promise<Response> {
  try {
    const token = secrets.get("SHOPIFY_STOREFRONT_TOKEN");
    if (!token) {
      return Response.json({ error: "Store not connected." }, { status: 503 });
    }

    const body = await req.json();
    // Whole-cart lines from the cart drawer; a single variantId (and
    // quantity) still works for direct buys.
    const raw = Array.isArray(body?.lines)
      ? body.lines
      : body?.variantId
        ? [{ variantId: body.variantId, quantity: body.quantity }]
        : [];
    const lines = raw
      .map((l) => ({
        merchandiseId:
          typeof l?.variantId === "string" ? l.variantId.trim() : "",
        quantity: Math.min(Math.max(parseInt(l?.quantity, 10) || 1, 1), 10),
      }))
      .filter(
        (l) =>
          l.merchandiseId.length >= 10 &&
          l.merchandiseId.length <= 120 &&
          /^[A-Za-z0-9:_\/=-]+$/.test(l.merchandiseId)
      )
      .slice(0, 12);

    if (lines.length === 0) {
      return Response.json({ error: "Invalid item." }, { status: 400 });
    }

    const res = await fetch(
      `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({
          query: `mutation CartCreate($lines: [CartLineInput!]!) {
            cartCreate(input: { lines: $lines }) {
              cart { checkoutUrl }
              userErrors { field message }
            }
          }`,
          variables: {
            lines,
          },
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    const data = await res.json();
    const checkoutUrl = data?.data?.cartCreate?.cart?.checkoutUrl;
    const userError =
      data?.data?.cartCreate?.userErrors?.[0]?.message || data?.errors?.[0]?.message;

    if (!checkoutUrl) {
      return Response.json(
        { error: userError || "Could not start checkout." },
        { status: 502 }
      );
    }

    return Response.json({ checkoutUrl });
  } catch (error) {
    return Response.json(
      { error: "Could not reach the store right now." },
      { status: 500 }
    );
  }
}