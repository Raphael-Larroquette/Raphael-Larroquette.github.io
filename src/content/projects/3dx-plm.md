---
title: '3DEXPERIENCE PLM Setup'
summary: "Restructured the team's CAD data platform with access control, approval workflows and standard libraries, so parts can't be accidentally broken and only approved designs reach manufacturing."
description: "Set up Blue Sky Solar Racing's 3DEXPERIENCE platform for Gen13: who can edit what, how designs get approved, and how parts are tagged, reused and drawn."
cover: '../../assets/images/projects/3dx-plm-cover.png'
coverAlt: 'The 3DEXPERIENCE logo'
tech:
  - '3DEXPERIENCE'
  - 'CATIA'
  - 'ENOVIA'
role: ''
year: 2026
client: 'Blue Sky Solar Racing (Gen13)'
---

## Before and after

<div class="cards">
<div>
<p class="cards__title">Before</p>
<ul>
<li>Everything in one shared space</li>
<li>Everyone could edit everything</li>
<li>Unreviewed parts could be referenced and sent out</li>
</ul>
</div>
<div>
<p class="cards__title">After</p>
<ul>
<li>Spaces separated by stage of design</li>
<li>Hierarchical edit rights by role</li>
<li>Approval routing before release</li>
</ul>
</div>
</div>

## Collaborative spaces

<div class="cards">
<div>
<p class="cards__title">Gen13</p>
<p>Every part and assembly on the car.</p>
</div>
<div>
<p class="cards__title">Gen13 Manufacturing</p>
<p>Molds, jigs and support structures for the build.</p>
</div>
<div>
<p class="cards__title">Gen13 COTS Library</p>
<p>Off-the-shelf parts used on the car.</p>
</div>
<div>
<p class="cards__title">Standard Library</p>
<p>Standard parts, templates and materials.</p>
</div>
<div>
<p class="cards__title">Pre-Gen13 Archive</p>
<p>Everything from previous cars.</p>
</div>
<div>
<p class="cards__title">Other</p>
<p>Work not directly part of the car.</p>
</div>
</div>

## User groups and permissions

<figure class="fig">
<a href="/images/projects/3dx-plm/user-groups.png" target="_blank" rel="noopener"><img src="/images/projects/3dx-plm/user-groups.png" alt="User Groups panel listing the ten groups on the platform" loading="lazy" /></a>
</figure>

<div class="split split--top">
<div>
<div class="table-wrap">
<table>
<thead>
<tr><th>Role</th><th>Can edit</th></tr>
</thead>
<tbody>
<tr><td>Admins &amp; Approvers</td><td>Everything</td></tr>
<tr><td>Leads</td><td>Their subsystems</td></tr>
<tr><td>Members</td><td>Parts they created, or were explicitly given access to</td></tr>
</tbody>
</table>
</div>
</div>
<ul>
<li>Everyone can still <em>see</em> everything in their spaces</li>
<li>Hierarchical flow of control, so nothing gets accidentally changed</li>
</ul>
</div>

## Maturity and approval

<ul>
<li>Every part and drawing moves through Draft → In Work → Frozen → Released</li>
<li>Release requires an approver: an automated route creates a review task for them</li>
<li>Unreleased work can't be referenced from other spaces</li>
<li>Unapproved drawings can't be sent out for manufacturing</li>
</ul>

<figure class="fig" style="max-width: 979px">
<a href="/images/projects/3dx-plm/maturity-graph.png" target="_blank" rel="noopener"><img src="/images/projects/3dx-plm/maturity-graph.png" alt="Maturity graph: Draft, In Work, Frozen, Released, then Obsolete, with a Released to In Work transition" loading="lazy" /></a>
</figure>

## Custom attributes

<ul>
<li>Mandatory tags on every part: subsystem, manufacturing method, subteam, handedness</li>
<li>Optional tags: mass, cost, manufacturer, part number</li>
<li>These enable:
<ul>
<li>Cleaner BOMs</li>
<li>Auto-filled drawing title blocks</li>
<li>Faster part search</li>
</ul>
</li>
</ul>

## Standard parts library

<ul>
<li>Standardized fasteners, projected to cut fastener cost by ~50% (~$1,600 → ~$800 CAD)</li>
<li>Design a part well once, then reuse it across the car as a standard part (e.g. composite inserts)</li>
</ul>

## Drawing templates <span class="tag-wip">Work in progress</span>

<ul>
<li>Drawing templates per manufacturing method, with that method's tolerances built in</li>
</ul>
