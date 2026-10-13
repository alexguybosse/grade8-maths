(function () {
  const { R, pick, fmt, round, num, mc, h, s, svg, slider, clear } = G8;
  const PI = 3.14;
  const piTol = (a) => Math.abs(a) * 0.0006 + 0.011;

  G8.topic({
    id: 'area-perimeter', strand: 'measure', title: 'Area and perimeter',
    blurb: 'Perimeter and area of squares, rectangles, triangles and circles, plus unit conversions.',
    rules: [
      '<b>Perimeter</b> is the distance around the outside (cm, m). <b>Area</b> is the space inside (cm², m²).',
      'Square: <span class="m">P = 4s</span>, <span class="m">A = s<sup>2</sup></span>. Rectangle: <span class="m">P = 2(l + b)</span>, <span class="m">A = l × b</span>.',
      'Triangle: <span class="m">A = ½ × base × height</span>. The height is perpendicular to the base.',
      'Circle: circumference <span class="m">C = 2πr = πd</span>, area <span class="m">A = πr<sup>2</sup></span>. Use π ≈ 3,14 (or the π key).',
      'The diameter is twice the radius: <span class="m">d = 2r</span>.',
      'Area units: <span class="m">1 cm<sup>2</sup> = 100 mm<sup>2</sup></span>, <span class="m">1 m<sup>2</sup> = 10 000 cm<sup>2</sup></span>, <span class="m">1 km<sup>2</sup> = 1 000 000 m<sup>2</sup></span>.',
      'For odd shapes, split them into rectangles and triangles, then add (or subtract) the areas.',
    ],
    lesson: [
      { h: 'Rectangles, squares and triangles', html: `
        <div class="eg"><b>Rectangle</b>8 m by 5 m: P = 2(8 + 5) = <b>26 m</b>. A = 8 × 5 = <b>40 m<sup>2</sup></b>.</div>
        <div class="eg"><b>Triangle</b>Base 10 cm, height 7 cm: A = ½ × 10 × 7 = <b>35 cm<sup>2</sup></b>.</div>
        <p class="tip">A triangle is half of a rectangle with the same base and height. That's where the ½ comes from.</p>
        <div class="eg"><b>Working backwards</b>A rectangle has area 54 cm<sup>2</sup> and length 9 cm. Breadth = 54 ÷ 9 = <b>6 cm</b>.</div>` },
      { h: 'Circles', html: `
        <div class="eg"><b>Circumference</b>Radius 7 cm: C = 2 × 3,14 × 7 = <b>43,96 cm</b>.</div>
        <div class="eg"><b>Area</b>Radius 7 cm: A = 3,14 × 7<sup>2</sup> = 3,14 × 49 = <b>153,86 cm<sup>2</sup></b>.</div>
        <div class="eg"><b>Given the diameter</b>d = 10 m, so r = 5 m. A = 3,14 × 25 = <b>78,5 m<sup>2</sup></b>.</div>
        <p>π is the number you get when you divide any circle's circumference by its diameter. It's about 3,14159…</p>` },
      { h: 'Converting area units', html: `
        <p>1 cm = 10 mm, so a 1 cm square is 10 mm by 10 mm = <b>100 mm<sup>2</sup></b>. Square the length conversion.</p>
        <div class="eg"><b>Example</b>3,5 m<sup>2</sup> = 3,5 × 10 000 = <b>35 000 cm<sup>2</sup></b>. &nbsp; 450 mm<sup>2</sup> = 450 ÷ 100 = <b>4,5 cm<sup>2</sup></b>.</div>
        <p>When you double the sides of a shape, the area becomes 4 times bigger (2<sup>2</sup>).</p>` },
    ],
    demos: [
      { title: 'Shape builder', about: 'Pick a shape and drag the sliders. The formula updates as you go.', run(el) {
        let shape = 'rect', p1 = 6, p2 = 4;
        const pic = svg(340, 200);
        const out = h('div', { class: 'readout' });
        const ctr = h('div', { class: 'controls' });
        const u = 18;
        function draw() {
          clear(pic); clear(ctr);
          // grid
          for (let x = 0; x <= 340; x += u) pic.append(s('line', { x1: x, y1: 0, x2: x, y2: 200, stroke: 'currentColor', 'stroke-opacity': .08 }));
          for (let y = 0; y <= 200; y += u) pic.append(s('line', { x1: 0, y1: y, x2: 340, y2: y, stroke: 'currentColor', 'stroke-opacity': .08 }));
          const st = { fill: 'var(--s-measure)', 'fill-opacity': .25, stroke: 'var(--s-measure)', 'stroke-width': 2.5 };
          if (shape === 'rect') {
            const x0 = Math.round((170 - p1 * u / 2) / u) * u, y0 = Math.round((100 - p2 * u / 2) / u) * u;
            pic.append(s('rect', Object.assign({ x: x0, y: y0, width: p1 * u, height: p2 * u }, st)));
            pic.append(s('text', { x: 170, y: y0 - 6, 'text-anchor': 'middle', 'font-size': 13 }, `l = ${p1}`), s('text', { x: x0 - 6, y: 104, 'text-anchor': 'end', 'font-size': 13 }, `b = ${p2}`));
            out.innerHTML = `Area = l × b = ${p1} × ${p2} = <b>${p1 * p2} square units</b> (count them!)<br>Perimeter = 2(l + b) = 2(${p1} + ${p2}) = <b>${2 * (p1 + p2)} units</b>`;
            ctr.append(slider('Length l', 1, 16, 1, p1, (v) => { p1 = v; draw(); }).el, slider('Breadth b', 1, 9, 1, p2, (v) => { p2 = v; draw(); }).el);
          } else if (shape === 'tri') {
            const x0 = Math.round((170 - p1 * u / 2) / u) * u, yb = Math.round((100 + p2 * u / 2) / u) * u, apex = x0 + Math.round(p1 * 0.3) * u;
            pic.append(s('rect', { x: x0, y: yb - p2 * u, width: p1 * u, height: p2 * u, fill: 'none', stroke: 'var(--pencil)', 'stroke-dasharray': '4 4' }));
            pic.append(s('polygon', Object.assign({ points: `${x0},${yb} ${x0 + p1 * u},${yb} ${apex},${yb - p2 * u}` }, st)));
            pic.append(s('line', { x1: apex, y1: yb, x2: apex, y2: yb - p2 * u, stroke: 'var(--red)', 'stroke-width': 2, 'stroke-dasharray': '5 3' }));
            pic.append(s('text', { x: 170, y: yb + 16, 'text-anchor': 'middle', 'font-size': 13 }, `base = ${p1}`), s('text', { x: apex + 5, y: yb - p2 * u / 2, 'font-size': 13, fill: 'var(--red)' }, `h = ${p2}`));
            out.innerHTML = `Area = ½ × base × height = ½ × ${p1} × ${p2} = <b>${fmt(p1 * p2 / 2)} square units</b><br><span class="small muted">Exactly half of the dashed rectangle.</span>`;
            ctr.append(slider('Base', 1, 16, 1, p1, (v) => { p1 = v; draw(); }).el, slider('Height h', 1, 9, 1, p2, (v) => { p2 = v; draw(); }).el);
          } else {
            const r = Math.min(p1, 5);
            pic.append(s('circle', Object.assign({ cx: 162, cy: 108, r: r * u }, st)));
            pic.append(s('line', { x1: 162, y1: 108, x2: 162 + r * u, y2: 108, stroke: 'var(--red)', 'stroke-width': 2.5 }));
            pic.append(s('circle', { cx: 162, cy: 108, r: 3, fill: 'var(--ink)' }), s('text', { x: 162 + r * u / 2, y: 102, 'text-anchor': 'middle', 'font-size': 13, fill: 'var(--red)', 'font-weight': 700 }, `r = ${r}`));
            out.innerHTML = `Area = πr<sup>2</sup> = 3,14 × ${r}<sup>2</sup> = <b>${fmt(round(PI * r * r, 2))} square units</b><br>Circumference = 2πr = 2 × 3,14 × ${r} = <b>${fmt(round(2 * PI * r, 2))} units</b>`;
            ctr.append(slider('Radius r', 1, 5, 0.5, r, (v) => { p1 = v; draw(); }).el);
          }
        }
        el.append(G8.seg([['rect', 'Rectangle'], ['tri', 'Triangle'], ['circle', 'Circle']], shape, (v) => { shape = v; if (v === 'circle') p1 = 3; draw(); }), pic, ctr, out);
        draw();
      } },
    ],
    gens: [
      () => { const l = R(3, 25), b = R(2, 15); return num(`A rectangle is <b>${l} m</b> long and <b>${b} m</b> wide. What is its area (m²)?`, l * b, `A = l × b = ${l} × ${b} = ${l * b} m².`); },
      () => { const l = R(3, 25), b = R(2, 15); return num(`A rectangle is <b>${l} cm</b> by <b>${b} cm</b>. What is its perimeter (cm)?`, 2 * (l + b), `P = 2(${l} + ${b}) = ${2 * (l + b)} cm.`); },
      () => { const s1 = R(3, 20); const w = pick(['area', 'perimeter']); return num(`A square has sides of <b>${s1} cm</b>. What is its <b>${w}</b>?`, w === 'area' ? s1 * s1 : 4 * s1, w === 'area' ? `A = ${s1}² = ${s1 * s1} cm².` : `P = 4 × ${s1} = ${4 * s1} cm.`); },
      () => { const b = R(4, 20), ht = R(3, 15); return num(`A triangle has a base of <b>${b} cm</b> and a perpendicular height of <b>${ht} cm</b>. Find its area (cm²).`, b * ht / 2, `A = ½ × ${b} × ${ht} = ${fmt(b * ht / 2)} cm².`); },
      () => { const r = R(2, 15); const A = round(PI * r * r, 2); return num(`Find the area of a circle with radius <b>${r} cm</b>. Use π = 3,14. (cm²)`, A, `A = πr² = 3,14 × ${r}² = 3,14 × ${r * r} = ${fmt(A)} cm².`, { tol: piTol(A), show: fmt(A) + ' cm²' }); },
      () => { const d = 2 * R(2, 12); const C = round(PI * d, 2); return num(`Find the circumference of a circle with diameter <b>${d} m</b>. Use π = 3,14. (m)`, C, `C = πd = 3,14 × ${d} = ${fmt(C)} m.`, { tol: piTol(C), show: fmt(C) + ' m' }); },
      () => { const d = 2 * R(2, 10); const A = round(PI * (d / 2) ** 2, 2); return num(`A round table top has a <b>diameter of ${d} dm</b>. Find its area using π = 3,14. (dm²)`, A, `r = ${d} ÷ 2 = ${d / 2}. A = 3,14 × ${d / 2}² = ${fmt(A)} dm².`, { tol: piTol(A), show: fmt(A) + ' dm²' }); },
      () => { const v = R(2, 90) / 2; const dir = pick(['m2cm', 'cm2mm', 'mm2cm']);
        if (dir === 'm2cm') return num(`Convert <b>${fmt(v)} m²</b> to cm².`, v * 10000, `1 m² = 10 000 cm², so ${fmt(v)} × 10 000 = ${fmt(v * 10000)} cm².`);
        if (dir === 'cm2mm') return num(`Convert <b>${fmt(v)} cm²</b> to mm².`, v * 100, `1 cm² = 100 mm², so ${fmt(v)} × 100 = ${fmt(v * 100)} mm².`);
        return num(`Convert <b>${fmt(v * 100)} mm²</b> to cm².`, v, `Divide by 100: ${fmt(v)} cm².`); },
      () => { const b = R(3, 12), l = R(3, 15); return num(`A rectangle has an area of <b>${l * b} cm²</b> and a length of <b>${l} cm</b>. What is its breadth (cm)?`, b, `b = A ÷ l = ${l * b} ÷ ${l} = ${b} cm.`); },
      () => { const L = R(8, 14), B = R(6, 10), cl = R(2, 4), cb = R(2, 4);
        return num(`An L-shaped floor is a <b>${L} m × ${B} m</b> rectangle with a <b>${cl} m × ${cb} m</b> corner cut out. What is the floor area (m²)?`, L * B - cl * cb, `Big rectangle − cut-out = ${L * B} − ${cl * cb} = ${L * B - cl * cb} m².`); },
      () => { const k = pick([2, 3]); return mc(`If you make every side of a rectangle <b>${k} times</b> longer, its area becomes…`, `${k * k} times bigger`, [`${k} times bigger`, `${2 * k} times bigger`, 'the same'], `Both length and breadth × ${k}, so area × ${k} × ${k} = ${k * k}.`); },
    ],
  });
})();
