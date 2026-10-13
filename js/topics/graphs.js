(function () {
  const { R, nz, pick, fmt, br, expr, num, mc, h, s, svg, slider, clear, seg } = G8;
  const lin = (m, c) => 'y = ' + expr([[m, 'x'], [c, '']]);

  /* small grid with optional points / line, returned as an SVG string for questions */
  function gridSVG({ pts = [], line = null, size = 200 } = {}) {
    const u = size / 12, o = size / 2;
    let g = `<svg viewBox="0 0 ${size} ${size}" style="width:${size}px;max-width:100%;display:block;margin:8px 0">`;
    for (let k = -5; k <= 5; k++) {
      g += `<line x1="${o + k * u}" y1="${u}" x2="${o + k * u}" y2="${size - u}" stroke="currentColor" stroke-opacity=".15"/>`;
      g += `<line x1="${u}" y1="${o + k * u}" x2="${size - u}" y2="${o + k * u}" stroke="currentColor" stroke-opacity=".15"/>`;
    }
    g += `<line x1="${u / 2}" y1="${o}" x2="${size - u / 2}" y2="${o}" stroke="currentColor"/><line x1="${o}" y1="${u / 2}" x2="${o}" y2="${size - u / 2}" stroke="currentColor"/>`;
    g += `<text x="${size - u / 2}" y="${o - 4}" font-size="11" text-anchor="end" fill="currentColor">x</text><text x="${o + 5}" y="${u}" font-size="11" fill="currentColor">y</text>`;
    for (let k = -5; k <= 5; k += 5) if (k) { g += `<text x="${o + k * u}" y="${o + 13}" font-size="9" text-anchor="middle" fill="currentColor">${k}</text><text x="${o - 4}" y="${o - k * u + 3}" font-size="9" text-anchor="end" fill="currentColor">${k}</text>`; }
    if (line) { const [m, c] = line; const x1 = -5.5, x2 = 5.5; g += `<line x1="${o + x1 * u}" y1="${o - (m * x1 + c) * u}" x2="${o + x2 * u}" y2="${o - (m * x2 + c) * u}" stroke="var(--red)" stroke-width="2.5"/>`; }
    pts.forEach(([x, y, lab]) => { g += `<circle cx="${o + x * u}" cy="${o - y * u}" r="4.5" fill="var(--red)"/>` + (lab ? `<text x="${o + x * u + 6}" y="${o - y * u - 6}" font-size="12" font-weight="700" fill="currentColor">${lab}</text>` : ''); });
    return g + '</svg>';
  }

  G8.topic({
    id: 'graphs', strand: 'algebra', title: 'Graphs',
    blurb: 'Plot points on the Cartesian plane, draw straight-line graphs, and read stories from graphs.',
    rules: [
      'A point is written <span class="m">(x ; y)</span>. x is across (left/right), y is up/down. Always x first.',
      'The origin is (0 ; 0). The axes split the plane into four quadrants, numbered anticlockwise from the top right.',
      'To draw <span class="m">y = mx + c</span>: make a table of values, plot the points, join them with a straight line.',
      'In <span class="m">y = mx + c</span>, <b>c</b> is where the line cuts the y-axis (the y-intercept). <b>m</b> says how steep it is and which way it slopes: positive goes up to the right, negative goes down.',
      'A point lies on a graph if its coordinates make the equation true.',
      'Global graphs tell a story: <b>increasing</b> (going up), <b>decreasing</b> (going down), <b>constant</b> (flat), with <b>maximum</b> and <b>minimum</b> points.',
      '<b>Linear</b> means a straight line; <b>non-linear</b> means curved. <b>Continuous</b> means joined; <b>discrete</b> means separate points (e.g. number of people).',
    ],
    lesson: [
      { h: 'The Cartesian plane', html: `
        <p>To plot (3 ; −2): start at the origin, go 3 right, then 2 down.</p>
        ${gridSVG({ pts: [[3, -2, '(3 ; −2)'], [-4, 1, '(−4 ; 1)']] })}
        <table><tr><th>Quadrant</th><td>1st</td><td>2nd</td><td>3rd</td><td>4th</td></tr><tr><th>Signs (x ; y)</th><td>(+ ; +)</td><td>(− ; +)</td><td>(− ; −)</td><td>(+ ; −)</td></tr></table>` },
      { h: 'Drawing a straight-line graph', html: `
        <div class="eg"><b>Example</b>Draw y = 2x − 1.
          <table><tr><th>x</th><td>−1</td><td>0</td><td>1</td><td>2</td></tr><tr><th>y</th><td>−3</td><td>−1</td><td>1</td><td>3</td></tr></table>
          Plot the points and join them.${gridSVG({ line: [2, -1], pts: [[-1, -3], [0, -1], [1, 1], [2, 3]] })}
          The line cuts the y-axis at −1 (that's c). Every step right, it goes up 2 (that's m).</div>
        <div class="eg"><b>Is (4 ; 7) on y = 2x − 1?</b>2(4) − 1 = 7 ✓ Yes.</div>
        <p class="tip">Horizontal lines look like <b>y = 3</b>. Vertical lines look like <b>x = −2</b>.</p>` },
      { h: 'Reading global graphs', html: `
        <p>A global graph shows the shape of a situation without exact numbers.</p>
        <div class="eg"><b>Example</b>A bath fills up (increasing), you sit in it for a while (constant), then you pull the plug (decreasing). The highest point is the maximum.</div>
        <p>Watch what's on each axis. On a distance-from-home graph, a flat part means standing still, not "travelling at constant speed".</p>` },
    ],
    demos: [
      { title: 'Line explorer', about: 'Change m and c. Watch the line turn and slide.', run(el) {
        let m = 1, c = 2;
        const pic = svg(300, 300);
        pic.style.maxWidth = '380px'; pic.style.margin = '0 auto';
        const out = h('div', { class: 'readout' });
        const u = 25, o = 150;
        function draw() {
          clear(pic);
          for (let k = -5; k <= 5; k++) {
            pic.append(s('line', { x1: o + k * u, y1: 25, x2: o + k * u, y2: 275, stroke: 'currentColor', 'stroke-opacity': .13 }));
            pic.append(s('line', { x1: 25, y1: o + k * u, x2: 275, y2: o + k * u, stroke: 'currentColor', 'stroke-opacity': .13 }));
            if (k) { pic.append(s('text', { x: o + k * u, y: o + 14, 'text-anchor': 'middle', 'font-size': 10 }, k)); pic.append(s('text', { x: o - 5, y: o - k * u + 4, 'text-anchor': 'end', 'font-size': 10 }, k)); }
          }
          pic.append(s('line', { x1: 15, y1: o, x2: 285, y2: o, stroke: 'currentColor', 'stroke-width': 1.5 }));
          pic.append(s('line', { x1: o, y1: 15, x2: o, y2: 285, stroke: 'currentColor', 'stroke-width': 1.5 }));
          const X = (x) => o + x * u, Y = (y) => o - y * u;
          const cp = s('clipPath', { id: 'gclip' }); cp.append(s('rect', { x: 25, y: 25, width: 250, height: 250 })); pic.append(cp);
          pic.append(s('line', { x1: X(-6), y1: Y(m * -6 + c), x2: X(6), y2: Y(m * 6 + c), stroke: 'var(--red)', 'stroke-width': 3, 'clip-path': 'url(#gclip)' }));
          for (let x = -5; x <= 5; x++) { const y = m * x + c; if (Math.abs(y) <= 5) pic.append(s('circle', { cx: X(x), cy: Y(y), r: 3.5, fill: 'var(--s-algebra)' })); }
          if (Math.abs(c) <= 5) pic.append(s('circle', { cx: X(0), cy: Y(c), r: 7, fill: 'none', stroke: 'var(--s-algebra)', 'stroke-width': 2.5 }));
          out.innerHTML = `<b>${lin(m, c)}</b><br>Cuts the y-axis at <b>(0 ; ${fmt(c)})</b>. ` +
            (m > 0 ? `Goes <b>up</b> ${fmt(m)} for every 1 to the right.` : m < 0 ? `Goes <b>down</b> ${fmt(-m)} for every 1 to the right.` : 'm = 0, so the line is <b>flat</b> (horizontal).');
        }
        el.append(pic, h('div', { class: 'controls' },
          slider('m (steepness)', -4, 4, 0.5, m, (v) => { m = v; draw(); }).el,
          slider('c (y-intercept)', -5, 5, 1, c, (v) => { c = v; draw(); }).el), out);
        draw();
      } },
      { title: 'Read the story', about: 'Tap a part of the graph to see what is happening.', run(el) {
        const stories = {
          bath: { y: 'water in bath', segs: [[0, 0, 3, 4, 'Taps on: the water level is increasing.'], [3, 4, 7, 4, 'Taps off, sitting in the bath: constant. This is the maximum.'], [7, 4, 9, 0, 'Plug pulled: decreasing, faster than it filled.']] },
          walk: { y: 'distance from home', segs: [[0, 0, 3, 3, 'Walking away from home: distance increasing.'], [3, 3, 5, 3, 'Stopped at the shop: distance constant.'], [5, 3, 6, 5, 'Running further: steeper, so faster.'], [6, 5, 9, 0, 'Walking all the way home: decreasing.']] },
          plant: { y: 'height of plant', segs: [[0, 0, 3, 1, 'Seedling grows slowly.'], [3, 1, 6, 4, 'Growth speeds up: steeper.'], [6, 4, 9, 4.6, 'Growth slows down as the plant matures. Still increasing, just less.']] },
        };
        let st = 'bath', active = 0;
        const pic = svg(340, 190);
        const out = h('div', { class: 'readout' });
        function draw() {
          clear(pic);
          const X = (t) => 40 + t * 32, Y = (v) => 160 - v * 28;
          pic.append(s('line', { x1: 40, y1: 160, x2: 335, y2: 160, stroke: 'currentColor', 'stroke-width': 1.5 }));
          pic.append(s('line', { x1: 40, y1: 160, x2: 40, y2: 10, stroke: 'currentColor', 'stroke-width': 1.5 }));
          pic.append(s('text', { x: 335, y: 178, 'text-anchor': 'end', 'font-size': 12 }, 'time'));
          const yl = s('text', { x: 14, y: 150, 'font-size': 12, transform: 'rotate(-90 14 150)' }, stories[st].y); pic.append(yl);
          stories[st].segs.forEach((sg, i) => {
            const on = i === active;
            const l = s('line', { x1: X(sg[0]), y1: Y(sg[1]), x2: X(sg[2]), y2: Y(sg[3]), stroke: on ? 'var(--red)' : 'var(--ink)', 'stroke-width': on ? 5 : 3, 'stroke-linecap': 'round', style: 'cursor:pointer' });
            const hit = s('line', { x1: X(sg[0]), y1: Y(sg[1]), x2: X(sg[2]), y2: Y(sg[3]), stroke: 'transparent', 'stroke-width': 26, style: 'cursor:pointer' });
            hit.addEventListener('click', () => { active = i; draw(); });
            pic.append(l, hit);
          });
          out.innerHTML = stories[st].segs[active][4];
        }
        const sg = seg([['bath', 'Bath'], ['walk', 'Walk'], ['plant', 'Plant']], st, (v) => { st = v; active = 0; draw(); });
        el.append(sg, pic, out);
        draw();
      } },
    ],
    gens: [
      () => { const x = nz(-5, 5), y = nz(-5, 5); const right = `(${fmt(x)} ; ${fmt(y)})`;
        return mc(`What are the coordinates of point A?${gridSVG({ pts: [[x, y, 'A']] })}`, right, [`(${fmt(y)} ; ${fmt(x)})`, `(${fmt(-x)} ; ${fmt(y)})`, `(${fmt(x)} ; ${fmt(-y)})`], `Go across first: x = ${fmt(x)}. Then up/down: y = ${fmt(y)}. So A${right}.`); },
      () => { const x = nz(-9, 9), y = nz(-9, 9); const q = x > 0 ? (y > 0 ? '1st' : '4th') : (y > 0 ? '2nd' : '3rd');
        return mc(`In which quadrant is the point <b>(${fmt(x)} ; ${fmt(y)})</b>?`, q, ['1st', '2nd', '3rd', '4th'].filter((z) => z !== q), `x is ${x > 0 ? 'positive' : 'negative'} and y is ${y > 0 ? 'positive' : 'negative'}: ${q} quadrant.`); },
      () => { const m = nz(-4, 4), c = nz(-6, 6); return num(`Where does <b>${lin(m, c)}</b> cut the <b>y-axis</b>? Give the y-value.`, c, `At the y-axis x = 0, so y = ${fmt(c)}. That's the c in y = mx + c.`); },
      () => { const m = nz(-4, 4), c = R(-5, 5), x = R(-4, 4); return num(`For <b>${lin(m, c)}</b>, find y when x = <b>${fmt(x)}</b>.`, m * x + c, `y = ${fmt(m)}(${fmt(x)}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${fmt(m * x + c)}.`); },
      () => { const m = nz(-3, 3), c = R(-4, 4), x = R(-3, 3); const on = pick([true, false]); const y = m * x + c + (on ? 0 : nz(-2, 2));
        return mc(`Does the point <b>(${fmt(x)} ; ${fmt(y)})</b> lie on <b>${lin(m, c)}</b>?`, on ? 'Yes' : 'No', [on ? 'No' : 'Yes'], `Substitute x = ${fmt(x)}: y = ${fmt(m * x + c)}. ${on ? 'That matches, so yes.' : `That's not ${fmt(y)}, so no.`}`); },
      () => { const m = nz(-3, 3), c = R(-3, 3);
        return mc(`Which equation matches this line?${gridSVG({ line: [m, c] })}`, lin(m, c), [lin(-m, c), lin(m, -c === c ? c + 1 : -c), lin(c === 0 ? m + 1 : c, m)], `It cuts the y-axis at ${fmt(c)} (so c = ${fmt(c)}) and ${m > 0 ? 'goes up' : 'goes down'} ${Math.abs(m)} for every 1 right (so m = ${fmt(m)}).`); },
      () => { const opts = [['Going down', 'decreasing'], ['Going up', 'increasing'], ['Flat', 'constant']]; const [shape, word] = pick(opts);
        return mc(`A part of a graph is <b>${shape.toLowerCase()}</b> from left to right. How do we describe it?`, word, opts.map((o) => o[1]).filter((w) => w !== word).concat(['maximum']), `${shape} means ${word}.`); },
      () => { const pairs = [['the number of learners in each class', 'discrete'], ['the temperature during a day', 'continuous'], ['the height of a growing child', 'continuous'], ['the number of cars sold each month', 'discrete'], ['the water level in a dam', 'continuous'], ['the number of goals scored per match', 'discrete']];
        const [what, ans] = pick(pairs); return mc(`A graph shows <b>${what}</b>. Should its points be joined (continuous) or separate (discrete)?`, ans, [ans === 'discrete' ? 'continuous' : 'discrete'], ans === 'discrete' ? 'You can only count whole ones, so the values are separate: discrete.' : 'It changes smoothly through every value in between: continuous.'); },
      () => { const c = R(-4, 4); const which = pick(['h', 'v']);
        return which === 'h' ? mc(`Which equation is a <b>horizontal</b> line through (0 ; ${fmt(c)})?`, `y = ${fmt(c)}`, [`x = ${fmt(c)}`, `y = ${fmt(c)}x`, `y = x + ${fmt(c)}`], 'Every point on a horizontal line has the same y-value.')
          : mc(`Which equation is a <b>vertical</b> line through (${fmt(c)} ; 0)?`, `x = ${fmt(c)}`, [`y = ${fmt(c)}`, `y = ${fmt(c)}x`, `x = ${fmt(c)}y`], 'Every point on a vertical line has the same x-value.'); },
    ],
  });
  G8.gridSVG = gridSVG;
})();
