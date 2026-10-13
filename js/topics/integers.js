(function () {
  const { R, nz, pick, fmt, br, num, mc, near, h, s, svg, slider, clear } = G8;

  G8.topic({
    id: 'integers', strand: 'numbers', title: 'Integers',
    blurb: 'Negative numbers on the number line, the sign rules, and squares and roots of integers.',
    rules: [
      'Integers are the whole numbers and their negatives: …, −3, −2, −1, 0, 1, 2, 3, …',
      'Adding a positive moves right on the number line. Adding a negative moves left.',
      'Subtracting a number is the same as adding its opposite: <span class="m">a − (−b) = a + b</span> and <span class="m">a − b = a + (−b)</span>.',
      'Multiply or divide: <b>same signs give a positive</b>, <b>different signs give a negative</b>.',
      '<span class="m">(−a)<sup>2</sup></span> is positive, but <span class="m">−a<sup>2</sup> = −(a<sup>2</sup>)</span> is negative. An odd power of a negative stays negative: <span class="m">(−2)<sup>3</sup> = −8</span>.',
      'Every positive number has a square root. A negative number has no real square root, but it does have a cube root: <span class="m">∛−27 = −3</span>.',
      'Additive inverse: <span class="m">a + (−a) = 0</span>.',
    ],
    lesson: [
      { h: 'The number line', html: `
        <p>Numbers to the right are bigger. So −2 is bigger than −7, even though 7 looks bigger. Think of temperature: −2 °C is warmer than −7 °C.</p>
        <div class="eg"><b>Example</b>Put in order from smallest: 4, −9, 0, −1, 6.<br><b>−9, −1, 0, 4, 6</b></div>` },
      { h: 'Adding and subtracting', html: `
        <div class="eg"><b>Example</b>−5 + 8: start at −5, move 8 right. Answer <b>3</b>.</div>
        <div class="eg"><b>Example</b>3 − 10 = 3 + (−10): start at 3, move 10 left. Answer <b>−7</b>.</div>
        <div class="eg"><b>Example</b>−4 − (−6) = −4 + 6 = <b>2</b>. Taking away a debt makes you richer.</div>
        <p class="tip">Two signs next to each other: <b>− −</b> becomes <b>+</b>, and <b>+ −</b> or <b>− +</b> becomes <b>−</b>.</p>` },
      { h: 'Multiplying and dividing', html: `
        <table><tr><th>×  or ÷</th><th>+</th><th>−</th></tr><tr><th>+</th><td>+</td><td>−</td></tr><tr><th>−</th><td>−</td><td>+</td></tr></table>
        <div class="eg"><b>Examples</b>(−6) × 4 = −24 &nbsp;&nbsp; (−6) × (−4) = 24 &nbsp;&nbsp; −36 ÷ 9 = −4 &nbsp;&nbsp; −36 ÷ (−9) = 4</div>
        <p>With a string of multiplications, count the negative signs. An even number of them gives a positive answer; an odd number gives a negative.</p>` },
      { h: 'Powers and roots', html: `
        <div class="eg"><b>Example</b>(−3)<sup>2</sup> = (−3) × (−3) = <b>9</b>, but −3<sup>2</sup> = −(3 × 3) = <b>−9</b>. The brackets matter.</div>
        <div class="eg"><b>Example</b>(−2)<sup>3</sup> = (−2)(−2)(−2) = <b>−8</b>, so ∛−8 = −2.</div>
        <p>√−16 has no real answer, because no number times itself gives a negative.</p>` },
    ],
    demos: [
      { title: 'Hop along the number line', about: 'Choose a start and what to add or subtract. Red hops show the moves.', run(el) {
        const pic = svg(340, 130);
        const out = h('div', { class: 'readout' });
        let a = -3, b = 5, op = '+';
        const X = (v) => 170 + v * 15;
        function draw() {
          clear(pic);
          pic.append(s('line', { x1: 8, y1: 90, x2: 332, y2: 90, stroke: 'currentColor', 'stroke-width': 1.5 }));
          for (let v = -10; v <= 10; v++) {
            pic.append(s('line', { x1: X(v), y1: 85, x2: X(v), y2: 95, stroke: 'currentColor', 'stroke-opacity': v === 0 ? 1 : .5 }));
            if (v % 2 === 0) pic.append(s('text', { x: X(v), y: 112, 'text-anchor': 'middle', 'font-size': 11 }, fmt(v)));
          }
          const move = op === '+' ? b : -b;
          const end = a + move;
          const dir = Math.sign(move);
          for (let k = 0; k < Math.abs(move); k++) {
            const x1 = X(a + dir * k), x2 = X(a + dir * (k + 1));
            if (Math.max(x1, x2) > 340 || Math.min(x1, x2) < 0) continue;
            pic.append(s('path', { d: `M${x1},86 Q${(x1 + x2) / 2},${60} ${x2},86`, fill: 'none', stroke: 'var(--red)', 'stroke-width': 2 }));
          }
          pic.append(s('circle', { cx: X(a), cy: 90, r: 6, fill: 'var(--ink)' }));
          if (Math.abs(end) <= 10) {
            pic.append(s('circle', { cx: X(end), cy: 90, r: 7, fill: 'var(--red)' }));
            pic.append(s('text', { x: X(end), y: 40, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, fill: 'var(--red)', class: 'hand' }, fmt(end)));
          }
          const sub = op === '−' && b < 0 ? ` = ${fmt(a)} + ${fmt(-b)}` : '';
          out.innerHTML = `<b>${fmt(a)} ${op} ${br(b)}${sub} = ${fmt(end)}</b><br>` +
            (move === 0 ? 'No move.' : `Move ${Math.abs(move)} step${Math.abs(move) === 1 ? '' : 's'} to the <b>${move > 0 ? 'right' : 'left'}</b>.`) +
            (Math.abs(end) > 10 ? ' <span class="muted">(off the end of this line)</span>' : '');
        }
        const opSeg = G8.seg([['+', 'Add'], ['−', 'Subtract']], op, (v) => { op = v; draw(); });
        el.append(pic, opSeg, h('div', { class: 'controls' },
          slider('Start at', -10, 10, 1, a, (v) => { a = v; draw(); }).el,
          slider('Number', -10, 10, 1, b, (v) => { b = v; draw(); }).el), out);
        opSeg.style.position = 'static';
        draw();
      } },
      { title: 'Sign rules machine', about: 'Pick two integers to multiply. Watch the sign decide the answer.', run(el) {
        const out = h('div', { class: 'readout' });
        let a = -4, b = 3;
        function draw() {
          const same = (a < 0) === (b < 0);
          out.innerHTML = `<span style="font-size:24px"><b>${br(a)} × ${br(b)} = ${fmt(a * b)}</b></span><br>` +
            (a === 0 || b === 0 ? 'Anything times 0 is 0.' : same ? 'Same signs, so the answer is <b>positive</b>.' : 'Different signs, so the answer is <b>negative</b>.') +
            (b !== 0 && a % b === 0 && a !== 0 ? `<br>Check with division: ${fmt(a * b)} ÷ ${br(b)} = ${fmt(a)}` : '');
        }
        el.append(h('div', { class: 'controls' },
          slider('First', -12, 12, 1, a, (v) => { a = v; draw(); }).el,
          slider('Second', -12, 12, 1, b, (v) => { b = v; draw(); }).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const a = nz(-20, 20), b = nz(-20, 20); return num(`<span class="big m">${fmt(a)} + ${br(b)}</span>`, a + b, `Start at ${fmt(a)} and move ${Math.abs(b)} ${b > 0 ? 'right' : 'left'}: ${fmt(a + b)}.`); },
      () => { const a = nz(-20, 20), b = nz(-20, 20); return num(`<span class="big m">${fmt(a)} − ${br(b)}</span>`, a - b, b < 0 ? `Subtracting a negative is adding: ${fmt(a)} + ${-b} = ${fmt(a - b)}.` : `${fmt(a)} − ${b}: move ${b} left to ${fmt(a - b)}.`); },
      () => { const a = nz(-12, 12), b = nz(-12, 12); return num(`<span class="big m">${br(a)} × ${br(b)}</span>`, a * b, `${(a < 0) === (b < 0) ? 'Same signs → positive' : 'Different signs → negative'}: ${fmt(a * b)}.`); },
      () => { const b = nz(-12, 12), q = nz(-12, 12), a = b * q; return num(`<span class="big m">${fmt(a)} ÷ ${br(b)}</span>`, q, `${(a < 0) === (b < 0) ? 'Same signs → positive' : 'Different signs → negative'}: ${fmt(q)}.`); },
      () => { const a = R(2, 9); const which = pick(['bracket', 'nobracket']);
        if (which === 'bracket') return mc(`What is <span class="big m">(−${a})<sup>2</sup></span>?`, fmt(a * a), [fmt(-a * a), fmt(-2 * a), fmt(2 * a)], `(−${a}) × (−${a}) = ${a * a}. Two negatives make a positive.`);
        return mc(`What is <span class="big m">−${a}<sup>2</sup></span>?`, fmt(-a * a), [fmt(a * a), fmt(-2 * a), fmt(2 * a)], `Without brackets only ${a} is squared: −(${a} × ${a}) = ${fmt(-a * a)}.`); },
      () => { const a = R(2, 5); return num(`<span class="big m">(−${a})<sup>3</sup></span>`, -a * a * a, `(−${a}) × (−${a}) × (−${a}): three negatives → negative. Answer ${fmt(-a * a * a)}.`); },
      () => { const a = R(2, 6); return num(`<span class="big m">∛${fmt(-a * a * a)}</span>`, -a, `(−${a})<sup>3</sup> = ${fmt(-a * a * a)}, so the cube root is ${fmt(-a)}.`); },
      () => { const t1 = R(-8, 6), ch = R(4, 15); return num(`At 6 a.m. it is <b>${fmt(t1)} °C</b>. By noon it has warmed up by <b>${ch} °C</b>. What is the temperature at noon?`, t1 + ch, `${fmt(t1)} + ${ch} = ${fmt(t1 + ch)} °C.`); },
      () => { const hi = R(-2, 12), lo = R(-15, -3); return num(`The highest temperature was <b>${fmt(hi)} °C</b> and the lowest was <b>${fmt(lo)} °C</b>. What is the difference?`, hi - lo, `Difference = ${fmt(hi)} − ${br(lo)} = ${fmt(hi)} + ${-lo} = ${hi - lo} °C.`); },
      () => { const a = nz(-6, 6), b = nz(-6, 6), c = nz(-6, 6); const v = a * b - c;
        return num(`<span class="big m">${br(a)} × ${br(b)} − ${br(c)}</span>`, v, `Multiply first: ${br(a)} × ${br(b)} = ${fmt(a * b)}. Then ${fmt(a * b)} − ${br(c)} = ${fmt(v)}.`); },
      () => { const set = [nz(-15, 15), nz(-15, 15), nz(-15, 15), nz(-15, 15)]; const sorted = set.slice().sort((x, y) => x - y);
        if (new Set(set).size < 4) return null;
        return mc(`Which number is the <b>smallest</b>? &nbsp; ${set.map((v) => fmt(v)).join(', ')}`, fmt(sorted[0]), set.filter((x) => x !== sorted[0]).map((v) => fmt(v)), `On a number line ${fmt(sorted[0])} is furthest left.`); },
      () => { const a = nz(-3, 3), b = nz(-3, 3), c = nz(-3, 3); const v = a * b * c; const negs = [a, b, c].filter((x) => x < 0).length;
        return num(`<span class="big m">${br(a)} × ${br(b)} × ${br(c)}</span>`, v, `${negs} negative sign${negs === 1 ? '' : 's'}: ${negs % 2 ? 'odd → negative' : 'even → positive'}. Answer ${fmt(v)}.`); },
    ],
  });
})();
