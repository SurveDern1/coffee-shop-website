# QA — версия 3

- Chromium, desktop 1440×1000 and mobile 390×844.
- Unit tests: 5/5 passed, including all 10 categories, 53 individually named images, source-sensitive prices/sizes and search.
- Browser check: all 10 category wheels switch images and menu data. Direct item links, next/previous arrows, continuous mouse drag, mobile-width drag, actual CDP touch events, category dropdown, search and empty result state, reduced-motion and keyboard arrows checked.
- No JavaScript errors, failed local resource responses or document-level horizontal overflow observed in checked states.
- Standalone offline HTML checked: local navigation, images and wheel work with no external requests.
- Impeccable detector: one cream-palette warning, intentionally retained to match the user’s warm cream reference; no other findings.
- Visual review: desktop/mobile home, categories, coffee/breakfast wheels, photo galleries, search and empty state.
- Full original PDF and 53-entry text-only menu retained.
- Product images are illustrations, clearly disclosed, not verified photos of actual cafe plating. Real cafe address/contacts are not provided or invented.
- Tested with Chromium device emulation, not on physical iOS/Android hardware.
- GitHub upload/deployment is not completed; earlier write attempt returned 403.

## Image revision v3
- Replaced all 53 menu assets, each individually generated at native 1024×1024 and exported as RGBA WebP 1024×1024 quality 96.
- No old collage crops remain in active menu assets.
- Cleaned real photographic contours, subpixel antialiasing, chroma-fringe cleanup, removed background through open ceramic handles.

- Glass-specific review on both forest and cream: complete subject segmentation, cast-shadow removal and neutral transparent interiors. No color-key holes in rims/handles.

- Final v3 review: every image inspected in paired dark/cream contact sheets across all ten categories. Actual desktop and 390px mobile wheels checked for oatmeal, masala and smoothie. Final standalone HTML passed offline navigation and CDP touch swipe with no JavaScript errors.
