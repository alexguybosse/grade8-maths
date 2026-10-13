(function () {
  const { R, pick, round, fmt, F, FS, simp, num, mc, near, h, s, svg, slider, clear } = G8;

  G8.topic({
    id: 'decimals', strand: 'numbers', title: 'Decimal fractions',
    blurb: 'Place value, converting between fractions and decimals, rounding, and calculating with decimals.',
    rules: [
      'Place value after the comma: tenths (' + F(1, 10) + '), hundredths (' + F(1, 100) + '), thousandths (' + F(1, 1000) + ').',
      'Fraction to decimal: divide the top by the bottom, or make the bottom 10, 100 or 1 000. <span class="m">' + F(3, 4) + ' = ' + F(75, 100) + ' = 0,75</span>',
      'Decimal to fraction: write it over 10, 100 or 1 000 and simplify. <span class="m">0,36 = ' + F(36, 100) + ' = ' + F(9, 25) + '</span>',
      'Rounding: look at the next digit. 5 or more rounds up; 4 or less stays.',
      'Add and subtract: line up the commas.',
      'Multiply: ignore the commas, multiply, then the answer has as many decimal places as the two numbers together.',
      'Divide by a decimal: multiply both numbers by 10, 100 … until you divide by a whole number. <span class="m">4,8 ÷ 0,6 = 48 ÷ 6 = 8</span>',
      'A recurring decimal repeats forever, shown with a dot or bar: <span class="m">' + F(1, 3) + ' = 0,333… = 0,<span class="sq">3</span></span>',
    ],
    lesson: [
      { h: 'Place value', html: `
        <div class="scroll-x"><table><tr><th>Tens</th><th>Units</th><th>,</th><th>Tenths</th><th>Hundredths</th><th>Thousandths</th></tr><tr><td>4</td><td>7</td><td>,</td><td>2</td><td>0</td><td>5</td></tr></table></div>
        <p>So 47,205 = 40 + 7 + ${F(2, 10)} + ${F(0, 100)} + ${F(5, 1000)}.</p>
        <div class="eg"><b>Which is bigger?</b>0,7 or 0,65? Write them with the same number of decimals: 0,70 and 0,65. So <b>0,7</b> is bigger.</div>` },
      { h: 'Converting', html: `
        <div class="eg"><b>Fraction → decimal</b>${F(3, 8)} = 3 ÷ 8 = <b>0,375</b>. &nbsp; ${F(7, 20)} = ${F(35, 100)} = <b>0,35</b>.</div>
        <div class="eg"><b>Decimal → fraction</b>0,125 = ${F(125, 1000)} = <b>${F(1, 8)}</b>. &nbsp; 2,4 = 2${F(4, 10)} = <b>2${F(2, 5)}</b>.</div>
        <div class="eg"><b>Percentage</b>0,35 = 35% (multiply by 100). 8% = 0,08.</div>
        <p>Learn these: ${F(1, 2)} = 0,5 · ${F(1, 4)} = 0,25 · ${F(3, 4)} = 0,75 · ${F(1, 5)} = 0,2 · ${F(1, 8)} = 0,125 · ${F(1, 3)} = 0,<span class="sq">3</span> · ${F(2, 3)} = 0,<span class="sq">6</span></p>` },
      { h: 'Rounding', html: `
        <div class="eg"><b>Example</b>Round 3,4762 to 2 decimal places.<br>Keep 3,47 and look at the next digit: 6. That's 5 or more, so round up: <b>3,48</b>.</div>` },
      { h: 'Calculating', html: `
        <div class="eg"><b>Add</b>12,5 + 3,47 → 12,50 + 3,47 = <b>15,97</b></div>
        <div class="eg"><b>Multiply</b>0,3 × 0,04 → 3 × 4 = 12. There are 1 + 2 = 3 decimal places, so <b>0,012</b>.</div>
        <div class="eg"><b>Divide</b>2,56 ÷ 0,08 → multiply both by 100: 256 ÷ 8 = <b>32</b>.</div>
        <p class="tip">Multiplying by 10, 100, 1 000 moves the digits left 1, 2, 3 places (the number gets bigger). Dividing moves them right.</p>` },
    ],
    demos: [
      { title: 'The hundred grid', about: 'One whole is cut into 100 squares. Slide to shade some and see it as a fraction, decimal and percentage.', run(el) {
        let n = 35;
        const pic = svg(220, 220);
        const out = h('div', { class: 'readout', style: 'font-size:19px' });
        pic.style.maxWidth = '260px'; pic.style.margin = '0 auto';
        const cells = [];
        for (let k = 0; k < 100; k++) {
          const r = s('rect', { x: 10 + (k % 10) * 20, y: 10 + Math.floor(k / 10) * 20, width: 20, height: 20, stroke: 'currentColor', 'stroke-opacity': .35 });
          cells.push(r); pic.append(r);
        }
        function draw() {
          cells.forEach((c, k) => { c.setAttribute('fill', k < n ? (Math.floor(k / 10) < Math.floor(n / 10) ? 'var(--s-numbers)' : 'var(--red)') : 'transparent'); c.setAttribute('fill-opacity', k < n ? .7 : 0); });
          const tenths = Math.floor(n / 10), hund = n % 10;
          out.innerHTML = `${F(n, 100)}${simp(n, 100)[1] !== 100 ? ' = ' + FS(n, 100) : ''} = <b>${fmt(n / 100)}</b> = ${n}%<br><span class="small"><span style="color:var(--s-numbers)">${tenths} full rows = ${tenths} tenths</span> and <span style="color:var(--red)">${hund} hundredths</span></span>`;
        }
        el.append(pic, h('div', { class: 'controls' }, slider('Shaded squares', 0, 100, 1, n, (v) => { n = v; draw(); }).el), out);
        draw();
      } },
      { title: 'Rounding zoom', about: 'Where does the number sit between its two neighbours?', run(el) {
        let x = 3.476, dp = 2;
        const pic = svg(340, 90);
        const out = h('div', { class: 'readout' });
        function draw() {
          clear(pic);
          const step = Math.pow(10, -dp), lo = Math.floor(x / step + 1e-9) * step, hi = lo + step;
          const X = (v) => 30 + (v - lo) / step * 280;
          pic.append(s('line', { x1: 20, y1: 50, x2: 320, y2: 50, stroke: 'currentColor' }));
          [lo, (lo + hi) / 2, hi].forEach((v, i) => {
            pic.append(s('line', { x1: X(v), y1: i === 1 ? 44 : 40, x2: X(v), y2: i === 1 ? 56 : 60, stroke: 'currentColor', 'stroke-dasharray': i === 1 ? '3 2' : '' }));
            pic.append(s('text', { x: X(v), y: 78, 'text-anchor': 'middle', 'font-size': 12 }, fmt(round(v, dp + 1))));
          });
          pic.append(s('circle', { cx: X(x), cy: 50, r: 6, fill: 'var(--red)' }));
          pic.append(s('text', { x: X(x), y: 30, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: 'var(--red)' }, fmt(x)));
          const r = round(x, dp);
          out.innerHTML = `${fmt(x)} rounded to ${dp} decimal place${dp > 1 ? 's' : ''} is <b>${fmt(r, dp)}</b>.<br><span class="small muted">It's past the halfway mark? Then it rounds up.</span>`;
        }
        el.append(pic, h('div', { class: 'controls' },
          slider('Number', 0, 10, 0.001, x, (v) => { x = v; draw(); }, (v) => fmt(v, 3)).el,
          slider('Decimal places', 0, 2, 1, dp, (v) => { dp = v; draw(); }).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const [n, d] = pick([[1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [3, 20], [7, 20], [9, 25], [11, 50], [1, 2], [13, 25], [3, 40]]);
        return num(`Write <span class="big m">${F(n, d)}</span> as a decimal.`, n / d, `${n} ÷ ${d} = ${fmt(n / d)}.`, { hint: 'e.g. 0,25' }); },
      () => { const d = pick([10, 100, 1000]), n = R(1, d - 1); if (n % 10 === 0 && d > 10) return null; const [a, b] = simp(n, d);
        return mc(`Write <span class="big m">${fmt(n / d)}</span> as a fraction in simplest form.`, FS(n, d), [F(n, d * 10), F(a + 1, b), F(n, d === 10 ? 100 : d / 10)], `${fmt(n / d)} = ${F(n, d)}${b !== d ? ' = ' + FS(n, d) : ''}.`); },
      () => { const x = R(1000, 99999) / 1000, dp = R(0, 2); const r = round(x, dp);
        return num(`Round <b>${fmt(x)}</b> to <b>${dp} decimal place${dp === 1 ? '' : 's'}</b>.`, r, `Look at the digit after the ${dp === 0 ? 'units' : dp === 1 ? 'first' : 'second'} decimal place. Answer: ${fmt(r, dp)}.`, { show: fmt(r, dp) }); },
      () => { const a = R(11, 99) / 10, b = R(101, 999) / 100; return num(`Calculate <span class="big m">${fmt(a)} + ${fmt(b)}</span>`, round(a + b, 2), `Line up the commas: ${fmt(round(a + b, 2))}.`); },
      () => { const a = R(201, 999) / 10, b = R(101, 999) / 100; if (a < b) return null; return num(`Calculate <span class="big m">${fmt(a)} − ${fmt(b)}</span>`, round(a - b, 2), `Write ${fmt(a)} as ${fmt(a, 2)} and subtract: ${fmt(round(a - b, 2))}.`); },
      () => { const a = R(2, 9), b = R(2, 9), p1 = R(1, 2), p2 = R(1, 2); const A = a / Math.pow(10, p1), B = b / Math.pow(10, p2);
        return num(`Calculate <span class="big m">${fmt(A)} × ${fmt(B)}</span>`, round(A * B, 6), `${a} × ${b} = ${a * b}. Decimal places: ${p1} + ${p2} = ${p1 + p2}. Answer ${fmt(round(A * B, 6))}.`); },
      () => { const q = R(2, 12), d = R(2, 9), p = R(1, 2); const D = d / Math.pow(10, p), N = round(q * D, 4);
        return num(`Calculate <span class="big m">${fmt(N)} ÷ ${fmt(D)}</span>`, q, `Multiply both by ${Math.pow(10, p)}: ${fmt(round(N * Math.pow(10, p), 4))} ÷ ${d} = ${q}.`); },
      () => { const a = R(11, 999) / 100, k = pick([10, 100, 1000]); const op = pick(['×', '÷']);
        const v = op === '×' ? round(a * k, 6) : round(a / k, 6);
        return num(`Calculate <span class="big m">${fmt(a)} ${op} ${fmt(k)}</span>`, v, `${op === '×' ? 'Multiplying' : 'Dividing'} by ${fmt(k)} moves the digits ${String(k).length - 1} place${k === 10 ? '' : 's'}: ${fmt(v)}.`); },
      () => { const vals = [R(1, 9) / 10, R(10, 99) / 100, R(100, 999) / 1000, R(1, 9) / 10 + R(1, 9) / 100]; if (new Set(vals.map(String)).size < 4) return null;
        const mx = Math.max(...vals); return mc(`Which is the <b>biggest</b>?`, fmt(mx), vals.filter((v) => v !== mx).map((v) => fmt(v)), `Give them all 3 decimal places and compare: ${vals.map((v) => fmt(v, 3)).join(', ')}. Biggest: ${fmt(mx)}.`); },
      () => { const p = pick([5, 8, 12, 15, 35, 60, 75, 125, 2.5]); return num(`Write <b>${fmt(p)}%</b> as a decimal.`, p / 100, `Divide by 100: ${fmt(p / 100)}.`); },
      () => { const [n, d, rep] = pick([[1, 3, '0,333…'], [2, 3, '0,666…'], [1, 9, '0,111…'], [5, 9, '0,555…'], [1, 6, '0,1666…'], [4, 11, '0,3636…']]);
        return mc(`Which decimal is equal to <span class="big m">${F(n, d)}</span>?`, rep, ['0,' + n + d, fmt(round(n / d, 1)), fmt(n / 10 + d / 100)], `${n} ÷ ${d} = ${rep}, a recurring decimal.`); },
      () => { const r = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.1, 1.2]); return num(`Calculate <span class="big m">(${fmt(r)})<sup>2</sup></span>`, round(r * r, 4), `${fmt(r)} × ${fmt(r)} = ${fmt(round(r * r, 4))}. (2 decimal places in the answer.)`); },
    ],
  });
})();
