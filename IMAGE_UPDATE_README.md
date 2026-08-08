# Real Image Update — Summary

All generic stock photos have been replaced with real A2Z site photos
(from the images you shared). Files removed: `service_01–08.jpg`,
`project01–02.jpg`, `clients.jpg` (unused). 25 new photos added as
`public/real-*.jpg` (cropped to remove WhatsApp/GPS watermark bands,
resized, compressed for web).

## Confidence level by section

**High confidence — photo verified to match the claim:**
- `iocl-odisha` project → `real-iocl-odisha-maintenance.jpg` (GPS-tagged
  Abhayachandapur, Odisha — worker maintaining grass beside plant piping)
- `nagar-nigam-varanasi` project → `real-nightlighting-nagarnigam.jpg`
  (signage in the photo literally reads "Nagar Nigam Varanasi")
- `rajasthan-housing-board` project → `real-rajasthan-site-road.jpg`
  (GPS-tagged Mahansara Khurd Rural, Rajasthan)

**Medium confidence — real A2Z work, but not verified as that exact
site.** Please review before treating these as site-specific proof:
- `nhai-ayodhya`, `nhai-prayagraj`, `nfl-madhya-pradesh`, `pwd-varanasi`,
  `nbcc-wtc-delhi`, `sunbeam-varanasi`, `csr-initiatives`, `ntpc-dadri`,
  `shivalik-corporates`, `castillo-hospitality`

If any of these pairings are wrong (e.g. the NBCC Delhi project photo
isn't actually from Delhi), it's an easy fix — just swap the `image:`
value in `frontend/lib/mock.js` for that project's slug.

## Where things changed
- `frontend/lib/mock.js` — HERO, ABOUT_IMAGES, SERVICES (17), PROJECTS (13), GALLERY (10)
- `frontend/components/HeroCarousel.jsx` — 4 hero slides
- `frontend/app/page.jsx` — homepage image grid
- `frontend/app/about/page.jsx` — About page image grid
- `frontend/public/` — 25 new `real-*.jpg` files added, 11 stock files removed
