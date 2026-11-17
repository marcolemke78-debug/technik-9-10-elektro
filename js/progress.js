/**
 * Fortschritt + Wiederholungsplan (Leitner) – gespeichert im localStorage.
 *
 * Zwei Arten von Einträgen:
 *   lessons[id] = { status, box, dueDate, confidence }   – ganze Lektion
 *   cards[id]   = { box, dueDate, lastReviewed }          – einzelne Vokabel/Begriff
 *
 * Abstände 1/2/4/7 Tage. Kein Termin liegt nach dem Tag vor der KA
 * (KA.date in app.js), damit alles vor der Arbeit noch einmal drankommt.
 */
const Progress = {
  VERSION: 1,
  INTERVALS: [1, 2, 4, 7], // Tage bis zur nächsten Wiederholung je Fach 1..4
  NEW_CARDS_PER_DAY: 10,

  key() { return 'ka_' + KA.id + '_progress'; },

  // ---------- Speichern / Laden (robust: privates Fenster, kaputtes JSON) ----------
  _mem: null, // Ersatzspeicher, falls localStorage gesperrt ist
  available() {
    try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); return true; }
    catch (e) { return false; }
  },
  createDefault() {
    return { version: this.VERSION, lessons: {}, cards: {}, newToday: { date: '', count: 0 }, lastLesson: null };
  },
  load() {
    try {
      const raw = localStorage.getItem(this.key());
      const data = raw ? JSON.parse(raw) : null;
      // fehlende Felder auffüllen, damit ein beschädigter Stand die App nicht lahmlegt
      if (data && data.version === this.VERSION) return Object.assign(this.createDefault(), data);
    } catch (e) {
      if (this._mem) return this._mem;
    }
    return this._mem || this.createDefault();
  },
  save(data) {
    this._mem = data;
    try { localStorage.setItem(this.key(), JSON.stringify(data)); } catch (e) { /* nur im Speicher */ }
  },
  reset() {
    this._mem = null;
    try { localStorage.removeItem(this.key()); } catch (e) { /* egal */ }
  },

  // ---------- Datum (immer YYYY-MM-DD, ohne Uhrzeit) ----------
  _fmt(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  },
  today() { return this._fmt(new Date()); },
  addDays(dateStr, n) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + n);
    return this._fmt(d);
  },
  daysBetween(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  },
  daysUntilKa() {
    return KA.date ? this.daysBetween(this.today(), KA.date) : null;
  },

  // Fälligkeitsdatum für ein Fach. Spätestens am Tag vor der KA, frühestens morgen
  // (am Vortag der KA selbst ist "morgen" der KA-Tag, das lässt sich nicht vermeiden).
  dueFor(box) {
    const today = this.today();
    let due = this.addDays(today, this.INTERVALS[box - 1]);
    if (KA.date) {
      const lastDay = this.addDays(KA.date, -1);
      if (due > lastDay) due = lastDay;
    }
    const tomorrow = this.addDays(today, 1);
    return due < tomorrow ? tomorrow : due;
  },
  // Text für einen Termin: "morgen", "in 3 Tagen"
  dueText(dueDate) {
    const n = this.daysBetween(this.today(), dueDate);
    return n <= 1 ? 'morgen' : 'in ' + n + ' Tagen';
  },

  // ---------- Lektionen ----------
  _lesson(data, id) {
    if (!data.lessons[id]) data.lessons[id] = { status: 'not_started' };
    return data.lessons[id];
  },
  getStatus(id) {
    const l = this.load().lessons[id];
    return l ? l.status : 'not_started';
  },
  setStatus(id, status) {
    const data = this.load();
    this._lesson(data, id).status = status;
    this.save(data);
  },
  getLastLesson() { return this.load().lastLesson; },
  setLastLesson(id) {
    const data = this.load();
    data.lastLesson = id;
    this.save(data);
  },

  // Neues Fach aus der Selbsteinschätzung.
  //   low  = noch unsicher -> Fach 1
  //   medium = geht so    -> bleibt (beim ersten Mal Fach 1)
  //   high = sitzt sicher -> ein Fach weiter (beim ersten Mal Fach 2)
  // Fehler zählen mit: Wer 2 oder mehr Fehler hatte, rückt nicht weiter vor (high -> medium).
  effectiveConfidence(confidence, wrongCount) {
    return (confidence === 'high' && wrongCount >= 2) ? 'medium' : confidence;
  },
  nextBox(currentBox, confidence) {
    const first = !currentBox;
    let box;
    if (confidence === 'low') box = 1;
    else if (confidence === 'high') box = first ? 2 : currentBox + 1;
    else box = first ? 1 : currentBox;
    return Math.max(1, Math.min(box, this.INTERVALS.length));
  },
  // Vorschau für die Knopf-Beschriftung: Wann käme die Lektion wieder?
  previewLesson(id, confidence, wrongCount) {
    const l = this.load().lessons[id] || {};
    const box = this.nextBox(l.box, this.effectiveConfidence(confidence, wrongCount));
    return this.dueText(this.dueFor(box));
  },
  recordCompletion(id, confidence, wrongCount) {
    const data = this.load();
    const l = this._lesson(data, id);
    const conf = this.effectiveConfidence(confidence, wrongCount || 0);
    l.box = this.nextBox(l.box, conf);
    l.dueDate = this.dueFor(l.box);
    l.confidence = conf;
    l.needsSelfCheck = false;
    this.save(data);
    return l;
  },
  // Lektion fertig, aber Selbsteinschätzung fehlt noch -> Startseite fragt nach.
  markNeedsSelfCheck(id, wrongCount) {
    const data = this.load();
    const l = this._lesson(data, id);
    l.status = 'completed';
    l.needsSelfCheck = true;
    l.wrongCount = wrongCount || 0;
    this.save(data);
  },
  getPendingSelfChecks() {
    const data = this.load();
    return Object.keys(data.lessons)
      .filter(id => data.lessons[id].needsSelfCheck)
      .map(id => ({ id: parseInt(id, 10), wrongCount: data.lessons[id].wrongCount || 0 }));
  },
  getDueLessons() {
    const data = this.load();
    const today = this.today();
    return Object.keys(data.lessons)
      .filter(id => data.lessons[id].box && data.lessons[id].dueDate <= today)
      .map(id => parseInt(id, 10));
  },
  getConfidence(id) {
    const l = this.load().lessons[id];
    return l && l.confidence ? l.confidence : null;
  },

  // ---------- Karten (Vokabeln / Begriffe) ----------
  getCard(cardId) { return this.load().cards[cardId] || null; },
  // Richtig: ein Fach weiter. Fast richtig: Fach bleibt. Falsch: Fach 1.
  rateCard(cardId, result) {
    const data = this.load();
    const c = data.cards[cardId] || { box: 0 };
    if (result === 'wrong') c.box = 1;
    else if (result === 'right') c.box = Math.min((c.box || 0) + 1, this.INTERVALS.length);
    else c.box = Math.max(c.box || 1, 1);
    c.dueDate = this.dueFor(c.box);
    c.lastReviewed = this.today();
    data.cards[cardId] = c;
    this.save(data);
    return c;
  },
  isCardDue(cardId) {
    const c = this.getCard(cardId);
    return !!(c && c.dueDate && c.dueDate <= this.today());
  },
  // Wie viele neue Karten dürfen heute noch dazukommen?
  newCardsLeft() {
    const n = this.load().newToday;
    return this.NEW_CARDS_PER_DAY - (n.date === this.today() ? n.count : 0);
  },
  countNewCard() {
    const data = this.load();
    if (data.newToday.date !== this.today()) data.newToday = { date: this.today(), count: 0 };
    data.newToday.count++;
    this.save(data);
  },

  // ---------- Fortschritt gesamt ----------
  getCompletionPercent() {
    if (!LESSONS.length) return 0;
    const done = LESSONS.filter(l => this.getStatus(l.id) === 'completed').length;
    return Math.round(done / LESSONS.length * 100);
  }
};

if (typeof module !== 'undefined') module.exports = Progress;
