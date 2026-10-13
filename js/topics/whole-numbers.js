(function () {
  const { R, pick, gcd, lcm, round, fmt, money, num, mc, near, h, s, svg, slider, clear } = G8;

  function primeFactors(n) {
    const f = []; let d = 2;
    while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; if (d * d > n && n > 1) { f.push(n); break; } }
    return f;
  }
  const powForm = (f) => {
    const c = {}; f.forEach((p) => (c[p] = (c[p] || 0) + 1));
    return Object.keys(c).map((p) => (c[p] > 1 ? `${p}<sup>${c[p]}</sup>` : p)).join(' × ');
  };

  G8.topic({
    id: 'whole-numbers', strand: 'numbers', title: 'Whole numbers',
    blurb: 'Prime factors, HCF and LCM, ratio and rate, and money maths: VAT, discount and interest.',
    rules: [
      'Order of operations: <b>B</b>rackets, <b>O</b>f / exponents, <b>D</b>ivide and <b>M</b>ultiply (left to right), <b>A</b>dd and <b>S</b>ubtract (left to right).',
      'Commutative: <span class="m">a + b = b + a</span> and <span class="m">a × b = b × a</span>. Associative: you can regroup, <span class="m">(a + b) + c = a + (b + c)</span>. Distributive: <span class="m">a(b + c) = ab + ac</span>.',
      'A <b>prime</b> has exactly two factors: 1 and itself. 1 is not prime. 2 is the only even prime.',
      '<b>HCF</b> = multiply the prime factors the numbers <i>share</i>. <b>LCM</b> = multiply every prime factor, using the highest power of each.',
      'Ratio <span class="m">a : b</span> means a share out of <span class="m">a + b</span> parts. Rate compares different units, e.g. km per hour.',
      'Profit = selling price − cost price. Discount and VAT are percentages of the original price. VAT in South Africa is 15%.',
      'Simple interest: <span class="m">A = P(1 + i·n)</span>. Compound interest: <span class="m">A = P(1 + i)<sup>n</sup></span>. P is the starting amount, i is the rate as a decimal, n is the number of years.',
    ],
    lesson: [
      { h: 'Properties of numbers', html: `
        <p>Whole numbers are 0, 1, 2, 3 and so on. Three properties let you rearrange sums to make them easier.</p>
        <div class="eg"><b>Example</b>Work out 25 × 37 × 4 in your head.<br>Swap the order (commutative): 25 × 4 × 37 = 100 × 37 = <b>3 700</b>.</div>
        <div class="eg"><b>Example</b>Work out 8 × 103 using the distributive law.<br>8 × (100 + 3) = 800 + 24 = <b>824</b>.</div>
        <p>Zero and one are special: <span class="m">a + 0 = a</span>, <span class="m">a × 1 = a</span>, <span class="m">a × 0 = 0</span>, and you can never divide by 0.</p>` },
      { h: 'Prime factors, HCF and LCM', html: `
        <p>Every whole number bigger than 1 can be written as a product of primes in exactly one way. Build a factor tree: keep splitting until every branch ends in a prime.</p>
        <div class="eg"><b>Example</b>Find the HCF and LCM of 36 and 60.
          <ol><li>36 = 2 × 2 × 3 × 3 = 2<sup>2</sup> × 3<sup>2</sup></li><li>60 = 2 × 2 × 3 × 5 = 2<sup>2</sup> × 3 × 5</li>
          <li>Shared: 2 × 2 × 3, so <b>HCF = 12</b></li><li>Highest powers of everything: 2<sup>2</sup> × 3<sup>2</sup> × 5, so <b>LCM = 180</b></li></ol></div>
        <p class="tip">Check: HCF × LCM = the two numbers multiplied. 12 × 180 = 2 160 = 36 × 60. ✓</p>` },
      { h: 'Ratio and rate', html: `
        <div class="eg"><b>Example</b>Share R720 between Thandi and Sipho in the ratio 5 : 3.
          <ol><li>Total parts = 5 + 3 = 8</li><li>One part = 720 ÷ 8 = R90</li><li>Thandi gets 5 × 90 = <b>R450</b>, Sipho gets 3 × 90 = <b>R270</b></li></ol></div>
        <div class="eg"><b>Example</b>A taxi drives 240 km in 3 hours. Its average speed is 240 ÷ 3 = <b>80 km/h</b>.</div>` },
      { h: 'Money maths', html: `
        <div class="eg"><b>VAT</b>A phone costs R2 400 before VAT. VAT = 15% × 2 400 = R360. Price with VAT = <b>R2 760</b>. (Shortcut: 2 400 × 1,15.)</div>
        <div class="eg"><b>Discount</b>A R480 jacket has 25% off. Discount = 0,25 × 480 = R120. You pay <b>R360</b>.</div>
        <div class="eg"><b>Simple interest</b>R5 000 at 8% per year for 3 years.<br>A = 5 000(1 + 0,08 × 3) = 5 000 × 1,24 = <b>R6 200</b>. Interest earned is R1 200.</div>
        <div class="eg"><b>Compound interest</b>R5 000 at 8% per year, compounded yearly for 3 years.<br>A = 5 000(1,08)<sup>3</sup> = <b>R6 298,56</b>. You earn interest on your interest, so it beats simple interest.</div>
        <p><b>Hire purchase</b> means paying a deposit and then monthly instalments. Total cost = deposit + (instalment × number of months). It always costs more than paying cash.</p>
        <p><b>Exchange rates</b>: if $1 = R18, then $50 = 50 × 18 = R900, and R360 = 360 ÷ 18 = $20.</p>` },
    ],
    demos: [
      { title: 'Factor tree', about: 'Pick a number and watch it split into primes.', run(el) {
        const pic = svg(340, 230);
        const out = h('div', { class: 'readout' });
        function draw(n) {
          clear(pic);
          const f = primeFactors(n);
          const stepY = Math.min(46, 196 / Math.max(1, f.length - 1));
          let x = f.length > 5 ? 60 : 110, y = 24, cur = n;
          const ring = (cx, cy, r) => pic.append(s('circle', { cx, cy: cy - 6, r, fill: 'none', stroke: 'var(--red)', 'stroke-width': 2 }));
          pic.append(s('text', { x, y, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700 }, cur));
          if (f.length === 1) ring(x, y, 22);
          f.slice(0, -1).forEach((p) => {
            const ny = y + stepY, lx = x - 30, rx = x + 38;
            pic.append(s('line', { x1: x - 4, y1: y + 6, x2: lx, y2: ny - 18, stroke: 'currentColor', 'stroke-opacity': .45 }));
            pic.append(s('line', { x1: x + 4, y1: y + 6, x2: rx, y2: ny - 18, stroke: 'currentColor', 'stroke-opacity': .45 }));
            ring(lx, ny, 13);
            pic.append(s('text', { x: lx, y: ny, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: 'var(--red)' }, p));
            cur = cur / p;
            pic.append(s('text', { x: rx, y: ny, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700 }, cur));
            x = rx; y = ny;
          });
          if (f.length > 1) ring(x, y, 13 + String(cur).length * 2);
          out.innerHTML = f.length === 1 ? `<b>${n}</b> is prime. Its only factors are 1 and ${n}.` : `<b>${n} = ${f.join(' × ')} = ${powForm(f)}</b><br><span class="muted">Circled numbers are primes.</span>`;
        }
        const sl = slider('Number', 2, 400, 1, 360, draw);
        el.append(pic, h('div', { class: 'controls' }, sl.el), out);
        draw(360);
      } },
      { title: 'Simple vs compound interest', about: 'Drag the sliders and watch compound interest pull ahead over time.', run(el) {
        const pic = svg(340, 200);
        const out = h('div', { class: 'readout' });
        let P = 1000, r = 10, n = 10;
        function draw() {
          clear(pic);
          const sim = [], com = [];
          for (let k = 0; k <= n; k++) { sim.push(P * (1 + r / 100 * k)); com.push(P * Math.pow(1 + r / 100, k)); }
          const max = com[n] * 1.05, W = 300, H = 160, ox = 32, oy = 180;
          pic.append(s('line', { x1: ox, y1: oy, x2: ox + W, y2: oy, stroke: 'currentColor', 'stroke-opacity': .5 }));
          pic.append(s('line', { x1: ox, y1: oy, x2: ox, y2: oy - H, stroke: 'currentColor', 'stroke-opacity': .5 }));
          const bw = W / (n + 1) / 2.4;
          for (let k = 0; k <= n; k++) {
            const x = ox + (k + 0.5) * W / (n + 1);
            const hs = sim[k] / max * H, hc = com[k] / max * H;
            pic.append(s('rect', { x: x - bw, y: oy - hs, width: bw, height: hs, fill: 'var(--s-numbers)', opacity: .55 }));
            pic.append(s('rect', { x, y: oy - hc, width: bw, height: hc, fill: 'var(--red)', opacity: .85 }));
            if (n <= 12 || k % 2 === 0) pic.append(s('text', { x: x, y: oy + 14, 'text-anchor': 'middle', 'font-size': 10 }, k));
          }
          pic.append(s('text', { x: ox + W, y: oy + 14, 'text-anchor': 'end', 'font-size': 10 }, 'years'));
          out.innerHTML = `After ${n} years: simple <b style="color:var(--s-numbers)">${money(sim[n])}</b>, compound <b style="color:var(--red)">${money(com[n])}</b>.<br>Compound earns you ${money(com[n] - sim[n])} more.`;
        }
        el.append(pic, h('div', { class: 'controls' },
          slider('Amount (P)', 500, 10000, 500, P, (v) => { P = v; draw(); }, (v) => 'R' + fmt(v)).el,
          slider('Rate per year', 1, 20, 1, r, (v) => { r = v; draw(); }, (v) => v + '%').el,
          slider('Years', 1, 20, 1, n, (v) => { n = v; draw(); }).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const g = pick([2, 3, 4, 5, 6, 8, 12]); const a = g * R(2, 9), b = g * R(2, 9); if (a === b) return null;
        const H = gcd(a, b); return num(`Find the HCF of <b>${a}</b> and <b>${b}</b>.`, H, `${a} = ${powForm(primeFactors(a))} and ${b} = ${powForm(primeFactors(b))}. Multiply the shared primes: HCF = ${H}.`); },
      () => { const a = R(3, 15), b = R(3, 15); if (a === b) return null; const L = lcm(a, b);
        return num(`Find the LCM of <b>${a}</b> and <b>${b}</b>.`, L, `List multiples or use prime factors: ${a} = ${powForm(primeFactors(a))}, ${b} = ${powForm(primeFactors(b))}. Highest power of each prime: LCM = ${L}.`); },
      () => { const n = pick([24, 36, 40, 48, 60, 72, 84, 90, 96, 100, 108, 120, 126, 150, 180]); const f = primeFactors(n);
        const right = powForm(f);
        const wrongs = [powForm(f.slice(1).concat([f[0] * 2]).sort((x, y) => x - y)), powForm([...f.slice(0, -1), f[f.length - 1] + 2].sort((x, y) => x - y)), powForm(f.slice(1))];
        return mc(`Which is <b>${n}</b> as a product of prime factors?`, right, wrongs, `${n} = ${f.join(' × ')} = ${right}.`); },
      () => { const a = R(1, 7), b = R(1, 7); if (a === b) return null; const unit = R(2, 30) * 10; const tot = (a + b) * unit;
        return num(`Share <b>R${fmt(tot)}</b> in the ratio <b>${a} : ${b}</b>. How much is the bigger share (in rand)?`, Math.max(a, b) * unit, `${a} + ${b} = ${a + b} parts. One part = ${fmt(tot)} ÷ ${a + b} = R${fmt(unit)}. Bigger share = ${Math.max(a, b)} × ${unit} = R${fmt(Math.max(a, b) * unit)}.`); },
      () => { const v = pick([60, 70, 80, 90, 100, 110, 120]), t = R(2, 5);
        return num(`A car travels <b>${v * t} km</b> in <b>${t} hours</b>. What is its average speed in km/h?`, v, `Speed = distance ÷ time = ${v * t} ÷ ${t} = ${v} km/h.`); },
      () => { const p = R(4, 60) * 20; const a = round(p * 1.15, 2);
        return num(`A bicycle costs <b>${money(p)}</b> excluding VAT. What does it cost including 15% VAT?`, a, `VAT = 15% × ${fmt(p)} = ${money(p * 0.15)}. Total = ${money(a)}. (Or ${fmt(p)} × 1,15.)`, { tol: 0.011, show: money(a) }); },
      () => { const p = R(4, 40) * 50, d = pick([10, 15, 20, 25, 30, 40]); const a = p * (1 - d / 100);
        return num(`Shoes cost <b>${money(p)}</b>. They are on sale at <b>${d}% off</b>. What is the sale price?`, a, `Discount = ${d}% × ${fmt(p)} = ${money(p * d / 100)}. Sale price = ${fmt(p)} − ${fmt(p * d / 100)} = ${money(a)}.`, { tol: 0.011, show: money(a) }); },
      () => { const P = R(2, 20) * 500, i = R(3, 12), n = R(2, 6); const A = P * (1 + i / 100 * n);
        return num(`<b>${money(P)}</b> is invested at <b>${i}% simple interest</b> per year for <b>${n} years</b>. What is the final amount?`, A, `A = P(1 + i·n) = ${fmt(P)}(1 + ${fmt(i / 100)} × ${n}) = ${fmt(P)} × ${fmt(1 + i / 100 * n)} = ${money(A)}.`, { tol: 0.011, show: money(A) }); },
      () => { const P = R(2, 10) * 1000, i = pick([5, 8, 10, 12]), n = R(2, 3); const A = round(P * Math.pow(1 + i / 100, n), 2);
        return num(`<b>${money(P)}</b> is invested at <b>${i}% compound interest</b> per year for <b>${n} years</b>. What is the final amount? Round to the nearest cent.`, A, `A = P(1 + i)<sup>n</sup> = ${fmt(P)} × ${fmt(1 + i / 100)}<sup>${n}</sup> = ${money(A)}.`, { tol: 0.011, show: money(A) }); },
      () => { const c = R(10, 80) * 10, pr = R(1, 30) * 10;
        return num(`A shop buys a lamp for <b>${money(c)}</b> and sells it for <b>${money(c + pr)}</b>. What is the profit?`, pr, `Profit = selling price − cost price = ${fmt(c + pr)} − ${fmt(c)} = ${money(pr)}.`, { show: money(pr) }); },
      () => { const rate = pick([16, 17, 18, 19, 20]), d = R(2, 40) * 5;
        return num(`If <b>$1 = R${rate}</b>, how many rand is <b>$${d}</b>?`, rate * d, `${d} × ${rate} = R${fmt(rate * d)}.`, { show: 'R' + fmt(rate * d) }); },
      () => { const a = R(2, 9), b = R(2, 9), c = R(2, 9), d = R(1, 9);
        const v = a + b * c - d;
        return mc(`Calculate <span class="big m">${a} + ${b} × ${c} − ${d}</span>`, fmt(v), near(v).concat([(a + b) * c - d]).map((v) => fmt(v)), `Multiply first: ${b} × ${c} = ${b * c}. Then ${a} + ${b * c} − ${d} = ${v}.`); },
      () => { const n = R(2, 9), d = pick([1, 2, 3, 4, 5, 6, 7, 8, 9]), base = pick([100, 1000]);
        return num(`Use the distributive law: <span class="m big">${n} × ${base + d}</span>`, n * (base + d), `${n} × (${base} + ${d}) = ${n * base} + ${n * d} = ${fmt(n * (base + d))}.`); },
      () => { const dep = R(2, 10) * 100, inst = R(10, 40) * 10, m = pick([6, 12, 18, 24]);
        return num(`A TV on hire purchase needs a <b>${money(dep)}</b> deposit and <b>${m}</b> monthly payments of <b>${money(inst)}</b>. What is the total cost?`, dep + inst * m, `Total = deposit + payments = ${fmt(dep)} + ${m} × ${fmt(inst)} = ${money(dep + inst * m)}.`, { show: money(dep + inst * m) }); },
    ],
  });
})();
