(function () {
  const { R, nz, pick, fmt, num, mc, h, s, svg, slider, clear, seg } = G8;
  const pt = (x, y) => `(${fmt(x)} ; ${fmt(y)})`;
  const MAPS = {
    tr: { name: 'Translate', f: (x, y, a, b) => [x + a, y + b], rule: (a, b) => `(x ; y) → (x ${a < 0 ? '−' : '+'} ${Math.abs(a)} ; y ${b < 0 ? '−' : '+'} ${Math.abs(b)})` },
    rx: { name: 'Reflect in x-axis', f: (x, y) => [x, -y], rule: () => '(x ; y) → (x ; −y)' },
    ry: { name: 'Reflect in y-axis', f: (x, y) => [-x, y], rule: () => '(x ; y) → (−x ; y)' },
    r90: { name: 'Rotate 90° anticlockwise', f: (x, y) => [-y, x], rule: () => '(x ; y) → (−y ; x)' },
    r90c: { name: 'Rotate 90° clockwise', f: (x, y) => [y, -x], rule: () => '(x ; y) → (y ; −x)' },
    r180: { name: 'Rotate 180°', f: (x, y) => [-x, -y], rule: () => '(x ; y) → (−x ; −y)' },
    en: { name: 'Enlarge', f: (x, y, a, b, k) => [x * k, y * k], rule: (a, b, k) => `(x ; y) → (${fmt(k)}x ; ${fmt(k)}y)` },
  };

  G8.topic({
    id: 'transformations', strand: 'space', title: 'Transformations',
    blurb: 'Slide, flip, turn and resize shapes on a grid, and describe each move with a rule.',
    rules: [
      '<b>Translation</b> (slide): <span class="m">(x ; y) → (x + a ; y + b)</span>. a moves right (+) or left (−); b moves up (+) or down (−).',
      '<b>Reflection</b> in the x-axis: <span class="m">(x ; y) → (x ; −y)</span>. In the y-axis: <span class="m">(x ; y) → (−x ; y)</span>.',
      '<b>Rotation</b> about the origin: 90° anticlockwise <span class="m">(x ; y) → (−y ; x)</span>, 90° clockwise <span class="m">(x ; y) → (y ; −x)</span>, 180° <span class="m">(x ; y) → (−x ; −y)</span>.',
      '<b>Enlargement</b> by scale factor k from the origin: <span class="m">(x ; y) → (kx ; ky)</span>. k &gt; 1 makes it bigger; 0 &lt; k &lt; 1 makes it smaller (a reduction).',
      'Translations, reflections and rotations keep size and shape: the image is <b>congruent</b>. An enlargement keeps the shape only: the image is <b>similar</b>.',
      'Enlarge by k: every length (and the perimeter) × k, but the area × k<sup>2</sup>.',
      'The image of point A is written A′ ("A dash").',
    ],
    lesson: [
      { h: 'The four transformations', html: `
        <div class="eg"><b>Translation</b>Move △ABC 3 right and 2 down. A(1 ; 4) → A′(4 ; 2).</div>
        <div class="eg"><b>Reflection</b>Reflect P(3 ; −5) in the y-axis: P′(−3 ; −5). The y-axis acts like a mirror, so x changes sign.</div>
        <div class="eg"><b>Rotation</b>Rotate Q(2 ; 5) through 90° anticlockwise about the origin: Q′(−5 ; 2).</div>
        <div class="eg"><b>Enlargement</b>Enlarge R(3 ; −1) by factor 2: R′(6 ; −2).</div>
        <p class="tip">Trace the shape on tracing paper (or imagine it) and physically turn it to check rotations.</p>` },
      { h: 'Enlargement, perimeter and area', html: `
        <div class="eg"><b>Example</b>A rectangle 3 cm by 2 cm is enlarged by factor 3.<br>New sides: 9 cm by 6 cm. Perimeter: 10 cm → 30 cm (× 3). Area: 6 cm<sup>2</sup> → 54 cm<sup>2</sup> (× 9 = 3<sup>2</sup>).</div>` },
    ],
    demos: [
      { title: 'Transform a flag', about: 'The faint flag is the original. Choose a transformation and watch where every corner goes.', run(el) {
        let mode = 'r90', a = 3, b = -2, k = 2;
        const shape = [[1, 1], [1, 4], [3, 3.5], [1, 3]];
        const pic = svg(320, 320);
        pic.style.maxWidth = '400px'; pic.style.margin = '0 auto';
        const out = h('div', { class: 'readout' });
        const u = 20, o = 160, X = (x) => o + x * u, Y = (y) => o - y * u;
        const sliders = h('div', { class: 'controls' });
        const sa = slider('Across (a)', -6, 6, 1, a, (v) => { a = v; draw(); });
        const sb = slider('Up/down (b)', -6, 6, 1, b, (v) => { b = v; draw(); });
        const sk = slider('Scale factor k', 0.5, 2, 0.5, k, (v) => { k = v; draw(); });
        function poly(ps, opts) { return s('polygon', Object.assign({ points: ps.map(([x, y]) => X(x) + ',' + Y(y)).join(' ') }, opts)); }
        function draw() {
          clear(pic);
          for (let i = -7; i <= 7; i++) {
            pic.append(s('line', { x1: X(i), y1: Y(-7.5), x2: X(i), y2: Y(7.5), stroke: 'currentColor', 'stroke-opacity': i ? .12 : .9, 'stroke-width': i ? 1 : 1.5 }));
            pic.append(s('line', { x1: X(-7.5), y1: Y(i), x2: X(7.5), y2: Y(i), stroke: 'currentColor', 'stroke-opacity': i ? .12 : .9, 'stroke-width': i ? 1 : 1.5 }));
          }
          const M = MAPS[mode];
          const img = shape.map(([x, y]) => M.f(x, y, a, b, k));
          pic.append(poly(shape, { fill: 'var(--s-space)', 'fill-opacity': .2, stroke: 'var(--s-space)', 'stroke-width': 2, 'stroke-dasharray': '4 3' }));
          pic.append(poly(img, { fill: 'var(--red)', 'fill-opacity': .3, stroke: 'var(--red)', 'stroke-width': 2.5 }));
          pic.append(s('text', { x: X(shape[1][0]) - 4, y: Y(shape[1][1]) - 6, 'font-size': 13, 'font-weight': 700, 'text-anchor': 'end' }, 'A'));
          pic.append(s('text', { x: X(img[1][0]) + 4, y: Y(img[1][1]) - 6, 'font-size': 13, 'font-weight': 700, fill: 'var(--red)' }, 'A′'));
          if (mode === 'r90' || mode === 'r90c' || mode === 'r180' || mode === 'en') pic.append(s('circle', { cx: X(0), cy: Y(0), r: 4, fill: 'var(--ink)' }));
          out.innerHTML = `<b>${M.name}</b>: ${M.rule(a, b, k)}<br>A${pt(...shape[1])} → A′${pt(...img[1])}` +
            (mode === 'en' ? `<br>Lengths × ${fmt(k)}, area × ${fmt(k * k)}. The image is ${k === 1 ? 'congruent' : 'similar'}.` : '<br>Same size and shape: the image is congruent.');
          clear(sliders);
          if (mode === 'tr') sliders.append(sa.el, sb.el);
          if (mode === 'en') sliders.append(sk.el);
        }
        const sel = h('select', { class: 'field', 'aria-label': 'Choose a transformation' }, Object.keys(MAPS).map((key) => h('option', { value: key }, MAPS[key].name)));
        sel.value = mode; sel.addEventListener('change', () => { mode = sel.value; draw(); });
        el.append(sel, pic, sliders, out);
        draw();
      } },
    ],
    gens: [
      () => { const x = nz(-6, 6), y = nz(-6, 6), key = pick(['rx', 'ry', 'r90', 'r90c', 'r180']); const M = MAPS[key]; const [X, Y] = M.f(x, y);
        const wrong = ['rx', 'ry', 'r90', 'r90c', 'r180'].filter((k) => k !== key).map((k) => pt(...MAPS[k].f(x, y)));
        return mc(`<b>${M.name}</b> the point <b>${pt(x, y)}</b>${key.startsWith('r') && key !== 'rx' && key !== 'ry' ? ' about the origin' : ''}. Where does it end up?`, pt(X, Y), wrong, `Rule: ${M.rule()}. So ${pt(x, y)} → ${pt(X, Y)}.`); },
      () => { const x = nz(-5, 5), y = nz(-5, 5), a = nz(-5, 5), b = nz(-5, 5);
        return mc(`Translate <b>${pt(x, y)}</b> ${Math.abs(a)} unit${Math.abs(a) === 1 ? '' : 's'} ${a > 0 ? 'right' : 'left'} and ${Math.abs(b)} unit${Math.abs(b) === 1 ? '' : 's'} ${b > 0 ? 'up' : 'down'}.`, pt(x + a, y + b), [pt(x + b, y + a), pt(x - a, y - b), pt(x + a, y - b)], `Add ${fmt(a)} to x and ${fmt(b)} to y: ${pt(x + a, y + b)}.`); },
      () => { const x = nz(-4, 4), y = nz(-4, 4), k = pick([2, 3, 0.5]);
        return mc(`Enlarge <b>${pt(x, y)}</b> by a scale factor of <b>${fmt(k)}</b> from the origin.`, pt(x * k, y * k), [pt(x + k, y + k), pt(x * k, y), pt(x / k === x * k ? x + 1 : x / k, y / k === y * k ? y + 1 : y / k)], `Multiply both coordinates by ${fmt(k)}: ${pt(x * k, y * k)}.`); },
      () => { const k = pick([2, 3, 4, 0.5]), A = pick([4, 6, 8, 10, 12, 20]); return num(`A shape with area <b>${A} cm²</b> is enlarged by a scale factor of <b>${fmt(k)}</b>. What is the new area (cm²)?`, A * k * k, `Area × k<sup>2</sup> = ${A} × ${fmt(k * k)} = ${fmt(A * k * k)} cm².`); },
      () => { const k = pick([2, 3, 5]), P = R(6, 30); return num(`A triangle with perimeter <b>${P} cm</b> is enlarged by factor <b>${k}</b>. What is the new perimeter (cm)?`, P * k, `Lengths × ${k}, so perimeter × ${k}: ${P * k} cm.`); },
      () => { const x = nz(-6, 6), y = nz(-6, 6), key = pick(['rx', 'ry', 'r180']); if (Math.abs(x) === Math.abs(y)) return null; const [X, Y] = MAPS[key].f(x, y);
        return mc(`<b>${pt(x, y)}</b> moves to <b>${pt(X, Y)}</b>. Which transformation is this?`, MAPS[key].name, ['rx', 'ry', 'r180', 'r90'].filter((k) => k !== key).map((k) => MAPS[k].name), `Rule: ${MAPS[key].rule()}.`); },
      () => mc('Which transformation can change the <b>size</b> of a shape?', 'Enlargement', ['Translation', 'Reflection', 'Rotation'], 'Only an enlargement (or reduction) changes size. The others give congruent images.'),
    ],
  });
})();
