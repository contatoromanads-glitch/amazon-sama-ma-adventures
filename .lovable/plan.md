## Replace hero video

Swap the current hero background video for the newly uploaded `hero-droneV2.mp4`.

### Steps
1. Delete the existing `public/hero-drone.mp4` from the repo.
2. Upload `hero-droneV2.mp4` to Lovable Assets CDN (it's ~1.9MB, but video belongs on CDN, not in repo) via `lovable-assets create`, producing `src/assets/hero-drone.mp4.asset.json`.
3. Update `src/pages/Index.tsx` so `HERO_VIDEO_URL` imports the asset JSON and uses its `.url` instead of the static `/hero-drone.mp4` path.

### Notes
- Keeps the same poster, autoplay, loop, muted attributes — only the source changes.
- No other pages reference `hero-drone.mp4`.
