# 📸 Family Peekaboo — adding your own photos

This folder holds the pictures that show up in the peekaboo game.

## How to add or change photos

1. **Drop your image files in this `photos/` folder.**
   - JPG or PNG both work.
   - Square-ish photos look best (the game crops to a square).
   - Tip: faces near the **center** of the photo work great, since the
     edges may get cropped on different screens.

2. **List them in the app.** Open `index.html`, find the
   `PHOTOS` list near the top of the `<script>`, and add one line per photo:

   ```js
   const PHOTOS = [
     { src: 'photos/mama.jpg' },
     { src: 'photos/dada.jpg' },
     { src: 'photos/grandma.jpg' },
   ];
   ```

   - `src` = the file name (inside this `photos/` folder)
   - No labels — the photo speaks for itself, so just list the file.

3. **Make it work offline too.** Open `sw.js`, add each new file
   to the `PRECACHE` list, and bump `CACHE_VERSION` (e.g. `peekaboo-v1`
   → `peekaboo-v2`). That tells installed iPads to grab the new photos.

That's it — commit, push, and Netlify will redeploy.

## Notes
- There's no limit on how many photos you add; the game loops forever.
- Big phone photos are fine — but smaller files load faster offline.
  Resizing the long edge to ~1600px keeps them sharp and light.
- iPhone photos sometimes carry a sideways/upside-down "orientation" tag.
  If one shows up rotated, re-save it upright (or just ask Claude to fix it).
