import { secrets } from "base44:runtime";

const STORE_DOMAIN = "mazrood-sa.myshopify.com";
const API_VERSION = "2025-01";

// Creates a one-line Shopify cart and returns the hosted checkoutUrl.
// Cart creation is a public Storefront operation; the caller only supplies
// a bounded variant id and quantity — checkout and payment stay on Shopify.
export default async function(req: Request): Promise<Response> {
  try {
    const token = secrets.get("SHOPIFY_STOREFRONT_TOKEN");
    if (!token) {
      return Response.json({ error: "Store not connected." }, { status: 503 });
    }

    const body = await req.json();
    const variantId =
      typeof body?.variantId === "string" ? body.variantId.trim() : "";
    const qty = Math.min(Math.max(parseInt(body?.quantity, 10) || 1, 1), 10);

    if (
      !variantId ||
      variantId.length < 10 ||
      variantId.length > 120 ||
      !/^[A-Za-z0-9:_\/=-]+$/.test(variantId)
    ) {
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
            lines: [{ merchandiseId: variantId, quantity: qty }],
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