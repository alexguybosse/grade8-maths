(function () {
  const { R, pick, fmt, num, mc, near, h, s, svg, slider, clear, seg } = G8;
  const P = (b, e) => `${b}<sup>${e}</sup>`;

  G8.topic({
    id: 'exponents', strand: 'numbers', title: 'Exponents',
    blurb: 'Powers, the exponent laws, square and cube roots, and scientific notation.',
    rules: [
      'In <span class="m">a<sup>n</sup></span>, <b>a</b> is the base and <b>n</b> is the exponent: multiply a by itself n times.',
      'Multiply powers with the same base: <b>add</b> the exponents. <span class="m">a<sup>m</sup> × a<sup>n</sup> = a<sup>m+n</sup></span>',
      'Divide powers with the same base: <b>subtract</b> the exponents. <span class="m">a<sup>m</sup> ÷ a<sup>n</sup> = a<sup>m−n</sup></span>',
      'Power of a power: <b>multiply</b> the exponents. <span class="m">(a<sup>m</sup>)<sup>n</sup> = a<sup>m×n</sup></span>',
      'Power of a product: <span class="m">(a × b)<sup>n</sup> = a<sup>n</sup> × b<sup>n</sup></span>',
      'Anything (except 0) to the power 0 is 1: <span class="m">a<sup>0</sup> = 1</span>',
      'Scientific notation: <span class="m">a × 10<sup>n</sup></span> where <span class="m">1 ≤ a &lt; 10</span>. E.g. 34 000 = 3,4 × 10<sup>4</sup>.',
      'The square root undoes squaring (√49 = 7). The cube root undoes cubing (∛64 = 4).',
    ],
    lesson: [
      { h: 'What a power means', html: `
        <div class="eg"><b>Example</b>2<sup>5</sup> = 2 × 2 × 2 × 2 × 2 = <b>32</b>. It is <i>not</i> 2 × 5.</div>
        <p>Know these by heart: squares up to 15<sup>2</sup> = 225, and cubes up to 6<sup>3</sup> = 216. Also 10<sup>n</sup> is 1 followed by n zeros.</p>
        <div class="scroll-x"><table><tr><th>n</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>
        <tr><th>n<sup>2</sup></th><td>1</td><td>4</td><td>9</td><td>16</td><td>25</td><td>36</td><td>49</td><td>64</td><td>81</td><td>100</td></tr>
        <tr><th>n<sup>3</sup></th><td>1</td><td>8</td><td>27</td><td>64</td><td>125</td><td>216</td><td>343</td><td>512</td><td>729</td><td>1 000</td></tr></table></div>` },
      { h: 'The exponent laws', html: `
        <div class="eg"><b>Multiply → add</b>x<sup>3</sup> × x<sup>4</sup> = (x·x·x)(x·x·x·x) = <b>x<sup>7</sup></b></div>
        <div class="eg"><b>Divide → subtract</b>y<sup>8</sup> ÷ y<sup>3</sup> = <b>y<sup>5</sup></b> (three of the y's cancel)</div>
        <div class="eg"><b>Power of a power → multiply</b>(a<sup>2</sup>)<sup>3</sup> = a<sup>2</sup> × a<sup>2</sup> × a<sup>2</sup> = <b>a<sup>6</sup></b></div>
        <div class="eg"><b>Brackets</b>(2x)<sup>3</sup> = 2<sup>3</sup> × x<sup>3</sup> = <b>8x<sup>3</sup></b>. Everything inside the bracket gets the power.</div>
        <div class="eg"><b>Power 0</b>5<sup>0</sup> = 1 because 5<sup>3</sup> ÷ 5<sup>3</sup> = 5<sup>0</sup>, and anything divided by itself is 1.</div>
        <p class="tip">The laws only work when the <b>bases are the same</b>. 2<sup>3</sup> × 3<sup>2</sup> can't be combined; just work it out: 8 × 9 = 72.</p>` },
      { h: 'Scientific notation', html: `
        <p>Huge numbers are easier to read as a number between 1 and 10 times a power of 10.</p>
        <div class="eg"><b>Example</b>The Earth is about 150 000 000 km from the Sun.<br>Move the comma until you have a number between 1 and 10: 1,5. You moved it 8 places, so it's <b>1,5 × 10<sup>8</sup> km</b>.</div>
        <div class="eg"><b>Example</b>4,02 × 10<sup>5</sup> = 4,02 × 100 000 = <b>402 000</b>.</div>` },
      { h: 'Order of operations with powers', html: `
        <div class="eg"><b>Example</b>3 + 2 × 4<sup>2</sup> = 3 + 2 × 16 = 3 + 32 = <b>35</b>. Powers come before multiplying.</div>` },
    ],
    demos: [
      { title: 'See the laws work', about: 'Each square is one copy of the base. Change the exponents and watch them combine.', run(el) {
        let law = 'mul', m = 3, n = 2;
        const pic = h('div', { style: 'font-size:22px;line-height:2;font-weight:700;min-height:90px' });
        const out = h('div', { class: 'readout' });
        const box = (c) => `<span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;border:2px solid ${c};border-radius:6px;margin:2px;font-size:16px">a</span>`;
        const cut = `<span style="display:inline-block;width:30px;height:30px;line-height:30px;text-align:center;border:2px dashed var(--red);border-radius:6px;margin:2px;font-size:16px;color:var(--red);text-decoration:line-through">a</span>`;
        function draw() {
          if (law === 'mul') {
            pic.innerHTML = Array(m).fill(box('var(--s-numbers)')).join('') + ' × ' + Array(n).fill(box('var(--red)')).join('');
            out.innerHTML = `a<sup>${m}</sup> × a<sup>${n}</sup> = <b>a<sup>${m + n}</sup></b> &nbsp; (${m} + ${n} = ${m + n} copies)`;
          } else if (law === 'div') {
            const k = Math.min(m, n);
            pic.innerHTML = Array(k).fill(cut).join('') + Array(m - k).fill(box('var(--s-numbers)')).join('') + (m < n ? ' <span class="small muted">(pick a top power at least as big)</span>' : '');
            out.innerHTML = m >= n ? `a<sup>${m}</sup> ÷ a<sup>${n}</sup> = <b>a<sup>${m - n}</sup></b> &nbsp; (${n} copies cancel; ${m} − ${n} = ${m - n})` + (m === n ? '<br>Everything cancels, which is why a<sup>0</sup> = 1.' : '') : 'Grade 8 keeps the top power bigger.';
          } else {
            pic.innerHTML = Array(n).fill('(' + Array(m).fill(box('var(--s-numbers)')).join('') + ')').join(' ');
            out.innerHTML = `(a<sup>${m}</sup>)<sup>${n}</sup> = <b>a<sup>${m * n}</sup></b> &nbsp; (${n} groups of ${m} = ${m * n} copies)`;
          }
        }
        const sg = seg([['mul', 'Multiply'], ['div', 'Divide'], ['pow', 'Power of a power']], law, (v) => { law = v; draw(); });
        el.append(sg, pic, h('div', { class: 'controls' },
          slider('m', 1, 6, 1, m, (v) => { m = v; draw(); }).el,
          slider('n', 1, 5, 1, n, (v) => { n = v; draw(); }).el), out);
        draw();
      } },
      { title: 'Scientific notation slider', about: 'Slide the number of zeros and see the comma jump.', run(el) {
        let a = 3.4, n = 6;
        const out = h('div', { class: 'readout', style: 'font-size:20px' });
        function draw() {
          const full = Math.round(a * Math.pow(10, n));
          out.innerHTML = `<b>${fmt(a)} × 10<sup>${n}</sup></b><br>= ${fmt(full)}<br><span class="small muted">The comma moves ${n} places to the right.</span>`;
        }
        el.append(h('div', { class: 'controls' },
          slider('Number (1 to 9,9)', 1, 9.9, 0.1, a, (v) => { a = v; draw(); }).el,
          slider('Power of 10', 1, 12, 1, n, (v) => { n = v; draw(); }).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const b = R(2, 5), e = R(2, b === 2 ? 7 : 4); return num(`Calculate <span class="big m">${P(b, e)}</span>`, Math.pow(b, e), `${Array(e).fill(b).join(' × ')} = ${fmt(Math.pow(b, e))}. Not ${b} × ${e}.`); },
      () => { const v = pick(['x', 'a', 'y', 'p']), m = R(2, 9), n = R(2, 9);
        return num(`Simplify <span class="big m">${v}<sup>${m}</sup> × ${v}<sup>${n}</sup> = ${v}<sup>?</sup></span><br>What is the exponent?`, m + n, `Same base, multiplying: add the exponents. ${m} + ${n} = ${m + n}.`, { inputmode: 'numeric' }); },
      () => { const v = pick(['x', 'a', 'y', 'k']), n = R(2, 6), m = n + R(1, 8);
        return num(`Simplify <span class="big m">${v}<sup>${m}</sup> ÷ ${v}<sup>${n}</sup> = ${v}<sup>?</sup></span><br>What is the exponent?`, m - n, `Same base, dividing: subtract. ${m} − ${n} = ${m - n}.`, { inputmode: 'numeric' }); },
      () => { const v = pick(['x', 'm', 'b']), m = R(2, 6), n = R(2, 5);
        return mc(`Simplify <span class="big m">(${v}<sup>${m}</sup>)<sup>${n}</sup></span>`, `${v}<sup>${m * n}</sup>`, [`${v}<sup>${m + n}</sup>`, `${v}<sup>${Math.pow(m, n)}</sup>`, `${n}${v}<sup>${m}</sup>`], `Power of a power: multiply the exponents. ${m} × ${n} = ${m * n}.`); },
      () => { const c = R(2, 5), v = pick(['x', 'y']), n = pick([2, 3]);
        return mc(`Simplify <span class="big m">(${c}${v})<sup>${n}</sup></span>`, `${Math.pow(c, n)}${v}<sup>${n}</sup>`, [`${c}${v}<sup>${n}</sup>`, `${c * n}${v}<sup>${n}</sup>`, `${Math.pow(c, n)}${v}`], `Both parts get the power: ${c}<sup>${n}</sup> × ${v}<sup>${n}</sup> = ${Math.pow(c, n)}${v}<sup>${n}</sup>.`); },
      () => { const b = pick([7, 13, 250, 'x', '3y', '−5']); return num(`What is <span class="big m">(${b})<sup>0</sup></span>?`, 1, 'Anything except 0 raised to the power 0 equals 1.', { inputmode: 'numeric' }); },
      () => { const r = R(2, 15); return num(`Calculate <span class="big m">√${r * r}</span>`, r, `${r} × ${r} = ${r * r}, so √${r * r} = ${r}.`); },
      () => { const r = R(2, 10); return num(`Calculate <span class="big m">∛${fmt(r * r * r)}</span>`, r, `${r} × ${r} × ${r} = ${fmt(r * r * r)}, so the cube root is ${r}.`); },
      () => { const a = R(11, 99) / 10, n = R(3, 9); const val = Math.round(a * Math.pow(10, n));
        const right = `${fmt(a)} × 10<sup>${n}</sup>`;
        return mc(`Write <b>${fmt(val)}</b> in scientific notation.`, right, [`${fmt(a)} × 10<sup>${n + 1}</sup>`, `${fmt(a * 10)} × 10<sup>${n - 1}</sup>`, `${fmt(a)} × 10<sup>${n - 1}</sup>`], `Put the comma after the first digit: ${fmt(a)}. Count the places it moved: ${n}. So ${right}.`); },
      () => { const a = R(11, 99) / 10, n = R(2, 6); const val = Math.round(a * Math.pow(10, n));
        return num(`Write <b>${fmt(a)} × 10<sup>${n}</sup></b> as an ordinary number.`, val, `Move the comma ${n} places right: ${fmt(val)}.`); },
      () => { const a = R(2, 9), b = R(2, 4), c = R(2, 5); const v = a + b * c * c;
        return num(`Calculate <span class="big m">${a} + ${b} × ${c}<sup>2</sup></span>`, v, `Power first: ${c}<sup>2</sup> = ${c * c}. Then ${b} × ${c * c} = ${b * c * c}. Then ${a} + ${b * c * c} = ${v}.`); },
      () => { const a = R(2, 3), m = R(2, 4), n = R(1, 3); const v = Math.pow(a, m + n);
        return num(`Calculate <span class="big m">${P(a, m)} × ${P(a, n)}</span>`, v, `${P(a, m)} × ${P(a, n)} = ${P(a, m + n)} = ${fmt(v)}.`); },
    ],
  });
})();
