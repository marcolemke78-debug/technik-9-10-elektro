/**
 * Interaktive Grafik: Spannungsteiler mit LDR (Dunkel- und Hellschaltung).
 * In einer Lektion: <div class="sim" data-sim="sensor"></div>
 * Der Renderer ruft nach dem Anzeigen Sims.initAll(container) auf.
 * Werte wie auf den Arbeitsblättern: 9 V, R3 = 10 kΩ, LDR 1 MΩ (dunkel) bis 500 Ω (hell).
 * Gerechnet ohne Basisstrom (wie AB Std 2, Aufgabe 7).
 */
const Sims = {
  initAll(root) {
    root.querySelectorAll('[data-sim]').forEach(el => {
      const fn = this[el.dataset.sim];
      if (fn && !el.dataset.ready) { el.dataset.ready = '1'; fn.call(this, el); }
    });
  },

  // Widerstand lesbar: 843 Ω, 12,5 kΩ, 1 MΩ
  ohm(r) {
    if (r >= 1e6) return Exercises.fmt(r / 1e6, 2).replace(/,?0+$/, '') + ' MΩ';
    if (r >= 1000) return Exercises.fmt(r / 1000, 1).replace(/,0$/, '') + ' kΩ';
    return Exercises.fmt(r, 0) + ' Ω';
  },

  sensor(el) {
    const U = 9, R3 = 10000, R_DARK = 1e6, R_BRIGHT = 500, UBE = 0.7;
    el.innerHTML = '<div class="sim-title">Ausprobieren: Spannungsteiler mit LDR</div>'
      + '<div class="sim-toggle" role="group">'
      + '<button type="button" class="sim-btn on" data-mode="dunkel">Dunkelschaltung<br><span class="sim-small">R₃ oben, LDR unten</span></button>'
      + '<button type="button" class="sim-btn" data-mode="hell">Hellschaltung<br><span class="sim-small">LDR oben, R₃ unten</span></button>'
      + '</div>'
      + '<label class="sim-row"><span class="sim-label">Helligkeit: <strong class="s-hell"></strong></span>'
      + '<input type="range" min="0" max="100" step="1" value="20" aria-label="Helligkeit"></label>'
      + '<div class="sim-flex"><svg class="sim-svg sim-led" viewBox="0 0 120 120" aria-hidden="true">'
      + '<circle class="s-glow" cx="60" cy="60" r="52" fill="#FDE047" opacity="0"/>'
      + '<circle class="s-bulb" cx="60" cy="60" r="30" fill="#E5E7EB" stroke="#374151" stroke-width="3"/>'
      + '<text x="60" y="66" text-anchor="middle" font-size="18" font-weight="700" fill="#374151">LED</text></svg>'
      + '<div class="sim-out s-out" aria-live="polite"></div></div>'
      + '<p class="sim-small">Gerechnet ohne Basisstrom. In echt bleibt die Basis bei etwa 0,7 V stehen, sobald der Transistor leitet. Für &bdquo;LED an oder aus&ldquo; ändert das nichts.</p>';
    let mode = 'dunkel';
    const slider = el.querySelector('input');
    const update = () => {
      const b = Number(slider.value);
      // logarithmisch zwischen 1 MΩ (0 %) und 500 Ω (100 %)
      const rLdr = R_DARK * Math.pow(R_BRIGHT / R_DARK, b / 100);
      const rTop = mode === 'dunkel' ? R3 : rLdr;
      const rBottom = mode === 'dunkel' ? rLdr : R3;
      const uBottom = U * rBottom / (rTop + rBottom);
      const on = uBottom > UBE;
      // Beschriftung an die Schaltschwellen gekoppelt: hell = Dunkelschaltung aus, dunkel = Hellschaltung aus
      const rDarkLimit = R3 * (U - UBE) / UBE;   // ≈ 118,6 kΩ
      const rBrightLimit = R3 * UBE / (U - UBE); // ≈ 843 Ω
      el.querySelector('.s-hell').textContent = rLdr >= rDarkLimit ? 'dunkel' : rLdr > rBrightLimit ? 'dämmrig' : 'hell';
      el.querySelector('.s-glow').setAttribute('opacity', on ? '0.55' : '0');
      el.querySelector('.s-bulb').setAttribute('fill', on ? '#FACC15' : '#E5E7EB');
      el.querySelector('.s-out').innerHTML =
        'Widerstand LDR: <strong>' + this.ohm(rLdr) + '</strong><br>'
        + 'Unten liegt: ' + (mode === 'dunkel' ? 'LDR' : 'R₃ = 10 kΩ') + '<br>'
        + 'Spannung unten (an der Basis): <strong>' + Exercises.fmt(uBottom, Math.abs(uBottom - UBE) < 0.01 ? 3 : 2) + ' V</strong> '
        + (on ? '&gt; 0,7 V' : '&lt; 0,7 V') + '<br>'
        + 'Transistor: <strong>' + (on ? 'leitet' : 'sperrt') + '</strong> → LED <strong>' + (on ? 'an' : 'aus') + '</strong>';
    };
    slider.addEventListener('input', update);
    el.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      el.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b === btn));
      update();
    }));
    update();
  }
};
