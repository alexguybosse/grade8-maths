(function () {
  const { R, pick, fmt, round, num, mc, h, s, svg, slider, clear, seg } = G8;

  G8.topic({
    id: 'surface-volume', strand: 'measure', title: 'Surface area and volume',
    blurb: 'Volume and surface area of cubes, rectangular prisms and triangular prisms, and capacity.',
    rules: [
      '<b>Volume</b> is the space inside a 3D object, in cubic units (cm³, m³).',
      'Volume of any prism = <b>area of the base × height</b>.',
      'Cube: <span class="m">V = s<sup>3</sup></span>. Rectangular prism: <span class="m">V = l × b × h</span>. Triangular prism: <span class="m">V = (½ × base × height of triangle) × length of prism</span>.',
      '<b>Surface area</b> is the total area of all the faces. Unfold the net and add up the faces.',
      'Cube: <span class="m">SA = 6s<sup>2</sup></span>. Rectangular prism: <span class="m">SA = 2(lb + lh + bh)</span>.',
      'Capacity: <span class="m">1 cm<sup>3</sup> = 1 mℓ</span>, <span class="m">1 000 cm<sup>3</sup> = 1 ℓ</span>, <span class="m">1 m<sup>3</sup> = 1 000 ℓ = 1 kℓ</span>.',
      'Volume units: <span class="m">1 cm<sup>3</sup> = 1 000 mm<sup>3</sup></span>, <span class="m">1 m<sup>3</sup> = 1 000 000 cm<sup>3</sup></span>.',
    ],
    lesson: [
      { h: 'Volume', html: `
        <p>Volume counts how many unit cubes fit inside. A box 4 cm long, 3 cm wide and 2 cm high holds 4 × 3 = 12 cubes on the bottom layer, and there are 2 layers: <b>24 cm<sup>3</sup></b>.</p>
        <div class="eg"><b>Triangular prism</b>The triangle has base 6 cm and height 4 cm; the prism is 10 cm long.<br>Base area = ½ × 6 × 4 = 12 cm<sup>2</sup>. V = 12 × 10 = <b>120 cm<sup>3</sup></b>.</div>` },
      { h: 'Surface area', html: `
        <div class="eg"><b>Rectangular prism</b>l = 5, b = 3, h = 2 (cm).<br>Top and bottom: 2 × 15 = 30. Front and back: 2 × 10 = 20. Sides: 2 × 6 = 12. SA = <b>62 cm<sup>2</sup></b>.</div>
        <div class="eg"><b>Cube</b>Side 4 cm: SA = 6 × 16 = <b>96 cm<sup>2</sup></b>.</div>
        <div class="eg"><b>Triangular prism</b>Right-angled triangle with sides 3, 4, 5 cm; prism length 10 cm.<br>Two triangles: 2 × (½ × 3 × 4) = 12. Three rectangles: 3 × 10 + 4 × 10 + 5 × 10 = 120. SA = <b>132 cm<sup>2</sup></b>.</div>` },
      { h: 'Capacity', html: `
        <div class="eg"><b>Example</b>A fish tank is 50 cm × 30 cm × 40 cm. V = 60 000 cm<sup>3</sup> = 60 000 mℓ = <b>60 ℓ</b>.</div>
        <div class="eg"><b>Example</b>A pool holds 2,5 m<sup>3</sup> of water = 2,5 × 1 000 = <b>2 500 ℓ</b>.</div>` },
    ],
    demos: [
      { title: 'Box builder', about: 'Change the size of the box. See the unit cubes for volume and the net for surface area.', run(el) {
        let l = 4, b = 3, hh = 2, view = 'cubes';
        const pic = svg(340, 240);
        const out = h('div', { class: 'readout' });
        function iso(x, y, z, u) { return [170 - (l - b) * u * 0.435 + (x - y) * u * 0.87, 215 - (x + y) * u * 0.5 - z * u]; }
        function draw() {
          clear(pic);
          if (view === 'cubes') {
            const u = Math.min(22, 200 / (l + b + hh));
            // draw cubes back to front
            for (let z = 0; z < hh; z++) for (let y = b - 1; y >= 0; y--) for (let x = l - 1; x >= 0; x--) {
              const P = (dx, dy, dz) => iso(x + dx, y + dy, z + dz, u).join(',');
              const top = [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], front = [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)];
              pic.append(s('polygon', { points: top.join(' '), fill: 'var(--s-measure)', 'fill-opacity': .5, stroke: 'var(--card)', 'stroke-width': 1 }));
              pic.append(s('polygon', { points: front.join(' '), fill: 'var(--s-measure)', 'fill-opacity': .85, stroke: 'var(--card)', 'stroke-width': 1 }));
              pic.append(s('polygon', { points: [P(0, 0, 0), P(0, 1, 0), P(0, 1, 1), P(0, 0, 1)].join(' '), fill: 'var(--s-measure)', 'fill-opacity': .65, stroke: 'var(--card)', 'stroke-width': 1 }));
            }
            out.innerHTML = `Volume = l × b × h = ${l} × ${b} × ${hh} = <b>${l * b * hh} cubes</b><br><span class="small muted">${l * b} cubes in each layer, ${hh} layer${hh > 1 ? 's' : ''}.</span>`;
          } else {
            const u = Math.min(18, 320 / (2 * l + 2 * b + 1), 220 / (2 * b + hh + 1));
            const x0 = 10 + (340 - (2 * l + 2 * b) * u) / 2, y0 = 10 + (220 - (2 * b + hh) * u) / 2;
            const face = (x, y, w, ht, col, lab) => {
              pic.append(s('rect', { x: x0 + x * u, y: y0 + y * u, width: w * u, height: ht * u, fill: col, 'fill-opacity': .3, stroke: 'currentColor', 'stroke-width': 1.5 }));
              if (w * u > 26 && ht * u > 14) pic.append(s('text', { x: x0 + (x + w / 2) * u, y: y0 + (y + ht / 2) * u + 4, 'text-anchor': 'middle', 'font-size': 11 }, lab));
            };
            // middle strip: back, side, front, side (height hh), top & bottom attached to front face
            face(0, b, b, hh, 'var(--s-numbers)', `${b}×${hh}`);
            face(b, b, l, hh, 'var(--red)', `${l}×${hh}`);
            face(b + l, b, b, hh, 'var(--s-numbers)', `${b}×${hh}`);
            face(2 * b + l, b, l, hh, 'var(--red)', `${l}×${hh}`);
            face(b, 0, l, b, 'var(--s-algebra)', `${l}×${b}`);
            face(b, b + hh, l, b, 'var(--s-algebra)', `${l}×${b}`);
            pic.setAttribute('viewBox', '0 0 340 240');
            const SA = 2 * (l * b + l * hh + b * hh);
            out.innerHTML = `SA = 2(lb + lh + bh) = 2(${l * b} + ${l * hh} + ${b * hh}) = <b>${SA} square units</b><br><span class="small muted">Matching colours are opposite faces: they come in pairs.</span>`;
          }
        }
        el.append(seg([['cubes', 'Volume (cubes)'], ['net', 'Surface area (net)']], view, (v) => { view = v; draw(); }), pic, h('div', { class: 'controls' },
          slider('Length l', 1, 7, 1, l, (v) => { l = v; draw(); }).el,
          slider('Breadth b', 1, 5, 1, b, (v) => { b = v; draw(); }).el,
          slider('Height h', 1, 5, 1, hh, (v) => { hh = v; draw(); }).el), out);
        draw();
      } },
    ],
    gens: [
      () => { const l = R(2, 15), b = R(2, 10), hh = R(2, 10); return num(`Find the volume of a rectangular prism <b>${l} cm × ${b} cm × ${hh} cm</b> (cm³).`, l * b * hh, `V = l × b × h = ${l} × ${b} × ${hh} = ${l * b * hh} cm³.`); },
      () => { const x = R(2, 12); return num(`Find the volume of a cube with sides of <b>${x} m</b> (m³).`, x ** 3, `V = s³ = ${x}³ = ${x ** 3} m³.`); },
      () => { const x = R(2, 12); return num(`Find the surface area of a cube with sides of <b>${x} cm</b> (cm²).`, 6 * x * x, `SA = 6s² = 6 × ${x * x} = ${6 * x * x} cm².`); },
      () => { const l = R(2, 12), b = R(2, 8), hh = R(2, 8); const SA = 2 * (l * b + l * hh + b * hh);
        return num(`Find the surface area of a box <b>${l} cm</b> long, <b>${b} cm</b> wide and <b>${hh} cm</b> high (cm²).`, SA, `SA = 2(lb + lh + bh) = 2(${l * b} + ${l * hh} + ${b * hh}) = ${SA} cm².`); },
      () => { const tb = R(2, 10), th = R(2, 10), L = R(3, 15); const v = tb * th / 2 * L;
        return num(`A triangular prism has a triangle with base <b>${tb} cm</b> and height <b>${th} cm</b>. The prism is <b>${L} cm</b> long. Find its volume (cm³).`, v, `Base area = ½ × ${tb} × ${th} = ${fmt(tb * th / 2)}. V = ${fmt(tb * th / 2)} × ${L} = ${fmt(v)} cm³.`); },
      () => { const l = R(2, 10) * 10, b = R(2, 6) * 10, hh = R(2, 6) * 10; const L = l * b * hh / 1000;
        return num(`A fish tank measures <b>${l} cm × ${b} cm × ${hh} cm</b>. How many <b>litres</b> of water does it hold?`, L, `V = ${fmt(l * b * hh)} cm³ = ${fmt(l * b * hh)} mℓ. Divide by 1 000: ${fmt(L)} ℓ.`); },
      () => { const v = R(1, 40) / 2; return num(`How many litres are in <b>${fmt(v)} m³</b>?`, v * 1000, `1 m³ = 1 000 ℓ, so ${fmt(v)} × 1 000 = ${fmt(v * 1000)} ℓ.`); },
      () => { const l = R(3, 12), b = R(2, 8), hh = R(2, 9); return num(`A box has a volume of <b>${l * b * hh} cm³</b>. It is ${l} cm long and ${b} cm wide. How high is it (cm)?`, hh, `h = V ÷ (l × b) = ${l * b * hh} ÷ ${l * b} = ${hh} cm.`); },
      () => { return mc(`If you double every side of a cube, its volume becomes…`, '8 times bigger', ['2 times bigger', '4 times bigger', '6 times bigger'], 'Length, breadth and height all × 2, so volume × 2 × 2 × 2 = 8.'); },
      () => mc('Which unit measures surface area?', 'cm²', ['cm³', 'cm', 'mℓ'], 'Surface area is an area, so square units.'),
    ],
  });
})();
