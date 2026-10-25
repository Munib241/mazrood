import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const GH = 'https://api.github.com';

// Admin-only: commits the app's stored Mazrood theme files (ThemeFile
// entity, private storage) to a GitHub repository as a single commit on an
// existing branch, via the GitHub connector token.
export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const repo = typeof body.repo === 'string' ? body.repo.trim() : '';
    const branch =
      typeof body.branch === 'string' && body.branch.trim() ? body.branch.trim() : 'main';
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
      return Response.json({ error: 'Provide the repository as "owner/repo".' }, { status: 400 });
    }
    if (!/^[A-Za-z0-9._-]+$/.test(branch)) {
      return Response.json({ error: 'Invalid branch name.' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');
    const ghHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'mazrood-base44-app',
    };
    const gh = async (path: string, init: object = {}) => {
      const res = await fetch(`${GH}${path}`, {
        ...init,
        headers: ghHeaders,
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`GitHub API ${res.status} on ${path}: ${text.slice(0, 300)}`);
      }
      return res.status === 204 ? null : res.json();
    };

    // Collect the active theme files (paginated).
    const files = [];
    let cursor = undefined;
    do {
      const page = await base44.entities.ThemeFile.filter(
        { deleted: { $ne: true } },
        { limit: 100, cursor }
      );
      files.push(...page.items);
      cursor = page.has_more ? page.next_cursor : undefined;
    } while (cursor);
    if (files.length === 0) {
      return Response.json({ error: 'No theme files stored to push.' }, { status: 400 });
    }

    // Current branch head + its base tree.
    const ref = await gh(`/repos/${repo}/git/ref/heads/${branch}`).catch((e) => {
      throw new Error(
        `Could not read branch "${branch}" in ${repo}. Does the repository and branch exist? (${e.message})`
      );
    });
    const baseCommitSha = ref.object.sha;
    const baseCommit = await gh(`/repos/${repo}/git/commits/${baseCommitSha}`);
    const baseTreeSha = baseCommit.tree.sha;

    // One blob per file — sign, read, and upload in batches of 6.
    const entries = [];
    const failures = [];
    for (let i = 0; i < files.length; i += 6) {
      const batch = files.slice(i, i + 6);
      const results = await Promise.allSettled(
        batch.map(async (f) => {
          const { signed_url } =
            await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
              file_uri: f.file_uri,
              expires_in: 300,
            });
          const res = await fetch(signed_url, { signal: AbortSignal.timeout(30000) });
          if (!res.ok) throw new Error(`file read failed (${res.status})`);
          const content = await res.text();
          const blob = await gh(`/repos/${repo}/git/blobs`, {
            method: 'POST',
            body: JSON.stringify({ content, encoding: 'utf-8' }),
          });
          return { path: f.path, sha: blob.sha };
        })
      );
      results.forEach((r, j) => {
        if (r.status === 'fulfilled') entries.push(r.value);
        else failures.push({ path: batch[j].path, error: r.reason?.message });
      });
    }
    if (entries.length === 0) {
      return Response.json(
        { error: 'Every file upload failed.', failures },
        { status: 502 }
      );
    }

    // New tree on top of the branch's tree, then the commit, then move the ref.
    const tree = await gh(`/repos/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: entries.map((e) => ({ path: e.path, mode: '100644', type: 'blob', sha: e.sha })),
      }),
    });
    const commit = await gh(`/repos/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: `Mazrood Studio theme — synced from Base44 (${new Date()
          .toISOString()
          .slice(0, 10)})`,
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    });
    await gh(`/repos/${repo}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: commit.sha }),
    });

    return Response.json({
      pushed: entries.length,
      failed: failures.length,
      failures,
      branch,
      commit_sha: commit.sha,
      commit_url: commit.html_url,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}