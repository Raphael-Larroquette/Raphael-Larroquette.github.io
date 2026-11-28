---
title: 'Throttleable Pintle Injector'
summary: 'Designed a throttleable N2O/ethanol pintle injector for a 5 kN bipropellant engine: from hand sketches, to a spreadsheet model, to a custom Python design tool, to detailed CAD.'
description: "Designed a throttleable pintle injector for UTAT's 5 kN nitrous oxide / ethanol bipropellant engine, taking it from first sketches through flow modelling, a custom design tool, and detailed CAD."
cover: '../../assets/images/projects/utat-pintle-cover.png'
coverAlt: 'Section view of the engine with the pintle injector in the injector head, the chamber and the nozzle'
tech:
  - 'Python'
  - 'Google Sheets'
  - 'OnShape'
  - 'Desmos'
  - "NASA's CEA"
role: 'Pintle design co-lead'
year: 2025
client: 'UofT Aerospace Team (Liquid Propulsion)'
duration: 'From Oct 2025'
---

<ul class="stats stats--row">
<li><b>~3.0 kg/s</b>Total propellant flow at the design point</li>
<li><b>3</b>Two-phase nitrous flow models implemented (SPI, HEM, Dyer)</li>
<li><b>Continuously throttleable</b>Fully throttleable with continuous mixture ratio for efficiency</li>
</ul>

## Problem

<ul>
<li>The previous pintle wasn't throttleable, so it didn't use a pintle's main advantage</li>
<li>Its flow rates were poorly predicted: cold flows were 40% lower than expected, while the hot-fire suggested up to 2× the predicted flow rate</li>
<li>Uneven propellant distribution caused the injector to melt at two points</li>
</ul>

## Goal

<ul>
<li>Throttle by varying orifice size of the oxidizer and fuel at the same time; holding the mixture ratio and thus efficiency across the throttle range</li>
<li>Predict flow rates accurately, including two-phase nitrous behaviour</li>
<li>Distribute propellant evenly to avoid local hot spots</li>
</ul>

## How I did it

<div class="split split--center">
<div>
<h3>1. Sketch → spreadsheet → software → CAD</h3>
<ul>
<li>Started from hand-drawn concepts</li>
<li>Moved to a spreadsheet model, then built a custom design tool, then detailed CAD</li>
</ul>
<h3>2. Flow and spray modelling</h3>
<ul>
<li>Sized the orifices from the engine requirements: thrust, Isp from CEA, O/F 3.5, and chamber and injector pressures</li>
<li>Implemented three two-phase nitrous oxide mass-flow models (SPI, HEM, Dyer) using NASA CEA data.</li>
<li>Predicted spray angle from the propellant momentum ratios</li>
<li>Evaluated four orifice geometries from the literature: circular orifices, two-layer quadrangular slots, slanted slots, and a continuous annular gap</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/pintle/drawings.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/drawings.png" alt="Hand-drawn pintle concept sketches comparing oxidizer deflector shapes and impingement behaviour" loading="lazy" /></a>
</figure>
</div>

<figure class="fig">
<a href="/images/projects/pintle/spreadsheet.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/spreadsheet.png" alt="Spreadsheet model with imported values, intermediate calculations, mass flow rates, fuel and oxidizer orifice sizing and spray parameters" loading="lazy" /></a>
</figure>

<div class="split split--media split--center">
<figure class="fig">
<a href="/images/projects/pintle/app.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/app.png" alt="UTAT Pintle Injector Calculator, step 1 engine specifications with governing equations" loading="lazy" /></a>
</figure>
<div>
<h3>3. Python design tool</h3>
<ul>
<li>Rebuilt the spreadsheet model as a Python app with a modular backend, accepting multiple calculation methods and geometries.</li>
<li>The tool made designs easy to change, compare and share with the team</li>
</ul>
</div>
</div>

<div class="split split--fill">
<div>
<h3>4. Detailed design</h3>
<ul>
<li>A lead-screw-driven throttle varies the oxidizer and fuel orifice areas together</li>
<li>O-ring grooves designed with Parker O-Ring Handbook</li>
</ul>
<figure class="fig fig--bare">
<a href="/images/projects/pintle/close.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/close.png" alt="Cross-section of the injector head showing the pintle post, oxidizer manifold and O-ring glands" loading="lazy" /></a>
</figure>
</div>
<figure class="fig fig--fill fig--bare">
<a href="/images/projects/pintle/exploded.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/exploded.png" alt="Exploded view of the injector assembly: cover plate, O-rings, pintle stem, manifold body, fittings and pintle sleeve" loading="lazy" /></a>
</figure>
</div>