import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";
import { secrets } from "base44:runtime";

const STORE_DOMAIN = "mazrood-sa.myshopify.com";
const API = `https://${STORE_DOMAIN}/admin/api/2025-01`;
const THEME_NAME = "Mazrood Studio (Auto-Sync)";

// Pushes every ThemeFile record into a dedicated Shopify theme via the Admin
// API. Creates the theme on first run, then updates its assets in place, so
// theme updates land in the store without manual zip uploads. Admin-only.

async function adminApi(token, path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    signal: AbortSignal.timeout(20000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Shopify ${options.method || "GET"} ${path} failed (${res.status}) ${
        data?.errors || ""
      }`.trim()
    );
  }
  return data;
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return Response.json({ error: "Forbidden" }, { status: 403 });

    const token = secrets.get("SHOPIFY_ADMIN_TOKEN");
    if (!token) {
      return Response.json(
        {
          configured: false,
          error:
            "SHOPIFY_ADMIN_TOKEN secret is not set yet. Add it in the app's Secrets settings.",
        },
        { status: 400 }
      );
    }

    const all = await base44.entities.ThemeFile.filter({});
    const files = all.filter((f) => f.path && f.content != null && !f.deleted);
    const deletions = all.filter((f) => f.path && f.deleted);

    // Find the synced theme (any role — the merchant may have published it),
    // creating it once on first sync.
    const themesData = await adminApi(token, "/themes.json");
    let theme = (themesData.themes || []).find((t) => t.name === THEME_NAME);
    if (!theme) {
      const created = await adminApi(token, "/themes.json", {
        method: "POST",
        body: JSON.stringify({
          theme: { name: THEME_NAME, role: "unpublished" },
        }),
      });
      theme = created.theme;
    }

    // Remove assets flagged deleted.
    let removed = 0;
    const delResults = await Promise.allSettled(
      deletions.map((f) =>
        fetch(
          `${API}/themes/${theme.id}/assets.json?asset[key]=${encodeURIComponent(
            f.path
          )}`,
          {
            method: "DELETE",
            headers: { "X-Shopify-Access-Token": token },
            signal: AbortSignal.timeout(10000),
          }
        ).then((r) => r.ok)
      )
    );
    delResults.forEach((r) => {
      if (r.status === "fulfilled" && r.value) removed++;
      else if (r.status === "rejected")
        errors.push({ path: "?", error: String(r.reason?.message || r.reason) });
    });

    // Upload text assets in batches of 6 parallel calls.
    const errors = [];
    let synced = 0;
    for (let i = 0; i < files.length; i += 6) {
      const batch = files.slice(i, i + 6);
      const results = await Promise.allSettled(
        batch.map((f) =>
          adminApi(token, `/themes/${theme.id}/assets.json`, {
            method: "PUT",
            body: JSON.stringify({ asset: { key: f.path, value: f.content } }),
          })
        )
      );
      results.forEach((r, j) => {
        if (r.status === "fulfilled") synced++;
        else
          errors.push({
            path: batch[j].path,
            error: String(r.reason?.message || r.reason),
          });
      });
    }

    return Response.json({
      configured: true,
      theme_id: theme.id,
      theme_name: theme.name,
      synced,
      removed,
      errors,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}