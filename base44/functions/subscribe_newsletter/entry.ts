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
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: "Could not sign you up right now — please try again." },
      { status: 500 }
    );
  }
}