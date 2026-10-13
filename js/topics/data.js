(function () {
  const { R, pick, fmt, round, num, mc, h, s, svg, clear, seg } = G8;
  const sorted = (a) => a.slice().sort((x, y) => x - y);
  const mean = (a) => a.reduce((t, x) => t + x, 0) / a.length;
  const median = (a) => { const b = sorted(a), n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
  const modes = (a) => { const c = {}; a.forEach((x) => (c[x] = (c[x] || 0) + 1)); const m = Math.max(...Object.values(c)); return m === 1 ? [] : Object.keys(c).filter((k) => c[k] === m).map(Number).sort((x, y) => x - y); };
  const list = (a) => a.map((v) => fmt(v)).join('; ');

  G8.topic({
    id: 'data', strand: 'data', title: 'Data handling',
    blurb: 'Collect, organise and summarise data: mean, median, mode, range, and the right graph for the job.',
    rules: [
      'The data cycle: pose a question → collect → organise → represent → analyse → report.',
      '<b>Mean</b> (average) = sum of the values ÷ number of values.',
      '<b>Median</b> = the middle value when the data is <b>in order</b>. With an even number of values, it is halfway between the two middle ones.',
      '<b>Mode</b> = the value that appears most often. There can be more than one, or none.',
      '<b>Range</b> = biggest value − smallest value. It measures spread.',
      'An <b>outlier</b> is a value far away from the rest. It pulls the mean towards it; the median hardly moves.',
      'Pie chart angle = <span class="m">' + G8.F('frequency', 'total') + ' × 360°</span>.',
      'Bar graph: separate categories. Histogram: grouped numbers (no gaps). Line graph: change over time. Pie chart: parts of a whole. Scatter plot: link between two quantities.',
    ],
    lesson: [
      { h: 'Collecting and organising', html: `
        <p>Use a <b>tally</b> and <b>frequency table</b> to count. For lots of numbers, group them in intervals (e.g. 0–9, 10–19, …) of equal width.</p>
        <p>A <b>stem-and-leaf</b> plot keeps every value but shows the shape. The stem is the tens, the leaf is the units:</p>
        <table><tr><th>Stem</th><th style="text-align:left">Leaf</th></tr><tr><td>2</td><td style="text-align:left">3 5 8</td></tr><tr><td>3</td><td style="text-align:left">0 1 1 6</td></tr><tr><td>4</td><td style="text-align:left">2 9</td></tr></table>
        <p class="small muted">Key: 3 | 1 means 31. The data is 23; 25; 28; 30; 31; 31; 36; 42; 49.</p>` },
      { h: 'Summarising', html: `
        <div class="eg"><b>Example</b>Test marks: 12; 15; 9; 15; 18; 14; 7.
          <ol><li>In order: 7; 9; 12; 14; 15; 15; 18</li><li>Mean = 90 ÷ 7 ≈ <b>12,86</b></li><li>Median = the 4th value = <b>14</b></li><li>Mode = <b>15</b></li><li>Range = 18 − 7 = <b>11</b></li></ol></div>
        <div class="eg"><b>Even count</b>3; 5; 8; 10 → median = (5 + 8) ÷ 2 = <b>6,5</b></div>` },
      { h: 'Representing and interpreting', html: `
        <div class="eg"><b>Pie chart</b>Of 40 learners, 10 walk to school. Angle = ${G8.F(10, 40)} × 360° = <b>90°</b>.</div>
        <p>Read graphs critically. A graph whose vertical axis doesn't start at 0 can make a small difference look huge. A tiny sample can't speak for everyone.</p>` },
    ],
    demos: [
      { title: 'Your data, live', about: 'Type whole numbers separated by spaces. Change one and watch the mean and median react.', run(el) {
        const input = h('textarea', { class: 'field', rows: 2, style: 'width:100%;font-size:18px', 'aria-label': 'Your data' });
        input.value = '7 9 12 14 15 15 18';
        let view = 'bar';
        const pic = svg(340, 200);
        const out = h('div', { class: 'readout' });
        const COLS = ['var(--s-data)', 'var(--red)', 'var(--s-numbers)', 'var(--s-algebra)', 'var(--s-space)', 'var(--s-measure)'];
        function parse() { return input.value.split(/[\s;]+|,(?=\s)|,$/).map((t) => t.replace(',', '.')).filter((t) => t !== '').map(Number).filter((x) => isFinite(x)); }
        function draw() {
          clear(pic);
          const d = parse();
          if (d.length < 2) { out.innerHTML = 'Type at least two numbers.'; return; }
          const c = {}; d.forEach((x) => (c[x] = (c[x] || 0) + 1));
          const keys = Object.keys(c).map(Number).sort((a, b) => a - b);
          if (view === 'bar') {
            const mx = Math.max(...Object.values(c)), W = 300 / keys.length;
            keys.forEach((k, i) => {
              const ht = c[k] / mx * 150;
              pic.append(s('rect', { x: 30 + i * W + W * 0.12, y: 170 - ht, width: W * 0.76, height: ht, fill: 'var(--s-data)', 'fill-opacity': .75 }));
              if (keys.length <= 16) pic.append(s('text', { x: 30 + i * W + W / 2, y: 186, 'text-anchor': 'middle', 'font-size': 11 }, fmt(k)));
              pic.append(s('text', { x: 30 + i * W + W / 2, y: 165 - ht, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700 }, c[k]));
            });
            pic.append(s('line', { x1: 28, y1: 170, x2: 332, y2: 170, stroke: 'currentColor' }));
            const X = (v) => 30 + (keys.indexOf(v) + 0.5) * W;
            const md = median(d); if (keys.includes(md)) pic.append(s('line', { x1: X(md), y1: 12, x2: X(md), y2: 170, stroke: 'var(--red)', 'stroke-dasharray': '4 3', 'stroke-width': 2 }));
          } else if (view === 'pie') {
            let a0 = -Math.PI / 2; const tot = d.length;
            keys.forEach((k, i) => {
              const a1 = a0 + c[k] / tot * 2 * Math.PI;
              const p = (a) => [120 + 80 * Math.cos(a), 100 + 80 * Math.sin(a)];
              const [x0, y0] = p(a0), [x1, y1] = p(a1);
              const large = a1 - a0 > Math.PI ? 1 : 0;
              pic.append(keys.length === 1 ? s('circle', { cx: 120, cy: 100, r: 80, fill: COLS[0] }) : s('path', { d: `M120,100 L${x0},${y0} A80,80 0 ${large} 1 ${x1},${y1} Z`, fill: COLS[i % COLS.length], 'fill-opacity': .8, stroke: 'var(--card)', 'stroke-width': 2 }));
              if (i < 9) { pic.append(s('rect', { x: 225, y: 22 + i * 18, width: 12, height: 12, fill: COLS[i % COLS.length], 'fill-opacity': .8 })); pic.append(s('text', { x: 243, y: 32 + i * 18, 'font-size': 12 }, `${fmt(k)}: ${fmt(round(c[k] / tot * 360, 1))}°`)); }
              a0 = a1;
            });
          } else {
            const b = sorted(d).filter((x) => Number.isInteger(x) && x >= 0);
            const stems = {}; b.forEach((x) => { const st = Math.floor(x / 10); (stems[st] = stems[st] || []).push(x % 10); });
            const ks = Object.keys(stems).map(Number);
            const lo = Math.min(...ks), hi = Math.max(...ks);
            let y = 30;
            pic.append(s('text', { x: 60, y: 16, 'text-anchor': 'end', 'font-size': 12, 'font-weight': 700 }, 'Stem'), s('text', { x: 80, y: 16, 'font-size': 12, 'font-weight': 700 }, 'Leaf'));
            for (let st = lo; st <= hi && y < 196; st++, y += 22) {
              pic.append(s('text', { x: 60, y, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 700 }, st));
              pic.append(s('text', { x: 80, y, 'font-size': 16, 'letter-spacing': '6' }, (stems[st] || []).join(' ')));
            }
            pic.append(s('line', { x1: 68, y1: 20, x2: 68, y2: Math.min(y - 10, 196), stroke: 'currentColor', 'stroke-width': 2 }));
          }
          const mo = modes(d);
          out.innerHTML = `${d.length} values. In order: ${list(sorted(d))}<br>Mean = ${fmt(round(d.reduce((t, x) => t + x, 0), 4))} ÷ ${d.length} = <b>${fmt(round(mean(d), 2))}</b> · Median = <b style="color:var(--red)">${fmt(median(d))}</b> · Mode = <b>${mo.length ? mo.map((v) => fmt(v)).join(' and ') : 'none'}</b> · Range = <b>${fmt(round(Math.max(...d) - Math.min(...d), 4))}</b>`;
        }
        input.addEventListener('input', draw);
        el.append(input, seg([['bar', 'Bar graph'], ['pie', 'Pie chart'], ['stem', 'Stem-and-leaf']], view, (v) => { view = v; draw(); }), pic, out,
          h('div', { class: 'row' }, G8.btn('Add an outlier', () => { input.value = input.value.trim() + ' 95'; draw(); }, 'ghost small'), G8.btn('Random class marks', () => { input.value = Array.from({ length: R(8, 14) }, () => R(20, 49)).join(' '); draw(); }, 'ghost small')));
        draw();
      } },
    ],
    gens: [
      () => { const n = R(5, 8); const d = Array.from({ length: n }, () => R(1, 30)); const m = mean(d); if (!Number.isInteger(m * 10)) return null;
        return num(`Find the <b>mean</b> of: ${list(d)}`, m, `Sum = ${d.reduce((t, x) => t + x, 0)}. ${d.reduce((t, x) => t + x, 0)} ÷ ${n} = ${fmt(m)}.`); },
      () => { const n = pick([5, 7, 9]); const d = Array.from({ length: n }, () => R(1, 50));
        return num(`Find the <b>median</b> of: ${list(d)}`, median(d), `In order: ${list(sorted(d))}. The middle (${(n + 1) / 2}th) value is ${fmt(median(d))}.`); },
      () => { const n = pick([6, 8]); const d = Array.from({ length: n }, () => R(1, 40));
        return num(`Find the <b>median</b> of: ${list(d)}`, median(d), `In order: ${list(sorted(d))}. Even count, so halfway between ${sorted(d)[n / 2 - 1]} and ${sorted(d)[n / 2]}: ${fmt(median(d))}.`); },
      () => { const base = Array.from({ length: 5 }, () => R(1, 20)); const m = R(1, 20); const d = G8.shuffle([...base, m, m, m]); const mo = modes(d); if (mo.length !== 1) return null;
        return num(`Find the <b>mode</b> of: ${list(d)}`, mo[0], `${mo[0]} appears most often.`); },
      () => { const d = Array.from({ length: R(6, 9) }, () => R(5, 99)); return num(`Find the <b>range</b> of: ${list(d)}`, Math.max(...d) - Math.min(...d), `Biggest − smallest = ${Math.max(...d)} − ${Math.min(...d)} = ${Math.max(...d) - Math.min(...d)}.`); },
      () => { const tot = pick([20, 24, 30, 36, 40, 60, 72, 90, 120]), part = R(1, tot - 1); const a = part / tot * 360; if (!Number.isInteger(a)) return null;
        return num(`In a survey of <b>${tot}</b> learners, <b>${part}</b> chose soccer. What angle should soccer get in a pie chart?`, a, `${G8.F(part, tot)} × 360° = ${a}°.`, { inputmode: 'numeric', hint: 'degrees' }); },
      () => { const d = Array.from({ length: 6 }, () => R(10, 20)); const out = R(70, 99); const all = G8.shuffle([...d, out]);
        return mc(`Which value is an <b>outlier</b>? ${list(all)}`, fmt(out), d.slice(0, 3).map((v) => fmt(v)), `${out} is far away from all the other values.`); },
      () => { const c = pick([['how the price of petrol changed over 12 months', 'Line graph'], ['the favourite sports of a class (as parts of the whole class)', 'Pie chart'], ['the heights of 30 learners grouped in intervals', 'Histogram'], ['whether taller learners have bigger shoe sizes', 'Scatter plot'], ['the number of learners in each grade', 'Bar graph']]);
        return mc(`Which graph best shows <b>${c[0]}</b>?`, c[1], ['Line graph', 'Pie chart', 'Histogram', 'Scatter plot', 'Bar graph'].filter((x) => x !== c[1]), `${c[1]}.`); },
      () => { const st = R(2, 7), leaves = sorted(Array.from({ length: 4 }, () => R(0, 9)));
        return mc(`In a stem-and-leaf plot, the row <b>${st} | ${leaves.join(' ')}</b> stands for which values?`, leaves.map((l) => st * 10 + l).join('; '), [leaves.map((l) => st + l).join('; '), leaves.map((l) => l * 10 + st).join('; '), leaves.map((l) => st * 100 + l).join('; ')], `Stem = tens, leaf = units: ${leaves.map((l) => st * 10 + l).join('; ')}.`); },
      () => mc('An outlier is added to a data set. Which measure changes the most?', 'the mean', ['the median', 'the mode', 'none of them'], 'Every value counts in the mean, so one extreme value drags it. The median only cares about the middle.'),
      () => { const n = R(4, 6), m = R(10, 20), tot = n * m, extra = R(5, 30);
        return num(`The mean of <b>${n}</b> numbers is <b>${m}</b>. One more number, <b>${extra}</b>, is added. What is the new mean?`, round((tot + extra) / (n + 1), 2), `Old total = ${n} × ${m} = ${tot}. New total = ${tot + extra}. New mean = ${tot + extra} ÷ ${n + 1} = ${fmt(round((tot + extra) / (n + 1), 2))}${Number.isInteger((tot + extra) / (n + 1)) ? '' : ' (rounded)'}.`, { tol: 0.011 }); },
    ],
  });
})();
