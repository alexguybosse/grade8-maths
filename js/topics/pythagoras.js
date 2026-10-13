(function () {
  const { R, pick, fmt, round, num, mc, h, s, svg, slider, clear } = G8;
  const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [20, 21, 29], [9, 40, 41], [15, 20, 25]];

  G8.topic({
    id: 'pythagoras', strand: 'measure', title: 'Theorem of Pythagoras',
    blurb: 'Find a missing side of a right-angled triangle, and test whether a triangle is right-angled.',
    rules: [
      'Only for <b>right-angled</b> triangles.',
      'The <b>hypotenuse</b> is the longest side. It is opposite the right angle.',
      '<span class="m">hypotenuse<sup>2</sup> = (one side)<sup>2</sup> + (other side)<sup>2</sup></span>, or <span class="m">c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></span> when c is the hypotenuse.',
      'Finding the hypotenuse: square, <b>add</b>, square root.',
      'Finding a shorter side: square, <b>subtract</b>, square root.',
      'Converse: if the longest side squared equals the sum of the squares of the other two, the triangle <b>is</b> right-angled.',
      'Pythagorean triples are whole-number sets that work: 3, 4, 5 · 5, 12, 13 · 8, 15, 17 · 7, 24, 25 (and multiples like 6, 8, 10).',
    ],
    lesson: [
      { h: 'The theorem', html: `
        <p>Draw a square on each side of a right-angled triangle. The two small squares together have exactly the same area as the big square on the hypotenuse. The demo lets you see it.</p>
        <div class="eg"><b>Find the hypotenuse</b>Sides 6 cm and 8 cm. c<sup>2</sup> = 6<sup>2</sup> + 8<sup>2</sup> = 36 + 64 = 100, so c = √100 = <b>10 cm</b>.</div>
        <div class="eg"><b>Find a shorter side</b>Hypotenuse 13 m, one side 5 m. a<sup>2</sup> = 13<sup>2</sup> − 5<sup>2</sup> = 169 − 25 = 144, so a = <b>12 m</b>.</div>
        <div class="eg"><b>Not a whole number</b>Sides 4 and 7: c<sup>2</sup> = 16 + 49 = 65, so c = √65 ≈ <b>8,06</b> (2 decimal places).</div>` },
      { h: 'Is it right-angled?', html: `
        <div class="eg"><b>Example</b>Sides 9, 12 and 15. Longest is 15: 15<sup>2</sup> = 225. Others: 81 + 144 = 225. Equal, so <b>yes, right-angled</b>.</div>
        <div class="eg"><b>Example</b>Sides 5, 6 and 8: 8<sup>2</sup> = 64 but 25 + 36 = 61. <b>Not</b> right-angled.</div>` },
      { h: 'Word problems', html: `
        <p>Draw a sketch, find the right angle, and label the hypotenuse first.</p>
        <div class="eg"><b>Ladder</b>A 5 m ladder leans against a wall with its foot 1,4 m from the wall. How high up the wall does it reach?<br>h<sup>2</sup> = 5<sup>2</sup> − 1,4<sup>2</sup> = 25 − 1,96 = 23,04, so h = <b>4,8 m</b>.</div>
        <div class="eg"><b>TV screens</b>Screens are measured across the diagonal. A screen 48 cm wide and 36 cm high has a diagonal of √(48<sup>2</sup> + 36<sup>2</sup>) = √3 600 = <b>60 cm</b>.</div>` },
    ],
    demos: [
      { title: 'Squares on the sides', about: 'Change the two short sides. The two small areas always add up to the big one.', run(el) {
        let a = 3, b = 4;
        const pic = svg(340, 300);
        pic.style.maxWidth = '420px'; pic.style.maxHeight = '360px'; pic.style.margin = '0 auto';
        const out = h('div', { class: 'readout' });
        function draw() {
          clear(pic);
          const c = Math.hypot(a, b), k = 10;
          const C = [0, 0], A = [b * k, 0], B = [0, -a * k];
          const all = [];
          const squares = [];
          const sq = (p, q, col, lab, val) => {
            // square on segment p→q, built on the outside of the triangle
            const dx = q[0] - p[0], dy = q[1] - p[1];
            const r = [p[0] + dy, p[1] - dx], t = [q[0] + dy, q[1] - dx];
            all.push(p, q, r, t);
            squares.push([[p, q, t, r], col, lab, val]);
          };
          sq(C, B, 'var(--s-numbers)', a + '²', '= ' + fmt(a * a));
          sq(A, C, 'var(--s-algebra)', b + '²', '= ' + fmt(b * b));
          sq(B, A, 'var(--red)', 'c²', '= ' + fmt(round(c * c, 2)));
          const xs = all.map((z) => z[0]), ys = all.map((z) => z[1]);
          const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
          const W = maxX - minX, H = maxY - minY, pad = Math.max(W, H) * 0.04;
          pic.setAttribute('viewBox', `${minX - pad} ${minY - pad} ${W + 2 * pad} ${H + 2 * pad}`);
          const fs = Math.max(W, H) / 22, sw = Math.max(W, H) / 170;
          squares.forEach(([pts, col, lab, val]) => {
            pic.append(s('polygon', { points: pts.map((z) => z.join(',')).join(' '), fill: col, 'fill-opacity': .25, stroke: col, 'stroke-width': sw }));
            const cx = pts.reduce((t, z) => t + z[0], 0) / 4, cy = pts.reduce((t, z) => t + z[1], 0) / 4;
            pic.append(s('text', { x: cx, y: cy - fs * 0.15, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 700 }, lab));
            pic.append(s('text', { x: cx, y: cy + fs * 1.05, 'text-anchor': 'middle', 'font-size': fs * 0.9 }, val));
          });
          pic.append(s('polygon', { points: [C, A, B].map((z) => z.join(',')).join(' '), fill: 'var(--card)', stroke: 'currentColor', 'stroke-width': sw * 1.3 }));
          const m = Math.min(a, b) * k * 0.18;
          pic.append(s('rect', { x: C[0], y: C[1] - m, width: m, height: m, fill: 'none', stroke: 'currentColor', 'stroke-width': sw * 0.7 }));
          out.innerHTML = `${a}<sup>2</sup> + ${b}<sup>2</sup> = ${a * a} + ${b * b} = <b>${a * a + b * b}</b> = c<sup>2</sup><br>c = √${a * a + b * b} = <b>${Number.isInteger(c) ? c : fmt(round(c, 2)) + ' (2 d.p.)'}</b>`;
        }
        el.append(pic, h('div', { class: 'controls' },
          slider('Side a', 1, 12, 1, a, (v) => { a = v; draw(); }).el,
          slider('Side b', 1, 12, 1, b, (v) => { b = v; draw(); }).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const [a, b, c] = pick(TRIPLES); return num(`A right-angled triangle has short sides <b>${a} cm</b> and <b>${b} cm</b>. How long is the hypotenuse?`, c, `c<sup>2</sup> = ${a * a} + ${b * b} = ${c * c}, so c = ${c} cm.`); },
      () => { const [a, b, c] = pick(TRIPLES); const [k, other] = pick([[a, b], [b, a]]);
        return num(`The hypotenuse of a right-angled triangle is <b>${c} m</b> and one side is <b>${k} m</b>. Find the other side.`, other, `${c}<sup>2</sup> − ${k}<sup>2</sup> = ${c * c} − ${k * k} = ${other * other}. √${other * other} = ${other} m.`); },
      () => { const a = R(2, 12), b = R(2, 12); const c = round(Math.hypot(a, b), 2); if (Number.isInteger(Math.hypot(a, b))) return null;
        return num(`Short sides <b>${a}</b> and <b>${b}</b>. Find the hypotenuse, rounded to 2 decimal places.`, c, `c<sup>2</sup> = ${a * a} + ${b * b} = ${a * a + b * b}. c = √${a * a + b * b} ≈ ${fmt(c, 2)}.`, { tol: 0.011, show: fmt(c, 2) }); },
      () => { const right = pick([true, false]); let [a, b, c] = pick(TRIPLES); if (!right) c = c + pick([-1, 1]);
        const sides = G8.shuffle([a, b, c]); const L = Math.max(...sides);
        return mc(`Is a triangle with sides <b>${sides.join(', ')}</b> right-angled?`, right ? 'Yes' : 'No', [right ? 'No' : 'Yes'], `Longest side: ${L}<sup>2</sup> = ${L * L}. Other two: ${sides.filter((x) => x !== L).map((x) => x + '<sup>2</sup>').join(' + ')} = ${sides.reduce((t, x) => t + x * x, 0) - L * L}. ${right ? 'Equal, so yes.' : 'Not equal, so no.'}`); },
      () => { const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]]); const m = pick([1, 2]);
        return num(`A <b>${c * m} m</b> ladder leans against a wall. Its foot is <b>${a * m} m</b> from the wall. How high up the wall does it reach (m)?`, b * m, `h<sup>2</sup> = ${c * m}<sup>2</sup> − ${a * m}<sup>2</sup> = ${(c * m) ** 2 - (a * m) ** 2}, so h = ${b * m} m.`); },
      () => { const [a, b, c] = pick(TRIPLES); const k = pick([2, 3, 4]);
        return num(`A rectangular field is <b>${a * k} m</b> by <b>${b * k} m</b>. How long is its diagonal (m)?`, c * k, `d<sup>2</sup> = ${a * k}<sup>2</sup> + ${b * k}<sup>2</sup> = ${(c * k) ** 2}, so d = ${c * k} m.`); },
      () => mc('In a right-angled triangle, which side is the hypotenuse?', 'The side opposite the right angle', ['The shortest side', 'The side at the bottom', 'Either side next to the right angle'], 'The hypotenuse is opposite the 90° angle, and it is always the longest side.'),
      () => { const [a, b, c] = pick(TRIPLES); return num(`In △ABC, B̂ = 90°, AB = <b>${a}</b> and BC = <b>${b}</b>. Find AC.`, c, `B is the right angle, so AC (opposite B) is the hypotenuse. AC<sup>2</sup> = ${a * a} + ${b * b} = ${c * c}, AC = ${c}.`); },
    ],
  });
})();
