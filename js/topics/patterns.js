(function () {
  const { R, nz, pick, fmt, expr, num, mc, near, h, s, svg, slider, clear, seg } = G8;
  const rule = (d, c) => 'T<sub>n</sub> = ' + expr([[d, 'n'], [c, '']]);

  G8.topic({
    id: 'patterns', strand: 'algebra', title: 'Number and shape patterns',
    blurb: 'Find the next term, the general rule, and any term in a pattern of numbers or shapes.',
    rules: [
      'A <b>term</b> is one number in the pattern. Its <b>position</b> n says where it is: 1st, 2nd, 3rd …',
      'If you add (or subtract) the same number each time, there is a <b>constant difference</b>.',
      'Constant difference d: the rule is <span class="m">T<sub>n</sub> = d × n + (T<sub>1</sub> − d)</span>.',
      'If you multiply by the same number each time, there is a <b>constant ratio</b>. E.g. 3, 6, 12, 24 (× 2).',
      'Squares 1, 4, 9, 16 … have rule <span class="m">T<sub>n</sub> = n<sup>2</sup></span>. Cubes 1, 8, 27 … have <span class="m">T<sub>n</sub> = n<sup>3</sup></span>.',
      'To find which position has a value, set the rule equal to the value and solve for n.',
    ],
    lesson: [
      { h: 'Describing a pattern', html: `
        <p>A pattern can be described in words, as a table, or as a rule (a formula).</p>
        <div class="eg"><b>Example</b>5; 8; 11; 14; …<br>Each term is 3 more than the one before, so the constant difference is 3. Next term: <b>17</b>.</div>
        <div class="eg"><b>Example</b>2; 6; 18; 54; …<br>Each term is 3 times the one before, a constant ratio of 3. Next term: <b>162</b>.</div>` },
      { h: 'Finding the general rule', html: `
        <p>When the difference is constant, the rule looks like <b>T<sub>n</sub> = (difference) × n + (something)</b>.</p>
        <div class="eg"><b>Example</b>Find the rule for 5; 8; 11; 14; …
          <ol><li>Difference = 3, so start with 3n</li><li>For n = 1, 3n = 3, but T<sub>1</sub> = 5. We need to add 2</li><li>Rule: <b>T<sub>n</sub> = 3n + 2</b></li><li>Check n = 4: 3(4) + 2 = 14 ✓</li></ol></div>
        <div class="eg"><b>Use the rule</b>T<sub>50</sub> = 3(50) + 2 = <b>152</b>.</div>
        <div class="eg"><b>Work backwards</b>Which term is 74? 3n + 2 = 74 → 3n = 72 → <b>n = 24</b>.</div>` },
      { h: 'Shape patterns', html: `
        <p>Count something in each shape (matchsticks, dots, tiles) and put the counts in a table.</p>
        <table><tr><th>Squares in a row (n)</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>Matchsticks</th><td>4</td><td>7</td><td>10</td><td>13</td></tr></table>
        <p>The first square needs 4 sticks and each new square adds 3. Rule: <b>3n + 1</b>. Try it in the demo.</p>` },
    ],
    demos: [
      { title: 'Matchstick patterns', about: 'Pick a shape and slide n. Count the sticks, then check the rule.', run(el) {
        let n = 3, shape = 'sq';
        const pic = svg(340, 110);
        const out = h('div', { class: 'readout' });
        const tbl = h('div', { class: 'scroll-x' });
        const SH = {
          sq: { name: 'squares', f: (k) => 3 * k + 1, rule: '3n + 1' },
          tri: { name: 'triangles', f: (k) => 2 * k + 1, rule: '2n + 1' },
          hex: { name: 'hexagons', f: (k) => 5 * k + 1, rule: '5n + 1' },
        };
        function stick(x1, y1, x2, y2) {
          pic.append(s('line', { x1, y1, x2, y2, stroke: '#C98B3B', 'stroke-width': 4, 'stroke-linecap': 'round' }));
          pic.append(s('circle', { cx: x2, cy: y2, r: 3.4, fill: 'var(--red)' }));
        }
        function draw() {
          clear(pic);
          if (shape === 'sq') {
            const a = Math.min(64, 300 / n);
            const x0 = (340 - n * a) / 2, y0 = (110 - a) / 2;
            stick(x0, y0 + a, x0, y0);
            for (let k = 0; k < n; k++) { const x = x0 + k * a; stick(x, y0, x + a, y0); stick(x, y0 + a, x + a, y0 + a); stick(x + a, y0 + a, x + a, y0); }
          } else if (shape === 'tri') {
            const a = Math.min(72, 600 / (n + 1)); const ht = a * 0.866, x0 = (340 - (n + 1) * a / 2) / 2, y0 = (110 + ht) / 2;
            for (let k = 0; k < n; k++) {
              const x = x0 + k * a / 2;
              if (k % 2 === 0) { if (k === 0) stick(x, y0, x + a / 2, y0 - ht); stick(x, y0, x + a, y0); stick(x + a / 2, y0 - ht, x + a, y0); }
              else { stick(x, y0 - ht, x + a, y0 - ht); stick(x + a, y0 - ht, x + a / 2, y0); }
            }
          } else {
            const a = Math.min(40, 300 / (1.732 * n), 50), y0 = 55, w = 1.732 * a;
            for (let k = 0; k < n; k++) {
              const cx = (340 - n * w) / 2 + w / 2 + k * w;
              const pts = [30, 90, 150, 210, 270, 330].map((deg) => [cx + a * Math.cos(deg * Math.PI / 180), y0 + a * Math.sin(deg * Math.PI / 180)]);
              for (let j = 0; j < 6; j++) { if (k > 0 && j === 2) continue; const p = pts[j], q = pts[(j + 1) % 6]; stick(p[0], p[1], q[0], q[1]); }
            }
          }
          const S = SH[shape];
          out.innerHTML = `${n} ${S.name}: <b>${S.f(n)} matchsticks</b><br>Rule: sticks = <b>${S.rule}</b> → ${S.rule.replace('n', '(' + n + ')')} = ${S.f(n)}`;
          tbl.innerHTML = `<table class="tbl"><tr><th>n</th>${[1, 2, 3, 4, 5, 6].map((k) => `<td${k === n ? ' style="color:var(--red);font-weight:700"' : ''}>${k}</td>`).join('')}<td>…</td><td>20</td></tr>` +
            `<tr><th>sticks</th>${[1, 2, 3, 4, 5, 6].map((k) => `<td${k === n ? ' style="color:var(--red);font-weight:700"' : ''}>${S.f(k)}</td>`).join('')}<td>…</td><td>${S.f(20)}</td></tr></table>`;
        }
        el.append(seg([['sq', 'Squares'], ['tri', 'Triangles'], ['hex', 'Hexagons']], shape, (v) => { shape = v; draw(); }), pic,
          h('div', { class: 'controls' }, slider('n (number of shapes)', 1, 8, 1, n, (v) => { n = v; draw(); }).el), out, tbl);
        draw();
      } },
      { title: 'Build a pattern from a rule', about: 'Choose the difference and the starting term. See the rule appear.', run(el) {
        let d = 4, t1 = 3;
        const out = h('div', { class: 'readout', style: 'font-size:19px' });
        function draw() {
          const terms = Array.from({ length: 6 }, (_, k) => t1 + d * k);
          out.innerHTML = `${terms.map((v) => fmt(v)).join('; ')}; …<br>Constant difference: <b>${fmt(d)}</b><br><b>${rule(d, t1 - d)}</b><br><span class="small muted">T<sub>100</sub> = ${fmt(d)} × 100 ${t1 - d < 0 ? '−' : '+'} ${Math.abs(t1 - d)} = ${fmt(d * 100 + t1 - d)}</span>`;
        }
        el.append(h('div', { class: 'controls' },
          slider('Difference', -6, 9, 1, d, (v) => { d = v; draw(); }).el,
          slider('First term', -10, 20, 1, t1, (v) => { t1 = v; draw(); }).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const d = nz(-7, 9), t1 = R(-10, 20); const t = Array.from({ length: 4 }, (_, k) => t1 + d * k);
        return num(`What is the next term? &nbsp;<span class="big m">${t.map((v) => fmt(v)).join('; ')}; …</span>`, t1 + 4 * d, `The constant difference is ${fmt(d)}: ${fmt(t[3])} ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${fmt(t1 + 4 * d)}.`); },
      () => { const r = pick([2, 3, 4, 5, 10]), t1 = R(1, 5); const t = Array.from({ length: 4 }, (_, k) => t1 * Math.pow(r, k));
        return num(`What is the next term? &nbsp;<span class="big m">${t.map((v) => fmt(v)).join('; ')}; …</span>`, t1 * Math.pow(r, 4), `Each term is ${r} times the one before (constant ratio): ${fmt(t[3])} × ${r} = ${fmt(t1 * Math.pow(r, 4))}.`); },
      () => { const d = nz(-5, 8), c = R(-9, 9); if (c === 0) return null; const t = [1, 2, 3, 4].map((k) => d * k + c);
        return mc(`Which rule gives the pattern <span class="m">${t.map((v) => fmt(v)).join('; ')}; …</span>?`, rule(d, c), [rule(d, c + d), rule(c, d), rule(d + 1, c - 1)], `Difference = ${fmt(d)}, so ${fmt(d)}n. For n = 1 you need ${fmt(t[0])}, so add ${fmt(c)}. ${rule(d, c)}.`); },
      () => { const d = R(2, 9), c = R(-5, 10), n = pick([10, 20, 25, 50, 100]);
        return num(`The rule is <b>${rule(d, c)}</b>. Find <b>T<sub>${n}</sub></b>.`, d * n + c, `${fmt(d)} × ${n} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${fmt(d * n + c)}.`); },
      () => { const d = R(2, 9), c = R(-5, 10), n = R(8, 60); const v = d * n + c;
        return num(`The rule is <b>${rule(d, c)}</b>. Which term (n) is equal to <b>${fmt(v)}</b>?`, n, `${expr([[d, 'n'], [c, '']])} = ${fmt(v)} → ${d}n = ${fmt(v - c)} → n = ${n}.`, { inputmode: 'numeric' }); },
      () => { const d = R(2, 7), t1 = R(1, 12), n = pick([10, 15, 20, 30]); const c = t1 - d; const t = [0, 1, 2, 3].map((k) => t1 + d * k);
        return num(`Pattern: <span class="m">${t.join('; ')}; …</span><br>What is the <b>${n}th</b> term?`, d * n + c, `Rule: ${rule(d, c)}. T<sub>${n}</sub> = ${d}(${n}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${d * n + c}.`); },
      () => { const n = R(5, 15); return num(`The pattern of square numbers is 1; 4; 9; 16; … What is the <b>${n}th</b> term?`, n * n, `T<sub>n</sub> = n<sup>2</sup>, so T<sub>${n}</sub> = ${n}<sup>2</sup> = ${n * n}.`); },
      () => { const n = pick([10, 12, 15, 20, 25]); return num(`Squares in a row made of matchsticks need 4; 7; 10; 13; … sticks. How many sticks for <b>${n} squares</b>?`, 3 * n + 1, `Rule: 3n + 1. 3(${n}) + 1 = ${3 * n + 1}.`); },
    ],
  });
})();
