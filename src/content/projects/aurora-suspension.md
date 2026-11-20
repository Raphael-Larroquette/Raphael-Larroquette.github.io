---
title: 'Aurora Suspension & Steering Redesign'
summary: "Redesigned Aurora's front suspension kinematics in CATIA, MATLAB and SUSProg to optimise for lateral stability and on-track performance."
description: 'Aurora lifted a wheel in the figure-eight and could not pass scrutineering. I traced it to two root causes and redesigned the front end around +60 mm of track width. It passed on the first attempt at race.'
cover: '../../assets/images/projects/aurora-cover.jpg'
coverAlt: 'Aurora solar car cornering during figure-eight testing with the inside front wheel lifted off the ground'
tech:
  - 'CATIA 3DX'
  - 'Ansys'
  - 'SUSProg'
  - 'MATLAB'
  - 'Python'
  - 'GD&T'
role: 'Suspension & steering design'
year: 2026
featured: true
client: 'Blue Sky Solar Racing'
duration: 'Jan - May 2026'
---

<div class="split split--text">
<div>
<ul>
<li>Aurora is the team's first three-wheeled car</li>
<li>It failed the figure-eight at competition, missing the 16 second time required</li>
<li>After replacing some parts, the inside wheel still lifted in testing</li>
<li>This is when I joined the team</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/aurora/figure8-course.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/figure8-course.png" alt="Figure-eight course layout from the ASC regulations" loading="lazy" /></a>
<figcaption>Figure-eight course, ASC regulations. 8 s per side, both sides back to back.</figcaption>
</figure>
</div>

## Diagnosis

I built a fully functional front suspension assembly in CATIA Assembly Design so I could measure the geometry through its full range of motion instead of trusting the wireframe.

<div class="cards">
<div>
<p class="cards__title">Negative Ackermann</p>
<ul>
<li>Geometry and alignment led to negative Ackermann</li>
<li>Anti-Ackermann hurts efficiency and grip</li>
<li>I targeted 100% positive Ackermann</li>
</ul>
</div>
<div>
<p class="cards__title">Wrong load transfer</p>
<ul>
<li>Original calculations assumed the rear contributed to the roll moment, predicting wheel lift at 1 g</li>
<li>I re-derived the equations, revealing wheel lift at 0.81 g</li>
</ul>
</div>
</div>

## Choosing the fix

<div class="split split--top">
<div>
<ul>
<li>Led a study across anti-roll bars, track width, shock adjustment, asymmetric UCAs, adjustable steering arms and Ackermann geometry</li>
<li>Chose +60 mm track width with ~100% Ackermann in roll, targeting 0.9 g lateral</li>
<li>Minimised changes to existing components, squeezing performance out of the tight aerobody envelope</li>
</ul>
</div>
<div>
<p class="eyebrow">Constraints</p>
<ul>
<li>LCA clevises, upright, hub and steering rack fixed</li>
<li>2 in bump and 2 in droop, with no clashing in any combination of travel and steer</li>
<li>At least 10% inner wheel load through the figure-eight</li>
<li>Must fit inside the existing aerobody</li>
</ul>
</div>
</div>

## Wireframe

<div class="split split--text">
<div>
<ul>
<li>Built from first principles: front view geometry and Ackermann calculations</li>
<li>Checked motion and clashing in the full CATIA assembly</li>
<li>Checked kinematics in SUSProg</li>
<li>Fully parametric off the hardpoints, so geometry changes propagate to all parts</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/aurora/wireframe.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/wireframe.png" alt="Suspension wireframe overlay, new geometry solid and original dashed" loading="lazy" /></a>
<figcaption>New geometry solid, original dashed.</figcaption>
</figure>
</div>

<figure class="fig">
<a href="/images/projects/aurora/catia-states.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/catia-states.png" alt="Front suspension assembly at neutral ride height, max bump, max droop and roll condition" loading="lazy" /></a>
</figure>

## Upper control arm

I designed three variants, all with an asymmetric rod-end attachment to match real suspension travel.

