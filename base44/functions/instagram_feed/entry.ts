import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Latest brand photography from the studio's Instagram Business account.
// Read-only, public content: a fixed photo limit, no caller-controlled input.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("instagram");
    if (!accessToken) {
      return Response.json({ error: "Instagram is not connected" }, { status: 503 });
    }

    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${encodeURIComponent(accessToken)}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!profileRes.ok) {
      return Response.json({ error: "Could not reach Instagram" }, { status: 502 });
    }
    const profile = await profileRes.json();

    const mediaRes = await fetch(
      `https://graph.instagram.com/${profile.id}/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=24&access_token=${encodeURIComponent(accessToken)}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (!mediaRes.ok) {
      return Response.json({ error: "Could not load Instagram media" }, { status: 502 });
    }
    const media = await mediaRes.json();

    const posts = (media.data || [])
      .filter(
        (p) =>
          (p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM") && p.media_url
      )
      .slice(0, 8)
      .map((p) => ({
        id: p.id,
        image: p.media_url,
        permalink: p.permalink,
        caption: (p.caption || "").split("\n")[0].slice(0, 140),
      }));

    return Response.json({ username: profile.username, posts });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}