import { createClientFromRequest } from "npm:@base44/sdk@0.8.52";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Visitors signing up from the public site have no app account,
    // so the signup is stored with the service role after validation.
    const base44 = createClientFromRequest(req);
    const existing = await base44.asServiceRole.entities.Subscriber.filter({ email });
    if (Array.isArray(existing) && existing.length > 0) {
      return Response.json({ ok: true, alreadySubscribed: true });
    }

    await base44.asServiceRole.entities.Subscriber.create({ email });

    // Best-effort sync: add the signup to the HubSpot customer contacts.
    // A HubSpot outage must not block the local signup, so failures are logged
    // and surfaced as a sync warning instead of failing the request.
    let hubspotSynced = false;
    let hubspotError: string | null = null;
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection("hubspot");
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            email,
            lifecyclestage: "subscriber",
          },
        }),
      });
      // 409 = contact already exists in HubSpot — that counts as synced.
      if (res.ok || res.status === 409) {
        hubspotSynced = true;
      } else {
        const detail = await res.text();
        hubspotError = `HubSpot responded ${res.status}`;
        console.error("HubSpot contact sync failed:", res.status, detail);
      }
    } catch (e) {
      hubspotError = e instanceof Error ? e.message : String(e);
      console.error("HubSpot contact sync failed:", e);
    }

    return Response.json({ ok: true, hubspotSynced, hubspotError });
  } catch (error) {
    return Response.json(
      { error: "Could not sign you up right now — please try again." },
      { status: 500 }
    );
  }
}