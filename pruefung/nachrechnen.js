// Prüfskript (Regel 7): rechnet jede Zahl-Aufgabe UNABHÄNGIG aus dem Aufgabentext nach.
// Für jede Aufgabe vom Typ 'number' muss unten eine eigene Rechnung stehen,
// die NICHT das Feld `answer` benutzt. Fehlt eine, meldet das Skript es.
// Aufruf (im Paketordner): node pruefung/nachrechnen.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {} };
ctx.window = ctx;
vm.createContext(ctx);
const jsDir = path.join(__dirname, '..', 'js');
fs.readdirSync(jsDir).filter(f => /^lessons-.*\.js$/.test(f)).forEach(f => {
  vm.runInContext(fs.readFileSync(path.join(jsDir, f), 'utf8'), ctx);
});

// Eigene Rechnungen: Schlüssel = eindeutiges Stück aus dem Fragetext
const RECHNUNGEN = {
  'Berechne R.': () => 9 / (30 / 1000),                                   // L3: 300 Ω
  'Welche Spannung liegt an R<sub>2</sub>?': () => 200 * 9 / (100 + 200), // L4: 6 V
  'Außenlampe mit 60 Ω': () => 12 / 40 + 12 / 120 + 12 / 60,              // L5: 0,6 A
  'an einer 6-V-Batterie': () => (6 - 2) / 0.02,                          // L6: 200 Ω
  'Berechne den Basisstrom': () => Math.round(8.3 / 10000 * 1000 * 100) / 100, // L7: 0,83 mA
  'Der LDR hat 2 kΩ': () => 2000 * 9 / (10000 + 2000)                    // L8: 1,5 V
};

// Lückentexte: erwartete Lösungen neu gerechnet (Zahlen wie in der App mit Komma)
const k = x => String(Math.round(x * 1000) / 1000).replace('.', ',');
const LUECKEN = {
  '40 mA = {{blank}} A': [k(40 / 1000), k(250 / 1000), k(0.5 * 1000), k(0.08 * 1000)],
  'Gegeben: U = 12 V, R = 60 Ω': [k(12 / 60)],
  'Gegeben: R = 150 Ω, I = 0,04 A': ['150', '0,04', k(150 * 0.04)],
  'Der letzte Schritt fehlt.<br>': [k(7 / 0.02)],
  '(40 Ω und 80 Ω an 12 V)': [k(80 * 12 / 120)],
  'R<sub>3</sub> = 50 Ω an U = 10 V': [k(100), k(10 / 100 * 1000), k(20 * 0.1), k(30 * 0.1), k(50 * 0.1)],
  'Die letzten zwei Schritte fehlen.': [k(0.3 + 0.1), k(12 / 0.4)],
  'R<sub>2</sub> = 30 Ω liegen parallel an U = 6 V': [k(6 / 60 * 1000), k(6 / 30 * 1000), k(300), k(6 / 0.3)],
  'Rechne den LED-Strom nach.': [k(9 - 2), k(Math.round(7 / 390 * 1000))]
};
Object.keys(LUECKEN).forEach(key => {
  let found = false;
  ctx.LESSON_DATA.forEach(l => (l.exercises || []).forEach(ex => {
    if (ex.type !== 'fill-in-blank' || (ex.question + ex.text).indexOf(key) === -1) return;
    found = true;
    const got = ex.blanks.map(b => b.correct);
    if (JSON.stringify(got) !== JSON.stringify(LUECKEN[key])) { console.log('FALSCH Lücke L' + l.id + ': ' + got + ' statt ' + LUECKEN[key]); process.exitCode = 1; }
  }));
  if (!found) { console.log('FEHLT Lückentext: ' + key); process.exitCode = 1; }
});

let fehler = 0, geprueft = 0;
ctx.LESSON_DATA.forEach(lesson => (lesson.exercises || []).forEach((ex, i) => {
  if (ex.type !== 'number') return;
  const key = Object.keys(RECHNUNGEN).find(k => ex.question.indexOf(k) !== -1);
  const wo = 'Lektion ' + lesson.id + ', Übung ' + (i + 1);
  if (!key) { fehler++; console.log('FEHLT  ' + wo + ': keine eigene Rechnung'); return; }
  const soll = RECHNUNGEN[key]();
  geprueft++;
  if (Math.abs(soll - ex.answer) > 1e-9) { fehler++; console.log('FALSCH ' + wo + ': answer ' + ex.answer + ', nachgerechnet ' + soll); }
}));
console.log(geprueft + ' Aufgaben nachgerechnet, ' + fehler + ' Probleme');
process.exit(fehler || process.exitCode ? 1 : 0);
