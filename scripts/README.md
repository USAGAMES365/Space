fetch-favicons.js

Usage:

1. Make sure `cwebp` is installed on your system (recommended - faster than sharp).

   On Debian/Ubuntu:

   sudo apt install webp

2. Run the script to fetch favicons for missing images:

   node scripts/fetch-favicons.js

Pass `--all` to force re-download and conversion of all favicons.
