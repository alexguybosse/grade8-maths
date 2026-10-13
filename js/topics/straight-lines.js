(function () {
  const { R, pick, fmt, num, mc, h, s, svg, slider, clear, seg } = G8;
  const deg = (v) => fmt(v) + '°';

  G8.topic({
    id: 'straight-lines', strand: 'space', title: 'Angles and straight lines',
    blurb: 'Angles on a line, around a point, vertically opposite, and angles made by parallel lines.',
    rules: [
      'Angles on a straight line add up to <b>180°</b> (they are supplementary).',
      'Angles around a point add up to <b>360°</b>.',
      'When two lines cross, <b>vertically opposite</b> angles are equal.',
      'Two angles that add up to 90° are <b>complementary</b>.',
      'Parallel lines cut by a transversal: <b>corresponding</b> angles are equal (an F shape).',
      'Parallel lines cut by a transversal: <b>alternate</b> angles are equal (a Z shape).',
      'Parallel lines cut by a transversal: <b>co-interior</b> angles add up to 180° (a C or U shape).',
      'Perpendicular lines meet at 90°. Angle types: acute (&lt; 90°), right (90°), obtuse (90°–180°), straight (180°), reflex (180°–360°), revolution (360°).',
    ],
    lesson: [
      { h: 'Angle pairs on lines', html: `
        <div class="eg"><b>Straight line</b>If one angle on a line is 128°, the angle next to it is 180° − 128° = <b>52°</b>.</div>
        <div class="eg"><b>Vertically opposite</b>Two lines cross and one angle is 40°. The angle opposite it is also <b>40°</b>, and the other two are each 140°.</div>
        <div class="eg"><b>Around a point</b>Three angles around a point are 100°, 145° and x. So x = 360° − 245° = <b>115°</b>.</div>` },
      { h: 'Parallel lines and a transversal', html: `
        <p>A transversal is a line that crosses two or more other lines. When those lines are parallel, eight angles appear, but there are only two different sizes.</p>
        <div class="eg"><b>Example</b>One angle is 70°. Its corresponding angle is 70°, its alternate angle is 70°, and its co-interior angle is 180° − 70° = <b>110°</b>.</div>
        <p class="tip">Give reasons in tests: write "corr ∠s, AB ∥ CD" or "alt ∠s, AB ∥ CD" or "co-int ∠s, AB ∥ CD".</p>
        <p>It works backwards too: if corresponding angles are equal, the lines must be parallel.</p>` },
      { h: 'Solving with algebra', html: `
        <div class="eg"><b>Example</b>Two co-interior angles are 3x and 2x + 30°. So 3x + 2x + 30° = 180° → 5x = 150° → <b>x = 30°</b>.</div>` },
    ],
    demos: [
      { title: 'Parallel line angles', about: 'Change the angle of the transversal and pick a pair type. Tap "Next pair" to see all of them.', run(el) {
        let th = 62, mode = 'corr', idx = 0;
        const pic = svg(340, 220);
        const out = h('div', { class: 'readout' });
        const P = { top: [170, 70], bot: [170, 160] };
        // positions: TL, TR, BL, BR -> [from, to] angles
        const span = (t) => ({ TR: [0, t], TL: [t, 180], BL: [180, 180 + t], BR: [180 + t, 360] });
        const val = (t) => ({ TR: t, TL: 180 - t, BL: t, BR: 180 - t });
        const names = { 1: ['top', 'TL'], 2: ['top', 'TR'], 3: ['top', 'BL'], 4: ['top', 'BR'], 5: ['bot', 'TL'], 6: ['bot', 'TR'], 7: ['bot', 'BL'], 8: ['bot', 'BR'] };
        const PAIRS = {
          corr: { name: 'Corresponding', rule: 'equal', list: [[1, 5], [2, 6], [3, 7], [4, 8]] },
          alt: { name: 'Alternate', rule: 'equal', list: [[3, 6], [4, 5]] },
          coint: { name: 'Co-interior', rule: 'add up to 180°', list: [[3, 5], [4, 6]] },
          vopp: { name: 'Vertically opposite', rule: 'equal', list: [[1, 4], [2, 3], [5, 8], [6, 7]] },
        };
        function arc(cx, cy, a1, a2, r, colour) {
          const p = (a) => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
          const [x1, y1] = p(a1), [x2, y2] = p(a2);
          pic.append(s('path', { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0 0 ${x2},${y2} Z`, fill: colour, 'fill-opacity': .35, stroke: colour, 'stroke-width': 2 }));
        }
        function draw() {
          clear(pic);
          const t = th, rad = t * Math.PI / 180;
          [P.top, P.bot].forEach((p) => pic.append(s('line', { x1: 10, y1: p[1], x2: 330, y2: p[1], stroke: 'currentColor', 'stroke-width': 2 })));
          // parallel arrows
          [P.top, P.bot].forEach((p) => pic.append(s('path', { d: `M300,${p[1] - 5} L308,${p[1]} L300,${p[1] + 5}`, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 })));
          const dx = Math.cos(rad), dy = Math.sin(rad);
          const midx = 170, midy = 115, L = 140;
          pic.append(s('line', { x1: midx - dx * L, y1: midy + dy * L, x2: midx + dx * L, y2: midy - dy * L, stroke: 'var(--s-space)', 'stroke-width': 2.5 }));
          // intersection x positions
          P.top = [midx + (midy - 70) / Math.tan(rad), 70];
          P.bot = [midx - (160 - midy) / Math.tan(rad), 160];
          const pair = PAIRS[mode].list[idx % PAIRS[mode].list.length];
          const sp = span(t), vv = val(t);
          pair.forEach((n, k) => { const [where, pos] = names[n]; arc(P[where][0], P[where][1], sp[pos][0], sp[pos][1], 24, k ? 'var(--red)' : 'var(--s-numbers)'); });
          for (let n = 1; n <= 8; n++) {
            const [where, pos] = names[n]; const mid = (sp[pos][0] + sp[pos][1]) / 2 * Math.PI / 180;
            pic.append(s('text', { x: P[where][0] + 38 * Math.cos(mid), y: P[where][1] - 38 * Math.sin(mid) + 4, 'text-anchor': 'middle', 'font-size': 12, fill: pair.includes(n) ? 'var(--ink)' : 'var(--pencil)', 'font-weight': pair.includes(n) ? 700 : 400 }, pair.includes(n) ? deg(vv[pos]) : n));
          }
          const [a, b] = pair.map((n) => vv[names[n][1]]);
          out.innerHTML = `<b>${PAIRS[mode].name} angles ${PAIRS[mode].rule}.</b><br>Angle ${pair[0]} = ${deg(a)} and angle ${pair[1]} = ${deg(b)}` + (mode === 'coint' ? `: ${deg(a)} + ${deg(b)} = 180°` : '');
        }
        el.append(seg([['corr', 'Corresponding'], ['alt', 'Alternate'], ['coint', 'Co-interior'], ['vopp', 'Vert. opp.']], mode, (v) => { mode = v; idx = 0; draw(); }), pic,
          h('div', { class: 'controls' }, slider('Transversal angle', 35, 145, 1, th, (v) => { th = v; draw(); }, deg).el),
          h('div', { class: 'row' }, G8.btn('Next pair', () => { idx++; draw(); }, 'ghost small')), out);
        draw();
      } },
    ],
    gens: [
      () => { const a = R(15, 165); return num(`Two angles lie next to each other on a straight line. One is <b>${deg(a)}</b>. What is the other?`, 180 - a, `Angles on a straight line add to 180°: 180° − ${deg(a)} = ${deg(180 - a)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const a = R(15, 165); return num(`Two straight lines cross. One of the angles is <b>${deg(a)}</b>. What is the angle vertically opposite it?`, a, 'Vertically opposite angles are equal.', { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const a = R(5, 85); return num(`What is the complement of <b>${deg(a)}</b>?`, 90 - a, `Complementary angles add to 90°: 90° − ${deg(a)} = ${deg(90 - a)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const a = R(60, 150), b = R(40, 140); const c = 360 - a - b; if (c < 20) return null;
        return num(`Three angles meet around a point: <b>${deg(a)}</b>, <b>${deg(b)}</b> and <b>x</b>. Find x.`, c, `Angles around a point add to 360°: 360° − ${deg(a)} − ${deg(b)} = ${deg(c)}.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const a = R(30, 150), t = pick(['corresponding', 'alternate', 'co-interior']); const ans = t === 'co-interior' ? 180 - a : a;
        return num(`Two parallel lines are cut by a transversal. One angle is <b>${deg(a)}</b>. What is its <b>${t}</b> angle?`, ans, t === 'co-interior' ? `Co-interior angles add to 180°: ${deg(180 - a)}.` : `${t[0].toUpperCase() + t.slice(1)} angles are equal when the lines are parallel.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const shapes = [['F', 'Corresponding'], ['Z', 'Alternate'], ['C (or U)', 'Co-interior']]; const [sh, nm] = pick(shapes);
        return mc(`On parallel lines, angles in a <b>${sh}</b> shape are called…`, nm, shapes.map((x) => x[1]).filter((x) => x !== nm).concat(['Vertically opposite']), `${nm} angles make a ${sh} shape.`); },
      () => { const a = R(5, 355); const type = a < 90 ? 'acute' : a === 90 ? 'right' : a < 180 ? 'obtuse' : a === 180 ? 'straight' : 'reflex';
        return mc(`What type of angle is <b>${deg(a)}</b>?`, type, ['acute', 'right', 'obtuse', 'reflex', 'straight'].filter((x) => x !== type), `Acute < 90° < obtuse < 180° < reflex < 360°.`); },
      () => { const x = R(10, 40), k = R(2, 4), b = 180 - (k + 1) * x; if (b < 0) return null;
        return num(`Two co-interior angles between parallel lines are <b>${k}x</b> and <b>x + ${b}°</b>. Find x.`, x, `${k}x + x + ${b} = 180 → ${k + 1}x = ${180 - b} → x = ${x}°.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const x = R(20, 70), k = R(2, 3); const c = k * x - x;
        return num(`Two alternate angles between parallel lines are <b>${k}x − ${c}°</b> and <b>x</b>. Find x.`, x, `Alternate angles are equal: ${k}x − ${c} = x → ${k - 1}x = ${c} → x = ${x}°.`, { inputmode: 'numeric', hint: 'degrees' }); },
    ],
  });
})();
