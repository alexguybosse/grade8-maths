(function () {
  const { R, pick, fmt, round, F, FS, simp, num, mc, h, s, svg, slider, clear, seg } = G8;
  const hint = 'e.g. 1/4 or 0,25';

  G8.topic({
    id: 'probability', strand: 'data', title: 'Probability',
    blurb: 'How likely is it? Outcomes, sample spaces, theoretical probability and what really happens when you experiment.',
    rules: [
      'Probability is a number from <b>0</b> (impossible) to <b>1</b> (certain). It can be a fraction, decimal or percentage.',
      'Theoretical probability: <span class="m">P(event) = ' + F('number of favourable outcomes', 'total number of possible outcomes') + '</span> (when all outcomes are equally likely).',
      '<b>Relative frequency</b> (experimental probability) = <span class="m">' + F('times it happened', 'number of trials') + '</span>.',
      'The more trials you do, the closer the relative frequency usually gets to the theoretical probability.',
      'P(not A) = 1 − P(A).',
      'The <b>sample space</b> is the list of all possible outcomes. For two events, use a table or tree diagram. Two coins: HH, HT, TH, TT.',
      'Coin and die together: 2 × 6 = 12 outcomes. Two dice: 6 × 6 = 36 outcomes.',
    ],
    lesson: [
      { h: 'Theoretical probability', html: `
        <div class="eg"><b>Example</b>Roll a fair die. P(even) = ${F(3, 6)} = <b>${F(1, 2)}</b> (2, 4 and 6 are favourable).</div>
        <div class="eg"><b>Example</b>A bag has 3 red, 5 blue and 2 green beads. P(blue) = ${F(5, 10)} = ${F(1, 2)}. P(not green) = 1 − ${F(2, 10)} = <b>${F(4, 5)}</b>.</div>` },
      { h: 'Sample spaces for two events', html: `
        <p>Toss a coin and roll a die. Every combination:</p>
        <div class="scroll-x"><table><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
        <tr><th>H</th><td>H1</td><td>H2</td><td>H3</td><td>H4</td><td>H5</td><td>H6</td></tr>
        <tr><th>T</th><td>T1</td><td>T2</td><td>T3</td><td>T4</td><td>T5</td><td>T6</td></tr></table></div>
        <div class="eg"><b>Example</b>P(heads and a number bigger than 4) = ${F(2, 12)} = <b>${F(1, 6)}</b> (H5, H6).</div>
        <div class="eg"><b>Two dice</b>There are 36 outcomes. A total of 7 comes up 6 ways (1+6, 2+5, 3+4, 4+3, 5+2, 6+1), so P(7) = ${F(6, 36)} = <b>${F(1, 6)}</b>. That's the most likely total.</div>` },
      { h: 'Experiments', html: `
        <p>Toss a coin 10 times and you might get 7 heads: a relative frequency of ${F(7, 10)}. Toss it 1 000 times and you'll get close to ${F(1, 2)}. Try it in the demo.</p>
        <p class="tip">Each toss is independent. After 5 heads in a row, the next toss is still a 50 / 50 chance.</p>` },
    ],
    demos: [
      { title: 'Run the experiment', about: 'Toss coins or roll dice many times. Watch the relative frequency settle down near the theory line.', run(el) {
        let kind = 'coin', counts, trials;
        const pic = svg(340, 200);
        const out = h('div', { class: 'readout' });
        const sums = () => (kind === 'coin' ? ['H', 'T'] : kind === 'die' ? [1, 2, 3, 4, 5, 6] : Array.from({ length: 11 }, (_, k) => k + 2));
        const theory = (o) => (kind === 'coin' ? 1 / 2 : kind === 'die' ? 1 / 6 : (6 - Math.abs(7 - o)) / 36);
        function reset() { counts = {}; sums().forEach((o) => (counts[o] = 0)); trials = 0; draw(); }
        function roll(n) {
          for (let i = 0; i < n; i++) {
            const o = kind === 'coin' ? pick(['H', 'T']) : kind === 'die' ? R(1, 6) : R(1, 6) + R(1, 6);
            counts[o]++; trials++;
          }
          draw();
        }
        function draw() {
          clear(pic);
          const os = sums(), W = 300 / os.length, maxP = kind === 'coin' ? 1 : kind === 'die' ? 0.4 : 0.3;
          const Y = (p) => 170 - p / maxP * 150;
          pic.append(s('line', { x1: 25, y1: 170, x2: 330, y2: 170, stroke: 'currentColor' }));
          os.forEach((o, i) => {
            const rf = trials ? counts[o] / trials : 0;
            pic.append(s('rect', { x: 30 + i * W + W * 0.15, y: Y(rf), width: W * 0.7, height: 170 - Y(rf), fill: 'var(--s-data)', 'fill-opacity': .7 }));
            pic.append(s('line', { x1: 30 + i * W + W * 0.05, y1: Y(theory(o)), x2: 30 + i * W + W * 0.95, y2: Y(theory(o)), stroke: 'var(--red)', 'stroke-width': 2.5 }));
            pic.append(s('text', { x: 30 + i * W + W / 2, y: 186, 'text-anchor': 'middle', 'font-size': 12 }, o));
          });
          [0, maxP / 2, maxP].forEach((p) => pic.append(s('text', { x: 22, y: Y(p) + 4, 'text-anchor': 'end', 'font-size': 10 }, fmt(round(p, 2)))));
          const first = os[kind === 'sum' ? 5 : 0];
          out.innerHTML = trials ? `${trials} ${kind === 'coin' ? 'tosses' : 'rolls'}. ${kind === 'sum' ? 'Total 7' : kind === 'coin' ? 'Heads' : 'Rolled a 1'}: ${counts[first]} times → relative frequency <b>${fmt(round(counts[first] / trials, 3))}</b>. Theory says <b>${fmt(round(theory(first), 3))}</b>.<br><span class="small muted">Blue bars = what happened. Red lines = theory.</span>`
            : 'Nothing yet. Tap a button to start.';
        }
        el.append(seg([['coin', 'Coin'], ['die', 'Die'], ['sum', 'Two dice total']], kind, (v) => { kind = v; reset(); }), pic,
          h('div', { class: 'row' }, G8.btn('×1', () => roll(1), 'ghost small'), G8.btn('×10', () => roll(10), 'ghost small'), G8.btn('×100', () => roll(100), 'ghost small'), G8.btn('×1 000', () => roll(1000), 'small'), G8.btn('Reset', reset, 'ghost small')), out);
        reset();
      } },
    ],
    gens: [
      () => { const ev = pick([['an even number', 3], ['a number greater than 4', 2], ['a 6', 1], ['a prime number', 3], ['a multiple of 3', 2], ['a number less than 5', 4]]);
        return num(`A fair die is rolled. What is P(<b>${ev[0]}</b>)?`, ev[1] / 6, `${ev[1]} favourable outcomes out of 6: ${F(ev[1], 6)}${simp(ev[1], 6)[1] !== 6 ? ' = ' + FS(ev[1], 6) : ''}.`, { hint, show: FS(ev[1], 6) }); },
      () => { const r = R(1, 8), b = R(1, 8), g = R(1, 8); const t = r + b + g; const which = pick([['red', r], ['blue', b], ['green', g]]);
        return num(`A bag has <b>${r} red</b>, <b>${b} blue</b> and <b>${g} green</b> sweets. One is taken without looking. What is P(${which[0]})?`, which[1] / t, `${which[1]} ${which[0]} out of ${t} sweets: ${F(which[1], t)}${simp(which[1], t)[1] !== t ? ' = ' + FS(which[1], t) : ''}.`, { hint, show: FS(which[1], t) }); },
      () => { const p = R(1, 19) * 5; return num(`The probability of rain tomorrow is <b>${p}%</b>. What is the probability that it does <b>not</b> rain? (as a %)`, 100 - p, `P(not rain) = 100% − ${p}% = ${100 - p}%.`, { show: (100 - p) + '%' }); },
      () => { const n = pick([20, 40, 50, 100, 200]), k = R(1, n - 1); return num(`A drawing pin was dropped <b>${n}</b> times and landed point-up <b>${k}</b> times. What is the relative frequency of point-up? (as a decimal)`, k / n, `${F(k, n)} = ${fmt(k / n)}.`, { hint: 'e.g. 0,35' }); },
      () => mc('How many outcomes are there when you toss <b>two coins</b>?', '4', ['2', '3', '6'], 'HH, HT, TH, TT.'),
      () => { const ev = pick([['heads and an even number', 3], ['tails and a 6', 1], ['heads and a number less than 3', 2], ['tails and an odd number', 3]]);
        return num(`A coin is tossed and a die is rolled. What is P(<b>${ev[0]}</b>)?`, ev[1] / 12, `12 outcomes in the sample space; ${ev[1]} favourable: ${F(ev[1], 12)}${simp(ev[1], 12)[1] !== 12 ? ' = ' + FS(ev[1], 12) : ''}.`, { hint, show: FS(ev[1], 12) }); },
      () => { const tot = pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); const ways = 6 - Math.abs(7 - tot);
        return num(`Two dice are rolled and the numbers added. What is P(total = <b>${tot}</b>)?`, ways / 36, `There are 36 outcomes and ${ways} of them total ${tot}: ${F(ways, 36)}${simp(ways, 36)[1] !== 36 ? ' = ' + FS(ways, 36) : ''}.`, { hint, show: FS(ways, 36) }); },
      () => { const p = pick([['impossible', '0'], ['certain', '1'], ['as likely as not', F(1, 2)]]);
        return mc(`What probability means an event is <b>${p[0]}</b>?`, p[1], ['0', '1', F(1, 2), '100'].filter((x) => x !== p[1]), `Impossible = 0, certain = 1, an even chance = ${F(1, 2)}.`); },
      () => mc('A fair coin lands heads 5 times in a row. What is the probability of heads on the next toss?', F(1, 2), [F(1, 6), F(1, 32), 'Less than ' + F(1, 2)], 'Each toss is independent. The coin has no memory.'),
      () => { const p = pick([[1, 4], [1, 5], [1, 10], [3, 10], [2, 5]]); const n = pick([20, 40, 100, 200]); if ((n * p[0]) % p[1]) return null;
        return num(`The probability of winning a game is <b>${F(p[0], p[1])}</b>. If you play <b>${n}</b> times, about how many times should you expect to win?`, n * p[0] / p[1], `${F(p[0], p[1])} × ${n} = ${n * p[0] / p[1]}.`); },
    ],
  });
})();
