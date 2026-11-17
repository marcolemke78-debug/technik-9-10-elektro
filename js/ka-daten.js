/**
 * Daten der Lern-App Technik 9/10 Elektrotechnik (keine Klassenarbeit, darum kein Datum).
 * Wird von der App UND von den Druckseiten in pdf/ gelesen.
 * LESSONS: IDs nie nachträglich ändern, sonst ist der Lernstand weg.
 */
const KA = {
  id: 'technik-9-10-elektro-2627',
  subject: 'Technik',
  title: 'Technik 9/10: Grundschaltungen und Transistor',
  date: '',
  topics: [
    { title: 'Spannung, Strom, Widerstand', page: '', lessons: [1] },
    { title: 'Schaltzeichen', page: '', lessons: [2] },
    { title: 'Ohmsches Gesetz', page: '', lessons: [3] },
    { title: 'Reihenschaltung', page: '', lessons: [4] },
    { title: 'Parallelschaltung', page: '', lessons: [5] },
    { title: 'Messgeräte und LED-Vorwiderstand', page: '', lessons: [6] },
    { title: 'Transistor als Schalter', page: 'S. 230–231', lessons: [7] },
    { title: 'Spannungsteiler und Dunkelschaltung', page: 'S. 232', lessons: [8] },
    { title: 'Hell-, Warm-, Kaltschaltung, EVA', page: 'S. 232, 240–241', lessons: [9] },
    { title: 'Fachbegriffe', page: '', trainer: true }
  ],
  links: [
    { label: 'Spickzettel (1 Seite)', href: 'pdf/spickzettel.html' },
    { label: 'Lernblatt und Faltkarten', href: 'pdf/karten.html' }
  ]
};

const MODULES = { m1: 'Grundlagen: Reihe und parallel', m2: 'Transistor und Sensoren' };

const LESSONS = [
  { id: 1, title: 'Spannung, Strom, Widerstand', module: 'm1' },
  { id: 2, title: 'Schaltzeichen und Schaltpläne', module: 'm1' },
  { id: 3, title: 'Das Ohmsche Gesetz', module: 'm1' },
  { id: 4, title: 'Die Reihenschaltung', module: 'm1' },
  { id: 5, title: 'Die Parallelschaltung', module: 'm1' },
  { id: 6, title: 'Messgeräte und LED-Vorwiderstand', module: 'm1' },
  { id: 7, title: 'Der Transistor als Schalter', module: 'm2' },
  { id: 8, title: 'Spannungsteiler und Dunkelschaltung', module: 'm2' },
  { id: 9, title: 'Hell-, Warm- und Kaltschaltung, EVA', module: 'm2' }
];
