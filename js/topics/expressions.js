(function () {
  const { R, nz, pick, fmt, br, term, expr, num, mc, h, s, svg, slider, clear, seg } = G8;

  G8.topic({
    id: 'expressions', strand: 'algebra', title: 'Algebraic expressions',
    blurb: 'Terms and like terms, expanding brackets, dividing, and substituting values.',
    rules: [
      'In <span class="m">5x<sup>2</sup> − 3x + 7</span> there are 3 <b>terms</b>. 5 is the <b>coefficient</b> of x<sup>2</sup>, and 7 is the <b>constant</b>.',
      '<b>Like terms</b> have exactly the same letters with the same exponents. Only like terms can be added or subtracted: <span class="m">4a + 3a = 7a</span>, but <span class="m">4a + 3a<sup>2</sup></span> stays as it is.',
      'Multiply terms: multiply the numbers, then use the exponent laws on the letters. <span class="m">3x<sup>2</sup> × 4x = 12x<sup>3</sup></span>',
      'Distributive law: everything inside the bracket gets multiplied. <span class="m">a(b + c) = ab + ac</span>',
      'A minus in front of a bracket changes every sign inside: <span class="m">−(x − 4) = −x + 4</span>',
      'Divide each term by the divisor: <span class="m">(6x<sup>2</sup> + 9x) ÷ 3x = 2x + 3</span>',
      'Square and root single terms: <span class="m">(3a<sup>2</sup>)<sup>2</sup> = 9a<sup>4</sup></span> and <span class="m">√(16x<sup>6</sup>) = 4x<sup>3</sup></span>',
      'Substitute: replace each letter with its value in brackets, then use the order of operations.',
    ],
    lesson: [
      { h: 'The language of algebra', html: `
        <p>Letters (variables) stand for numbers we don't know yet, or that can change. An <b>expression</b> has no equals sign; an <b>equation</b> does.</p>
        <div class="eg"><b>Example</b>In <span class="m">−2xy + 5y<sup>2</sup> − 8</span>: the coefficient of xy is −2, the coefficient of y<sup>2</sup> is 5, and the constant is −8.</div>` },
      { h: 'Adding and subtracting', html: `
        <div class="eg"><b>Example</b>Simplify 5x + 3y − 2x + 7y.<br>Group like terms: (5x − 2x) + (3y + 7y) = <b>3x + 10y</b></div>
        <div class="eg"><b>Example</b>Simplify 4a<sup>2</sup> + 3a − a<sup>2</sup> + 6a = <b>3a<sup>2</sup> + 9a</b></div>
        <p class="tip">The sign in front of a term belongs to that term. Circle the term with its sign before you group.</p>` },
      { h: 'Multiplying and expanding', html: `
        <div class="eg"><b>Monomials</b>(−2a<sup>3</sup>)(5a<sup>2</sup>b) = −10a<sup>5</sup>b</div>
        <div class="eg"><b>Expand</b>3x(2x − 5) = 3x × 2x − 3x × 5 = <b>6x<sup>2</sup> − 15x</b></div>
        <div class="eg"><b>Expand and simplify</b>2(x + 4) − 3(x − 1) = 2x + 8 − 3x + 3 = <b>−x + 11</b></div>
        <div class="eg"><b>Trinomial</b>−a(a<sup>2</sup> − 2a + 4) = <b>−a<sup>3</sup> + 2a<sup>2</sup> − 4a</b></div>` },
      { h: 'Dividing', html: `
        <div class="eg"><b>Example</b>${'(12x<sup>3</sup> − 8x<sup>2</sup> + 4x) ÷ 4x'} = 3x<sup>2</sup> − 2x + 1. Each term is divided by 4x.</div>` },
      { h: 'Substitution', html: `
        <div class="eg"><b>Example</b>If a = −2 and b = 3, find 3a<sup>2</sup> − ab.<br>3(−2)<sup>2</sup> − (−2)(3) = 3(4) + 6 = <b>18</b></div>` },
    ],
    demos: [
      { title: 'Expanding with an area model', about: 'A bracket times a term is just the area of a rectangle cut into two pieces.', run(el) {
        let a = 3, b = 2, c = 5;
        const pic = svg(340, 170);
        const out = h('div', { class: 'readout' });
        function draw() {
          clear(pic);
          const W = 280, wx = W * (b * 2) / (b * 2 + c), wc = W - wx; // pretend x is about 2 units wide
          const H = 40 + a * 14;
          const x0 = 50, y0 = 30;
          pic.append(s('rect', { x: x0, y: y0, width: wx, height: H, fill: 'var(--s-algebra)', 'fill-opacity': .35, stroke: 'currentColor' }));
          pic.append(s('rect', { x: x0 + wx, y: y0, width: wc, height: H, fill: 'var(--red)', 'fill-opacity': .3, stroke: 'currentColor' }));
          pic.append(s('text', { x: x0 + wx / 2, y: 20, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700 }, term(b, 'x')));
          pic.append(s('text', { x: x0 + wx + wc / 2, y: 20, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700 }, '+ ' + c));
          pic.append(s('text', { x: 30, y: y0 + H / 2 + 5, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700 }, term(a, 'x')));
          pic.append(s('text', { x: x0 + wx / 2, y: y0 + H / 2 + 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, class: 'hand' }, term(a * b, 'x', 2)));
          pic.append(s('text', { x: x0 + wx + wc / 2, y: y0 + H / 2 + 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, class: 'hand' }, term(a * c, 'x')));
          pic.setAttribute('viewBox', `0 0 340 ${y0 + H + 10}`);
          out.innerHTML = `${term(a, 'x')}(${expr([[b, 'x'], [c, '']])}) = ${term(a, 'x')} × ${term(b, 'x')} + ${term(a, 'x')} × ${c} = <b>${expr([[a * b, 'x', 2], [a * c, 'x']])}</b>`;
        }
        el.append(pic, h('div', { class: 'controls' },
          slider('Outside: ?x', 1, 6, 1, a, (v) => { a = v; draw(); }).el,
          slider('Inside: ?x', 1, 5, 1, b, (v) => { b = v; draw(); }).el,
          slider('Inside: number', 1, 9, 1, c, (v) => { c = v; draw(); }).el), out);
        draw();
      } },
      { title: 'Like terms sorter', about: 'Tap "New expression". Like terms get the same colour, then they combine.', run(el) {
        const out = h('div', { class: 'readout', style: 'font-size:20px;line-height:1.9' });
        const cols = { x2: 'var(--s-measure)', x: 'var(--s-algebra)', y: 'var(--s-numbers)', c: 'var(--red)' };
        function make() {
          const kinds = [['x', 2, 'x2'], ['x', 1, 'x'], ['y', 1, 'y'], ['', 1, 'c']];
          const terms = [];
          kinds.forEach((k) => { const n = R(1, 2); for (let i = 0; i < n; i++) terms.push({ c: nz(-7, 9), v: k[0], p: k[1], key: k[2] }); });
          const shuffled = G8.shuffle(terms);
          const show = shuffled.map((t, i) => {
            const body = term(Math.abs(t.c), t.v, t.p);
            const sign = t.c < 0 ? '− ' : i ? '+ ' : '';
            return `<span style="color:${cols[t.key]};font-weight:700">${sign}${body}</span>`;
          }).join(' ');
          const sums = {}; terms.forEach((t) => (sums[t.key] = (sums[t.key] || 0) + t.c));
          const ans = expr([[sums.x2 || 0, 'x', 2], [sums.x || 0, 'x'], [sums.y || 0, 'y'], [sums.c || 0, '']]);
          out.innerHTML = `${show}<br>= <b>${ans}</b><br><span class="small muted">Purple x², green x, blue y, red numbers</span>`;
        }
        el.append(out, h('div', { class: 'row' }, G8.btn('New expression', make)));
        make();
      } },
    ],
    gens: [
      () => { const a = nz(-9, 9), b = nz(-9, 9), c = nz(-9, 9), d = nz(-9, 9);
        const q = expr([[a, 'x'], [b, 'y'], [c, 'x'], [d, 'y']]);
        return mc(`Simplify <span class="big m">${q}</span>`, expr([[a + c, 'x'], [b + d, 'y']]), [expr([[a + c, 'x'], [b - d, 'y']]), expr([[a - c, 'x'], [b + d, 'y']]), term(a + b + c + d, 'xy')], `Group like terms: (${expr([[a, 'x'], [c, 'x']])}) + (${expr([[b, 'y'], [d, 'y']])}) = ${expr([[a + c, 'x'], [b + d, 'y']])}.`); },
      () => { const a = nz(-6, 9), b = nz(-6, 9), c = nz(-6, 6);
        const q = expr([[a, 'a', 2], [b, 'a'], [c, 'a', 2]]);
        return mc(`Simplify <span class="big m">${q}</span>`, expr([[a + c, 'a', 2], [b, 'a']]), [term(a + b + c, 'a', 2), expr([[a + c, 'a', 4], [b, 'a']]), term(a + b + c, 'a', 3)], `Only the a<sup>2</sup> terms are like terms: ${fmt(a)} + ${br(c)} = ${fmt(a + c)}. The ${term(b, 'a')} stays.`); },
      () => { const a = nz(-5, 6), b = R(1, 4), c = nz(-5, 6), d = R(1, 3);
        return mc(`Simplify <span class="big m">(${term(a, 'x', b)})(${term(c, 'x', d)})</span>`, term(a * c, 'x', b + d), [term(a * c, 'x', b * d), term(a + c, 'x', b + d), term(a * c, 'x', b + d + 1)], `Multiply numbers: ${br(a)} × ${br(c)} = ${fmt(a * c)}. Add exponents: ${b} + ${d} = ${b + d}.`); },
      () => { const a = nz(-5, 6), b = R(1, 6), c = nz(-9, 9);
        return mc(`Expand <span class="big m">${term(a, 'x')}(${expr([[b, 'x'], [c, '']])})</span>`, expr([[a * b, 'x', 2], [a * c, 'x']]), [expr([[a * b, 'x', 2], [c, '']]), expr([[a * b, 'x'], [a * c, 'x']]), expr([[a * b, 'x', 2], [-a * c, 'x']])], `${term(a, 'x')} × ${term(b, 'x')} = ${term(a * b, 'x', 2)} and ${term(a, 'x')} × ${br(c)} = ${term(a * c, 'x')}.`); },
      () => { const a = R(2, 5), b = R(1, 9), c = R(2, 5), d = R(1, 9);
        const ans = expr([[a - c, 'x'], [a * b + c * d, '']]);
        return mc(`Expand and simplify <span class="big m">${a}(x + ${b}) − ${c}(x − ${d})</span>`, ans, [expr([[a - c, 'x'], [a * b - c * d, '']]), expr([[a + c, 'x'], [a * b + c * d, '']]), expr([[a - c, 'x'], [b + d, '']])], `${a}x + ${a * b} − ${c}x + ${c * d} = ${ans}. Watch the sign: −${c} × −${d} = +${c * d}.`); },
      () => { const k = R(2, 6), a = nz(-4, 5), b = nz(-6, 6);
        return mc(`Simplify <span class="big m">(${expr([[k * a, 'x', 2], [k * b, 'x']])}) ÷ ${k}x</span>`, expr([[a, 'x'], [b, '']]), [expr([[a, 'x', 2], [b, 'x']]), expr([[k * a, 'x'], [k * b, '']]), expr([[a, 'x'], [b, 'x']])], `Divide each term by ${k}x: ${term(k * a, 'x', 2)} ÷ ${k}x = ${term(a, 'x')}, and ${term(k * b, 'x')} ÷ ${k}x = ${fmt(b)}.`); },
      () => { const c = R(2, 6), p = R(1, 4);
        return mc(`Simplify <span class="big m">(${term(c, 'a', p)})<sup>2</sup></span>`, term(c * c, 'a', 2 * p), [term(c * 2, 'a', 2 * p), term(c * c, 'a', p + 2), term(c, 'a', 2 * p)], `Square the number: ${c}<sup>2</sup> = ${c * c}. Multiply the exponent by 2: ${2 * p}.`); },
      () => { const c = R(2, 9), p = R(1, 4);
        return mc(`Simplify <span class="big m">√(${term(c * c, 'x', 2 * p)})</span>`, term(c, 'x', p), [term(c * c / 2 === Math.round(c * c / 2) ? c * c / 2 : c + 1, 'x', p), term(c, 'x', 2 * p - 1 || 1), term(c, 'x', p + 2)], `√${c * c} = ${c}, and halve the exponent: ${2 * p} ÷ 2 = ${p}.`); },
      () => { const a = nz(-4, 4), b = nz(-4, 4), p = R(2, 5), q = nz(-5, 5);
        const v = p * a * a + q * a * b;
        return num(`If <b>a = ${fmt(a)}</b> and <b>b = ${fmt(b)}</b>, find the value of <span class="m big">${expr([[p, 'a', 2], [q, 'ab']])}</span>`, v, `${p}(${fmt(a)})<sup>2</sup> ${q < 0 ? '−' : '+'} ${Math.abs(q)}(${fmt(a)})(${fmt(b)}) = ${p * a * a} ${q * a * b < 0 ? '−' : '+'} ${Math.abs(q * a * b)} = ${fmt(v)}.`); },
      () => { const a = nz(-6, 9), v = pick(['x', 'y', 'm']), p = R(2, 4), c = nz(-9, 9);
        const q = expr([[a, v, p], [c, '']]);
        return num(`What is the <b>coefficient of ${v}<sup>${p}</sup></b> in <span class="m big">${q}</span>?`, a, `The coefficient is the number in front of ${v}<sup>${p}</sup>, sign included: ${fmt(a)}.`); },
      () => { const a = R(1, 6), b = nz(-6, 6);
        return mc(`Simplify <span class="big m">−(${expr([[a, 'x'], [b, '']])})</span>`, expr([[-a, 'x'], [-b, '']]), [expr([[-a, 'x'], [b, '']]), expr([[a, 'x'], [-b, '']]), expr([[a, 'x'], [b, '']])], 'The minus in front changes the sign of every term inside the bracket.'); },
    ],
  });
})();
