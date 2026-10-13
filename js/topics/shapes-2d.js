(function () {
  const { R, pick, fmt, round, num, mc, h, s, svg, clear, seg } = G8;
  const deg = (v) => fmt(v) + '°';

  const QUADS = {
    square: { name: 'Square', pts: [[90, 40], [250, 40], [250, 200], [90, 200]], props: ['All four sides equal', 'All four angles 90°', 'Both pairs of opposite sides parallel', 'Diagonals equal, bisect each other at 90°'] },
    rectangle: { name: 'Rectangle', pts: [[50, 60], [290, 60], [290, 180], [50, 180]], props: ['Opposite sides equal', 'All four angles 90°', 'Both pairs of opposite sides parallel', 'Diagonals equal and bisect each other'] },
    rhombus: { name: 'Rhombus', pts: [[170, 25], [270, 120], [170, 215], [70, 120]], props: ['All four sides equal', 'Opposite angles equal', 'Both pairs of opposite sides parallel', 'Diagonals bisect each other at 90° and bisect the angles'] },
    parallelogram: { name: 'Parallelogram', pts: [[100, 60], [300, 60], [240, 180], [40, 180]], props: ['Opposite sides equal', 'Opposite angles equal', 'Both pairs of opposite sides parallel', 'Diagonals bisect each other'] },
    trapezium: { name: 'Trapezium', pts: [[110, 60], [230, 60], [300, 180], [40, 180]], props: ['One pair of opposite sides parallel', 'Angles between the parallel sides are co-interior (add to 180°)'] },
    kite: { name: 'Kite', pts: [[170, 30], [250, 100], [170, 220], [90, 100]], props: ['Two pairs of adjacent sides equal', 'One pair of opposite angles equal', 'Diagonals meet at 90°', 'The long diagonal bisects the short one and bisects two angles'] },
  };

  G8.topic({
    id: 'shapes-2d', strand: 'space', title: 'Triangles and quadrilaterals',
    blurb: 'Classify triangles and quadrilaterals, use their angle facts, and spot congruent and similar shapes.',
    rules: [
      'The interior angles of a triangle add up to <b>180°</b>.',
      'An exterior angle of a triangle equals the <b>sum of the two opposite interior angles</b>.',
      'Isosceles triangle: two equal sides, and the angles opposite them are equal. Equilateral: all sides equal, all angles 60°.',
      'By sides: scalene, isosceles, equilateral. By angles: acute-angled, right-angled, obtuse-angled.',
      'The interior angles of a quadrilateral add up to <b>360°</b>.',
      'Know the properties of the square, rectangle, rhombus, parallelogram, trapezium and kite (sides, angles, diagonals).',
      '<b>Congruent</b> (≡) shapes are identical: same shape and same size. Triangles are congruent if <b>SSS, SAS, AAS or RHS</b> match.',
      '<b>Similar</b> (|||) shapes have equal angles and proportional sides: one is an enlargement of the other.',
    ],
    lesson: [
      { h: 'Triangles', html: `
        <div class="eg"><b>Example</b>Two angles of a triangle are 48° and 75°. Third angle = 180° − 48° − 75° = <b>57°</b>.</div>
        <div class="eg"><b>Isosceles</b>The angle between the equal sides is 40°. The two base angles are equal: (180° − 40°) ÷ 2 = <b>70°</b> each.</div>
        <div class="eg"><b>Exterior angle</b>Interior angles 50° and 65° are opposite an exterior angle. Exterior angle = 50° + 65° = <b>115°</b>.</div>
        <p class="tip">Triangle inequality: the two shorter sides must add up to more than the longest side, or the triangle won't close. 3, 4 and 8 can't make a triangle.</p>` },
      { h: 'Quadrilaterals', html: `
        <p>A quadrilateral has four sides. Split it with a diagonal and you get two triangles, which is why the angles add up to 2 × 180° = 360°.</p>
        <p>They are a family: a square is a special rectangle <i>and</i> a special rhombus. Every rectangle, rhombus and square is a parallelogram.</p>
        <div class="eg"><b>Example</b>A parallelogram has one angle of 70°. The opposite angle is 70°, and the other two are 180° − 70° = <b>110°</b> each.</div>` },
      { h: 'Congruent and similar', html: `
        <table><tr><th>Condition</th><th>What matches</th></tr>
        <tr><td>SSS</td><td>three sides</td></tr><tr><td>SAS</td><td>two sides and the angle between them</td></tr>
        <tr><td>AAS</td><td>two angles and a side in the same position</td></tr><tr><td>RHS</td><td>right angle, hypotenuse and one side</td></tr></table>
        <p>AAA is <b>not</b> enough for congruence: two triangles with the same angles can be different sizes. That makes them <b>similar</b>.</p>
        <div class="eg"><b>Similar triangles</b>△ABC ||| △DEF with AB = 4, DE = 10, so the scale factor is 10 ÷ 4 = 2,5. If BC = 6, then EF = 6 × 2,5 = <b>15</b>.</div>` },
    ],
    demos: [
      { title: 'Drag the triangle', about: 'Drag any corner. The angles change, but they always add to 180°.', run(el) {
        const pts = [[60, 200], [290, 210], [170, 40]];
        const pic = svg(340, 250);
        const out = h('div', { class: 'readout' });
        const ang = (a, b, c) => { const v1 = [b[0] - a[0], b[1] - a[1]], v2 = [c[0] - a[0], c[1] - a[1]]; return Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / (Math.hypot(...v1) * Math.hypot(...v2))) * 180 / Math.PI; };
        let drag = -1;
        function draw() {
          clear(pic);
          pic.append(s('polygon', { points: pts.map((p) => p.join(',')).join(' '), fill: 'var(--s-space)', 'fill-opacity': .15, stroke: 'currentColor', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
          const A = [0, 1, 2].map((i) => ang(pts[i], pts[(i + 1) % 3], pts[(i + 2) % 3]));
          const r = A.map((a) => Math.round(a));
          const diff = 180 - r.reduce((x, y) => x + y, 0); r[r.indexOf(Math.max(...r))] += diff; // show whole numbers that still add to 180
          const cols = ['var(--s-numbers)', 'var(--red)', 'var(--s-algebra)'];
          pts.forEach((p, i) => {
            const q1 = pts[(i + 1) % 3], q2 = pts[(i + 2) % 3];
            const mx = (q1[0] + q2[0]) / 2, my = (q1[1] + q2[1]) / 2; const d = Math.hypot(mx - p[0], my - p[1]);
            pic.append(s('text', { x: p[0] + (mx - p[0]) / d * 34, y: p[1] + (my - p[1]) / d * 34 + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: cols[i] }, r[i] + '°'));
            const c = s('circle', { cx: p[0], cy: p[1], r: 13, fill: cols[i], 'fill-opacity': .9, stroke: 'var(--card)', 'stroke-width': 3, style: 'cursor:grab' });
            c.addEventListener('pointerdown', (e) => { drag = i; pic.setPointerCapture(e.pointerId); e.preventDefault(); });
            pic.append(c);
          });
          const sides = [0, 1, 2].map((i) => Math.hypot(pts[i][0] - pts[(i + 1) % 3][0], pts[i][1] - pts[(i + 1) % 3][1]));
          const eq = (a, b) => Math.abs(a - b) < 6;
          const bySide = eq(sides[0], sides[1]) && eq(sides[1], sides[2]) ? 'equilateral' : eq(sides[0], sides[1]) || eq(sides[1], sides[2]) || eq(sides[0], sides[2]) ? 'isosceles' : 'scalene';
          const mx = Math.max(...r); const byAng = mx === 90 ? 'right-angled' : mx > 90 ? 'obtuse-angled' : 'acute-angled';
          out.innerHTML = `<span style="color:var(--s-numbers)">${r[0]}°</span> + <span style="color:var(--red)">${r[1]}°</span> + <span style="color:var(--s-algebra)">${r[2]}°</span> = <b>180°</b><br>This triangle is <b>${bySide}</b> and <b>${byAng}</b>.`;
        }
        pic.addEventListener('pointermove', (e) => {
          if (drag < 0) return;
          const b = pic.getBoundingClientRect(), k = 340 / b.width;
          pts[drag] = [Math.max(14, Math.min(326, (e.clientX - b.left) * k)), Math.max(14, Math.min(236, (e.clientY - b.top) * k))];
          draw();
        });
        const stop = () => (drag = -1);
        pic.addEventListener('pointerup', stop); pic.addEventListener('pointercancel', stop);
        el.append(pic, out);
        draw();
      } },
      { title: 'Quadrilateral family', about: 'Pick a shape to see its properties.', run(el) {
        let k = 'parallelogram';
        const pic = svg(340, 240);
        const out = h('div', { class: 'readout' });
        function draw() {
          clear(pic);
          const q = QUADS[k];
          pic.append(s('line', { x1: q.pts[0][0], y1: q.pts[0][1], x2: q.pts[2][0], y2: q.pts[2][1], stroke: 'var(--pencil)', 'stroke-dasharray': '5 4' }));
          pic.append(s('line', { x1: q.pts[1][0], y1: q.pts[1][1], x2: q.pts[3][0], y2: q.pts[3][1], stroke: 'var(--pencil)', 'stroke-dasharray': '5 4' }));
          pic.append(s('polygon', { points: q.pts.map((p) => p.join(',')).join(' '), fill: 'var(--s-space)', 'fill-opacity': .18, stroke: 'currentColor', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
          out.innerHTML = `<b>${q.name}</b><ul style="margin:4px 0;padding-left:20px">${q.props.map((p) => `<li>${p}</li>`).join('')}</ul><span class="small muted">Dashed lines are the diagonals.</span>`;
        }
        const sel = h('select', { class: 'field', 'aria-label': 'Choose a quadrilateral' }, Object.keys(QUADS).map((key) => h('option', { value: key }, QUADS[key].name)));
        sel.value = k; sel.addEventListener('change', () => { k = sel.value; draw(); });
        el.append(sel, pic, out);
        draw();
      } },
    ],
    gens: [
      () => { const a = R(20, 100), b = R(20, 150 - a); return num(`Two angles of a triangle are <b>${deg(a)}</b> and <b>${deg(b)}</b>. Find the third angle.`, 180 - a - b, `180° − ${deg(a)} − ${deg(b)} = ${deg(180 - a - b)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const a = R(25, 85), b = R(25, 85); return num(`An exterior angle of a triangle is opposite interior angles of <b>${deg(a)}</b> and <b>${deg(b)}</b>. How big is the exterior angle?`, a + b, `Exterior angle = sum of the opposite interior angles: ${deg(a)} + ${deg(b)} = ${deg(a + b)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const top = 2 * R(10, 70); return num(`An isosceles triangle has an angle of <b>${deg(top)}</b> between its two equal sides. How big is each base angle?`, (180 - top) / 2, `(180° − ${deg(top)}) ÷ 2 = ${deg((180 - top) / 2)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const b = R(30, 85); return num(`An isosceles triangle has two base angles of <b>${deg(b)}</b>. Find the third angle.`, 180 - 2 * b, `180° − 2 × ${deg(b)} = ${deg(180 - 2 * b)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const a = R(60, 120), b = R(60, 120), c = R(50, 120); const d = 360 - a - b - c; if (d < 30 || d > 200) return null;
        return num(`Three angles of a quadrilateral are <b>${deg(a)}</b>, <b>${deg(b)}</b> and <b>${deg(c)}</b>. Find the fourth.`, d, `Quadrilateral angles add to 360°: 360° − ${deg(a + b + c)} = ${deg(d)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const a = R(50, 130); if (a === 90) return null; return num(`One angle of a parallelogram is <b>${deg(a)}</b>. What is the size of the angle next to it?`, 180 - a, `Neighbouring angles in a parallelogram are co-interior: 180° − ${deg(a)} = ${deg(180 - a)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const facts = [
          ['has all sides equal but its angles are not 90°', 'rhombus'], ['has exactly one pair of parallel sides', 'trapezium'], ['has two pairs of equal adjacent sides', 'kite'],
          ['has equal diagonals and four right angles, but its sides are not all equal', 'rectangle'], ['has opposite sides parallel and equal, with no right angles and sides not all equal', 'parallelogram'], ['has four equal sides and four right angles', 'square']];
        const [f, ans] = pick(facts);
        return mc(`Which quadrilateral ${f}?`, ans, Object.keys(QUADS).filter((x) => x !== ans), `That describes a ${ans}.`); },
      () => { const c = pick([['three pairs of equal sides', 'SSS'], ['two equal sides and the equal angle between them', 'SAS'], ['two equal angles and an equal side in the same position', 'AAS'], ['a right angle, equal hypotenuses and one other equal side', 'RHS']]);
        return mc(`Two triangles have <b>${c[0]}</b>. Which condition proves they are congruent?`, c[1], ['SSS', 'SAS', 'AAS', 'RHS', 'AAA'].filter((x) => x !== c[1]), `${c[1]}: ${c[0]}.`); },
      () => { const k = pick([1.5, 2, 2.5, 3, 4]), ab = R(2, 9), bc = R(2, 9);
        return num(`△ABC ||| △PQR. AB = <b>${ab}</b>, BC = <b>${bc}</b> and PQ = <b>${fmt(ab * k)}</b>. Find QR.`, round(bc * k, 4), `Scale factor = ${fmt(ab * k)} ÷ ${ab} = ${fmt(k)}. QR = ${bc} × ${fmt(k)} = ${fmt(round(bc * k, 4))}.`); },
      () => { const a = R(2, 9), b = R(2, 9), long = pick([true, false]); const c = long ? a + b + R(1, 4) : Math.max(a, b) + R(1, Math.min(a, b) - 1 || 1);
        const ok = a + b > c && a + c > b && b + c > a;
        return mc(`Can sides of <b>${a} cm, ${b} cm and ${c} cm</b> make a triangle?`, ok ? 'Yes' : 'No', [ok ? 'No' : 'Yes'], ok ? 'The two shorter sides add up to more than the longest, so yes.' : `The two shorter sides don't reach past the longest side (${Math.min(a, b, c) + (a + b + c - Math.min(a, b, c) - Math.max(a, b, c))} is not more than ${Math.max(a, b, c)}).`); },
      () => mc('Every square is also a…', pick(['rectangle', 'rhombus', 'parallelogram']), ['trapezium only', 'kite only', 'triangle'], 'A square has all the properties of a rectangle, a rhombus and a parallelogram.'),
    ],
  });
})();
