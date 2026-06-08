# 📸 Family Peekaboo — adding your own photos

This folder holds the pictures that show up in the peekaboo game.

## How to add or change photos

1. **Drop your image files in this `photos/` folder.**
   - JPG or PNG both work.
   - Square-ish photos look best (the game crops to a square).
   - Tip: faces near the **center** of the photo work great, since the
     edges may get cropped on different screens.

2. **List them in the app.** Open `peekaboo/index.html`, find the
   `PHOTOS` list near the top of the `<script>`, and add one line per photo:

   ```js
   const PHOTOS = [
     { src: 'photos/mama.jpg',    name: 'Mama!' },
     { src: 'photos/dada.jpg',    name: 'Dada!' },
     { src: 'photos/grandma.jpg', name: 'Grandma!' },
   ];
   ```

   - `src`  = the file name (inside this `photos/` folder)
   - `name` = the big label shown + spoken out loud when revealed

3. **Make it work offline too.** Open `peekaboo/sw.js`, add each new file
   to the `PRECACHE` list, and bump `CACHE_VERSION` (e.g. `peekaboo-v1`
   → `peekaboo-v2`). That tells installed iPads to grab the new photos.

That's it — commit, push, and Netlify will redeploy.

## Notes
- There's no limit on how many photos you add; the game loops forever.
- The starter photos here (`our-family.png`, `remi-and-scout.png`,
  `the-babies.png`) are copies of images already in the project — feel
  free to delete them once you've added your own.
