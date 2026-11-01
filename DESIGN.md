# Coffee 26 — image-led redesign

This replaces the rejected text-first v1, rather than polishing it.

## Visual world
Warm cream #f8f4ec, deep forest #263e30 and #1c3025, coffee-rust #a4542e. Ivory type on the dark, full-bleed coffee banner; product images on cream, pale green and warm sand fields. Prata display and Manrope interface, both self-hosted. Rounded photo cards follow the explicit supplied Bean & Bloom and iced-coffee references. No fake cart, ratings or business claims.

## Visitor path
Hero → illustrated category ribbon / category image tiles → a distinct category screen → a draggable circular product wheel → complete visual grid. Every one of the 53 menu entries has a separate local image. The same wheel works in all ten categories. Home includes a working breakfast wheel, not a static teaser.

## Motion contract
Seven rendered slots travel on a trigonometric circular arc. During pointer movement, item position, rotation and scale are tied continuously to drag distance. Pointer release snaps with bounded momentum to the closest dish. This is not a crossfade or one-image swap. Neighbours remain visible; images have photo-derived antialiased alpha mattes instead of circular masks. Arrows, ArrowLeft / ArrowRight, Home / End and photo cards provide alternatives. Horizontal trackpad deltas rotate the wheel; vertical page scrolling is never intercepted. Reduced motion snaps immediately, without inertia or animation.

## Page modes
Landing: Persuade. Category wheel: Experience. Photo grid and search: Operate. Every actual price, portion, composition and supplement comes from the user-supplied PDF. Generated menu illustrations are disclosed in the footer; real cafe photos can replace them by filename. No address or all-day opening hours were invented.

## Responsive composition
Desktop 1440×1000: full-width cafe banner, 5-column category tiles, 4-column product cards, broad wheel with visible neighbours. Mobile 390×844: top-lit coffee banner, 2-column image tiles/cards, horizontal category ribbon and dropdown, large central product with clipped peripheral neighbours inside the wheel only. No document-level horizontal scrolling. Category routes and browser Back work without server rewrites.

## Image-quality revision v3
All 53 menu assets replaced with individually generated 1024×1024 photographs/illustrations, rather than small collage crops. Photo-derived silhouette separation, subpixel edge antialiasing and edge-chroma cleanup replace the earlier small masks. Glass uses ISNet subject segmentation to retain complete rims, spouts and handles, then a neutral transmission matte removes the green backdrop without punching holes in glass. Source shadows are removed rather than carried onto cream. Smooth complete ivory ceramic rims, rich natural food texture, cohesive warm lighting. Existing layout, routes, menu truth and wheel interactions retained.
