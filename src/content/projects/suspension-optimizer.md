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

<p class="view-source-row"><a class="view-source" href="https://github.com/Raphael-Larroquette/BSSR-suspension" target="_blank" rel="noopener noreferrer">View source <span aria-hidden="true">↗</span></a></p>

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

## Problem

<ul>
<li>Our Tadpole (3 Wheeled Vehicle) behaves entirely distinct to the 4 wheeled vehicles commercial suspension tools assume</li>
<li>A solar car needs to minimize rolling-resistance losses while vehicle design literature focuses on maximising grip</li>
</ul>

## Goal

<ul>
<li>Natively handle 3-wheeled vehicles</li>
<li>Support flexible front and rear suspension layouts</li>
<li>Solve forces for every suspension component</li>
<li>Calculate and optimize joint characteristics</li>
<li>Usable by future generations</li>
</ul>

## How I did it

<div class="split split--text">
<div>
<h3>1. Tadpole-native foundation</h3>
<ul>
<li>Extended the open-source <a href="https://github.com/suspension-explorer/suspension-explorer-core" target="_blank" rel="noopener noreferrer">suspension-explorer-core</a> kinematics library</li>
<li>Added single rear wheel centre class, hand deriving new equations for anti geometry and load transfer.</li>
</ul>
</div>
<figure class="fig">
<div class="logo-panel"><img src="/images/projects/suspension-optimizer/suspension-explorer-logo.svg" alt="suspension-explorer-core wordmark" loading="lazy" /></div>
</figure>
</div>

<div class="split split--text">
<div>
<h3>2. Sweeps</h3>
<ul>
<li>Created sweeps of wheel z position and rack displacement</li>
<li>Reports suspension characteristics at every point in the suspensions motion</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/suspension-optimizer/bump-plots.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/bump-plots.png" alt="Bump sweep plots: camber, caster, toe, scrub radius, trail, half track, damper length, motion ratio, installation ratio, roll-centre height, track change, steering ratio and camber gain against left wheel travel" loading="lazy" /></a>
</figure>
</div>

<h3>3. Joint misalignment analysis</h3>
<ul>
<li>Aurora's rod ends broke because misalignment wasn't considered from the start of design. Therefore I:
<ul>
<li>Made all sweeps calculate the angular displacement at every joint</li>
<li>The reported maximum values, along with the forces at every joint, allow for easy rod-end selection</li>
</ul>
</li>
</ul>

<figure class="fig">
<a href="/images/projects/suspension-optimizer/alignment.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/alignment.png" alt="Table of required and best-available misalignment angle per joint, naming the sweep step that sets each maximum" loading="lazy" /></a>
</figure>

<div class="split split--text">
<div>
<h3>4. Suspension layout-agnostic force solver</h3>
<ul>
<li>The software builds a static-equilibrium matrix from the linkages, identifying bodies and two-force members automatically, so new layouts need no new hand calculations</li>
<li>Exports all part-relative loads directly for Ansys FEA</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/suspension-optimizer/fbd.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/fbd.png" alt="Hand-solved free-body diagram of the suspension linkage" loading="lazy" /></a>
</figure>
</div>

<figure class="fig">
<a href="/images/projects/suspension-optimizer/forces.png" target="_blank" rel="noopener"><img src="/images/projects/suspension-optimizer/forces.png" alt="Output force table for the lower wishbone inboard front joint across bump, brake and corner cases" loading="lazy" /></a>
</figure>

<div class="split split--text">
<div>
<h3>5. Multi-objective optimizer</h3>
<ul>
<li>Implemented NSGA-III to optimize 5 objectives over 21 parameters</li>
<li>Used integral-based objectives to score each desired characteristic over the whole range of motion, not just the design position</li>
<li>Created a quasi-static cornering metric that to get near zero road relative camber in turns, for efficiency</li>
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

<p class="view-source-row"><a class="view-source" href="https://github.com/Raphael-Larroquette/BSSR-suspension" target="_blank" rel="noopener noreferrer">View source <span aria-hidden="true">↗</span></a></p>

## Validation

<div class="grid3">
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

<div class="split split--text">
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
