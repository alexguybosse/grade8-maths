(function () {
  const { R, pick, gcd, lcm, fmt, money, F, FS, MX, simp, num, mc, h, s, svg, slider, clear, seg } = G8;
  const hint = 'e.g. 3/4 or 1 1/2';
  const frac = (n, d) => { const [a, b] = simp(n, d); return { n: a, d: b }; };

  G8.topic({
    id: 'fractions', strand: 'numbers', title: 'Common fractions',
    blurb: 'Add, subtract, multiply and divide fractions and mixed numbers. Fractions of amounts and percentages.',
    rules: [
      'To add or subtract, first make the denominators the same (use the LCM). Then add or subtract the numerators only.',
      'To multiply, multiply the tops and multiply the bottoms: <span class="m">' + F('a', 'b') + ' × ' + F('c', 'd') + ' = ' + F('ac', 'bd') + '</span>',
      'To divide, multiply by the reciprocal (flip the second fraction): <span class="m">' + F('a', 'b') + ' ÷ ' + F('c', 'd') + ' = ' + F('a', 'b') + ' × ' + F('d', 'c') + '</span>',
      'Change mixed numbers to improper fractions before multiplying or dividing: <span class="m">2' + F(1, 3) + ' = ' + F(7, 3) + '</span>',
      'Simplify by dividing top and bottom by their HCF. Equivalent fractions have the same value: <span class="m">' + F(2, 3) + ' = ' + F(8, 12) + '</span>',
      '"Of" means multiply: <span class="m">' + F(3, 4) + ' of 60 = 45</span>. Percent means "out of 100": <span class="m">35% = ' + F(35, 100) + '</span>.',
      'Percentage increase or decrease = <span class="m">' + F('change', 'original') + ' × 100%</span>',
      'To square or cube a fraction, do it to the top and bottom: <span class="m">(' + F(2, 3) + ')<sup>2</sup> = ' + F(4, 9) + '</span>, <span class="m">√' + F(25, 49) + ' = ' + F(5, 7) + '</span>',
    ],
    lesson: [
      { h: 'Adding and subtracting', html: `
        <div class="eg"><b>Example</b>${F(2, 3)} + ${F(3, 4)}<ol><li>LCM of 3 and 4 is 12</li><li>${F(2, 3)} = ${F(8, 12)} and ${F(3, 4)} = ${F(9, 12)}</li><li>${F(8, 12)} + ${F(9, 12)} = ${F(17, 12)} = <b>1${F(5, 12)}</b></li></ol></div>
        <div class="eg"><b>Mixed numbers</b>3${F(1, 2)} − 1${F(2, 3)} = ${F(7, 2)} − ${F(5, 3)} = ${F(21, 6)} − ${F(10, 6)} = ${F(11, 6)} = <b>1${F(5, 6)}</b></div>
        <p class="tip">Never add the denominators. ${F(1, 2)} + ${F(1, 2)} is 1, not ${F(2, 4)}.</p>` },
      { h: 'Multiplying and dividing', html: `
        <div class="eg"><b>Multiply</b>${F(4, 9)} × ${F(3, 8)}: cancel first (4 with 8, 3 with 9) → ${F(1, 3)} × ${F(1, 2)} = <b>${F(1, 6)}</b></div>
        <div class="eg"><b>Divide</b>${F(5, 6)} ÷ ${F(2, 3)} = ${F(5, 6)} × ${F(3, 2)} = ${F(15, 12)} = <b>1${F(1, 4)}</b></div>
        <div class="eg"><b>Mixed</b>1${F(1, 2)} × 2${F(2, 3)} = ${F(3, 2)} × ${F(8, 3)} = ${F(24, 6)} = <b>4</b></div>` },
      { h: 'Fractions of amounts and percentages', html: `
        <div class="eg"><b>Example</b>${F(3, 5)} of R450 = 450 ÷ 5 × 3 = <b>R270</b></div>
        <div class="eg"><b>Example</b>12% of 250 = ${F(12, 100)} × 250 = <b>30</b></div>
        <div class="eg"><b>Example</b>As a percentage, 18 out of 24 = ${F(18, 24)} × 100% = <b>75%</b></div>
        <div class="eg"><b>Percentage change</b>A price goes from R80 to R92. Increase = R12. ${F(12, 80)} × 100% = <b>15% increase</b>.</div>` },
    ],
    demos: [
      { title: 'Fraction bars', about: 'Choose two fractions. The bars get cut into equal pieces so you can add them.', run(el) {
        let a = 2, b = 3, c = 1, d = 4;
        const pic = svg(340, 190);
        const out = h('div', { class: 'readout' });
        function bar(y, parts, fill, colour, label, offset = 0) {
          const W = 270, x0 = 60;
          pic.append(s('text', { x: 8, y: y + 20, 'font-size': 14, 'font-weight': 700 }, label));
          for (let k = 0; k < parts; k++) {
            const on = k >= offset && k < offset + fill;
            pic.append(s('rect', { x: x0 + k * W / parts, y, width: W / parts, height: 30, fill: on ? colour : 'transparent', 'fill-opacity': on ? .75 : 0, stroke: 'currentColor', 'stroke-opacity': .5 }));
          }
        }
        function draw() {
          clear(pic);
          const L = lcm(b, d), A = a * L / b, C = c * L / d;
          bar(10, b, a, 'var(--s-numbers)', `${a}/${b}`);
          bar(50, d, c, 'var(--red)', `${c}/${d}`);
          bar(110, L, A, 'var(--s-numbers)', `${Math.min(A + C, L)}/${L}`);
          bar(110, L, Math.min(C, L - Math.min(A, L)), 'var(--red)', '', A);
          pic.append(s('text', { x: 8, y: 100, 'font-size': 13, fill: 'var(--pencil)' }, `Both cut into ${L} equal pieces, then added:`));
          if (A + C > L) pic.append(s('text', { x: 8, y: 160, 'font-size': 13, fill: 'var(--pencil)' }, 'More than one whole, so the rest spills over:'));
          if (A + C > L) bar(166, L, A + C - L, 'var(--red)', `+${A + C - L}/${L}`, 0);
          const sum = A + C;
          out.innerHTML = `${F(a, b)} + ${F(c, d)} = ${F(A, L)} + ${F(C, L)} = ${F(sum, L)}` + (gcd(sum, L) > 1 || sum >= L ? ` = <b>${MX(sum, L)}</b>` : '') + `<br><span class="small muted">The LCM of ${b} and ${d} is ${L}, so both bars are cut into ${L} pieces.</span>`;
          pic.setAttribute('viewBox', `0 0 340 ${A + C > L ? 202 : 146}`);
        }
        const sa = slider('Top of first', 1, 12, 1, a, (v) => { a = Math.min(v, b); sa.set(a); draw(); });
        const sb = slider('Bottom of first', 2, 12, 1, b, (v) => { b = v; if (a > b) { a = b; sa.set(a); } draw(); });
        const sc = slider('Top of second', 1, 12, 1, c, (v) => { c = Math.min(v, d); sc.set(c); draw(); });
        const sd = slider('Bottom of second', 2, 12, 1, d, (v) => { d = v; if (c > d) { c = d; sc.set(c); } draw(); });
        el.append(pic, h('div', { class: 'controls' }, sa.el, sb.el, sc.el, sd.el), out);
        draw();
      } },
      { title: 'Why dividing flips', about: 'How many pieces of size ' + F(1, 'n') + ' fit into a number of wholes?', run(el) {
        let w = 3, n = 4;
        const pic = svg(340, 70);
        const out = h('div', { class: 'readout' });
        function draw() {
          clear(pic);
          const W = 320 / w;
          for (let k = 0; k < w; k++) {
            for (let j = 0; j < n; j++) pic.append(s('rect', { x: 10 + k * W + j * W / n, y: 15, width: W / n, height: 40, fill: (k * n + j) % 2 ? 'var(--s-numbers)' : 'var(--red)', 'fill-opacity': .55, stroke: 'currentColor', 'stroke-opacity': .4 }));
            pic.append(s('rect', { x: 10 + k * W, y: 15, width: W, height: 40, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }));
          }
          out.innerHTML = `${w} ÷ ${F(1, n)} = ${w} × ${n} = <b>${w * n}</b><br><span class="small muted">Each whole holds ${n} pieces, so ${w} wholes hold ${w * n}. Dividing by ${F(1, n)} is the same as multiplying by ${n}.</span>`;
        }
        el.append(pic, h('div', { class: 'controls' },
          slider('Wholes', 1, 6, 1, w, (v) => { w = v; draw(); }).el,
          slider('Piece size 1/n', 2, 8, 1, n, (v) => { n = v; draw(); }, (v) => '1/' + v).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const b = pick([2, 3, 4, 5, 6, 8]), d = pick([3, 4, 5, 6, 8, 10]); if (b === d) return null; const a = R(1, b - 1), c = R(1, d - 1);
        const L = lcm(b, d), top = a * L / b + c * L / d;
        return num(`Calculate <span class="big m">${F(a, b)} + ${F(c, d)}</span>`, top / L, `LCD = ${L}: ${F(a * L / b, L)} + ${F(c * L / d, L)} = ${F(top, L)}${gcd(top, L) > 1 || top > L ? ' = ' + MX(top, L) : ''}.`, { hint, show: MX(top, L) }); },
      () => { const b = pick([2, 3, 4, 5, 6]), d = pick([3, 4, 6, 8, 9, 10, 12]); if (b === d) return null; const a = R(1, b - 1), c = R(1, d - 1);
        const L = lcm(b, d), top = a * L / b - c * L / d;
        return num(`Calculate <span class="big m">${F(a, b)} − ${F(c, d)}</span>`, top / L, `LCD = ${L}: ${F(a * L / b, L)} − ${F(c * L / d, L)} = ${top < 0 ? '−' + F(-top, L) : F(top, L)}${gcd(top, L) > 1 ? ' = ' + FS(top, L) : ''}.`, { hint, show: FS(top, L) }); },
      () => { const a = R(1, 7), b = R(a + 1, 9), c = R(1, 7), d = R(c + 1, 9);
        return num(`Calculate <span class="big m">${F(a, b)} × ${F(c, d)}</span>`, (a * c) / (b * d), `Tops: ${a} × ${c} = ${a * c}. Bottoms: ${b} × ${d} = ${b * d}. ${F(a * c, b * d)}${gcd(a * c, b * d) > 1 ? ' = ' + FS(a * c, b * d) : ''}.`, { hint, show: FS(a * c, b * d) }); },
      () => { const a = R(1, 7), b = R(a + 1, 9), c = R(1, 7), d = R(c + 1, 9);
        return num(`Calculate <span class="big m">${F(a, b)} ÷ ${F(c, d)}</span>`, (a * d) / (b * c), `Flip and multiply: ${F(a, b)} × ${F(d, c)} = ${F(a * d, b * c)}${gcd(a * d, b * c) > 1 || a * d > b * c ? ' = ' + MX(a * d, b * c) : ''}.`, { hint, show: MX(a * d, b * c) }); },
      () => { const w1 = R(1, 4), n1 = R(1, 3), d1 = pick([2, 3, 4]), w2 = R(1, 3), n2 = 1, d2 = pick([2, 3, 4, 5]);
        if (n1 >= d1) return null;
        const t1 = w1 * d1 + n1, t2 = w2 * d2 + n2, L = lcm(d1, d2), top = t1 * L / d1 + t2 * L / d2;
        return num(`Calculate <span class="big m">${w1}${F(n1, d1)} + ${w2}${F(n2, d2)}</span>`, top / L, `Improper fractions: ${F(t1, d1)} + ${F(t2, d2)} = ${F(t1 * L / d1, L)} + ${F(t2 * L / d2, L)} = ${F(top, L)} = ${MX(top, L)}.`, { hint, show: MX(top, L) }); },
      () => { const w = R(1, 3), n = 1, d = pick([2, 3, 4]), k = R(2, 6);
        const t = w * d + n; return num(`Calculate <span class="big m">${w}${F(n, d)} × ${k}</span>`, t * k / d, `${w}${F(n, d)} = ${F(t, d)}. ${F(t, d)} × ${k} = ${F(t * k, d)} = ${MX(t * k, d)}.`, { hint, show: MX(t * k, d) }); },
      () => { const d = pick([3, 4, 5, 6, 8, 10]), n = R(1, d - 1), amt = d * R(3, 30);
        return num(`What is <b>${F(n, d)} of R${amt}</b>?`, amt / d * n, `${amt} ÷ ${d} = ${amt / d}. Then × ${n} = R${amt / d * n}.`, { show: 'R' + fmt(amt / d * n) }); },
      () => { const p = pick([5, 10, 12, 15, 20, 25, 30, 40, 75]), amt = R(2, 20) * 20;
        return num(`Calculate <b>${p}% of ${amt}</b>.`, p * amt / 100, `${F(p, 100)} × ${amt} = ${fmt(p * amt / 100)}.`); },
      () => { const tot = pick([20, 25, 40, 50, 80]), got = R(1, tot - 1); const v = got / tot * 100;
        if (v !== Math.round(v * 10) / 10) return null;
        return num(`You got <b>${got} out of ${tot}</b> in a test. What is that as a percentage?`, v, `${F(got, tot)} × 100% = ${fmt(v)}%.`, { show: fmt(v) + '%' }); },
      () => { const orig = R(4, 30) * 10, pct = pick([10, 15, 20, 25, 30, 50]); const neu = orig * (1 + pct / 100);
        return num(`A price goes up from <b>R${orig}</b> to <b>R${fmt(neu)}</b>. What is the percentage increase?`, pct, `Increase = R${fmt(neu - orig)}. ${F(fmt(neu - orig), orig)} × 100% = ${pct}%.`, { show: pct + '%' }); },
      () => { const a = R(1, 6), b = R(a + 1, 9);
        return mc(`What is <span class="big m">(${F(a, b)})<sup>2</sup></span>?`, F(a * a, b * b), [F(a * 2, b * 2), F(a * a, b), F(a, b * b)], `Square the top and the bottom: ${F(a * a, b * b)}.`); },
      () => { const a = R(1, 9), b = R(a + 1, 12);
        return mc(`What is <span class="big m">√${F(a * a, b * b)}</span>?`, FS(a, b), [F(a * a, b), F(a, b * b), F(a * a / 2 > 1 ? a * 2 : a + 1, b)], `√${a * a} = ${a} and √${b * b} = ${b}, so the answer is ${FS(a, b)}.`); },
      () => { const g = R(2, 6), a = R(1, 5), b = R(a + 1, 9); if (gcd(a, b) > 1) return null;
        return mc(`Which fraction is equal to <span class="big m">${F(a * g, b * g)}</span>?`, F(a, b), [F(a + 1, b), F(a, b + 1), F(b, a)], `Divide top and bottom by ${g}: ${F(a, b)}.`); },
    ],
  });
})();
