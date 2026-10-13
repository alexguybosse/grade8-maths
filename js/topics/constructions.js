(function () {
  const { pick, num, mc, h, s, svg, clear, seg } = G8;

  /* Each construction = list of steps; each step = [instruction, draw-function(pic)] drawn cumulatively */
  const L = (x1, y1, x2, y2, o = {}) => s('line', Object.assign({ x1, y1, x2, y2, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' }, o));
  const ARC = (cx, cy, r, a1, a2, o = {}) => {
    const p = (a) => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2);
    return s('path', Object.assign({ d: `M${x1},${y1} A${r},${r} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} 0 ${x2},${y2}`, fill: 'none', stroke: 'var(--red)', 'stroke-width': 1.8 }, o));
  };
  const DOT = (x, y, label, dx = 0, dy = -10) => [s('circle', { cx: x, cy: y, r: 3.5, fill: 'currentColor' }), label ? s('text', { x: x + dx, y: y + dy, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700 }, label) : null].filter(Boolean);

  const C = {
    perp: { name: 'Perpendicular bisector of a line', steps: [
      ['Draw line segment AB.', (p) => { p.append(L(70, 120, 270, 120)); p.append(...DOT(70, 120, 'A', -8, 18), ...DOT(270, 120, 'B', 8, 18)); }],
      ['Open the compass more than half of AB. Put the point on A and draw an arc above and below the line.', (p) => { p.append(ARC(70, 120, 130, 35, 68), ARC(70, 120, 130, -68, -35)); }],
      ['Keep the same width. Put the point on B and draw arcs that cross the first two.', (p) => { p.append(ARC(270, 120, 130, 112, 145), ARC(270, 120, 130, 215, 248)); }],
      ['Join the two crossing points. This line cuts AB in half at 90°.', (p) => { const yy = Math.sqrt(130 * 130 - 100 * 100); p.append(L(170, 120 - yy - 20, 170, 120 + yy + 20, { stroke: 'var(--s-space)', 'stroke-width': 3 })); p.append(s('rect', { x: 170, y: 108, width: 12, height: 12, fill: 'none', stroke: 'var(--s-space)', 'stroke-width': 1.5 })); p.append(...DOT(170, 120 - yy), ...DOT(170, 120 + yy)); }],
    ] },
    bis: { name: 'Bisect an angle', steps: [
      ['Start with angle ABC.', (p) => { p.append(L(60, 200, 300, 200), L(60, 200, 240, 50)); p.append(...DOT(60, 200, 'B', -10, 6), ...DOT(300, 200, 'C', 0, 20), ...DOT(240, 50, 'A', 10, -6)); }],
      ['Compass point on B: draw an arc that cuts both arms.', (p) => { p.append(ARC(60, 200, 110, -5, 45)); p.append(...DOT(170, 200), ...DOT(60 + 110 * Math.cos(39.8 * Math.PI / 180), 200 - 110 * Math.sin(39.8 * Math.PI / 180))); }],
      ['From each of those two points, draw an arc (same width) so they cross inside the angle.', (p) => { const ax = 60 + 110 * Math.cos(39.8 * Math.PI / 180), ay = 200 - 110 * Math.sin(39.8 * Math.PI / 180); p.append(ARC(170, 200, 75, 32, 72), ARC(ax, ay, 75, -30, 10)); }],
      ['Join B to where the arcs cross. That line splits the angle into two equal angles.', (p) => { const t = 19.9 * Math.PI / 180; p.append(L(60, 200, 60 + 260 * Math.cos(t), 200 - 260 * Math.sin(t), { stroke: 'var(--s-space)', 'stroke-width': 3 })); }],
    ] },
    sixty: { name: 'Construct a 60° angle', steps: [
      ['Draw a line and mark point P on it.', (p) => { p.append(L(50, 200, 300, 200)); p.append(...DOT(80, 200, 'P', 0, 20)); }],
      ['Compass on P: draw a big arc that cuts the line at Q.', (p) => { p.append(ARC(80, 200, 140, -3, 75)); p.append(...DOT(220, 200, 'Q', 0, 20)); }],
      ['Same width, compass on Q: draw an arc that crosses the first one at R.', (p) => { p.append(ARC(220, 200, 140, 105, 135)); p.append(...DOT(150, 200 - 140 * Math.sin(Math.PI / 3), 'R', 10, -6)); }],
      ['Join P to R. Angle RPQ is exactly 60°, because PQR is an equilateral triangle. Bisect it to get 30°.', (p) => { p.append(L(80, 200, 80 + 190 * 0.5, 200 - 190 * Math.sin(Math.PI / 3), { stroke: 'var(--s-space)', 'stroke-width': 3 })); p.append(s('text', { x: 125, y: 190, 'font-size': 14, 'font-weight': 700, fill: 'var(--s-space)' }, '60°')); }],
    ] },
    tri: { name: 'Construct a triangle (SSS)', steps: [
      ['Example: sides 7 cm, 5 cm and 6 cm. Draw the longest side, AB = 7 cm.', (p) => { p.append(L(60, 200, 280, 200)); p.append(...DOT(60, 200, 'A', -6, 20), ...DOT(280, 200, 'B', 6, 20)); }],
      ['Set the compass to 5 cm. Point on A, draw an arc above AB.', (p) => { p.append(ARC(60, 200, 157, 35, 75)); }],
      ['Set it to 6 cm. Point on B, draw an arc that crosses the first. That point is C.', (p) => { p.append(ARC(280, 200, 189, 115, 155)); }],
      ['Join A and B to C. Label the sides to check.', (p) => {
        const d = 220, a = 157, b = 189; const x = (a * a - b * b + d * d) / (2 * d), y = Math.sqrt(a * a - x * x);
        const cx = 60 + x, cy = 200 - y; p.append(L(60, 200, cx, cy, { stroke: 'var(--s-space)', 'stroke-width': 3 }), L(280, 200, cx, cy, { stroke: 'var(--s-space)', 'stroke-width': 3 })); p.append(...DOT(cx, cy, 'C'));
        p.append(s('text', { x: 170, y: 220, 'text-anchor': 'middle', 'font-size': 13 }, '7 cm'), s('text', { x: (60 + cx) / 2 - 22, y: (200 + cy) / 2, 'font-size': 13 }, '5 cm'), s('text', { x: (280 + cx) / 2 + 10, y: (200 + cy) / 2, 'font-size': 13 }, '6 cm')); }],
    ] },
  };

  G8.topic({
    id: 'constructions', strand: 'space', title: 'Constructions',
    blurb: 'Use a compass and ruler to bisect lines and angles and build 60°, 30°, 90°, 45° and triangles.',
    rules: [
      'You need a sharp pencil, a ruler, a compass and a protractor. Constructions use the compass and ruler; the protractor is only for checking.',
      '<b>Bisect</b> means cut into two equal parts.',
      'Every point on the perpendicular bisector of AB is the same distance from A and from B.',
      '60° comes from an equilateral triangle. Bisect it for 30°, bisect again for 15°.',
      '90° comes from a perpendicular. Bisect it for 45°.',
      'A triangle can be constructed from SSS, SAS, ASA or RHS. Two sides must add to more than the third.',
      'Leave your construction arcs on the page: they show your method.',
    ],
    lesson: [
      { h: 'Why compasses work', html: `
        <p>A compass draws every point that is the same distance from its centre. So when two arcs of the same width cross, the crossing point is the same distance from both centres. That's the idea behind every construction here.</p>` },
      { h: 'The main constructions', html: `
        <div class="eg"><b>Perpendicular bisector of AB</b><ol><li>Compass more than half of AB, arcs from A above and below.</li><li>Same width, arcs from B.</li><li>Join the crossings.</li></ol></div>
        <div class="eg"><b>Angle bisector</b><ol><li>Arc from the vertex cutting both arms.</li><li>Equal arcs from those two points, crossing inside the angle.</li><li>Join the vertex to the crossing.</li></ol></div>
        <div class="eg"><b>60°</b>Arc from P cuts the line at Q; same width from Q gives R. Angle RPQ = 60°.</div>
        <div class="eg"><b>Perpendicular from a point on a line (90°)</b>Mark equal distances either side of the point, then draw the perpendicular bisector of those two marks.</div>` },
      { h: 'Constructing quadrilaterals', html: `
        <p>Use the properties. For a rhombus with side 5 cm and angle 60°: draw one side, construct 60° at one end, mark 5 cm along it, then use the compass (5 cm) from the two free corners to find the last one.</p>
        <p class="tip">Check your work with a protractor and ruler at the end. Small errors are fine; a whole degree or millimetre off is the limit.</p>` },
    ],
    demos: [
      { title: 'Step-by-step constructions', about: 'Pick one and step through it. Red arcs are compass marks.', run(el) {
        let k = 'perp', step = 0;
        const pic = svg(340, 240);
        const out = h('div', { class: 'readout' });
        const prev = G8.btn('Back', () => { if (step > 0) { step--; draw(); } }, 'ghost small');
        const next = G8.btn('Next step', () => { if (step < C[k].steps.length - 1) { step++; draw(); } }, 'small');
        function draw() {
          clear(pic);
          const st = C[k].steps;
          for (let i = 0; i <= step; i++) st[i][1](pic);
          if (st[step][2]) st[step][2](pic);
          out.innerHTML = `<b>Step ${step + 1} of ${st.length}.</b> ${st[step][0]}`;
          prev.disabled = step === 0; next.disabled = step === st.length - 1;
        }
        const sel = h('select', { class: 'field', 'aria-label': 'Choose a construction' }, Object.keys(C).map((key) => h('option', { value: key }, C[key].name)));
        sel.addEventListener('change', () => { k = sel.value; step = 0; draw(); });
        el.append(sel, pic, out, h('div', { class: 'row' }, prev, next));
        draw();
      } },
    ],
    gens: [
      () => mc('Which angle do you get by bisecting a 60° angle?', '30°', ['45°', '120°', '20°'], 'Bisect means halve: 60° ÷ 2 = 30°.'),
      () => mc('How do you construct a 45° angle?', 'Construct 90° and bisect it', ['Construct 60° and bisect it', 'Bisect 180° once', 'Measure it with a protractor'], '90° ÷ 2 = 45°.'),
      () => mc('Why does the 60° construction work?', 'It makes an equilateral triangle', ['It makes a right-angled triangle', 'A compass always draws 60°', 'It makes an isosceles triangle with a 30° angle'], 'PQ, PR and QR all equal the compass width, so the triangle is equilateral and each angle is 60°.'),
      () => mc('Every point on the perpendicular bisector of AB is…', 'the same distance from A and B', ['closer to A than to B', 'on the line AB', 'exactly 90 mm from A'], 'That is why the arcs from A and B (same width) cross on it.'),
      () => { const a = pick([30, 60, 90, 120]); const how = { 30: 'Construct 60° and bisect it', 60: 'Arc from P to Q, same arc from Q', 90: 'Perpendicular to a line', 120: 'Construct 60° twice next to each other' };
        return mc(`What is the best way to construct <b>${a}°</b>?`, how[a], Object.values(how).filter((x) => x !== how[a]), `${how[a]}.`); },
      () => { const ab = pick([6, 8, 10, 12]); return num(`You construct the perpendicular bisector of a line segment AB that is <b>${ab} cm</b> long. How far is the midpoint from A (in cm)?`, ab / 2, `The perpendicular bisector cuts AB in half: ${ab} ÷ 2 = ${ab / 2} cm.`); },
      () => mc('Which information is <b>not</b> enough to construct one exact triangle?', 'Three angles', ['Three sides', 'Two sides and the angle between them', 'Two angles and the side between them'], 'Three angles fix the shape but not the size, so many triangles fit.'),
      () => mc('When bisecting an angle, the two arcs from the arms must…', 'have the same radius', ['have different radii', 'be smaller than the first arc', 'touch the vertex'], 'Equal radii make the crossing point the same distance from both arms.'),
    ],
  });
})();
