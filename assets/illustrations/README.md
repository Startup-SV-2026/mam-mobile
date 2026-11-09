# Mầm illustration sample

`space.png` is an original raster illustration generated with the built-in ImageGen tool for this project, not copied from Wondering. It is bundled with the first Space lesson to preview the visual direction without an image API key.

Final prompt:

> Create a polished editorial educational illustration for Mầm, a Vietnamese microlearning mobile app. Landscape 3:2 composition, no text, no letters, no numbers, no logos. A tiny handcrafted 3D clay diorama explaining our place in space: Earth prominent in the foreground, a warm small sun behind and to its left, graceful orbital wire arcs leading outward to a spiral of many tiny star dots suggesting our Milky Way. Scientifically suggestive schematic, NOT a scale-accurate astronomical diagram: do not imply Earth is the center of the solar system. No other planets necessary. Soft sage green land, powder blue oceans, muted apricot sun, dusty lavender distant galaxy, deep cocoa accents, warm cream #FFFDF1 seamless background with lots of breathing room. Matte clay and paper-cut materials, subtle tactile texture, fine warm outlines, soft natural studio shadows, isometric three quarter view, elegant playful high quality museum education illustration, restrained palette, focal content centered and safe margins. It must be a beautiful small composition on a lesson page, not a UI screenshot, no card border.

The result is an artistic scene. Its orbits and distances are decorative, not a scientific geometry model; the app caption states that explicitly. Accurate explanatory text and diagrams remain code-rendered.

New lesson artwork uses `server/illustrations.ts`, the Gemini image model and the fixed `mam-clay-v1` style prompt, rather than the built-in tool. Generated results live in `server/.cache/illustrations/` and are excluded from Git. The same art direction helps consistency, but model outputs can vary and need factual review.
