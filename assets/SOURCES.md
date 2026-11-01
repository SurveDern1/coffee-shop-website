# Sources and image provenance — v3

- Every `assets/menu/*.webp` (53 individual images) is a generated menu illustration, art-directed from the user's Coffee 26 PDF. These are not documentary photos. Food amounts/actual plating can differ; textual menu data is authoritative. Disclosure appears in the public footer.
- `hero-v2.webp` is an independently generated cafe still life, guided by the supplied Bean & Bloom reference. No screenshot artwork was copied into the site, no third-party cafe or logo is shown as Coffee 26.
- `menu/provenance.json` maps all 53 NEW individual native-1024px sources to their final transparent 1024×1024 WebP assets. Unlike v2, these are NOT crops from 2×2 sheets. Ceramic/food mattes follow real subject contours with edge antialiasing and chroma decontamination. Glass silhouettes use ISNet segmentation, preserving complete rims/handles and removing cast shadows, followed by neutral semitransparent glass despill. No fitted geometric plate mask. Preparation: `scripts/prepare-v3-assets.py`, then `scripts/refine-v3-glass.py` (Python rembg/onnxruntime required for regeneration only). Source registry: `scripts/assets-v3-sources.json`. Original generation files are session-local; final WebP assets need no processing dependencies to run.
- `menu.pdf` was supplied by the user. Menu names, ingredients, portions and prices are transcribed into `menu.js`.
- Prata and Manrope are self-hosted Google Fonts, SIL OFL. See adjacent OFL files.
- Impeccable: https://github.com/pbakaus/impeccable, upstream commit e89e3ada3e875a89ac2c5d33d11e65ebef6fe285, version 4.8.0. License and notice retained in installed skill folder.

New UI routes use only the new generated images.
