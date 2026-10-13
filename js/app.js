/* Grade 8 Maths — app shell: routing, pages, quiz engine, progress. */
(function () {
  const { h, clear, shuffle, pick, fmt, checkNum } = G8;
  const app = document.getElementById('app');

  const STRANDS = [
    { id: 'numbers', name: 'Numbers and calculations', note: 'Numbers, operations and relationships', color: 'var(--s-numbers)' },
    { id: 'algebra', name: 'Patterns, functions and algebra', note: 'Patterns, functions and algebra', color: 'var(--s-algebra)' },
    { id: 'space', name: 'Geometry', note: 'Space and shape', color: 'var(--s-space)' },
    { id: 'measure', name: 'Measurement', note: 'Measurement', color: 'var(--s-measure)' },
    { id: 'data', name: 'Data and probability', note: 'Data handling', color: 'var(--s-data)' },
  ];
  const strandOf = (t) => STRANDS.find((s) => s.id === t.strand);
  const byId = (id) => G8.topics.find((t) => t.id === id);

  /* ---------- progress (kept on this phone only) ---------- */
  const KEY = 'g8maths-progress-v1';
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { progress = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (e) { /* storage off: progress lasts this visit */ } }
  function record(id, score, total) {
    const p = progress[id] || { best: 0, tries: 0 };
    p.tries++; p.last = score / total; p.best = Math.max(p.best || 0, score / total);
    progress[id] = p; save();
  }
  const markFor = (id) => {
    const p = progress[id];
    if (!p || !p.tries) return h('span', { class: 'mark empty' }, 'not tested');
    return h('span', { class: 'mark', title: 'Best score' }, Math.round(p.best * 100) + '%');
  };

  /* ---------- question generation ---------- */
  function makeQuestion(topic) {
    for (let i = 0; i < 20; i++) {
      try {
        const q = pick(topic.gens)();
        if (q && (q.kind === 'mc' ? q.ans >= 0 : isFinite(q.a))) { q.topic = topic.id; return q; }
      } catch (e) { console.error(topic.id, e); }
    }
    return null;
  }
  function makeSet(topics, n) {
    const out = [];
    // spread questions evenly over the topics, then shuffle
    let pool = [];
    while (pool.length < n) pool = pool.concat(shuffle(topics));
    pool.slice(0, n).forEach((t) => { const q = makeQuestion(t); if (q) out.push(q); });
    return topics.length > 1 ? shuffle(out) : out;
  }
  const answerText = (q) => (q.kind === 'mc' ? q.opts[q.ans] : q.show !== undefined ? q.show : fmt(q.a) + (q.unit ? ' ' + q.unit : ''));

  const TICK = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 26 L19 37 L41 10"/></svg>';
  const CROSS = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 12 L36 36 M36 12 L12 36"/></svg>';

  /* One question card. instant=true marks it straight away; otherwise just records the answer. */
  function questionCard(q, { meta = '', instant = true, onDone }) {
    const card = h('div', { class: 'qcard' });
    if (meta) card.append(h('div', { class: 'qmeta', html: meta }));
    card.append(h('div', { class: 'qtext', html: q.q }));
    const fb = h('div', { class: 'feedback', hidden: '' });
    let done = false;

    function finish(correct, given) {
      if (done) return; done = true;
      if (instant) {
        fb.hidden = false;
        fb.innerHTML = `<div class="verdict">${correct ? TICK + 'Correct' : CROSS + 'Not quite'}</div>` +
          (correct ? '' : `<p>Answer: <b>${answerText(q)}</b></p>`) +
          (q.why ? `<p class="why">${q.why}</p>` : '');
      }
      onDone && onDone(correct, given);
    }

    if (q.kind === 'mc') {
      const opts = h('div', { class: 'opts' });
      q.opts.forEach((o, i) => {
        const b = h('button', { class: 'opt', type: 'button', html: o, onclick: () => {
          if (done) return;
          opts.querySelectorAll('.opt').forEach((x) => (x.disabled = true));
          if (instant) {
            opts.children[q.ans].classList.add('right');
            if (i !== q.ans) b.classList.add('wrong');
          } else b.classList.add('right');
          finish(i === q.ans, o);
        } });
        opts.append(b);
      });
      card.append(opts);
    } else {
      const input = h('input', { class: 'field', type: 'text', inputmode: q.inputmode || 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Your answer', placeholder: q.hint || 'Your answer' });
      const go = h('button', { class: 'btn', type: 'button' }, 'Check');
      const submit = () => {
        if (done) return;
        if (!input.value.trim()) { input.focus(); return; }
        input.disabled = true; go.disabled = true; keys.querySelectorAll('button').forEach((k) => (k.disabled = true));
        finish(checkNum(input.value, q.a, q.tol), escapeHtml(input.value));
      };
      go.onclick = submit;
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      const keys = h('div', { class: 'keys', 'aria-label': 'Extra keys' });
      ['−', '/', ','].forEach((k) => keys.append(h('button', { type: 'button', 'aria-label': 'Type ' + k, onclick: () => {
        const v = input.value, p = input.selectionStart ?? v.length;
        input.value = v.slice(0, p) + (k === '−' ? '-' : k) + v.slice(input.selectionEnd ?? p);
        input.focus(); input.setSelectionRange(p + 1, p + 1);
      } }, k)));
      card.append(h('div', { class: 'answer-row' }, input, go), keys);
      if (q.after) card.append(h('p', { class: 'small muted', html: q.after }));
      setTimeout(() => instant && input.focus({ preventScroll: true }), 50);
    }
    card.append(fb);
    return card;
  }

  /* A run of questions. mode 'practice' marks each one; 'exam' marks at the end. */
  function runQuiz(root, questions, { mode = 'practice', title, onFinish, again }) {
    let i = 0, score = 0;
    const answers = [];
    function show() {
      clear(root);
      const q = questions[i];
      const meta = `<span>Question ${i + 1} of ${questions.length}</span><span>${mode === 'practice' ? 'Score ' + score : ''}</span>`;
      const next = h('button', { class: 'btn', type: 'button', disabled: '' }, i === questions.length - 1 ? 'See my score' : 'Next question');
      const card = questionCard(q, { meta, instant: mode === 'practice', onDone: (ok, given) => {
        answers[i] = { ok, given }; if (ok) score++;
        next.disabled = false;
        if (mode === 'exam') setTimeout(go, 250); else next.focus({ preventScroll: true });
      } });
      const go = () => { i++; i < questions.length ? show() : end(); };
      next.onclick = go;
      root.append(card);
      if (mode === 'practice') root.append(h('div', { class: 'qfoot' }, next));
      root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    function end() {
      clear(root);
      const total = questions.length, pct = score / total;
      const msg = pct === 1 ? 'Full marks. You know this.' : pct >= 0.8 ? 'Strong. Check the ones you missed and you’re there.'
        : pct >= 0.5 ? 'Getting there. Read the rules again, then try another set.' : 'Go back to the lesson and the demo, then have another go. Every set is new.';
      const res = h('div', { class: 'card result' },
        h('h2', {}, title || 'Your score'),
        h('div', { class: 'mark big' }, `${score}/${total}`),
        h('p', {}, msg));
      const row = h('div', { class: 'row' });
      if (again) row.append(G8.btn('Try a new set', again));
      res.append(row);
      root.append(res);
      onFinish && onFinish(score, total, answers);
      if (mode === 'exam') root.append(reviewList(questions, answers));
      root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    show();
  }

  function reviewList(questions, answers) {
    const wrap = h('div', { class: 'card' }, h('h2', { style: 'margin-top:0' }, 'Marked paper'));
    // topic breakdown
    const per = {};
    questions.forEach((q, i) => { per[q.topic] = per[q.topic] || [0, 0]; per[q.topic][1]++; if (answers[i] && answers[i].ok) per[q.topic][0]++; });
    const weak = Object.entries(per).filter(([, v]) => v[0] < v[1]).map(([id]) => byId(id));
    if (weak.length) {
      const p = h('p', {}, 'Work on: ');
      weak.forEach((t, k) => { p.append(h('a', { href: '#/t/' + t.id }, t.title)); if (k < weak.length - 1) p.append(', '); });
      wrap.append(p);
    }
    const ol = h('ol', { class: 'review' });
    questions.forEach((q, i) => {
      const a = answers[i] || {};
      ol.append(h('li', { html:
        `<div class="q">${q.q}</div>` +
        `<div>${a.ok ? '<b style="color:var(--ok)">✓</b>' : '<b style="color:var(--red)">✗</b>'} You said: ${a.given || '—'}` +
        (a.ok ? '' : ` · Answer: <b>${answerText(q)}</b>`) + `</div>` +
        (!a.ok && q.why ? `<div class="why small">${q.why}</div>` : '') }));
    });
    wrap.append(ol);
    return wrap;
  }
  const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- pages ---------- */
  function setNav(which) {
    document.querySelectorAll('.tabbar a').forEach((a) => a.classList.toggle('on', a.dataset.nav === which));
  }

  function homePage() {
    setNav('home');
    const tested = G8.topics.filter((t) => progress[t.id] && progress[t.id].tries).length;

    const head = h('header', { class: 'masthead' },
      h('h1', {}, 'Grade 8 Maths'),
      h('p', {}, 'Every topic in the CAPS syllabus. Learn the rules, play with the demo, then test yourself.'));

    // Warm-up: a live question from a random topic
    const warm = h('section', { class: 'card warmup', 'aria-label': 'Warm-up question' });
    function newWarm() {
      clear(warm);
      const t = pick(G8.topics);
      const q = makeQuestion(t);
      warm.append(
        h('div', { class: 'warmup-head' }, h('h2', {}, 'Warm-up'), h('a', { href: '#/t/' + t.id }, t.title)),
        questionCard(q, { instant: true, onDone: () => warm.append(h('div', { class: 'qfoot' }, G8.btn('Another one', newWarm, 'ghost small'))) }));
      warm.querySelector('.qcard').style.border = '0';
      warm.querySelector('.qcard').style.padding = '0';
      const inp = warm.querySelector('input'); if (inp) setTimeout(() => inp.blur(), 60);
    }
    newWarm();

    const bar = h('div', { class: 'progress-line' },
      h('span', {}, `${tested} of ${G8.topics.length} topics tested`),
      h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': G8.topics.length, 'aria-valuenow': tested },
        h('i', { style: `width:${(tested / G8.topics.length) * 100}%` })));

    const strands = STRANDS.map((s) => {
      const list = h('ul', { class: 'topics' });
      G8.topics.filter((t) => t.strand === s.id).forEach((t) => {
        list.append(h('li', {}, h('a', { href: '#/t/' + t.id },
          h('span', { class: 'tt' }, h('b', {}, t.title), h('span', {}, t.blurb)), markFor(t.id))));
      });
      return h('section', { class: 'strand', style: `--strand:${s.color}` },
        h('div', { class: 'strand-head' }, h('span', { class: 'tab' }), h('h2', {}, s.name)), list);
    });

    const install = h('details', { class: 'card install' },
      h('summary', {}, 'Put this on your home screen'),
      h('p', {}, 'It then opens like an app and works without data once loaded.'),
      h('ol', { html: '<li><b>iPhone (Safari):</b> tap Share, then <i>Add to Home Screen</i>.</li><li><b>Android (Chrome):</b> tap the ⋮ menu, then <i>Add to Home screen</i> or <i>Install app</i>.</li>' }),
      h('p', { class: 'muted' }, 'Your scores are saved on this phone only.'));

    app.append(head, warm, bar, ...strands, install);
  }

  function topicPage(id, tab = 'learn') {
    const t = byId(id);
    if (!t) return notFound();
    setNav('home');
    const s = strandOf(t);
    const page = h('div', { style: `--strand:${s.color}` });
    page.append(
      h('a', { class: 'crumb', href: '#/' }, '‹ All topics'),
      h('div', { class: 'topic-head' }, h('span', { class: 'chip' }, s.name), h('h1', {}, t.title), h('p', {}, t.blurb)));
    const body = h('div');
    page.append(G8.seg([['learn', 'Learn'], ['try', 'Try it'], ['test', 'Test yourself']], tab, (v) => {
      history.replaceState(null, '', '#/t/' + id + (v === 'learn' ? '' : '/' + v)); fill(v);
    }), body);

    function fill(v) {
      clear(body);
      if (v === 'learn') {
        const rules = h('section', { class: 'rules' }, h('h2', {}, 'Rules to know'), h('ol', {}, t.rules.map((r) => h('li', { html: r }))));
        const lesson = h('div', { class: 'lesson' });
        t.lesson.forEach((sec) => lesson.append(h('h2', {}, sec.h), h('div', { html: sec.html })));
        body.append(rules, lesson, h('div', { class: 'next-row' }, G8.btn('Try the demo', () => { page.querySelectorAll('.seg button')[1].click(); window.scrollTo({ top: 0 }); })));
      } else if (v === 'try') {
        t.demos.forEach((d) => {
          const box = h('section', { class: 'demo' }, h('h3', {}, d.title));
          if (d.about) box.append(h('p', { html: d.about }));
          const stage = h('div');
          box.append(stage);
          body.append(box);
          try { d.run(stage); } catch (e) { console.error(e); stage.append(h('p', { class: 'muted' }, 'This demo could not start on this browser.')); }
        });
        body.append(h('div', { class: 'next-row' }, G8.btn('Test yourself', () => { page.querySelectorAll('.seg button')[2].click(); window.scrollTo({ top: 0 }); })));
      } else {
        const p = progress[t.id];
        const intro = h('div', { class: 'card' },
          h('h2', { style: 'margin-top:0' }, '10 questions'),
          h('p', {}, 'You get marked after each one, with the working shown when you’re wrong. Every set is different, so you can redo it as often as you like.'),
          p && p.tries ? h('p', { class: 'muted' }, `Best so far: ${Math.round(p.best * 100)}% (${p.tries} ${p.tries === 1 ? 'try' : 'tries'})`) : '',
          h('div', { class: 'row' }, G8.btn('Start', start)));
        const quizRoot = h('div');
        body.append(intro, quizRoot);
        function start() {
          intro.remove();
          runQuiz(quizRoot, makeSet([t], 10), { mode: 'practice', title: t.title, onFinish: (sc, tot) => record(t.id, sc, tot), again: start });
        }
      }
    }
    fill(tab);
    app.append(page);
  }

  function rulesPage() {
    setNav('rules');
    const search = h('input', { class: 'field search', type: 'search', placeholder: 'Search the rules (e.g. VAT, angle, mean)', 'aria-label': 'Search the rules' });
    const list = h('div');
    function render() {
      clear(list);
      const q = search.value.trim().toLowerCase();
      let any = false;
      STRANDS.forEach((s) => {
        const ts = G8.topics.filter((t) => t.strand === s.id);
        const blocks = [];
        ts.forEach((t) => {
          const rules = t.rules.filter((r) => !q || (t.title + ' ' + r.replace(/<[^>]+>/g, '')).toLowerCase().includes(q));
          if (!rules.length) return;
          blocks.push(h('div', { class: 'sheet-topic', style: `--strand:${s.color}` },
            h('h3', {}, h('a', { href: '#/t/' + t.id }, t.title)),
            h('ol', {}, rules.map((r) => h('li', { html: r })))));
        });
        if (blocks.length) { any = true; list.append(h('h2', {}, s.name), ...blocks); }
      });
      if (!any) list.append(h('p', { class: 'muted' }, 'No rules match that. Try a shorter word.'));
    }
    search.addEventListener('input', render);
    render();
    app.append(h('header', { class: 'masthead' }, h('h1', {}, 'Rules sheet'), h('p', {}, 'Every rule from every topic on one page. Handy the night before a test.')), search, list);
  }

  function examPage() {
    setNav('exam');
    const root = h('div');
    const choose = h('div', {},
      h('header', { class: 'masthead' }, h('h1', {}, 'Mock exam'), h('p', {}, '20 questions. No marks until the end, like the real thing. Then you get the marked paper and a list of topics to work on.')));
    const scope = h('div', { class: 'scope' });
    const opt = (label, sub, color, topics) => scope.append(h('button', { type: 'button', style: `--strand:${color}`, onclick: () => start(label, topics) },
      h('span', { class: 'tab' }), h('span', {}, h('b', {}, label), h('span', {}, sub))));
    opt('The whole year', 'Mixed questions from all 20 topics', 'var(--ink)', G8.topics);
    STRANDS.forEach((s) => {
      const ts = G8.topics.filter((t) => t.strand === s.id);
      opt(s.name, ts.map((t) => t.title).join(', '), s.color, ts);
    });
    choose.append(scope);
    root.append(choose);
    function start(label, topics) {
      clear(root);
      root.append(h('a', { class: 'crumb', href: '#/exam', onclick: (e) => { e.preventDefault(); route(); } }, '‹ Choose another exam'), h('h1', { style: 'margin-bottom:6px' }, label));
      const q = h('div');
      root.append(q);
      runQuiz(q, makeSet(topics, 20), { mode: 'exam', title: label, again: () => start(label, topics) });
    }
    app.append(root);
  }

  function notFound() {
    app.append(h('h1', {}, 'Page not found'), h('p', {}, 'That link doesn’t match a topic.'), h('a', { href: '#/' }, 'Go to all topics'));
  }

  /* ---------- router ---------- */
  function route() {
    clear(app);
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
    if (!parts.length) homePage();
    else if (parts[0] === 't') topicPage(parts[1], parts[2] || 'learn');
    else if (parts[0] === 'rules') rulesPage();
    else if (parts[0] === 'exam') examPage();
    else notFound();
    window.scrollTo(0, 0);
    const h1 = app.querySelector('h1');
    document.title = h1 && parts.length ? h1.textContent + ' · Grade 8 Maths' : 'Grade 8 Maths';
  }
  window.addEventListener('hashchange', route);
  route();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  G8._internals = { makeQuestion, STRANDS };
})();