<div class="compare">
<div class="compare__col compare__col--chosen">
<figure class="fig"><a href="/images/projects/aurora/uca-machined.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/uca-machined.png" alt="Machined billet aluminium upper control arm" loading="lazy" /></a></figure>
<div><p class="compare__name" data-badge="Chosen">Machined billet</p><ul><li>Al 7075-T651, 5-axis CNC</li><li>I-beam legs placed according to sims</li><li>$450 CAD for two</li></ul></div>
<figure class="fig"><a href="/images/projects/aurora/uca-sim-machined.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/uca-sim-machined.png" alt="Safety factor plot for the machined UCA" loading="lazy" /></a></figure>
<ul class="compare__sim"><li>High safety factor</li><li>Peak stress at the transition point</li><li>99 g each</li></ul>
</div>
<div class="compare__col">
<figure class="fig"><a href="/images/projects/aurora/uca-waterjet.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/uca-waterjet.png" alt="Waterjet upper control arm" loading="lazy" /></a></figure>
<div><p class="compare__name" data-badge="Chosen as replacements">Waterjet</p><ul><li>Al 6061-T6</li><li>Sponsored waterjet cutting</li><li>$50 CAD for two</li></ul></div>
<figure class="fig"><a href="/images/projects/aurora/uca-sim-waterjet.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/uca-sim-waterjet.png" alt="Safety factor plot for the waterjet UCA" loading="lazy" /></a></figure>
<ul class="compare__sim"><li>Passes all cases, but with high deflection</li><li>140 g each</li></ul>
</div>
<div class="compare__col">
<figure class="fig"><a href="/images/projects/aurora/uca-welded.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/uca-welded.png" alt="Welded 4130 steel tube upper control arm" loading="lazy" /></a></figure>
<div><p class="compare__name">Welded 4130 tube</p><ul><li>Sponsor manufactured</li><li>$100 CAD for two</li><li>Safety board's preference</li></ul></div>
<figure class="fig"><a href="/images/projects/aurora/uca-sim-welded.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/uca-sim-welded.png" alt="Safety factor plot for the welded UCA" loading="lazy" /></a></figure>
<ul class="compare__sim"><li>Very low safety factor at the weld fillets</li><li>Sim results could not be trusted</li><li>190 g each</li></ul>
</div>
</div>

<div class="decision">
<ul>
<li><strong>Chose the machined arm</strong></li>
<li>Couldn't verify the welded results in the time we had</li>
<li>The waterjet's deflection was bad enough that it was selected only as a backup</li>
<li>Built a new fatigue framework (derating results for loading type, surface finish, size, environment, etc.) so I could present the aluminium part to the safety board with confidence</li>
</ul>
</div>

## Lower control arm

<ul>
<li>The previous LCA performed well, so I adapted and optimised it rather than starting over</li>
<li>Widened the shock mount clevis for the longer moment arm</li>
<li>Wrote a MATLAB script to place the shock mount so motion ratio and initial shock length stay constant</li>
</ul>

<div class="grid3">
<figure class="fig">
<a href="/images/projects/aurora/lca-sq.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/lca-sq.png" alt="Redesigned lower control arm" loading="lazy" /></a>
<figcaption>Adapted LCA.</figcaption>
</figure>
<figure class="fig">
<a href="/images/projects/aurora/lca-sim-sq.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/lca-sim-sq.png" alt="Safety factor plot for the lower control arm" loading="lazy" /></a>
<figcaption>LCA safety factor.</figcaption>
</figure>
<figure class="fig">
<a href="/images/projects/aurora/shock-position.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/shock-sq.png" alt="MATLAB solution for the new shock mount position" loading="lazy" /></a>
<figcaption>Shock mount solved for constant motion ratio.</figcaption>
</figure>
</div>

## Drawings

<div class="split split--top">
<div>
<ul>
<li>Physically based GD&amp;T: datums taken from the features that actually join to other parts</li>
<li>Tolerances assigned using full system tolerance stackup</li>
</ul>
<figure class="fig">
<a href="/images/projects/aurora/bearing-bore.png" target="_blank" rel="noopener"><img src="/images/projects/aurora/bearing-bore.png" alt="Spherical bearing bore detail with GD&amp;T callouts" loading="lazy" /></a>
<figcaption>Spherical bearing bore detail.</figcaption>
</figure>
</div>
<figure class="fig">
<a href="/images/projects/aurora/uca-drawing.jpg" target="_blank" rel="noopener"><img src="/images/projects/aurora/uca-drawing.jpg" alt="Upper control arm manufacturing drawing with GD&amp;T callouts" loading="lazy" /></a>
<figcaption>UCA drawing. Click for full size.</figcaption>
</figure>
</div>

## Where it went wrong

<ul>
<li>One LCA bearing bore came back undersized because of a drawing error</li>
<li>Got the part remachined</li>
<li>Hand-made a custom jig and wrote an in-depth install guide to make sure the spherical bearings were installed properly</li>
</ul>

## It worked

<div class="split split--media">
<ul class="stats">
<li><b>~15.5 s</b>Both sides, every driver, consistently. The limit is 16 s.</li>
<li><b>17 s to 15 s</b>Best time before and after the redesign.</li>
<li><b>First attempt</b>Passed the figure-eight at race with every driver, plus slalom.</li>
</ul>
<video controls preload="metadata" poster="/video/aurora-figure8-poster.jpg">
<source src="/video/aurora-figure8.mp4" type="video/mp4" />
</video>
</div>

## What I'd do differently

<div class="cards">
<div>
<p class="cards__title">Account for bearing misalignment from the start</p>
<p>The clashes that began this were invisible at design time. My suspension tool now reports maximum misalignment per joint across a sweep.</p>
</div>
<div>
<p class="cards__title">Design suspension components parametrically</p>
<p>From the outset, not once the geometry is already moving.</p>
</div>
<div>
<p class="cards__title">Account for fatigue</p>
<p>Through the whole design, not added late to justify a material decision.</p>
</div>
<div>
<p class="cards__title">Triple check calculations, and hand derive them</p>
<p>An inherited load transfer error survived a full design generation. Re-deriving it by hand is what caught it.</p>
</div>
</div>
