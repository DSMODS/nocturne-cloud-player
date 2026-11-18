export async function onRequestGet({ env }) {
  const listed = await env.MUSIC_BUCKET.list({ prefix: "music/", limit: 1000 });
  const tracks = await Promise.all(listed.objects.map(async (o) => {
    const meta = await env.MUSIC_BUCKET.head(o.key);
    return { id: o.key.slice(6), name: meta?.customMetadata?.name || o.key.split("/").pop(),
      size: o.size, type: meta?.httpMetadata?.contentType || "audio/mpeg",
      url: `/api/audio/${encodeURIComponent(o.key.slice(6))}` };
  }));
  tracks.sort((a,b) => a.name.localeCompare(b.name));
  return Response.json(tracks, { headers: { "Cache-Control": "no-store" } });
}
export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_KEY || (request.headers.get("X-Admin-Key") || "") !== env.ADMIN_KEY)
    return Response.json({ error: "Unauthorized. Enter the correct admin key." }, { status: 401 });
  const name = decodeURIComponent(request.headers.get("X-File-Name") || "audio-file");
  const type = request.headers.get("Content-Type") || "application/octet-stream";
  if (!type.startsWith("audio/") && !/\.(mp3|m4a|aac|ogg|wav|flac|opus|webm)$/i.test(name))
    return Response.json({ error: "Only audio files are accepted." }, { status: 415 });
  const id = crypto.randomUUID();
  await env.MUSIC_BUCKET.put(`music/${id}`, request.body, {
    httpMetadata: { contentType: type, contentDisposition: "inline" },
    customMetadata: { name }
  });
  return Response.json({ ok: true, id });
}