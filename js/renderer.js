/**
 * Renderer: Startseite "Das kommt dran", Seitenleiste, Fortschrittsbalken,
 * Lektion (Erklärung / Beispiel / Übung) und Selbsteinschätzung.
 * Lektionsdaten: window.LESSON_DATA (aus js/lessons-*.js).
 */
const Renderer = {
  current: 'start',

  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  },

  lessonTitle(id) {
    const l = LESSONS.find(x => x.id === id);
    return l ? l.title : 'Lektion ' + id;
  },

  // ---------- Ampel je Thema ----------
  // grau = noch nicht geübt, rot = kann ich noch nicht, gelb = geht so, grün = kann ich
  AMPEL: {
    none:   { cls: 'ampel-none',   label: 'noch nicht geübt' },
    low:    { cls: 'ampel-low',    label: 'kann ich noch nicht' },
    medium: { cls: 'ampel-medium', label: 'geht so' },
    partial: { cls: 'ampel-partial', label: 'erst teilweise geübt' },
    high:   { cls: 'ampel-high',   label: 'kann ich' }
  },
  topicLevel(topic) {
    if (topic.trainer) {
      const c = Trainer.boxCounts();
      const total = CARDS.items.length;
      if (c.neu === total) return 'none';
      const sure = c[3] + c[4];
      if (sure === total) return 'high';
      return (c[2] + sure) * 2 >= total ? 'medium' : 'low';
    }
    const confs = (topic.lessons || []).map(id => Progress.getConfidence(id));
    if (confs.every(c => !c)) return 'none';
    if (confs.some(c => c === 'low')) return 'low';
    if (confs.some(c => !c)) return 'partial'; // ein Teil noch nicht geübt
    return confs.every(c => c === 'high') ? 'high' : 'medium';
  },
  ampelHtml(level) {
    const a = this.AMPEL[level];
    return '<span class="ampel ' + a.cls + '"><span class="ampel-dot" aria-hidden="true"></span>' + a.label + '</span>';
  },

  // ---------- Startseite ----------
  renderStart() {
    const c = document.getElementById('lesson-container');
    c.innerHTML = '';
    c.appendChild(this.el('h1', '', KA.title));
    c.appendChild(this.el('p', 'start-small', 'Ohne Anmeldung: Dein Lernstand wird nur in diesem Browser auf diesem Gerät gespeichert. Nutze darum immer dasselbe Gerät.'));

    // KA-Datum + Countdown
    const n = Progress.daysUntilKa();
    if (n !== null) {
      const d = new Date(KA.date + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
      const left = n > 1 ? 'noch ' + n + ' Tage' : n === 1 ? 'morgen!' : n === 0 ? 'heute!' : 'schon vorbei';
      c.appendChild(this.el('p', 'start-date', '<strong>' + KA.title + '</strong><br>' + d + ' · <span class="start-left">' + left + '</span>'));
    }

    // Nachholen: Lektion fertig, aber keine Selbsteinschätzung
    Progress.getPendingSelfChecks().forEach(p => {
      const box = this.el('div', 'start-pending');
      box.appendChild(this.el('p', '', 'Du hast <strong>' + this.lessonTitle(p.id) + '</strong> fertig gemacht. Eine Frage fehlt noch:'));
      c.appendChild(box);
      this.renderSelfCheck(p.id, box, p.wrongCount, () => this.renderStart());
    });

    // Heute fällig
    const dueLessons = Progress.getDueLessons();
    const s = Trainer.buildSession();
    const cardsToday = s.due.length + s.fresh.length;
    const today = this.el('div', 'review-due-card');
    today.appendChild(this.el('div', 'review-due-head', '<span class="review-due-icon">↻</span> Heute dran'));
    const list = this.el('div', 'review-due-list');
    if (cardsToday > 0) {
      const parts = [];
      if (s.due.length) parts.push(s.due.length + ' wiederholen');
      if (s.fresh.length) parts.push(s.fresh.length + ' neue Karten');
      const b = this.el('button', 'review-due-btn', CARDS.title + ': ' + parts.join(', '));
      b.addEventListener('click', () => navigate('trainer'));
      list.appendChild(b);
    }
    dueLessons.forEach(id => {
      const b = this.el('button', 'review-due-btn', 'Wiederholen: ' + this.lessonTitle(id));
      b.addEventListener('click', () => navigate(id));
      list.appendChild(b);
    });
    // Nächste neue Lektion, solange keine Lektion zur Wiederholung ansteht
    const nextLesson = LESSONS.find(l => Progress.getStatus(l.id) !== 'completed');
    if (!dueLessons.length) {
      if (nextLesson) {
        const started = Progress.getStatus(nextLesson.id) === 'in_progress';
        const b = this.el('button', 'review-due-btn', (started ? 'Weiter mit: ' : 'Neu: ') + nextLesson.title);
        b.addEventListener('click', () => navigate(nextLesson.id));
        list.appendChild(b);
      } else if (!cardsToday) {
        list.appendChild(this.el('p', 'review-due-hint', 'Alles erledigt für heute. Lies zum Schluss den Spickzettel einmal durch.'));
      }
    }
    today.appendChild(list);
    c.appendChild(today);

    // Themenliste mit Ampel
    c.appendChild(this.el('h2', '', 'Themen'));
    const table = this.el('table', 'topic-table');
    table.innerHTML = '<thead><tr><th>Thema</th><th>Buch</th><th>So sicher bin ich</th><th></th></tr></thead>';
    const tb = this.el('tbody');
    KA.topics.forEach(t => {
      const tr = this.el('tr');
      tr.innerHTML = '<td>' + t.title + '</td><td>' + (t.page || '–') + '</td><td>' + this.ampelHtml(this.topicLevel(t)) + '</td>';
      const td = this.el('td');
      const b = this.el('button', 'topic-go', 'Üben');
      const target = t.trainer ? 'trainer' : (t.lessons && t.lessons.length ? t.lessons[0] : null);
      if (target === null) b.disabled = true;
      b.addEventListener('click', () => navigate(target));
      td.appendChild(b);
      tr.appendChild(td);
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    c.appendChild(table);
    c.appendChild(this.el('p', 'start-small', 'Die Ampel kommt aus deiner eigenen Einschätzung am Ende jeder Lektion und aus dem Trainer.'));
    if (this.mixedPool().lessons >= 2) {
      const mix = this.el('button', 'topic-go mixed-go', '🔀 Gemischt üben: alle Themen durcheinander');
      mix.addEventListener('click', () => navigate('mixed'));
      c.appendChild(mix);
    }

    // Papier-Set
    if (KA.links.length) {
      c.appendChild(this.el('h2', '', 'Zum Ausdrucken'));
      const ul = this.el('ul', 'pdf-links');
      KA.links.forEach(l => ul.appendChild(this.el('li', '', '<a href="' + l.href + '" target="_blank" rel="noopener">' + l.label + '</a>')));
      c.appendChild(ul);
    }
    if (!Progress.available()) {
      c.appendChild(this.el('p', 'start-small', '⚠ Dein Browser speichert gerade nichts (privates Fenster?). Dein Lernstand ist nach dem Schließen weg.'));
    }
  },

  // ---------- Selbsteinschätzung ----------
  // Knopftexte nennen den wirklich gesetzten Abstand.
  renderSelfCheck(lessonId, container, wrongCount, onDone) {
    const wrapper = this.el('div', 'self-check');
    wrapper.appendChild(this.el('div', 'self-check-head', 'Wie sicher fühlst du dich jetzt mit dieser Lektion?'));
    wrapper.appendChild(this.el('p', 'self-check-hint', 'Sei ehrlich. Deine Antwort bestimmt, wann die Lektion wiederkommt.'
      + (wrongCount >= 2 ? ' Du hattest ' + wrongCount + ' Fehler, darum rückt sie diesmal nicht weiter nach hinten.' : '')));
    const row = this.el('div', 'self-check-btns');
    [['low', 'Noch unsicher'], ['medium', 'Geht so'], ['high', 'Sitzt sicher']].forEach(([conf, label]) => {
      const sub = Progress.previewLesson(lessonId, conf, wrongCount);
      const b = this.el('button', 'self-check-btn self-check-' + conf,
        '<span class="sc-label">' + label + '</span><span class="sc-sub">kommt ' + sub + ' wieder</span>');
      b.addEventListener('click', () => {
        const l = Progress.recordCompletion(lessonId, conf, wrongCount);
        wrapper.innerHTML = '<div class="self-check-done">✓ Gespeichert. Die Lektion kommt '
          + Progress.dueText(l.dueDate) + ' wieder dran.</div>';
        this.renderSidebar();
        if (onDone) onDone();
      });
      row.appendChild(b);
    });
    wrapper.appendChild(row);
    container.appendChild(wrapper);
  },

  // ---------- Gemischt üben ----------
  // Zufällige Aufgaben aus allen GESCHAFFTEN Lektionen, jedes Mal neu gemischt.
  // Erst entscheiden "Welche Regel ist das?", dann lösen (Rohrer: Interleaving).
  MIXED_COUNT: 8,
  mixedPool() {
    const pool = [];
    let lessons = 0;
    (window.LESSON_DATA || []).forEach(l => {
      if (Progress.getStatus(l.id) !== 'completed') return;
      lessons++;
      (l.exercises || []).forEach(ex => {
        if (ex.type !== 'free-text') pool.push({ lessonId: l.id, ex: ex });
      });
    });
    return { items: pool, lessons: lessons };
  },
  renderMixed() {
    const c = document.getElementById('lesson-container');
    c.innerHTML = '';
    c.appendChild(this.el('h1', '', 'Gemischt üben'));
    const pool = this.mixedPool();
    if (pool.lessons < 2) {
      c.appendChild(this.el('p', '', 'Schaff zuerst mindestens zwei Lektionen. Gemischt üben lohnt sich erst, wenn die einzelnen Themen sitzen.'));
      return;
    }
    c.appendChild(this.el('p', 'exercises-intro', 'Die Aufgaben kommen aus allen Lektionen, die du geschafft hast, bunt durcheinander. '
      + 'Überleg bei jeder Aufgabe zuerst: <strong>Zu welchem Thema gehört das?</strong> Genau das musst du im Test auch.'));
    // zufällig ziehen (Fisher-Yates)
    const items = pool.items.slice();
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = items[i]; items[i] = items[j]; items[j] = t;
    }
    const round = items.slice(0, this.MIXED_COUNT);
    const sec = this.el('section', 'phase exercises active');
    c.appendChild(sec);
    const wrongBy = {};
    let done = 0;
    const seed = String(Date.now());
    round.forEach((it, i) => {
      const head = this.el('div', 'exercise-header', 'Aufgabe ' + (i + 1) + ' von ' + round.length);
      sec.appendChild(head);
      let finished = false;
      Exercises.render(Exercises.shuffleOptions(it.ex, 'M' + seed + i), sec, () => {
        if (finished) return;
        finished = true;
        done++;
        head.classList.add('completed');
        // Thema erst nach dem Lösen verraten
        head.textContent += ' · ' + this.lessonTitle(it.lessonId);
        if (done === round.length) this.renderMixedSummary(sec, wrongBy, round.length);
      }, () => { wrongBy[it.lessonId] = (wrongBy[it.lessonId] || 0) + 1; });
    });
  },
  renderMixedSummary(container, wrongBy, total) {
    const box = this.el('div', 'self-check');
    const ids = Object.keys(wrongBy).map(Number);
    if (!ids.length) {
      box.innerHTML = '<div class="self-check-done">✓ Alle ' + total + ' Aufgaben ohne Fehler. Stark!</div>';
    } else {
      box.appendChild(this.el('div', 'self-check-head', 'Geschafft! Hier hattest du Fehler, schau dir die Lektion noch einmal an:'));
      const row = this.el('div', 'review-due-list');
      ids.forEach(id => {
        const b = this.el('button', 'review-due-btn', this.lessonTitle(id) + ' (' + wrongBy[id] + ' Fehler)');
        b.addEventListener('click', () => navigate(id));
        row.appendChild(b);
      });
      box.appendChild(row);
    }
    const again = this.el('button', 'exercise-check-btn', 'Neue gemischte Runde');
    again.addEventListener('click', () => navigate('mixed'));
    box.appendChild(again);
    container.appendChild(box);
  },

  // ---------- Seitenleiste ----------
  renderSidebar() {
    const nav = document.getElementById('nav');
    nav.innerHTML = '';
    const top = this.el('ul', 'nav-top');
    [['start', 'Start'], ['trainer', CARDS.title], ['mixed', 'Gemischt üben']].forEach(([r, label]) => {
      const li = this.el('li', this.current === r ? 'active' : '', label);
      li.dataset.route = r;
      top.appendChild(li);
    });
    nav.appendChild(top);

    const due = Progress.getDueLessons();
    Object.keys(MODULES).forEach(m => {
      nav.appendChild(this.el('h3', '', MODULES[m]));
      const ul = this.el('ul');
      LESSONS.filter(l => l.module === m).forEach(l => {
        const st = Progress.getStatus(l.id);
        const li = this.el('li', (st === 'completed' ? 'completed' : st === 'in_progress' ? 'in-progress' : 'not-started')
          + (this.current === l.id ? ' active' : ''), (st === 'completed' ? '✓ ' : '') + l.title);
        li.dataset.route = String(l.id);
        if (due.indexOf(l.id) !== -1) {
          const badge = this.el('span', 'review-badge', '↻');
          badge.title = 'Heute zur Wiederholung dran';
          li.appendChild(badge);
        }
        ul.appendChild(li);
      });
      nav.appendChild(ul);
    });
  },

  renderProgressBar() {
    const p = Progress.getCompletionPercent();
    document.getElementById('progress-bar').style.width = p + '%';
    const done = LESSONS.filter(l => Progress.getStatus(l.id) === 'completed').length;
    document.getElementById('progress-label').textContent = p + ' % – ' + done + ' von ' + LESSONS.length + ' Lektionen geschafft';
  },

  // ---------- Lektion ----------
  renderLesson(id) {
    const container = document.getElementById('lesson-container');
    const data = (window.LESSON_DATA || []).find(l => l.id === id);
    const pos = LESSONS.findIndex(l => l.id === id) + 1;
    container.innerHTML = '';
    if (!data) {
      container.innerHTML = '<h1>' + this.lessonTitle(id) + '</h1><p>Inhalt fehlt noch.</p>';
      return;
    }
    container.appendChild(this.el('h1', '', 'Lektion ' + pos + ': ' + data.title));

    const phases = [];
    if (data.explanation) phases.push(['explanation', 'Erklärung']);
    if (data.example) phases.push(['example', 'Beispiel']);
    if (data.exercises && data.exercises.length) phases.push(['exercises', 'Übung']);

    const tabs = this.el('div', 'phase-tabs');
    phases.forEach(([key, label], i) => {
      const b = this.el('button', 'phase-tab' + (i === 0 ? ' active' : ''), label);
      b.dataset.phase = key;
      tabs.appendChild(b);
    });
    container.appendChild(tabs);

    if (data.explanation) {
      const sec = this.el('section', 'phase explanation', data.explanation.html);
      sec.id = 'phase-explanation';
      container.appendChild(sec);
    }
    if (data.example) {
      const sec = this.el('section', 'phase example');
      sec.id = 'phase-example';
      sec.appendChild(this.el('h2', '', data.example.title));
      data.example.steps.forEach((step, i) => {
        const det = this.el('details', 'example-step');
        if (i === 0) det.open = true;
        det.appendChild(this.el('summary', '', 'Schritt ' + (i + 1) + ': ' + step.label));
        det.appendChild(this.el('div', 'step-content', step.html));
        sec.appendChild(det);
      });
      container.appendChild(sec);
    }
    if (data.exercises && data.exercises.length) {
      const sec = this.el('section', 'phase exercises');
      sec.id = 'phase-exercises';
      container.appendChild(sec);
      if (data.exercisesIntro) sec.appendChild(this.el('div', 'exercises-intro', data.exercisesIntro));

      const total = data.exercises.length;
      let done = 0;
      let wrong = 0;
      data.exercises.forEach((ex, i) => {
        const head = this.el('div', 'exercise-header', 'Übung ' + (i + 1) + ' von ' + total);
        sec.appendChild(head);
        const shown = Exercises.shuffleOptions(ex, 'L' + id + 'E' + i);
        let finished = false;
        Exercises.render(shown, sec, () => {
          if (finished) return;
          finished = true;
          done++;
          head.classList.add('completed');
          if (done === total) {
            // Erst vormerken, dann fragen: Wer jetzt schließt, wird auf der Startseite gefragt.
            Progress.markNeedsSelfCheck(id, wrong);
            this.renderSidebar();
            this.renderProgressBar();
            this.renderSelfCheck(id, sec, wrong);
          }
        }, () => { wrong++; });
      });
    }
    const first = container.querySelector('.phase');
    if (first) first.classList.add('active');
    // Interaktive Grafiken (js/sims.js, falls im Paket vorhanden) starten
    if (typeof Sims !== 'undefined') Sims.initAll(container);

    tabs.addEventListener('click', e => {
      const t = e.target.closest('.phase-tab');
      if (!t) return;
      tabs.querySelectorAll('.phase-tab').forEach(x => x.classList.remove('active'));
      container.querySelectorAll('.phase').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('phase-' + t.dataset.phase).classList.add('active');
      window.scrollTo(0, 0);
    });
  }
};
