# Verification and visual critique

Final local implementation checked at 1440×900, 768×1024 and 390×844 using installed Edge over CDP. REA separately supplied the original live-site investigation and controlled route replay.

## Functional checks

`functional-results.json` records successful checks at all three widths:

- WebGL canvas starts; fallback remains hidden; no horizontal document overflow.
- Reduced-motion preference starts playback paused.
- Time scrubbing updates the displayed normalized time and changes rendered pixels.
- Brightness input updates its value; all four visibility inputs update projected-label visibility.
- Hide text and restore text work.
- All four hash-section links update active navigation.
- Play advances time; reset restores defaults.
- No uncaught JavaScript exceptions or console errors, including no shader compilation errors, were recorded.

Node syntax checks passed for main/lensing modules. Independent numeric checks verified point-lens image roots solve `theta-1/theta=u`, lens-path central alignment/symmetry, and magnification's decreasing behavior and limit at large impact parameter. These checks do not establish physically calibrated simulation accuracy or GPU performance on other hardware.

## Inspector and reference-specific exceptions

Final inspector output: `final-inspection/report.json`: zero unexcepted FAIL/WARN at 1440, 768 and 390. All three font assets loaded, body contrast measured 15.2:1, heading stayed on one line, and overflow was zero.

The initial generic marketing-page inspector flagged intentional reference characteristics. Explicit exceptions in the final run were `micro-label`, `palette-terracotta`, `body-size`, `few-pictures`, `small-text`, `still-page`, `font-count`, `first-action`, `no-footage`, `off-centre`, `small-title`, `name-only-title`. Reasons: this task asks for the reference's narrow, quiet 14px portfolio column, three named font roles, small scientific diagram labels, rust accent and full-screen procedural canvas. Adding unrelated photographs/video, large CTAs or eight decorative DOM animations would change that brief. The canvas animation is not counted by the inspector's DOM-motion metric. These exceptions are disclosed, not claims that the reference conventions satisfy every general accessibility/design preference.

Every final fold and page sheet was opened, along with the phone controls screenshot. The inspector's page contact sheets contain unused gray space around the scaled page; the full-size fold and verified screenshots show the actual viewport.

## Final critique

ROUND 2

Seen in one second: a dark astronomical diagram behind a small readable portfolio column.

Idea (one sentence): the reference's gravitational-lensing diagram becomes the working background for a personal portfolio.

Live thing: scrub lens alignment and switch the visible objects while the observer image updates.

Layout words by section: about=centered text over scene / projects=same sample shell / writing=same sample shell / cabinet=same sample shell.

Scores: design 6.5 · usability 7 · creativity 6 · content 7 → overall 6.6.

Caps applied: no photographic imagery; borrowed reference concept; small reference typography; generic sample content. This is a technical MVP, not an award-ready original portfolio design. The score applies to the visual starter, not the completeness of the reverse-engineering evidence.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. The Earth is a plain sphere (`verified-1440.png`). Replace with an independently licensed textured globe/GLB for production. Deliberately simplified for this small starter.
2. On phones the observer panel sits behind the text (`final-inspection/mobile-fold.jpg`). The same camera-fit technique preserves the scene, but the panel becomes small; hiding the text exposes it. A later production version could offer a dedicated observer view without changing the default aesthetic.
3. Sample sections reuse the lensing scene (`verified-768.png`). The reference has distinct robotics, orbit and detector experiences. Implement these as separate future scenes if matching the whole portfolio; they are explicitly beyond this lensing MVP.

The previous round's cropped camera composition and labels overlapping text were corrected with the recovered camera fitter and projected-label overlap dimming. No random design direction was drawn: this is a bounded component reconstruction with an explicit reference. No found photographs or footage were used; the source galaxy, stars and globe are generated in code.
