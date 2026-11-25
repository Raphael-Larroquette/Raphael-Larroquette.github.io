---
title: 'Throttleable Pintle Injector'
summary: 'Designed a throttleable N2O/ethanol pintle injector for a 5 kN bipropellant engine: from hand sketches, to a spreadsheet model, to a custom Python design tool, to detailed CAD.'
description: "Designed a throttleable pintle injector for UTAT's 5 kN nitrous oxide / ethanol bipropellant engine, taking it from first sketches through flow modelling, a custom design tool, and detailed CAD."
cover: '../../assets/images/projects/utat-pintle-cover.png'
coverAlt: 'Placeholder cover image for the pintle injector project'
tech:
  - 'Python'
  - 'Google Sheets'
  - 'OnShape'
  - 'Desmos'
role: 'Pintle design co-lead'
year: 2025
client: 'UofT Aerospace Team (Liquid Propulsion)'
duration: 'From Oct 2025'
---

<div class="split split--text">
<ul class="stats">
<li><b>~3.0 kg/s</b>Total propellant flow at the design point</li>
<li><b>3</b>Two-phase nitrous flow models implemented (SPI, HEM, Dyer)</li>
<li><b>3</b>Orifice geometries evaluated</li>
</ul>
<figure class="fig">
<a href="/images/projects/pintle/full.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/full.png" alt="Cross-section of the engine showing the pintle injector in the injector head, the chamber and the nozzle" /></a>
</figure>
</div>

## Problem

<ul>
<li>The previous pintle wasn't throttleable, so it didn't use a pintle's main advantage</li>
<li>Its flow rates were poorly predicted:
<ul>
<li>In cold flow, oxidizer flow came in at 0.90 kg/s against a 1.24 kg/s target</li>
<li>The hot-fire data suggested oxidizer flow up to 2× the expected value</li>
</ul>
</li>
<li>Uneven propellant distribution and the excess oxidizer caused local overheating. The injector melted at two points around the liner groove</li>
</ul>

## Goal

<ul>
<li>Throttle by varying orifice size, on both the oxidizer and fuel sides at the same time, to hold mixture ratio and efficiency across the throttle range</li>
<li>Predict flow rates accurately, including two-phase nitrous behaviour</li>
<li>Distribute propellant evenly to avoid local hot spots</li>
</ul>

## How I did it

<div class="split split--text">
<div>
<h3>1. Sketch → spreadsheet → software → CAD</h3>
<ul>
<li>Started from hand-drawn concepts</li>
<li>Moved to a spreadsheet model, then built a custom design tool, then detailed CAD</li>
</ul>
</div>
<figure class="fig">
<a href="/images/projects/pintle/drawings.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/drawings.png" alt="Hand-drawn pintle concept sketches comparing oxidizer deflector shapes and impingement behaviour" loading="lazy" /></a>
</figure>
</div>

<h3>2. Flow and spray modelling</h3>

<ul>
<li>Sized the orifices from the engine requirements: thrust, Isp from CEA, O/F 3.5, and chamber and injector pressures</li>
<li>Implemented three two-phase nitrous oxide mass-flow models (SPI, HEM, Dyer) using NIST property data. For the same orifice they predict flow rates up to ~3× apart, which is why model choice matters</li>
<li>Predicted spray angle from the propellant momentum ratio</li>
<li>Evaluated three orifice geometries from the literature: two-layer quadrangular slots, slanted slots, and a continuous annular gap</li>
</ul>

<figure class="fig">
<a href="/images/projects/pintle/spreadsheet.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/spreadsheet.png" alt="Spreadsheet model with imported values, intermediate calculations, mass flow rates, fuel and oxidizer orifice sizing and spray parameters" loading="lazy" /></a>
</figure>

<div class="split split--media">
<figure class="fig">
<a href="/images/projects/pintle/app.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/app.png" alt="UTAT Pintle Injector Calculator, step 1 engine specifications with governing equations" loading="lazy" /></a>
</figure>
<div>
<h3>3. Python design tool</h3>
<ul>
<li>Rebuilt the spreadsheet model as a Python app that accepts multiple orifice geometries</li>
<li>Designs are easy to change, compare and share with the team</li>
</ul>
</div>
</div>

<h3>4. Detailed design</h3>

<ul>
<li>A lead-screw-driven throttle varies the oxidizer and fuel orifice areas together</li>
<li>O-ring glands designed to the Parker O-Ring Handbook</li>
<li>Every small feature designed for manufacturability</li>
</ul>

<div class="split">
<figure class="fig">
<a href="/images/projects/pintle/close.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/close.png" alt="Cross-section of the injector head showing the pintle post, oxidizer manifold and O-ring glands" loading="lazy" /></a>
</figure>
<figure class="fig">
<a href="/images/projects/pintle/exploded.png" target="_blank" rel="noopener"><img src="/images/projects/pintle/exploded.png" alt="Exploded view of the injector assembly: cover plate, O-rings, pintle stem, manifold body, fittings and pintle sleeve" loading="lazy" /></a>
</figure>
</div>

## Outcome

<div class="decision">
<ul>
<li>Completed detailed design of a throttleable pintle injector, with the orifice sizing, throttle mechanism and sealing fully defined</li>
<li>The project stopped before simulation, manufacturing or testing</li>
</ul>
</div>

<p class="attrib">All injector design work was mine; the regeneratively cooled chamber was designed by a teammate.</p>
