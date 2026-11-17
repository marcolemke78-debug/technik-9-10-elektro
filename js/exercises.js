/**
 * Übungs-Engine der KA-Vorlage (angepasst nach Lernpaket-Audit 11/2026).
 *
 * Typen:
 *   - multiple-choice  (eigene Erklärung je falscher Option: wrongExplanations)
 *   - matching         (Zuordnung; geprüft wird der TEXT, nicht die Position)
 *   - ordering         (Reihenfolge per Pfeil-Knöpfe)
 *   - fill-in-blank    (Lückentext mit {{blank}})
 *   - number           (Zahl tippen, mit Einheit; nach dem 2. Fehlversuch der Rechenweg)
 *   - listening        (Browser liest vor + Verständnisfrage)
 *   - free-text        (selbst schreiben, Musterlösung, selbst einschätzen)
 * Vokabeln/Begriffe laufen NICHT hier, sondern im Trainer (js/trainer.js), der je Karte speichert.
 *
 * Render-Signatur: render(exercise, container, onComplete, onWrong)
 *   onComplete() genau einmal, wenn die Übung geschafft ist
 *   onWrong()    bei jedem falschen Prüfen (zählt für den Wiederholungsplan mit)
 */
const Exercises = {
  /**
   * Zahl für die Anzeige: deutsches Komma, höchstens `digits` Nachkommastellen,
   * Tausender mit schmalem Leerzeichen. Nie toString() verwenden, sonst
   * erscheint "2,4000000000000004".
   *   Exercises.fmt(0.5) -> "0,5"   Exercises.fmt(12000) -> "12 000"
   *   fixed = true behält Endnullen: Exercises.fmt(3.5, 2, true) -> "3,50" (Euro)
   */
  fmt(x, digits, fixed) {
    const d = digits === undefined ? 3 : digits;
    const f = Math.pow(10, d);
    const r = Math.round((Number(x) + Number.EPSILON) * f) / f;
    let str = Math.abs(r).toFixed(d);
    if (!fixed && str.indexOf('.') !== -1) str = str.replace(/0+$/, '').replace(/\.$/, '');
    const parts = str.split('.');
    const int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
    return (r < 0 ? '\u2212' : '') + int + (parts[1] ? ',' + parts[1] : '');
  },

  // Eingabe vergleichbar machen: klein, getrimmt, Apostrophe gerade.
  _norm(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  },

  /**
   * Mischt die Antworten jeder Übung mit options + correct (auch listening),
   * deterministisch je Übung (Seed), damit die richtige Antwort nicht immer
   * am selben Platz steht. wrongExplanations wandern mit.
   */
  shuffleOptions(exercise, seedString) {
    if (!Array.isArray(exercise.options) || typeof exercise.correct !== 'number' || exercise.noShuffle) {
      return exercise;
    }
    // kleiner Zufallsgenerator mit Startwert (mulberry32)
    let h = 1779033703;
    for (let i = 0; i < seedString.length; i++) h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
    function rnd() {
      h = (h + 0x6D2B79F5) | 0;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    const perm = exercise.options.map((_, i) => i);
    for (let i = perm.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = perm[i]; perm[i] = perm[j]; perm[j] = t;
    }
    let wrong;
    if (exercise.wrongExplanations) {
      wrong = {};
      Object.keys(exercise.wrongExplanations).forEach(k => {
        wrong[perm.indexOf(parseInt(k, 10))] = exercise.wrongExplanations[k];
      });
    }
    return Object.assign({}, exercise, {
      options: perm.map(i => exercise.options[i]),
      correct: perm.indexOf(exercise.correct),
      wrongExplanations: wrong
    });
  },

  render(exercise, container, onComplete, onWrong) {
    const wrongFn = onWrong || function () {};
    switch (exercise.type) {
      case 'multiple-choice': return Exercises.renderMultipleChoice(exercise, container, onComplete, wrongFn);
      case 'matching':        return Exercises.renderMatching(exercise, container, onComplete, wrongFn);
      case 'ordering':        return Exercises.renderOrdering(exercise, container, onComplete, wrongFn);
      case 'fill-in-blank':   return Exercises.renderFillInBlank(exercise, container, onComplete, wrongFn);
      case 'number':          return Exercises.renderNumber(exercise, container, onComplete, wrongFn);
      case 'listening':       return Exercises.renderListening(exercise, container, onComplete, wrongFn);
      case 'free-text':       return Exercises.renderFreeText(exercise, container, onComplete);
      default: {
        const div = document.createElement('div');
        div.textContent = 'Übungstyp "' + exercise.type + '" gibt es nicht.';
        container.appendChild(div);
      }
    }
  },

  // ======================================================================
  // Multiple Choice
  // ======================================================================
  renderMultipleChoice(exercise, container, onComplete, onWrong) {
    onWrong = onWrong || function () {};
    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-mc';

    const questionEl = document.createElement('p');
    questionEl.className = 'exercise-question';
    questionEl.innerHTML = exercise.question;
    wrapper.appendChild(questionEl);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'mc-options';

    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'exercise-feedback';
    feedbackEl.style.display = 'none';

    exercise.options.forEach(function(optionText, index) {
      const button = document.createElement('button');
      button.className = 'mc-option';
      button.setAttribute('data-index', index);
      button.innerHTML = optionText;

      button.addEventListener('click', function() {
        if (index === exercise.correct) {
          button.classList.add('correct');
          feedbackEl.innerHTML = exercise.explanation || 'Richtig!';
          feedbackEl.className = 'exercise-feedback correct';
          feedbackEl.style.display = 'block';
          optionsContainer.querySelectorAll('.mc-option').forEach(function(btn) { btn.disabled = true; });
          onComplete();
        } else {
          button.classList.add('incorrect');
          button.disabled = true;
          onWrong();
          let feedbackText;
          if (exercise.wrongExplanations && exercise.wrongExplanations[index] !== undefined) {
            feedbackText = exercise.wrongExplanations[index];
          } else if (exercise.hint) {
            feedbackText = exercise.hint;
          } else {
            feedbackText = 'Leider falsch. Versuch es nochmal!';
          }
          feedbackEl.innerHTML = feedbackText;
          feedbackEl.className = 'exercise-feedback incorrect';
          feedbackEl.style.display = 'block';
        }
      });
      optionsContainer.appendChild(button);
    });

    wrapper.appendChild(optionsContainer);
    wrapper.appendChild(feedbackEl);
    container.appendChild(wrapper);
  },

  // ======================================================================
  // Matching (Zuordnung) — z.B. Englisch <-> Deutsch
  // ======================================================================
  renderMatching(exercise, container, onComplete, onWrong) {
    var pairColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    var wrapper = document.createElement('div');
    wrapper.className = 'exercise-matching';

    var questionEl = document.createElement('p');
    questionEl.className = 'exercise-question';
    questionEl.innerHTML = exercise.question;
    wrapper.appendChild(questionEl);

    var matchingArea = document.createElement('div');
    matchingArea.className = 'matching-area';

    var leftCol = document.createElement('div');
    leftCol.className = 'matching-left';
    var rightCol = document.createElement('div');
    rightCol.className = 'matching-right';

    var rightIndices = [];
    for (var i = 0; i < exercise.pairs.length; i++) rightIndices.push(i);
    for (var j = rightIndices.length - 1; j > 0; j--) {
      var rand = Math.floor(Math.random() * (j + 1));
      var temp = rightIndices[j];
      rightIndices[j] = rightIndices[rand];
      rightIndices[rand] = temp;
    }

    var selectedLeft = null;
    var connections = {};
    var reverseConnections = {};
    var nextColorIndex = 0;
    var connectionColors = {};
    var leftItems = [];
    var rightItems = {};

    exercise.pairs.forEach(function(pair, idx) {
      var item = document.createElement('div');
      item.className = 'match-item match-left';
      item.setAttribute('data-index', idx);
      item.innerHTML = pair.left;

      item.addEventListener('click', function() {
        if (connections[idx] !== undefined) {
          var connectedRight = connections[idx];
          item.classList.remove('matched');
          item.style.backgroundColor = ''; item.style.borderColor = ''; item.style.color = '';
          var rightEl = rightItems[connectedRight];
          rightEl.classList.remove('matched');
          rightEl.style.backgroundColor = ''; rightEl.style.borderColor = ''; rightEl.style.color = '';
          delete reverseConnections[connectedRight];
          delete connectionColors[idx];
          delete connections[idx];
          if (selectedLeft !== null) leftItems[selectedLeft].classList.remove('selected');
          selectedLeft = null;
          return;
        }
        if (selectedLeft !== null) leftItems[selectedLeft].classList.remove('selected');
        selectedLeft = idx;
        item.classList.add('selected');
      });

      leftItems.push(item);
      leftCol.appendChild(item);
    });

    rightIndices.forEach(function(originalIdx) {
      var pair = exercise.pairs[originalIdx];
      var item = document.createElement('div');
      item.className = 'match-item match-right';
      item.setAttribute('data-index', originalIdx);
      item.innerHTML = pair.right;

      item.addEventListener('click', function() {
        if (reverseConnections[originalIdx] !== undefined) {
          var connectedLeft = reverseConnections[originalIdx];
          item.classList.remove('matched');
          item.style.backgroundColor = ''; item.style.borderColor = ''; item.style.color = '';
          var leftEl = leftItems[connectedLeft];
          leftEl.classList.remove('matched');
          leftEl.style.backgroundColor = ''; leftEl.style.borderColor = ''; leftEl.style.color = '';
          delete connections[connectedLeft];
          delete connectionColors[connectedLeft];
          delete reverseConnections[originalIdx];
          if (selectedLeft !== null) { leftItems[selectedLeft].classList.remove('selected'); selectedLeft = null; }
          return;
        }
        if (selectedLeft === null) return;
        var leftIdx = selectedLeft;
        var color = pairColors[nextColorIndex % pairColors.length];
        nextColorIndex++;
        connections[leftIdx] = originalIdx;
        reverseConnections[originalIdx] = leftIdx;
        connectionColors[leftIdx] = color;
        leftItems[leftIdx].classList.remove('selected');
        leftItems[leftIdx].classList.add('matched');
        leftItems[leftIdx].style.backgroundColor = color;
        leftItems[leftIdx].style.borderColor = color;
        leftItems[leftIdx].style.color = 'white';
        item.classList.add('matched');
        item.style.backgroundColor = color;
        item.style.borderColor = color;
        item.style.color = 'white';
        selectedLeft = null;
      });

      rightItems[originalIdx] = item;
      rightCol.appendChild(item);
    });

    matchingArea.appendChild(leftCol);
    matchingArea.appendChild(rightCol);
    wrapper.appendChild(matchingArea);

    var feedbackEl = document.createElement('div');
    feedbackEl.className = 'exercise-feedback';
    feedbackEl.style.display = 'none';

    var checkBtn = document.createElement('button');
    checkBtn.className = 'exercise-check-btn';
    checkBtn.textContent = 'Prüfen';

    checkBtn.addEventListener('click', function() {
      var totalPairs = exercise.pairs.length;
      var connectedCount = Object.keys(connections).length;
      if (connectedCount < totalPairs) {
        feedbackEl.textContent = 'Bitte ordne zuerst alle Begriffe zu.';
        feedbackEl.className = 'exercise-feedback incorrect';
        feedbackEl.style.display = 'block';
        return;
      }
      // Text vergleichen, nicht die Position: Gibt es zwei gleichlautende
      // Karten ("parallel" 2x), ist jede davon richtig.
      var allCorrect = true;
      for (var k = 0; k < totalPairs; k++) {
        if (Exercises._norm(exercise.pairs[connections[k]].right) !== Exercises._norm(exercise.pairs[k].right)) { allCorrect = false; break; }
      }
      if (allCorrect) {
        feedbackEl.innerHTML = 'Alle Zuordnungen sind korrekt – super!' + (exercise.explanation ? '<br><br>' + exercise.explanation : '');
        feedbackEl.className = 'exercise-feedback correct';
        feedbackEl.style.display = 'block';
        checkBtn.disabled = true;
        onComplete();
      } else {
        onWrong();
        feedbackEl.textContent = 'Nicht alle Zuordnungen stimmen. Tipp auf ein Paar, um es zu lösen, und versuch es nochmal.';
        feedbackEl.className = 'exercise-feedback incorrect';
        feedbackEl.style.display = 'block';
      }
    });

    wrapper.appendChild(checkBtn);
    wrapper.appendChild(feedbackEl);
    container.appendChild(wrapper);
  },

  // ======================================================================
  // Ordering (Reihenfolge) — z.B. Satzbau / Wortstellung
  // ======================================================================
  renderOrdering(exercise, container, onComplete, onWrong) {
    if (!Array.isArray(exercise.items) || !Array.isArray(exercise.correctOrder)
        || exercise.items.length !== exercise.correctOrder.length
        || exercise.items.length === 0) {
      const errDiv = document.createElement('div');
      errDiv.className = 'exercise-feedback incorrect';
      errDiv.textContent = 'Diese Übung ist fehlerhaft konfiguriert.';
      container.appendChild(errDiv);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-ordering';

    const questionEl = document.createElement('p');
    questionEl.className = 'exercise-question';
    questionEl.innerHTML = exercise.question;
    wrapper.appendChild(questionEl);

    const items = exercise.items.map((text, idx) => ({ text: text, originalIndex: idx }));
    for (let i = items.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      const tmp = items[i]; items[i] = items[rand]; items[rand] = tmp;
    }
    let alreadyCorrect = true;
    for (let i = 0; i < items.length; i++) {
      if (items[i].originalIndex !== exercise.correctOrder[i]) { alreadyCorrect = false; break; }
    }
    if (alreadyCorrect && items.length >= 2) {
      const tmp = items[0]; items[0] = items[1]; items[1] = tmp;
    }

    const list = document.createElement('ol');
    list.className = 'ordering-list';
    wrapper.appendChild(list);

    function renderList() {
      list.innerHTML = '';
      items.forEach(function(item, idx) {
        const li = document.createElement('li');
        li.className = 'ordering-item';
        const textSpan = document.createElement('span');
        textSpan.className = 'ordering-text';
        textSpan.innerHTML = item.text;
        li.appendChild(textSpan);
        const btnGroup = document.createElement('div');
        btnGroup.className = 'ordering-buttons';
        const upBtn = document.createElement('button');
        upBtn.className = 'ordering-btn ordering-up';
        upBtn.textContent = '↑';
        upBtn.disabled = (idx === 0);
        upBtn.setAttribute('aria-label', 'Nach oben verschieben');
        upBtn.addEventListener('click', function() {
          const tmp = items[idx]; items[idx] = items[idx - 1]; items[idx - 1] = tmp; renderList();
        });
        const downBtn = document.createElement('button');
        downBtn.className = 'ordering-btn ordering-down';
        downBtn.textContent = '↓';
        downBtn.disabled = (idx === items.length - 1);
        downBtn.setAttribute('aria-label', 'Nach unten verschieben');
        downBtn.addEventListener('click', function() {
          const tmp = items[idx]; items[idx] = items[idx + 1]; items[idx + 1] = tmp; renderList();
        });
        btnGroup.appendChild(upBtn);
        btnGroup.appendChild(downBtn);
        li.appendChild(btnGroup);
        list.appendChild(li);
      });
    }
    renderList();

    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'exercise-feedback';
    feedbackEl.style.display = 'none';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'exercise-check-btn';
    checkBtn.textContent = 'Prüfen';

    let completed = false;
    checkBtn.addEventListener('click', function() {
      if (completed) return;
      let correctCount = 0;
      items.forEach(function(item, idx) {
        if (item.originalIndex === exercise.correctOrder[idx]) correctCount++;
      });
      if (correctCount === items.length) {
        completed = true;
        feedbackEl.innerHTML = 'Reihenfolge korrekt – super!' + (exercise.explanation ? '<br><br>' + exercise.explanation : '');
        feedbackEl.className = 'exercise-feedback correct';
        feedbackEl.style.display = 'block';
        checkBtn.disabled = true;
        list.querySelectorAll('button').forEach(function(b) { b.disabled = true; });
        onComplete();
      } else {
        onWrong();
        feedbackEl.textContent = correctCount + ' von ' + items.length + ' an der richtigen Position. Verschiebe die Teile mit den Pfeilen.';
        feedbackEl.className = 'exercise-feedback incorrect';
        feedbackEl.style.display = 'block';
      }
    });

    wrapper.appendChild(checkBtn);
    wrapper.appendChild(feedbackEl);
    container.appendChild(wrapper);
  },

  // ======================================================================
  // Fill-in-blank (Lückentext)
  // text enthält {{blank}}-Marker; blanks[] liefert die Lösungen.
  // exercise: { type, question, text, blanks:[{correct, alternatives?}], explanation, prompts? }
  // prompts (optional): Array gleicher Länge wie blanks, als Platzhalter im Input.
  // ======================================================================
  renderFillInBlank(exercise, container, onComplete, onWrong) {
    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-fill';

    if (exercise.question) {
      const questionEl = document.createElement('p');
      questionEl.className = 'exercise-question';
      questionEl.innerHTML = exercise.question;
      wrapper.appendChild(questionEl);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'fill-text';

    const parts = String(exercise.text).split('{{blank}}');
    const inputs = [];
    parts.forEach(function(part, idx) {
      const span = document.createElement('span');
      span.innerHTML = part;
      textWrap.appendChild(span);
      if (idx < parts.length - 1) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'fill-input';
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('autocapitalize', 'off');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('spellcheck', 'false');
        if (exercise.prompts && exercise.prompts[idx]) {
          input.placeholder = exercise.prompts[idx];
        }
        textWrap.appendChild(input);
        inputs.push(input);
      }
    });
    wrapper.appendChild(textWrap);

    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'exercise-feedback';
    feedbackEl.style.display = 'none';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'exercise-check-btn';
    checkBtn.textContent = 'Prüfen';

    let completed = false;

    function checkOne(input, blank) {
      const typed = Exercises._norm(input.value);
      const candidates = [Exercises._norm(blank.correct)].concat(
        (blank.alternatives || []).map(Exercises._norm)
      );
      return candidates.indexOf(typed) !== -1;
    }

    checkBtn.addEventListener('click', function() {
      if (completed) return;
      let allCorrect = true;
      let anyEmpty = false;
      inputs.forEach(function(input, i) {
        if (Exercises._norm(input.value) === '') anyEmpty = true;
        const ok = checkOne(input, exercise.blanks[i]);
        input.classList.remove('correct', 'incorrect');
        input.classList.add(ok ? 'correct' : 'incorrect');
        if (!ok) allCorrect = false;
      });

      if (allCorrect) {
        completed = true;
        feedbackEl.innerHTML = 'Alles richtig – super!' + (exercise.explanation ? '<br><br>' + exercise.explanation : '');
        feedbackEl.className = 'exercise-feedback correct';
        feedbackEl.style.display = 'block';
        checkBtn.disabled = true;
        inputs.forEach(function(input) { input.disabled = true; });
        onComplete();
      } else {
        if (!anyEmpty) onWrong();
        let msg = anyEmpty
          ? 'Fülle bitte alle Lücken aus. Rote Felder stimmen noch nicht.'
          : 'Rote Felder stimmen noch nicht. Schau dir die Regel nochmal an und probier es erneut.';
        feedbackEl.innerHTML = msg;
        feedbackEl.className = 'exercise-feedback incorrect';
        feedbackEl.style.display = 'block';
      }
    });

    // "Lösung zeigen" — nur als Hilfe, schaltet die Übung NICHT frei (kein onComplete).
    const solveBtn = document.createElement('button');
    solveBtn.className = 'exercise-solve-btn';
    solveBtn.textContent = 'Lösung zeigen';
    solveBtn.addEventListener('click', function() {
      // Lösung nur ANZEIGEN, nicht ins Feld schreiben: selbst eintippen ist die Übung.
      // Nachschauen zählt wie ein Fehler (Wiederholungsplan).
      onWrong();
      const sol = exercise.blanks.map(function(b, i) { return (inputs.length > 1 ? (i + 1) + ': ' : '') + '<strong>' + b.correct + '</strong>'; }).join(' · ');
      inputs.forEach(function(input, i) {
        if (!checkOne(input, exercise.blanks[i])) { input.value = ''; input.classList.remove('incorrect'); }
      });
      feedbackEl.innerHTML = 'Lösung: ' + sol + '<br>Tipp sie jetzt selbst ein und drück auf Prüfen.' + (exercise.explanation ? '<br><br>' + exercise.explanation : '');
      feedbackEl.className = 'exercise-feedback neutral';
      feedbackEl.style.display = 'block';
    });

    // Enter im letzten Feld löst "Prüfen" aus
    inputs.forEach(function(input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); checkBtn.click(); }
      });
    });

    const btnRow = document.createElement('div');
    btnRow.className = 'fill-btn-row';
    btnRow.appendChild(checkBtn);
    btnRow.appendChild(solveBtn);
    wrapper.appendChild(btnRow);
    wrapper.appendChild(feedbackEl);
    container.appendChild(wrapper);
  },

  // ======================================================================
  // Number — Zahl tippen (Komma oder Punkt), Einheit steht daneben.
  // exercise: { type:'number', question, answer, unit?, tolerance?, digits?, hint?, solution }
  //   tolerance: erlaubte Abweichung (Standard: 0,5 % vom Ergebnis, mind. 0,001)
  //   solution:  Rechenweg als HTML, erscheint nach dem 2. Fehlversuch
  // ======================================================================
  renderNumber(exercise, container, onComplete, onWrong) {
    onWrong = onWrong || function () {};
    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-number';

    const q = document.createElement('p');
    q.className = 'exercise-question';
    q.innerHTML = exercise.question;
    wrapper.appendChild(q);

    const row = document.createElement('div');
    row.className = 'number-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'decimal';
    input.className = 'fill-input number-input';
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-label', 'Ergebnis');
    row.appendChild(input);
    if (exercise.unit) {
      const u = document.createElement('span');
      u.className = 'number-unit';
      u.textContent = exercise.unit;
      row.appendChild(u);
    }
    wrapper.appendChild(row);

    const checkBtn = document.createElement('button');
    checkBtn.className = 'exercise-check-btn';
    checkBtn.textContent = 'Prüfen';
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'exercise-feedback';
    feedbackEl.style.display = 'none';

    const tol = exercise.tolerance !== undefined
      ? exercise.tolerance
      : Math.max(Math.abs(exercise.answer) * 0.005, 0.001);
    const shown = Exercises.fmt(exercise.answer, exercise.digits) + (exercise.unit ? '\u00A0' + exercise.unit : '');
    let tries = 0;
    let done = false;

    function check() {
      if (done) return;
      // "1.800" = 1800 (Punkt als Tausendertrenner), "1,8" = 1.8
      // Einheit hinten weglassen ("20 N", "3,5cm", "12 kg"), dann Leerzeichen raus
      let raw = input.value.trim().replace(/\s*[a-zA-ZäöüÄÖÜµΩΩ]+\.?$/, '').replace(/[\s\u202F]/g, '');
      if (/^-?\d{1,3}(\.\d{3})+$/.test(raw)) raw = raw.replace(/\./g, '');
      raw = raw.replace(',', '.');
      if (raw === '') { input.focus(); return; }
      const val = Number(raw);
      // Keine Zahl erkannt: nur Hinweis, zählt NICHT als Fehlversuch
      if (isNaN(val)) {
        feedbackEl.innerHTML = 'Bitte nur eine Zahl eintippen' + (exercise.unit ? ', die Einheit ' + exercise.unit + ' steht schon daneben.' : '.');
        feedbackEl.className = 'exercise-feedback neutral';
        feedbackEl.style.display = 'block';
        return;
      }
      input.classList.remove('correct', 'incorrect');
      if (!isNaN(val) && Math.abs(val - exercise.answer) <= tol) {
        done = true;
        input.classList.add('correct');
        input.disabled = true;
        checkBtn.disabled = true;
        feedbackEl.innerHTML = 'Richtig: <strong>' + shown + '</strong>'
          + (exercise.solution ? '<div class="number-solution">' + exercise.solution + '</div>' : '');
        feedbackEl.className = 'exercise-feedback correct';
        onComplete();
      } else {
        tries++;
        onWrong();
        input.classList.add('incorrect');
        if (tries >= 2 && exercise.solution) {
          feedbackEl.innerHTML = 'So wird gerechnet:<div class="number-solution">' + exercise.solution + '</div>'
            + 'Tipp das Ergebnis jetzt selbst ein.';
        } else {
          feedbackEl.innerHTML = isNaN(val)
            ? 'Bitte nur eine Zahl eintippen, die Einheit steht schon daneben.'
            : 'Noch nicht. ' + (exercise.hint || 'Prüf die Einheit und rechne nochmal.');
        }
        feedbackEl.className = 'exercise-feedback incorrect';
      }
      feedbackEl.style.display = 'block';
    }
    checkBtn.addEventListener('click', check);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
    });

    wrapper.appendChild(checkBtn);
    wrapper.appendChild(feedbackEl);
    container.appendChild(wrapper);
  },

  // ======================================================================
  // Listening — Browser liest englischen Text vor + Verständnisfrage (MC)
  // exercise: { type, instruction?, audioText, lang?, rate?, question, options, correct, explanation, wrongExplanations? }
  // ======================================================================
  renderListening(exercise, container, onComplete, onWrong) {
    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-listening';

    const instr = document.createElement('p');
    instr.className = 'exercise-question';
    instr.innerHTML = exercise.instruction
      || 'Hör gut zu (du kannst mehrmals abspielen) und beantworte dann die Frage.';
    wrapper.appendChild(instr);

    const controls = document.createElement('div');
    controls.className = 'listening-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'listening-play-btn';
    playBtn.innerHTML = '▶ Abspielen';

    const slowBtn = document.createElement('button');
    slowBtn.className = 'listening-slow-btn';
    slowBtn.innerHTML = '🐢 Langsam';

    function speak(rate) {
      if (!('speechSynthesis' in window)) {
        warn.style.display = 'block';
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(exercise.audioText);
      u.lang = exercise.lang || 'en-GB';
      u.rate = rate;
      window.speechSynthesis.speak(u);
    }

    playBtn.addEventListener('click', function() { speak(exercise.rate || 0.9); });
    slowBtn.addEventListener('click', function() { speak(0.6); });

    controls.appendChild(playBtn);
    controls.appendChild(slowBtn);
    wrapper.appendChild(controls);

    const warn = document.createElement('div');
    warn.className = 'exercise-feedback incorrect';
    warn.style.display = 'none';
    warn.innerHTML = 'Dein Browser kann keine Sprache vorlesen. Tipp: Nutze Safari oder Chrome. '
      + 'Du kannst den Text unten trotzdem aufdecken.';
    wrapper.appendChild(warn);

    container.appendChild(wrapper);

    // Verständnisfrage als eingebettete Multiple-Choice
    const questionWrap = document.createElement('div');
    questionWrap.className = 'listening-question';
    wrapper.appendChild(questionWrap);
    Exercises.renderMultipleChoice({
      type: 'multiple-choice',
      question: exercise.question,
      options: exercise.options,
      correct: exercise.correct,
      explanation: exercise.explanation,
      wrongExplanations: exercise.wrongExplanations,
      hint: exercise.hint
    }, questionWrap, onComplete, onWrong);

    // Text zum Nachlesen (erst auf Klick) — als Lernhilfe
    const reveal = document.createElement('details');
    reveal.className = 'listening-transcript';
    const sum = document.createElement('summary');
    sum.textContent = 'Text anzeigen (zum Nachlesen)';
    reveal.appendChild(sum);
    const tx = document.createElement('p');
    tx.className = 'listening-transcript-text';
    tx.textContent = exercise.audioText;
    reveal.appendChild(tx);
    wrapper.appendChild(reveal);
  },

  // ======================================================================
  // Free-text — Schreibaufgabe mit Musterlösung + Selbsteinschätzung
  // Freies Englisch lässt sich nicht zuverlässig automatisch bewerten;
  // darum: schreiben -> Musterlösung aufdecken -> selbst einschätzen.
  // exercise: { type, question, hint?, modelAnswer, minWords?, placeholder?, compareHint? }
  // ======================================================================
  renderFreeText(exercise, container, onComplete) {
    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-freetext';

    const questionEl = document.createElement('p');
    questionEl.className = 'exercise-question';
    questionEl.innerHTML = exercise.question;
    wrapper.appendChild(questionEl);

    if (exercise.hint) {
      const hint = document.createElement('div');
      hint.className = 'tip-box';
      hint.innerHTML = '<strong>Tipp:</strong> ' + exercise.hint;
      wrapper.appendChild(hint);
    }

    const textarea = document.createElement('textarea');
    textarea.className = 'freetext-area';
    textarea.rows = 5;
    textarea.placeholder = exercise.placeholder || 'Schreib hier deine Antwort …';
    wrapper.appendChild(textarea);

    const counter = document.createElement('div');
    counter.className = 'freetext-counter';
    counter.textContent = '0 Wörter';
    wrapper.appendChild(counter);
    textarea.addEventListener('input', function() {
      const words = textarea.value.trim() === '' ? 0 : textarea.value.trim().split(/\s+/).length;
      counter.textContent = words + (words === 1 ? ' Wort' : ' Wörter');
    });

    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'exercise-feedback';
    feedbackEl.style.display = 'none';

    const showBtn = document.createElement('button');
    showBtn.className = 'exercise-check-btn';
    showBtn.textContent = 'Musterlösung anzeigen';

    const modelBox = document.createElement('div');
    modelBox.className = 'freetext-model';
    modelBox.style.display = 'none';

    const selfCheckBox = document.createElement('div');
    selfCheckBox.className = 'freetext-selfcheck';
    selfCheckBox.style.display = 'none';

    showBtn.addEventListener('click', function() {
      const words = textarea.value.trim() === '' ? 0 : textarea.value.trim().split(/\s+/).length;
      const minWords = exercise.minWords || 0;
      if (words < minWords) {
        feedbackEl.innerHTML = 'Versuch erst, selbst mindestens ' + minWords + ' Wörter zu schreiben. '
          + 'Erst denken, dann vergleichen — so lernst du am meisten!';
        feedbackEl.className = 'exercise-feedback incorrect';
        feedbackEl.style.display = 'block';
        return;
      }
      feedbackEl.style.display = 'none';
      modelBox.innerHTML = '<div class="freetext-model-head">Eine mögliche Musterlösung:</div>'
        + '<div class="freetext-model-text">' + exercise.modelAnswer + '</div>'
        + '<div class="freetext-model-hint">' + (exercise.compareHint
          || 'Deine Lösung darf anders klingen! Vergleiche: Hast du das Wichtigste drin? Stimmen die Fachbegriffe?') + '</div>';
      modelBox.style.display = 'block';
      selfCheckBox.style.display = 'block';
      showBtn.disabled = true;
    });

    // Selbsteinschätzung -> schließt die Übung ab (subjektiv, kein Richtig/Falsch)
    const scHead = document.createElement('div');
    scHead.className = 'freetext-sc-head';
    scHead.textContent = 'Vergleiche ehrlich: Wie gut war deine Antwort?';
    selfCheckBox.appendChild(scHead);

    const scBtns = document.createElement('div');
    scBtns.className = 'freetext-sc-btns';
    [
      { label: 'Passt gut 👍', cls: 'sc-good' },
      { label: 'Teilweise 🤔', cls: 'sc-mid' },
      { label: 'Nochmal üben 🔁', cls: 'sc-low' }
    ].forEach(function(opt) {
      const b = document.createElement('button');
      b.className = 'freetext-sc-btn ' + opt.cls;
      b.textContent = opt.label;
      b.addEventListener('click', function() {
        selfCheckBox.innerHTML = '<div class="self-check-done">✓ Gut gemacht, dass du es selbst geschrieben '
          + 'und verglichen hast. Genau so übt man richtig.</div>';
        onComplete();
      });
      scBtns.appendChild(b);
    });
    selfCheckBox.appendChild(scBtns);

    wrapper.appendChild(showBtn);
    wrapper.appendChild(feedbackEl);
    wrapper.appendChild(modelBox);
    wrapper.appendChild(selfCheckBox);
    container.appendChild(wrapper);
  }
};

window.Exercises = Exercises;
