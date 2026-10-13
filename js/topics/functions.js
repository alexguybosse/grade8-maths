(function () {
  const { R, nz, pick, fmt, br, expr, num, mc, h, s, svg, slider, clear, seg } = G8;
  const lin = (m, c) => 'y = ' + expr([[m, 'x'], [c, '']]);

  G8.topic({
    id: 'functions', strand: 'algebra', title: 'Functions and relationships',
    blurb: 'Input and output values with flow diagrams, tables and formulas.',
    rules: [
      'A function takes an <b>input</b> (x), follows a rule, and gives exactly one <b>output</b> (y).',
      'The same relationship can be shown as a <b>flow diagram</b>, a <b>table</b>, a <b>formula</b> (y = 2x + 1), a <b>graph</b> or in <b>words</b>.',
      'To find an output: substitute the input into the rule.',
      'To find an input from an output: work backwards, doing the opposite operations in the opposite order.',
      'To find the rule from a table with a constant difference in y (when x goes up by 1): <span class="m">y = (difference)x + (y when x = 0)</span>.',
    ],
    lesson: [
      { h: 'Flow diagrams', html: `
        <p>A flow diagram shows the steps of the rule.</p>
        <div class="eg"><b>Example</b>x → <b>× 3</b> → <b>− 2</b> → y. That's y = 3x − 2.<br>Input 5: 5 × 3 = 15, 15 − 2 = <b>13</b>.<br>Output 22: work backwards: 22 + 2 = 24, 24 ÷ 3 = <b>8</b>.</div>
        <p class="tip">Order matters. × 3 then − 2 gives 3x − 2. But − 2 then × 3 gives 3(x − 2) = 3x − 6.</p>` },
      { h: 'Tables of values', html: `
        <div class="eg"><b>Example</b>Complete the table for y = 2x + 5.
          <table><tr><th>x</th><td>−2</td><td>−1</td><td>0</td><td>1</td><td>2</td></tr><tr><th>y</th><td>1</td><td>3</td><td>5</td><td>7</td><td>9</td></tr></table></div>
        <div class="eg"><b>Find the rule</b><table><tr><th>x</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>y</th><td>2</td><td>6</td><td>10</td><td>14</td></tr></table>
          y goes up by 4 each time, so it's 4x + something. When x = 1, 4x = 4 but y = 2, so subtract 2: <b>y = 4x − 2</b>.</div>` },
      { h: 'Formulas from real life', html: `
        <div class="eg"><b>Example</b>A plumber charges R350 to come out plus R200 per hour. Cost C for h hours: <b>C = 200h + 350</b>.<br>For 3 hours: C = 200(3) + 350 = <b>R950</b>.</div>` },
    ],
    demos: [
      { title: 'Function machine', about: 'Set the two steps of the machine, then feed it numbers.', run(el) {
        let m = 3, c = -2, x = 4;
        const pic = svg(340, 110);
        const out = h('div', { class: 'readout' });
        const tbl = h('div', { class: 'scroll-x' });
        function boxAt(x0, label, fill) {
          pic.append(s('rect', { x: x0, y: 30, width: 70, height: 46, rx: 8, fill, 'fill-opacity': .18, stroke: fill, 'stroke-width': 2 }));
          pic.append(s('text', { x: x0 + 35, y: 59, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, class: 'hand' }, label));
        }
        const arrow = (x1, x2) => { pic.append(s('line', { x1, y1: 53, x2: x2 - 6, y2: 53, stroke: 'currentColor', 'stroke-width': 2 })); pic.append(s('path', { d: `M${x2 - 8},47 L${x2},53 L${x2 - 8},59`, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 })); };
        function draw() {
          clear(pic);
          const mid = m * x, y = mid + c;
          pic.append(s('text', { x: 22, y: 59, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: 'var(--s-algebra)' }, fmt(x)));
          arrow(38, 80); boxAt(80, '× ' + br(m), 'var(--s-algebra)');
          arrow(150, 196); pic.append(s('text', { x: 173, y: 44, 'text-anchor': 'middle', 'font-size': 13 }, fmt(mid)));
          boxAt(196, (c < 0 ? '− ' : '+ ') + Math.abs(c), 'var(--s-algebra)');
          arrow(266, 300); pic.append(s('text', { x: 320, y: 59, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: 'var(--red)' }, fmt(y)));
          pic.append(s('text', { x: 22, y: 98, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--pencil)' }, 'input'));
          pic.append(s('text', { x: 320, y: 98, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--pencil)' }, 'output'));
          out.innerHTML = `Formula: <b>${lin(m, c)}</b><br>${fmt(x)} × ${br(m)} = ${fmt(mid)}, then ${fmt(mid)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = <b>${fmt(y)}</b>`;
          const xs = [-2, -1, 0, 1, 2, 3, 4, 5];
          tbl.innerHTML = `<table class="tbl"><tr><th>x</th>${xs.map((v) => `<td${v === x ? ' style="color:var(--red);font-weight:700"' : ''}>${fmt(v)}</td>`).join('')}</tr><tr><th>y</th>${xs.map((v) => `<td${v === x ? ' style="color:var(--red);font-weight:700"' : ''}>${fmt(m * v + c)}</td>`).join('')}</tr></table>`;
        }
        el.append(pic, h('div', { class: 'controls' },
          slider('Multiply by', -5, 6, 1, m, (v) => { m = v; draw(); }).el,
          slider('Then add', -9, 9, 1, c, (v) => { c = v; draw(); }).el,
          slider('Input x', -5, 10, 1, x, (v) => { x = v; draw(); }).el), out, tbl);
        draw();
      } },
    ],
    gens: [
      () => { const m = nz(-5, 6), c = nz(-9, 9), x = R(-5, 10); return num(`If <b>${lin(m, c)}</b>, find y when <b>x = ${fmt(x)}</b>.`, m * x + c, `y = ${fmt(m)}(${fmt(x)}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${fmt(m * x)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${fmt(m * x + c)}.`); },
      () => { const m = R(2, 6), c = nz(-9, 9), x = R(-3, 12); const y = m * x + c;
        return num(`If <b>${lin(m, c)}</b> and <b>y = ${fmt(y)}</b>, what is x?`, x, `Work backwards: ${fmt(y)} ${c < 0 ? '+' : '−'} ${Math.abs(c)} = ${fmt(y - c)}, then ÷ ${m} = ${fmt(x)}.`); },
      () => { const m = nz(-4, 6), c = R(-8, 8); const ys = [1, 2, 3, 4].map((x) => m * x + c);
        return mc(`Which rule fits this table?<table class="tbl"><tr><th>x</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>y</th>${ys.map((y) => `<td>${fmt(y)}</td>`).join('')}</tr></table>`,
          lin(m, c), [lin(m, c + m), lin(m + 1, c - 1), lin(c === 0 ? 1 : c, m)], `y changes by ${fmt(m)} each time, so ${fmt(m)}x. When x = 1: ${fmt(m)} + (${fmt(c)}) = ${fmt(ys[0])}. So ${lin(m, c)}.`); },
      () => { const a = R(2, 5), b = R(1, 9), x = R(1, 10); return num(`Input x = <b>${x}</b> goes through the flow diagram: <b>x → + ${b} → × ${a} → y</b>. What is y?`, (x + b) * a, `First add: ${x} + ${b} = ${x + b}. Then multiply: ${x + b} × ${a} = ${(x + b) * a}.`); },
      () => { const a = R(2, 5), b = R(1, 9); return mc(`Which formula matches <b>x → − ${b} → × ${a} → y</b>?`, `y = ${a}(x − ${b})`, [`y = ${a}x − ${b}`, `y = x − ${a * b}`, `y = ${a}x + ${b}`], `Subtract first, then multiply the whole result: y = ${a}(x − ${b}) = ${a}x − ${a * b}.`); },
      () => { const fee = R(2, 8) * 50, rate = R(1, 6) * 50, hrs = R(2, 6);
        return num(`An electrician charges a call-out fee of <b>R${fee}</b> plus <b>R${rate} per hour</b>. What does a <b>${hrs}-hour</b> job cost?`, fee + rate * hrs, `C = ${rate}h + ${fee} = ${rate}(${hrs}) + ${fee} = R${fee + rate * hrs}.`, { show: 'R' + (fee + rate * hrs) }); },
      () => { const m = nz(-3, 4), c = R(-6, 6); const xs = [-1, 0, 1, 2]; const miss = R(0, 3);
        const cells = xs.map((x, i) => (i === miss ? '<td style="color:var(--red)">?</td>' : `<td>${fmt(m * x + c)}</td>`)).join('');
        return num(`Rule: <b>${lin(m, c)}</b>. Fill in the missing value.<table class="tbl"><tr><th>x</th>${xs.map((x) => `<td>${fmt(x)}</td>`).join('')}</tr><tr><th>y</th>${cells}</tr></table>`, m * xs[miss] + c, `x = ${fmt(xs[miss])}: y = ${fmt(m)}(${fmt(xs[miss])}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${fmt(m * xs[miss] + c)}.`); },
    ],
  });
})();
