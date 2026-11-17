/**
 * Trainer zum Auswendiglernen (Vokabeln, Fachbegriffe, Formeln, Jahreszahlen).
 * Daten: js/cards.js (CARDS). Fortschritt je Karte: Progress.rateCard().
 *
 * Ablauf einer Runde:
 *   1. erst fällige Karten, dann bis zu 10 neue am Tag
 *   2. mode 'type':   Vorderseite sehen, Rückseite TIPPEN
 *      mode 'reveal': Vorderseite sehen, selbst erklären, aufdecken, ehrlich einschätzen
 *   3. falsch -> Fach 1 und in derselben Runde noch einmal
 *      ein Buchstabe daneben -> "fast richtig", ein zweiter Versuch
 *   4. CARDS.reverse: Sitzt eine Karte (ab Fach 2), kommt auch die Gegenrichtung
 *      (Fremdsprache -> Deutsch) dran, zum Aufdecken.
 *
 * Karten-IDs nie nachträglich ändern, sonst ist der Lernstand der Karte weg.
 */
const Trainer = {

  // ---------- Hilfen ----------
  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  // Vergleichstext: klein, ohne Satzzeichen am Ende, bei Englisch ohne "to " vorn.
  norm(s, formula) {
    let t = Exercises._norm(String(s).replace(/<[^>]+>/g, '')).replace(/[.!?]+$/, '');
    if (CARDS.speak && CARDS.speak.indexOf('en') === 0) t = t.replace(/^to\s+/, '');
    // Formelkarten (formula: true): Leerzeichen, Unterstriche und gleichwertige Rechenzeichen egal
    if (formula) t = t.replace(/[\s_]/g, '').replace(/[·×x*]/g, '*').replace(/[:÷]/g, '/').replace(/[−–]/g, '-').replace(/,/g, '.');
    return t;
  },

  // Abstand zweier Wörter in Buchstaben (Tippfehler, Dreher), für "fast richtig".
  distance(a, b) {
    const m = a.length, n = b.length;
    const d = [];
    for (let i = 0; i <= m; i++) { d[i] = [i]; }
    for (let j = 1; j <= n; j++) { d[0][j] = j; }
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        // vertauschte Nachbarbuchstaben ("reliabel") zählen als 1 Fehler
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
    return d[m][n];
  },

  // 'right' | 'almost' | 'wrong'
  judge(typed, item) {
    const t = this.norm(typed, item.formula);
    const answers = [item.back].concat(item.alt || []).map(x => this.norm(x, item.formula));
    if (answers.indexOf(t) !== -1) return 'right';
    // Bei Formeln ist ein anderes Zeichen kein Tippfehler, sondern falsch: kein "fast richtig"
    if (!item.formula && answers.some(a => a.length >= 4 && this.distance(t, a) === 1)) return 'almost';
    return 'wrong';
  },

  speak(text, lang) {
    if (!lang || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, ''));
    u.lang = lang;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  },

  speakBtn(text) {
    const b = this.el('button', 'trainer-speak', '🔊 Anhören');
    b.type = 'button';
    b.addEventListener('click', () => this.speak(text, CARDS.speak));
    return b;
  },

  // ---------- Karten einer Runde ----------
  // Jede Vokabel ergibt bis zu zwei Karten: id (Deutsch -> Fremdsprache) und id + '<' (Gegenrichtung).
  allCards() {
    const cards = [];
    CARDS.items.forEach(item => {
      cards.push({ cardId: item.id, item: item, reverse: false, mode: item.mode || CARDS.mode || 'type' });
      if (CARDS.reverse) cards.push({ cardId: item.id + '<', item: item, reverse: true, mode: 'reveal' });
    });
    return cards;
  },

  buildSession() {
    const due = [], fresh = [];
    this.allCards().forEach(c => {
      const rec = Progress.getCard(c.cardId);
      if (rec) { if (Progress.isCardDue(c.cardId)) due.push(c); return; }
      if (c.reverse) {
        const fwd = Progress.getCard(c.item.id);
        if (!fwd || fwd.box < 2) return; // Gegenrichtung erst, wenn die Hinrichtung sitzt
      }
      fresh.push(c);
    });
    return { due: due, fresh: fresh.slice(0, Math.max(0, Progress.newCardsLeft())) };
  },

  boxCounts() {
    const counts = { neu: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    CARDS.items.forEach(item => {
      const rec = Progress.getCard(item.id);
      if (rec) counts[rec.box]++; else counts.neu++;
    });
    return counts;
  },

  nextDueDate() {
    let next = null;
    this.allCards().forEach(c => {
      const rec = Progress.getCard(c.cardId);
      if (rec && rec.dueDate && (!next || rec.dueDate < next)) next = rec.dueDate;
    });
    return next;
  },

  // ---------- Seite ----------
  render(container) {
    container.innerHTML = '';
    container.appendChild(this.el('h1', '', CARDS.title));

    const c = this.boxCounts();
    const stats = this.el('div', 'trainer-stats');
    stats.innerHTML = '<span><strong>' + c.neu + '</strong> neu</span>'
      + [1, 2, 3, 4].map(b => '<span>Fach ' + b + ': <strong>' + c[b] + '</strong></span>').join('');
    container.appendChild(stats);

    const s = this.buildSession();
    const total = s.due.length + s.fresh.length;
    const intro = this.el('div', 'trainer-intro');

    if (!CARDS.items.length) {
      intro.innerHTML = '<p>Für dieses Paket gibt es noch keine Karten.</p>';
      container.appendChild(intro);
      return;
    }
    if (total === 0) {
      const next = this.nextDueDate();
      intro.innerHTML = '<p class="trainer-done-text">✓ Für heute ist alles erledigt.'
        + (next ? ' Die nächsten Karten kommen ' + Progress.dueText(next) + ' dran.' : '') + '</p>'
        + '<p class="trainer-small">Lieber jeden Tag kurz als einmal lang. Morgen geht es weiter.</p>';
      const extra = this.el('button', 'exercise-check-btn', 'Extra-Runde: 10 schwierige Karten');
      extra.addEventListener('click', () => this.runSession(container, this.hardestCards(10), true));
      intro.appendChild(extra);
      container.appendChild(intro);
      return;
    }

    intro.innerHTML = '<p>Heute dran: <strong>' + s.due.length + '</strong> zum Wiederholen'
      + ' und <strong>' + s.fresh.length + '</strong> neue Karten.</p>'
      + '<p class="trainer-small">Erst überlegen, dann tippen. Was falsch war, kommt gleich noch einmal und morgen wieder.</p>';
    const start = this.el('button', 'exercise-check-btn', 'Los geht\'s');
    start.addEventListener('click', () => this.runSession(container, s.due.concat(s.fresh), false));
    intro.appendChild(start);
    container.appendChild(intro);
  },

  // Extra-Runde: die Karten mit dem niedrigsten Fach (zählt nicht für den Plan)
  hardestCards(n) {
    return this.allCards()
      .filter(c => Progress.getCard(c.cardId))
      .sort((a, b) => Progress.getCard(a.cardId).box - Progress.getCard(b.cardId).box)
      .slice(0, n);
  },

  runSession(container, cards, practiceOnly) {
    const queue = cards.slice();
    const rated = {};      // Karte in dieser Runde schon bewertet?
    let firstTry = 0;
    const total = cards.length;

    const page = this.el('div', 'trainer-session');
    const progressEl = this.el('div', 'vocab-progress');
    const card = this.el('div', 'vocab-card');
    page.appendChild(progressEl);
    page.appendChild(card);
    container.innerHTML = '';
    container.appendChild(this.el('h1', '', CARDS.title + (practiceOnly ? ' – Extra-Runde' : '')));
    container.appendChild(page);

    const rate = (c, result) => {
      if (rated[c.cardId]) return;
      rated[c.cardId] = true;
      if (result === 'right') firstTry++;
      if (practiceOnly) return;
      if (!Progress.getCard(c.cardId)) Progress.countNewCard();
      Progress.rateCard(c.cardId, result);
    };

    const next = () => {
      if (!queue.length) return finish();
      const c = queue[0];
      progressEl.textContent = 'Noch ' + queue.length + ' Karte' + (queue.length === 1 ? '' : 'n') + ' in dieser Runde';
      card.innerHTML = '';
      if (c.mode === 'type') showType(c); else showReveal(c);
    };

    const nextBtn = (label) => {
      const b = this.el('button', 'exercise-check-btn vocab-next', label || (queue.length ? 'Weiter →' : 'Fertig'));
      b.addEventListener('click', next);
      card.appendChild(b);
      b.focus();
    };

    const showExtras = (c) => {
      if (c.item.example) card.appendChild(this.el('div', 'trainer-example', c.item.example));
      if (CARDS.speak) card.appendChild(this.speakBtn(c.item.back + (c.item.example ? '. ' + c.item.example : '')));
    };

    // Tippen
    const showType = (c) => {
      card.appendChild(this.el('div', 'vocab-prompt', c.item.front));
      if (c.item.hint) card.appendChild(this.el('div', 'vocab-hint', '💡 ' + c.item.hint));
      const input = this.el('input', 'vocab-input');
      input.type = 'text';
      input.placeholder = CARDS.typePlaceholder || 'Antwort tippen …';
      ['autocomplete', 'autocapitalize', 'autocorrect'].forEach(a => input.setAttribute(a, 'off'));
      input.setAttribute('spellcheck', 'false');
      card.appendChild(input);
      const fb = this.el('div', 'exercise-feedback');
      fb.style.display = 'none';
      card.appendChild(fb);
      const check = this.el('button', 'exercise-check-btn', 'Prüfen');
      card.appendChild(check);

      let almostOnce = false;
      let answered = false;
      const evaluate = () => {
        if (answered) return;
        if (input.value.trim() === '') { input.focus(); return; }
        const res = this.judge(input.value, c.item);
        if (res === 'almost' && !almostOnce) {
          almostOnce = true;
          fb.innerHTML = 'Fast richtig, schau auf die Schreibung. Noch ein Versuch!';
          fb.className = 'exercise-feedback neutral';
          fb.style.display = 'block';
          input.select();
          return;
        }
        answered = true;
        input.disabled = true;
        check.style.display = 'none';
        queue.shift();
        const alt = c.item.alt && c.item.alt.length ? ' (auch: ' + c.item.alt.join(', ') + ')' : '';
        if (res === 'right') {
          rate(c, almostOnce ? 'almost' : 'right');
          input.classList.add('correct');
          fb.innerHTML = '✓ Richtig: <strong>' + c.item.back + '</strong>' + alt;
          fb.className = 'exercise-feedback correct';
        } else {
          rate(c, 'wrong');
          queue.push(c); // in dieser Runde noch einmal
          input.classList.add('incorrect');
          fb.innerHTML = 'Richtig ist: <strong>' + c.item.back + '</strong>' + alt
            + '<br>Schreib es dir einmal ab. Die Karte kommt am Ende der Runde noch einmal.';
          fb.className = 'exercise-feedback incorrect';
        }
        fb.style.display = 'block';
        if (CARDS.speak) this.speak(c.item.back, CARDS.speak);
        showExtras(c);
        nextBtn();
      };
      check.addEventListener('click', evaluate);
      input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (answered) { const nb = card.querySelector('.vocab-next'); if (nb) nb.click(); }
        else evaluate();
      });
      input.focus();
    };

    // Aufdecken + selbst einschätzen (Definitionen, Gegenrichtung)
    const showReveal = (c) => {
      const front = c.reverse ? c.item.back : c.item.front;
      const back = c.reverse ? c.item.front : c.item.back;
      card.appendChild(this.el('div', 'vocab-prompt', front));
      if (c.reverse && CARDS.speak) card.appendChild(this.speakBtn(front));
      card.appendChild(this.el('p', 'trainer-small',
        c.reverse ? 'Was heißt das auf Deutsch? Sag es laut, dann aufdecken.'
                  : 'Erklär es in eigenen Worten, laut oder im Kopf. Dann aufdecken.'));
      const show = this.el('button', 'exercise-check-btn', 'Aufdecken');
      card.appendChild(show);
      show.addEventListener('click', () => {
        show.remove();
        card.appendChild(this.el('div', 'trainer-back', back));
        if (!c.reverse && c.item.example) card.appendChild(this.el('div', 'trainer-example', c.item.example));
        const row = this.el('div', 'self-check-btns');
        [['right', 'Gewusst', 'self-check-high'], ['wrong', 'Nicht gewusst', 'self-check-low']].forEach(([res, label, cls]) => {
          const b = this.el('button', 'self-check-btn ' + cls, '<span class="sc-label">' + label + '</span>');
          b.addEventListener('click', () => {
            queue.shift();
            rate(c, res);
            if (res === 'wrong') queue.push(c);
            next();
          });
          row.appendChild(b);
        });
        card.appendChild(row);
      });
    };

    const finish = () => {
      progressEl.textContent = '';
      card.innerHTML = '<div class="vocab-done">✓ Runde geschafft! <strong>' + firstTry + ' von ' + total
        + '</strong> Karten gleich beim ersten Mal gewusst.'
        + (practiceOnly ? ' (Extra-Runde, zählt nicht für den Plan.)' : ' Was falsch war, kommt morgen wieder.') + '</div>';
      const back = this.el('button', 'exercise-check-btn', 'Zur Übersicht');
      back.addEventListener('click', () => navigate('trainer'));
      card.appendChild(back);
      Renderer.renderSidebar();
    };

    next();
  }
};
