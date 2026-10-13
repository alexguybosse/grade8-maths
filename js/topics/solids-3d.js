(function () {
  const { R, pick, fmt, num, mc, h, s, svg, clear } = G8;
  const phi = (1 + Math.sqrt(5)) / 2;

  function byMinDistance(V) {
    let m = Infinity; const E = [];
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) { const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]); if (d > 1e-6 && d < m) m = d; }
    for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) { const d = Math.hypot(V[i][0] - V[j][0], V[i][1] - V[j][1], V[i][2] - V[j][2]); if (Math.abs(d - m) < 1e-4) E.push([i, j]); }
    return E;
  }
  const signs = (arr) => arr.reduce((acc, v) => acc.flatMap((p) => (v === 0 ? [[...p, 0]] : [[...p, v], [...p, -v]])), [[]]);
  function ring(n, y, r = 1.1, rot = 0) { return Array.from({ length: n }, (_, k) => [r * Math.cos(2 * Math.PI * k / n + rot), y, r * Math.sin(2 * Math.PI * k / n + rot)]); }
  function prism(n) { const V = [...ring(n, -0.9), ...ring(n, 0.9)]; const E = []; for (let k = 0; k < n; k++) { E.push([k, (k + 1) % n], [n + k, n + (k + 1) % n], [k, n + k]); } return { V, E }; }
  function pyramid(n) { const V = [...ring(n, -0.8), [0, 1.2, 0]]; const E = []; for (let k = 0; k < n; k++) E.push([k, (k + 1) % n], [k, n]); return { V, E }; }

  const SOLIDS = {
    tet: { name: 'Tetrahedron (Platonic)', faces: 4, face: '4 equilateral triangles', make: () => { const V = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]; return { V, E: byMinDistance(V) }; } },
    cube: { name: 'Cube (Platonic)', faces: 6, face: '6 squares', make: () => { const V = signs([1, 1, 1]); return { V, E: byMinDistance(V) }; } },
    oct: { name: 'Octahedron (Platonic)', faces: 8, face: '8 equilateral triangles', make: () => { const V = [[1.4, 0, 0], [-1.4, 0, 0], [0, 1.4, 0], [0, -1.4, 0], [0, 0, 1.4], [0, 0, -1.4]]; return { V, E: byMinDistance(V) }; } },
    dod: { name: 'Dodecahedron (Platonic)', faces: 12, face: '12 regular pentagons', make: () => { const V = [...signs([1, 1, 1]), ...signs([0, 1 / phi, phi]), ...signs([1 / phi, phi, 0]), ...signs([phi, 0, 1 / phi])].map((p) => p.map((c) => c * 0.75)); return { V, E: byMinDistance(V) }; } },
    ico: { name: 'Icosahedron (Platonic)', faces: 20, face: '20 equilateral triangles', make: () => { const V = [...signs([0, 1, phi]), ...signs([1, phi, 0]), ...signs([phi, 0, 1])].map((p) => p.map((c) => c * 0.8)); return { V, E: byMinDistance(V) }; } },
    tprism: { name: 'Triangular prism', faces: 5, face: '2 triangles and 3 rectangles', make: () => prism(3) },
    hprism: { name: 'Hexagonal prism', faces: 8, face: '2 hexagons and 6 rectangles', make: () => prism(6) },
    spyr: { name: 'Square pyramid', faces: 5, face: '1 square and 4 triangles', make: () => pyramid(4) },
    ppyr: { name: 'Pentagonal pyramid', faces: 6, face: '1 pentagon and 5 triangles', make: () => pyramid(5) },
  };
  const polyName = { 3: 'triangular', 4: 'rectangular', 5: 'pentagonal', 6: 'hexagonal', 8: 'octagonal' };

  G8.topic({
    id: 'solids-3d', strand: 'space', title: '3D objects',
    blurb: 'Prisms, pyramids and the five Platonic solids: faces, edges, vertices and nets.',
    rules: [
      'A <b>face</b> is a flat surface, an <b>edge</b> is where two faces meet, and a <b>vertex</b> is a corner (plural: vertices).',
      'A <b>prism</b> has two identical parallel bases joined by rectangles. It is named after its base: triangular prism, hexagonal prism…',
      'A <b>pyramid</b> has one base and triangles that meet at a point (the apex).',
      'A prism with an n-sided base: <span class="m">n + 2</span> faces, <span class="m">2n</span> vertices, <span class="m">3n</span> edges.',
      'A pyramid with an n-sided base: <span class="m">n + 1</span> faces, <span class="m">n + 1</span> vertices, <span class="m">2n</span> edges.',
      'Euler\'s rule for these solids: <span class="m">F + V − E = 2</span>.',
      'There are only five <b>Platonic solids</b> (all faces the same regular polygon): tetrahedron, cube, octahedron, dodecahedron, icosahedron.',
      'A <b>net</b> is the flat shape you fold up to make a 3D object.',
    ],
    lesson: [
      { h: 'Prisms and pyramids', html: `
        <table><tr><th>Object</th><th>Faces</th><th>Vertices</th><th>Edges</th></tr>
        <tr><td>Cube</td><td>6</td><td>8</td><td>12</td></tr><tr><td>Triangular prism</td><td>5</td><td>6</td><td>9</td></tr>
        <tr><td>Square pyramid</td><td>5</td><td>5</td><td>8</td></tr><tr><td>Hexagonal prism</td><td>8</td><td>12</td><td>18</td></tr></table>
        <div class="eg"><b>Check Euler</b>Triangular prism: 5 + 6 − 9 = <b>2</b> ✓</div>` },
      { h: 'The Platonic solids', html: `
        <p>A solid is Platonic if every face is the same regular polygon and the same number of faces meet at every vertex.</p>
        <table><tr><th>Solid</th><th>Faces</th><th>V</th><th>E</th></tr>
        <tr><td>Tetrahedron</td><td>4 triangles</td><td>4</td><td>6</td></tr><tr><td>Cube (hexahedron)</td><td>6 squares</td><td>8</td><td>12</td></tr>
        <tr><td>Octahedron</td><td>8 triangles</td><td>6</td><td>12</td></tr><tr><td>Dodecahedron</td><td>12 pentagons</td><td>20</td><td>30</td></tr>
        <tr><td>Icosahedron</td><td>20 triangles</td><td>12</td><td>30</td></tr></table>` },
      { h: 'Nets', html: `
        <p>A cube has 11 different nets. The cross shape is the famous one. A net only works if, when folded, no faces overlap and no gaps are left.</p>
        <p>Spheres, cylinders and cones are 3D objects with curved surfaces. A cylinder's net is two circles and a rectangle.</p>` },
    ],
    demos: [
      { title: 'Spin a solid', about: 'Drag the object to turn it. Count the faces, vertices and edges.', run(el) {
        let key = 'ico', ax = 0.5, ay = 0.6, model = SOLIDS[key].make(), drag = null, raf = 0;
        const pic = svg(300, 260);
        pic.style.maxWidth = '360px'; pic.style.margin = '0 auto';
        const out = h('div', { class: 'readout' });
        const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function project([x, y, z]) {
          let x1 = x * Math.cos(ay) + z * Math.sin(ay), z1 = -x * Math.sin(ay) + z * Math.cos(ay);
          let y1 = y * Math.cos(ax) - z1 * Math.sin(ax), z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
          const p = 4 / (4 + z2);
          return [150 + x1 * 70 * p, 130 - y1 * 70 * p, z2];
        }
        function draw() {
          clear(pic);
          const P = model.V.map(project);
          const edges = model.E.map(([i, j]) => ({ i, j, z: (P[i][2] + P[j][2]) / 2 })).sort((a, b) => b.z - a.z);
          edges.forEach(({ i, j, z }) => pic.append(s('line', { x1: P[i][0], y1: P[i][1], x2: P[j][0], y2: P[j][1], stroke: z > 0 ? 'var(--pencil)' : 'var(--s-space)', 'stroke-width': z > 0 ? 1.4 : 3, 'stroke-dasharray': z > 0 ? '4 4' : '', 'stroke-linecap': 'round' })));
          P.forEach(([x, y, z]) => pic.append(s('circle', { cx: x, cy: y, r: z > 0 ? 2.5 : 4.5, fill: 'var(--red)', 'fill-opacity': z > 0 ? .4 : 1 })));
          const S = SOLIDS[key], F = S.faces, V = model.V.length, E = model.E.length;
          out.innerHTML = `<b>${S.name}</b>: ${S.face}<br>Faces <b>${F}</b> · Vertices <b>${V}</b> · Edges <b>${E}</b><br>Euler: ${F} + ${V} − ${E} = <b>${F + V - E}</b>`;
        }
        function spin() { if (!pic.isConnected && raf) return; if (!drag) { ay += 0.008; ax += 0.003; draw(); } raf = requestAnimationFrame(spin); }
        pic.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY]; pic.setPointerCapture(e.pointerId); });
        pic.addEventListener('pointermove', (e) => { if (!drag) return; ay += (e.clientX - drag[0]) * 0.01; ax += (e.clientY - drag[1]) * 0.01; drag = [e.clientX, e.clientY]; draw(); });
        const up = () => (drag = null); pic.addEventListener('pointerup', up); pic.addEventListener('pointercancel', up);
        const sel = h('select', { class: 'field', 'aria-label': 'Choose a 3D object' }, Object.keys(SOLIDS).map((k) => h('option', { value: k }, SOLIDS[k].name)));
        sel.value = key; sel.addEventListener('change', () => { key = sel.value; model = SOLIDS[key].make(); draw(); });
        el.append(sel, pic, out);
        draw();
        if (!still) {
          raf = requestAnimationFrame(spin);
        }
      } },
    ],
    gens: [
      () => { const n = pick([3, 5, 6, 8]), what = pick(['faces', 'vertices', 'edges']); const v = { faces: n + 2, vertices: 2 * n, edges: 3 * n }[what];
        return num(`How many <b>${what}</b> does a <b>${polyName[n]} prism</b> have?`, v, `The base has ${n} sides. Prism: faces = n + 2 = ${n + 2}, vertices = 2n = ${2 * n}, edges = 3n = ${3 * n}.`, { inputmode: 'numeric' }); },
      () => { const n = pick([3, 4, 5, 6, 8]), what = pick(['faces', 'vertices', 'edges']); const v = { faces: n + 1, vertices: n + 1, edges: 2 * n }[what];
        const nm = n === 4 ? 'square' : polyName[n];
        return num(`How many <b>${what}</b> does a <b>${nm}-based pyramid</b> have?`, v, `Base has ${n} sides. Pyramid: faces = n + 1 = ${n + 1}, vertices = n + 1 = ${n + 1}, edges = 2n = ${2 * n}.`, { inputmode: 'numeric' }); },
      () => { const F = R(5, 20), E = R(F + 2, F + 20), V = 2 - F + E;
        return num(`A solid has <b>${F} faces</b> and <b>${E} edges</b>. Use F + V − E = 2 to find the number of vertices.`, V, `${F} + V − ${E} = 2 → V = 2 − ${F} + ${E} = ${V}.`, { inputmode: 'numeric' }); },
      () => { const pairs = [['tetrahedron', '4 equilateral triangles'], ['cube', '6 squares'], ['octahedron', '8 equilateral triangles'], ['dodecahedron', '12 regular pentagons'], ['icosahedron', '20 equilateral triangles']];
        const [nm, f] = pick(pairs); return mc(`Which Platonic solid has <b>${f}</b> as faces?`, nm, pairs.map((p) => p[0]).filter((x) => x !== nm), `The ${nm} has ${f}.`); },
      () => mc('How many Platonic solids are there?', '5', ['3', '6', 'Infinitely many'], 'Only five: tetrahedron, cube, octahedron, dodecahedron, icosahedron.'),
      () => { const o = pick([['cylinder', 'two circles and a rectangle'], ['cube', 'six squares'], ['triangular prism', 'two triangles and three rectangles'], ['square pyramid', 'one square and four triangles']]);
        return mc(`What shapes make up the net of a <b>${o[0]}</b>?`, o[1], ['two circles and a rectangle', 'six squares', 'two triangles and three rectangles', 'one square and four triangles'].filter((x) => x !== o[1]), `A ${o[0]} unfolds into ${o[1]}.`); },
      () => mc('What is the point at the top of a pyramid called?', 'the apex', ['the base', 'the edge', 'the face'], 'All the triangular faces meet at the apex.'),
    ],
  });
})();
