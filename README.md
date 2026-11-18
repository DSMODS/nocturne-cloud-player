# NOCTURNE Cloud Player

Uploads are stored in Cloudflare R2, so the same deployed library can be played from other browsers and devices. The playlist/audio endpoints are public; uploads require an admin key.

## Setup
1. In Cloudflare Dashboard → R2, create a bucket named `nocturne-music`.
2. Deploy this project as a Cloudflare Pages project with Functions enabled (the `functions/` folder must be deployed).
3. In Pages → Settings → Bindings, add an R2 bucket binding named `MUSIC_BUCKET` pointing to `nocturne-music`.
4. In Pages → Settings → Variables and Secrets, add secret `ADMIN_KEY` with a long random password. Apply to Production (and Preview if needed).
5. Redeploy after adding bindings/secrets.

## Deploy using Wrangler
```bash
npm install -g wrangler
npx wrangler login
npx wrangler pages project create nocturne-cloud-player
npx wrangler pages deploy . --project-name nocturne-cloud-player
```
Make sure the `functions/` directory is included in the Pages deployment. For Git integration, use the repository root and no build command.

## Use
Visit your Pages URL, click Admin, enter `ADMIN_KEY`, then click Upload. Other browsers/devices can open the same Pages URL and stream the public playlist. Audio uses byte-range responses for seeking.

## Notes
- Uploaded tracks are publicly playable to anyone with the site URL. Only uploads are protected by `ADMIN_KEY`.
- Keep the admin key private; it is not stored in the source files.
- R2 pricing and account limits apply.
- This starter lists up to 1,000 tracks and does not yet implement delete/rename.
