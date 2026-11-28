---
title: 'Suspension Design & Optimization Tool'
summary: 'Python tool that solves kinematics, forces and joint misalignment for 3-wheeled solar cars, and optimizes the geometry toward efficiency targets.'
description: "Developed a suspension solving and optimization tool for Blue Sky Solar Racing's 3-wheeled Gen13 solar car, covering kinematics, steady-state forces, bearing misalignment, and multi-objective geometry optimization."
cover: '../../assets/images/projects/suspension-optimizer-cover.jpg'
showCover: false
coverAlt: 'First frame of the suspension sweep: front, side, top and isometric views of the Gen13 linkage'
tech:
  - 'Python'
  - 'pymoo (NSGA-III)'
  - 'NumPy'
  - 'SUSProg'
  - 'CATIA 3DX'
  - 'Desmos'
role: 'Mechanical Lead'
year: 2026
featured: true
client: 'Blue Sky Solar Racing'
duration: 'Aug 2026 to present'
links:
  github: 'https://github.com/Raphael-Larroquette/BSSR-suspension'
---

<p class="view-source-row"><a class="view-source" href="https://github.com/Raphael-Larroquette/BSSR-suspension" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>See it on GitHub <span aria-hidden="true">↗</span></a></p>

<figure class="fig">
<video autoplay loop muted playsinline preload="metadata" poster="/images/projects/suspension-optimizer/hero-sweep-poster.jpg" aria-label="Suspension sweep animation with instant-centre and roll-centre overlays">
<source src="/images/projects/suspension-optimizer/hero-sweep.mp4" type="video/mp4" />
</video>
</figure>

<ul class="stats stats--row">
<li><b>~12 s</b>To analyze a candidate design (previously 1 to 2 hours)</li>
<li><b>1064 → 960 mm</b>Track width, through faster iteration with the whole team</li>
<li><b>Pareto Optimized</b>Suspension designs lie on the boundary of performance.</li>
</ul>

<div class="split split--pair">
<div>
<h2>Problem</h2>
<ul>
<li>Our tadpole (3-wheeled vehicle) behaves very differently from the 4-wheeled vehicles that commercial suspension tools assume</li>
<li>A solar car needs to minimize rolling-resistance losses while vehicle design literature focuses on maximising grip</li>
</ul>
</div>
<div>
<h2>Goal</h2>
<ul>
<li>Natively handle 3-wheeled vehicles</li>
<li>Support flexible front and rear suspension layouts</li>
<li>Solve forces for every suspension component</li>
<li>Calculate and optimize joint characteristics</li>
<li>Usable by future generations</li>
</ul>
</div>
</div>

## How I did it

<div class="split split--center split--step">
<div>
<h3>1. Tadpole-native foundation</h3>
<ul>
<li>Extended the open-source <a href="https://github.com/suspension-explorer/suspension-explorer-core" target="_blank" rel="noopener noreferrer">suspension-explorer-core</a> kinematics library</li>
<li>Added single rear wheel centre class, hand deriving new equations for anti geometry and load transfer.</li>
</ul>
</div>
<figure class="fig fig--logo">
<div class="logo-panel"><img src="/images/projects/suspension-optimizer/suspension-explorer-logo.svg" alt="suspension-explorer-core wordmark" loading="lazy" /></div>
</figure>
</div>

<div class="split split--center split--step split--rev">
<div>
<h3>2. Sweeps</h3>
<ul>
<li>Created sweeps of wheel z position and rack displacement</li>
<li>Reports suspension characteristics at every point in the suspensions motion</li>
</ul>
<h3>3. Joint misalignment analysis</h3>
<ul>
<li>Aurora's rod ends broke because misalignment wasn't considered from the start of design. Therefore I:
<ul>
<li>Made all sweeps calculate the angular displacement at every joint</li>
<li>The reported maximum values, along with the forces at every joint, allow for easy rod-end selection</li>
</ul>
</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/suspension-optimizer/bump-plots.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/bump-plots-crop.png" alt="Bump sweep plots: camber, caster, toe, scrub radius, trail and half track against left wheel travel" loading="lazy" /></a>
<figcaption>6 of the 13 bump sweep plots. Click for all of them.</figcaption>
</figure>
</div>

