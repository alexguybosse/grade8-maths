(function () {
  const { R, nz, pick, fmt, br, expr, round, num, mc, h, s, svg, slider, clear, seg } = G8;
  const side = (a, b) => expr([[a, 'x'], [b, '']]);
  const undo = (b) => (b > 0 ? 'Subtract ' + fmt(b) : 'Add ' + fmt(-b));
  const sgn = (n) => (n < 0 ? '− ' + fmt(-n) : '+ ' + fmt(n));

  G8.topic({
    id: 'equations', strand: 'algebra', title: 'Algebraic equations',
    blurb: 'Solve equations by keeping them balanced: inverse operations, brackets, x on both sides.',
    rules: [
      'An equation is a balance. Whatever you do to one side, do <b>exactly the same</b> to the other side.',
      'Use the <b>inverse operation</b> to undo: + undoes −, × undoes ÷.',
      'Undo in reverse order: first get rid of the number added or subtracted, then the number multiplied.',
      'Brackets: expand first. <span class="m">3(x − 2) = 12 → 3x − 6 = 12</span>',
      'x on both sides: move the x-terms to one side and the numbers to the other.',
      'Check by substituting your answer back into the original equation. Both sides must be equal.',
      'Exponent equations: write both sides with the same base. <span class="m">2<sup>x</sup> = 32 = 2<sup>5</sup> → x = 5</span>',
    ],
    lesson: [
      { h: 'Solving by inspection', html: `
        <p>Some equations you can just see: x + 7 = 12 means x = 5, because 5 + 7 = 12.</p>` },
      { h: 'Inverse operations', html: `
        <div class="eg"><b>Example</b>Solve 4x + 7 = 31.
          <ol><li>Subtract 7 from both sides: 4x = 24</li><li>Divide both sides by 4: <b>x = 6</b></li><li>Check: 4(6) + 7 = 31 ✓</li></ol></div>
        <div class="eg"><b>Example</b>Solve <span class="m">${G8.F('x', 3)} − 2 = 5</span>.
          <ol><li>Add 2: ${G8.F('x', 3)} = 7</li><li>Multiply by 3: <b>x = 21</b></li></ol></div>` },
      { h: 'Brackets and x on both sides', html: `
        <div class="eg"><b>Example</b>Solve 5(x − 3) = 2x + 6.
          <ol><li>Expand: 5x − 15 = 2x + 6</li><li>Subtract 2x: 3x − 15 = 6</li><li>Add 15: 3x = 21</li><li><b>x = 7</b></li></ol></div>
        <div class="eg"><b>Negative answers are fine</b>2x + 9 = 1 → 2x = −8 → <b>x = −4</b></div>` },
      { h: 'Equations with exponents', html: `
        <div class="eg"><b>Example</b>3<sup>x</sup> = 81. Since 81 = 3<sup>4</sup>, <b>x = 4</b>.</div>
        <div class="eg"><b>Example</b>x<sup>2</sup> = 49 → x = 7 or x = −7, because (−7)<sup>2</sup> = 49 too.</div>
        <div class="eg"><b>Example</b>x<sup>3</sup> = −27 → <b>x = −3</b></div>` },
      { h: 'Word problems', html: `
        <div class="eg"><b>Example</b>Think of a number, multiply it by 3 and add 5. The answer is 26. What was the number?<br>3n + 5 = 26 → 3n = 21 → <b>n = 7</b></div>` },
    ],
    demos: [
      { title: 'The balance', about: 'Keep the scale level. Pick an amount and an operation; it happens to both sides. Get x on its own to win.', run(el) {
        let L, Rt, steps;
        const pic = svg(340, 170);
        const eq = h('div', { class: 'readout', style: 'font-size:22px;text-align:center' });
        const log = h('ol', { class: 'small', style: 'margin:8px 0 0;padding-left:22px' });
        const amt = h('input', { class: 'field', type: 'text', inputmode: 'numeric', style: 'width:80px', value: '' });
        let kind = 'num';
        function fresh() {
          const x = nz(-6, 9), a = R(2, 6), c = pick([0, 0, 1, R(1, a - 1)]), b = nz(-9, 12);
          const d = (a - c) * x + b; L = [a, b]; Rt = [c, d]; steps = []; clear(log); draw();
        }
        function objs(g, cx, a, b) {
          if (a >= 0 && a <= 6 && Number.isInteger(a) && b >= 0 && b <= 12 && Number.isInteger(b)) {
            let k = 0; const per = 6;
            for (let i = 0; i < a; i++, k++) { const x = cx - 52 + (k % per) * 18, y = 92 - Math.floor(k / per) * 18; g.append(s('rect', { x, y: y - 14, width: 15, height: 15, rx: 3, fill: 'var(--s-algebra)' })); g.append(s('text', { x: x + 7.5, y: y - 3, 'text-anchor': 'middle', 'font-size': 10, fill: '#fff', 'font-weight': 700 }, 'x')); }
            for (let i = 0; i < b; i++, k++) { const x = cx - 52 + (k % per) * 18, y = 92 - Math.floor(k / per) * 18; g.append(s('circle', { cx: x + 7.5, cy: y - 6.5, r: 6.5, fill: 'var(--red)' })); }
          }
        }
        function draw() {
          clear(pic);
          pic.append(s('path', { d: 'M170,104 L156,150 L184,150 Z', fill: 'var(--pencil)' }));
          pic.append(s('line', { x1: 40, y1: 100, x2: 300, y2: 100, stroke: 'currentColor', 'stroke-width': 4, 'stroke-linecap': 'round' }));
          [[85, L], [255, Rt]].forEach(([cx, sd]) => {
            pic.append(s('path', { d: `M${cx - 60},100 L${cx - 50},96 L${cx + 50},96 L${cx + 60},100`, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }));
            objs(pic, cx, sd[0], sd[1]);
            pic.append(s('text', { x: cx, y: 128, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700 }, side(sd[0], round(sd[1], 4))));
          });
          eq.innerHTML = `<b>${side(L[0], round(L[1], 4))} = ${side(Rt[0], round(Rt[1], 4))}</b>`;
          const solved = (L[0] === 1 && Math.abs(L[1]) < 1e-9 && Rt[0] === 0) || (Rt[0] === 1 && Math.abs(Rt[1]) < 1e-9 && L[0] === 0);
          if (solved) eq.innerHTML += `<div class="verdict" style="justify-content:center;font-size:22px">Solved in ${steps.length} step${steps.length === 1 ? '' : 's'}!</div>`;
        }
        function apply(op) {
          const v = G8.parseAnswer(amt.value);
          if (isNaN(v) || (op === '÷' && v === 0)) { amt.focus(); return; }
          if ((op === '×' || op === '÷') && kind === 'x') { log.append(h('li', {}, 'You can only multiply or divide by a number here.')); return; }
          const f = (sd) => {
            if (op === '+') return kind === 'x' ? [sd[0] + v, sd[1]] : [sd[0], sd[1] + v];
            if (op === '−') return kind === 'x' ? [sd[0] - v, sd[1]] : [sd[0], sd[1] - v];
            if (op === '×') return [sd[0] * v, sd[1] * v];
            return [round(sd[0] / v, 6), round(sd[1] / v, 6)];
          };
          L = f(L); Rt = f(Rt);
          const what = (op === '+' ? 'Add ' : op === '−' ? 'Subtract ' : op === '×' ? 'Multiply by ' : 'Divide by ') + fmt(v) + (kind === 'x' ? 'x' : '');
          steps.push(what); log.append(h('li', {}, `${what} on both sides → ${side(L[0], round(L[1], 4))} = ${side(Rt[0], round(Rt[1], 4))}`));
          draw();
        }
        el.append(pic, eq,
          h('div', { class: 'row' }, h('span', {}, 'Amount'), amt, seg([['num', 'number'], ['x', 'x-term']], kind, (v) => (kind = v))),
          h('div', { class: 'row' }, ...['−', '+', '÷', '×'].map((op) => G8.btn(op === '−' ? 'Subtract' : op === '+' ? 'Add' : op === '÷' ? 'Divide by' : 'Multiply by', () => apply(op), 'ghost small'))),
          log, h('div', { class: 'row' }, G8.btn('New equation', fresh, 'small')));
        el.querySelector('.seg').style.margin = '0';
        fresh();
      } },
    ],
    gens: [
      () => { const x = nz(-9, 12), a = R(2, 9), b = nz(-15, 15); const c = a * x + b;
        return num(`Solve for x: <span class="big m">${side(a, b)} = ${fmt(c)}</span>`, x, `${undo(b)} on both sides: ${a}x = ${fmt(c - b)}. Divide by ${a}: x = ${fmt(x)}.`, { hint: 'x = ?' }); },
      () => { const x = nz(-6, 10), a = R(2, 6), b = nz(-8, 8); const c = a * (x + b);
        return num(`Solve: <span class="big m">${a}(x ${sgn(b)}) = ${fmt(c)}</span>`, x, `Divide by ${a} (or expand): x ${sgn(b)} = ${fmt(x + b)}, so x = ${fmt(x)}.`, { hint: 'x = ?' }); },
      () => { const x = nz(-8, 10), c = R(1, 5), a = c + R(1, 5), b = nz(-12, 12); const d = (a - c) * x + b;
        return num(`Solve: <span class="big m">${side(a, b)} = ${side(c, d)}</span>`, x, `Subtract ${c === 1 ? '' : c}x: ${side(a - c, b)} = ${fmt(d)}. Then ${(a - c)}x = ${fmt(d - b)}, so x = ${fmt(x)}.`, { hint: 'x = ?' }); },
      () => { const k = R(2, 6), x = k * nz(-5, 8), b = nz(-9, 9); const c = x / k + b;
        return num(`Solve: <span class="big m">${G8.F('x', k)} ${sgn(b)} = ${fmt(c)}</span>`, x, `${undo(b)}: ${G8.F('x', k)} = ${fmt(c - b)}. Multiply by ${k}: x = ${fmt(x)}.`, { hint: 'x = ?' }); },
      () => { const b = pick([2, 3, 5, 10]), x = R(2, b === 2 ? 7 : b === 3 ? 5 : 4);
        return num(`Solve: <span class="big m">${b}<sup>x</sup> = ${fmt(Math.pow(b, x))}</span>`, x, `${fmt(Math.pow(b, x))} = ${b}<sup>${x}</sup>, so x = ${x}.`, { hint: 'x = ?', inputmode: 'numeric' }); },
      () => { const r = R(2, 6); const neg = pick([true, false]);
        return num(`Solve: <span class="big m">x<sup>3</sup> = ${fmt(neg ? -r * r * r : r * r * r)}</span>`, neg ? -r : r, `${br(neg ? -r : r)}<sup>3</sup> = ${fmt(neg ? -r * r * r : r * r * r)}, so x = ${fmt(neg ? -r : r)}.`, { hint: 'x = ?' }); },
      () => { const r = R(2, 12);
        return mc(`Solve: <span class="big m">x<sup>2</sup> = ${r * r}</span>`, `x = ${r} or x = −${r}`, [`x = ${r} only`, `x = ${r * r / 2 === Math.round(r * r / 2) ? r * r / 2 : r + 1}`, `x = −${r} only`], `Both ${r}<sup>2</sup> and (−${r})<sup>2</sup> equal ${r * r}.`); },
      () => { const n = R(2, 20), a = R(2, 6), b = R(1, 15);
        return num(`I think of a number, multiply it by <b>${a}</b> and add <b>${b}</b>. The answer is <b>${a * n + b}</b>. What is my number?`, n, `${a}n + ${b} = ${a * n + b} → ${a}n = ${a * n} → n = ${n}.`); },
      () => { const x = R(3, 15), w = x + R(2, 8); const P = 2 * (x + w);
        return num(`A rectangle is <b>x</b> cm wide and <b>(x + ${w - x})</b> cm long. Its perimeter is <b>${P} cm</b>. Find x.`, x, `2(x + x + ${w - x}) = ${P} → 4x + ${2 * (w - x)} = ${P} → 4x = ${P - 2 * (w - x)} → x = ${x}.`); },
      () => { const x = nz(-6, 9), a = R(2, 5), b = nz(-8, 8), c = nz(-9, 9);
        const lhs = `${a}(x ${sgn(b)}) ${sgn(c)}`, rhs = a * (x + b) + c;
        return num(`Solve: <span class="big m">${lhs} = ${fmt(rhs)}</span>`, x, `Expand: ${side(a, a * b + c)} = ${fmt(rhs)} → ${a}x = ${fmt(rhs - a * b - c)} → x = ${fmt(x)}.`, { hint: 'x = ?' }); },
      () => { const x = nz(-6, 9), a = R(2, 7), b = nz(-10, 10), v = a * x + b;
        return mc(`Which value of x makes <span class="m">${side(a, b)} = ${fmt(v)}</span> true?`, 'x = ' + fmt(x), ['x = ' + fmt(x + 1), 'x = ' + fmt(-x), 'x = ' + fmt(x + 2)], `Substitute: ${a}(${fmt(x)}) ${sgn(b)} = ${fmt(v)} ✓`); },
    ],
  });
})();
