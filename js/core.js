/* Grade 8 Maths — shared helpers used by every topic file.
   Everything hangs off one global, G8, so topic files stay plain scripts. */
(function () {
  const G8 = (window.G8 = window.G8 || {});
  G8.topics = [];
  G8.topic = (t) => G8.topics.push(t);

  /* ---------- random helpers ---------- */
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const nz = (a, b) => { let v = 0; while (v === 0) v = R(a, b); return v; };
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const round = (x, dp = 2) => { const f = Math.pow(10, dp); return Math.round((x + Number.EPSILON) * f) / f; };

  /* ---------- number formatting (South African style: decimal comma, space for thousands) ---------- */
  function fmt(x, dp) {
    if (typeof x !== 'number' || !isFinite(x)) return String(x);
    let s;
    if (dp === undefined) { s = String(round(x, 6)); }
    else s = x.toFixed(dp);
    const neg = s.startsWith('-');
    if (neg) s = s.slice(1);
    let [i, d] = s.split('.');
    if (i.length > 4) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : '') + i + (d ? ',' + d : '');
  }
  const money = (x) => 'R' + fmt(x, 2);
  /* signed number in brackets when negative, e.g. (−3) */
  const br = (n) => (n < 0 ? '(' + fmt(n) + ')' : fmt(n));

  /* ---------- fractions ---------- */
  function simp(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; }
  /* stacked fraction html */
  function F(n, d) {
    if (d === undefined) return fmt(n);
    return `<span class="fr"><span>${typeof n === 'number' ? fmt(n) : n}</span><span>${typeof d === 'number' ? fmt(d) : d}</span></span>`;
  }
  /* simplified fraction html, whole numbers shown plainly */
  function FS(n, d) {
    const [a, b] = simp(n, d);
    if (b === 1) return fmt(a);
    if (a < 0) return '−' + F(-a, b);
    return F(a, b);
  }
  /* mixed number html */
  function MX(n, d) {
    const [a, b] = simp(n, d);
    if (b === 1) return fmt(a);
    const neg = a < 0, A = Math.abs(a), w = Math.floor(A / b), r = A % b;
    return (neg ? '−' : '') + (w ? w + ' ' : '') + F(r, b);
  }
  const fracText = (n, d) => { const [a, b] = simp(n, d); return b === 1 ? String(a) : `${a}/${b}`; };

  /* ---------- algebra term formatting ---------- */
  /* term(3,'x',2) -> 3x² ; term(-1,'x') -> −x ; term(5) -> 5 */
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = (n) => String(n).split('').map((c) => SUP[c] || c).join('');
  function term(c, v = '', p = 1) {
    if (c === 0) return '0';
    const vv = v ? v + (p === 1 ? '' : sup(p)) : '';
    if (!v) return fmt(c);
    if (c === 1) return vv;
    if (c === -1) return '−' + vv;
    return fmt(c) + vv;
  }
  /* join a list of [coef, var, pow] into an expression: 3x − 2y + 4 */
  function expr(terms) {
    let out = '';
    terms.filter((t) => t[0] !== 0).forEach((t, i) => {
      const c = t[0];
      const body = term(Math.abs(c), t[1], t[2]);
      if (i === 0) out += (c < 0 ? '−' : '') + body;
      else out += (c < 0 ? ' − ' : ' + ') + body;
    });
    return out || '0';
  }

  /* ---------- question builders ---------- */
  /* numeric-answer question */
  const num = (q, a, why, opts = {}) => Object.assign({ kind: 'num', q, a, why }, opts);
  /* multiple-choice: correct html + wrong htmls (duplicates removed) */
  function mc(q, correct, wrongs, why) {
    const seen = new Set([String(correct)]);
    const w = [];
    wrongs.forEach((x) => { const s = String(x); if (!seen.has(s)) { seen.add(s); w.push(x); } });
    const opts = shuffle([correct, ...w.slice(0, 3)]);
    return { kind: 'mc', q, opts: opts.map(String), ans: opts.indexOf(correct), why };
  }
  /* numeric distractors near a value */
  function near(a, n = 3, spread) {
    const s = spread || Math.max(1, Math.round(Math.abs(a) * 0.25));
    const out = new Set();
    let guard = 0;
    while (out.size < n && guard++ < 200) {
      const v = a + nz(-s, s);
      if (v !== a) out.add(v);
    }
    return [...out];
  }

  /* ---------- answer parsing ---------- */
  /* Accepts 12 | −3 | 2,5 | 2.5 | 3/4 | 1 3/4 | R250 | 45° | x = 7 */
  function parseAnswer(raw) {
    if (raw == null) return NaN;
    let s = String(raw).trim().toLowerCase()
      .replace(/[−–—]/g, '-')
      .replace(/^[a-z]\s*=\s*/, '')
      .replace(/[a-zℓ°%²³=°]/g, '')
      .trim();
    if (s.includes('/')) {
      s = s.replace(/,/g, '.');
      const m = s.match(/^(-?)\s*(?:(\d+)\s+)?(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
      if (!m) return NaN;
      const sign = m[1] ? -1 : 1;
      const whole = m[2] ? parseFloat(m[2]) : 0;
      const d = parseFloat(m[4]);
      if (!d) return NaN;
      return sign * (whole + parseFloat(m[3]) / d);
    }
    s = s.replace(/[\s  ]/g, '');
    // 1,250.50 style or 2,5 style
    if (s.includes(',') && s.includes('.')) s = s.replace(/,/g, '');
    else s = s.replace(',', '.');
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return parseFloat(s);
  }
  function checkNum(raw, a, tol) {
    const v = parseAnswer(raw);
    if (isNaN(v)) return false;
    const t = tol !== undefined ? tol : 1e-6 + Math.abs(a) * 1e-9;
    return Math.abs(v - a) <= t;
  }

  /* ---------- tiny DOM + SVG helpers for demos ---------- */
  function h(tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach((k) => k != null && e.append(k.nodeType ? k : document.createTextNode(k)));
    return e;
  }
  const NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs = {}, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function svg(w, hgt, cls = '') {
    return s('svg', { viewBox: `0 0 ${w} ${hgt}`, class: 'demo-svg ' + cls, role: 'img' });
  }
  /* labelled range slider; returns {el, input, get, set} */
  function slider(label, min, max, step, value, oninput, show = (v) => fmt(v)) {
    const out = h('output', {}, show(value));
    const input = h('input', { type: 'range', min, max, step, value });
    const wrap = h('label', { class: 'slider' }, h('span', { class: 'slider-top' }, h('span', {}, label), out), input);
    input.addEventListener('input', () => { out.textContent = show(+input.value); oninput && oninput(+input.value); });
    return { el: wrap, input, get: () => +input.value, set: (v) => { input.value = v; out.textContent = show(v); } };
  }
  function btn(text, onclick, cls = '') { return h('button', { class: 'btn ' + cls, type: 'button', onclick }, text); }
  function seg(options, value, onchange) {
    const wrap = h('div', { class: 'seg', role: 'tablist' });
    options.forEach(([val, label]) => {
      const b = h('button', { type: 'button', class: val === value ? 'on' : '', onclick: () => {
        wrap.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
        b.classList.add('on'); onchange(val);
      } }, label);
      wrap.append(b);
    });
    return wrap;
  }
  const clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  Object.assign(G8, { R, pick, nz, shuffle, gcd, lcm, round, fmt, money, br, simp, F, FS, MX, fracText,
    sup, term, expr, num, mc, near, parseAnswer, checkNum, h, s, svg, slider, btn, seg, clear });
})();