<div class="split split--center split--step">
<div>
<h3>4. Suspension layout-agnostic force solver</h3>
<ul>
<li>The software builds a static-equilibrium matrix from the linkages, identifying bodies and two-force members automatically, so new layouts need no new hand calculations</li>
<li>Exports all part-relative loads directly for Ansys FEA</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/suspension-optimizer/forces.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/forces.png" alt="Output force table for the lower wishbone inboard front joint across bump, brake and corner cases" loading="lazy" /></a>
</figure>
</div>

<div class="split split--center split--step split--rev">
<div>
<h3>5. Multi-objective optimizer</h3>
<ul>
<li>Implemented NSGA-III to optimize 5 objectives over 21 parameters</li>
<li>Used integral-based objectives to score each desired characteristic over the whole range of motion, not just the design position</li>
<li>Created a quasi-static cornering metric to get near-zero road-relative camber in turns, for efficiency</li>
</ul>
</div>
<div>
<figure class="fig">
<div class="table-wrap">
<table>
<thead>
<tr><th>Objectives (5)</th><th>Constraints</th></tr>
</thead>
<tbody>
<tr><td>Joint force</td><td>KPI 9 to 11°</td></tr>
<tr><td>Bump scrub</td><td>Toe range 0 to 1°</td></tr>
<tr><td>Ackermann error</td><td>Install ratio 0.6 to 1.01</td></tr>
<tr><td>Camber gain over travel</td><td>Min shock length</td></tr>
<tr><td>Road camber in corners</td><td>Min turn angle 17.5°</td></tr>
</tbody>
</table>
</div>
<figcaption>NSGA-III objectives and constraints.</figcaption>
</figure>
</div>
</div>

## Validation

<p>I successfully validated the software through 3 different methods.</p>

<div class="grid3 grid3--frames">
<figure class="fig">
<a href="/images/projects/suspension-optimizer/susprog.jpg" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/susprog.jpg" alt="The same suspension geometry modelled in SUSProg" loading="lazy" /></a>
<figcaption><strong>SUSProg.</strong> Same geometry independently confirmed through a known good software.</figcaption>
</figure>
<figure class="fig">
<a href="/images/projects/suspension-optimizer/desmos.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/desmos.png" alt="Desmos front-view four-bar model with a slider for lower control arm rotation" loading="lazy" /></a>
<figcaption><strong>Desmos four-bar.</strong> Manually written 4 bar model to confirm front view kinematics.</figcaption>
</figure>
<figure class="fig">
<a href="/images/projects/suspension-optimizer/fbd.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/fbd.png" alt="Hand-solved free-body diagram used to check the solver" loading="lazy" /></a>
<figcaption><strong>Hand-solved FBD.</strong> The solver matched hand derived equations for the double wishbone suspension.</figcaption>
</figure>
</div>

<div class="split split--text split--center">
<div>
<h3>Real car</h3>
<ul>
<li>The quasi-static cornering model predicted ~4° of outer-wheel road-relative camber on Aurora's Figure-8 path</li>
<li>That matched closely with the cars actual driving.</li>
</ul>
</div>
<figure class="fig">
<video controls preload="metadata" poster="/video/aurora-figure8-poster.jpg">
<source src="/video/aurora-figure8.mp4" type="video/mp4" />
</video>
</figure>
</div>

## Outcome

<div class="split split--text">
<div class="decision">
<ul>
<li>Candidate analysis cut from 1 to 2 hours to ~12 seconds</li>
<li>Faster iteration on track width with the rest of the team: 1064 → 960 mm. The smaller frontal area cuts the power needed to overcome drag at cruising speed by ~10%</li>
<li>Built for reuse: well documented, no hidden defaults, vertically integrated force solves, and infinitely expandable</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/suspension-optimizer/catia-wireframe.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/catia-wireframe.png" alt="Gen13 front suspension wireframe in CATIA" loading="lazy" /></a>
</figure>
</div>

<p class="attrib">Built on <a href="https://github.com/suspension-explorer/suspension-explorer-core" target="_blank" rel="noopener noreferrer">suspension-explorer-core</a>.</p>
