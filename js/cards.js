/**
 * Karten für den Begriffe-Trainer.
 *   id    – fest, nie ändern (Lernstand hängt daran)
 *   front – Beschreibung, back – Fachbegriff (wird getippt)
 *   alt   – weitere richtige Antworten
 *   mode  – 'reveal' = aufdecken und selbst einschätzen (für Erklär-Fragen)
 */
const CARDS = {
  title: 'Begriffe-Trainer',
  speak: null,
  reverse: false,
  mode: 'type',
  typePlaceholder: 'Begriff tippen …',
  items: [
    { id: 'g01', front: 'Größe, die wie der Druck einer Pumpe den Strom antreibt (Einheit Volt)', back: 'Spannung' },
    { id: 'g02', front: 'Größe, die angibt, wie viel Strom pro Sekunde fließt (Einheit Ampere)', back: 'Stromstärke', alt: ['Strom'] },
    { id: 'g03', front: 'Größe, die den Strom bremst wie eine Engstelle im Rohr (Einheit Ohm)', back: 'Widerstand' },
    { id: 'g04', front: 'Wie viele mA sind 1 A?', back: '1000', alt: ['1000 mA', '1000mA', '1.000', '1.000 mA', '1 000', '1 000 mA'] },
    { id: 'g05', front: 'Formel des Ohmschen Gesetzes, nach U aufgelöst', back: 'U = R · I', formula: true, alt: ['U = RI', 'U = I · R', 'U = IR'] },
    { id: 'g06', front: 'Schaltung, bei der die Bauteile hintereinander liegen und der Strom nur einen Weg hat', back: 'Reihenschaltung', alt: ['Serienschaltung', 'Reihen-Schaltung'] },
    { id: 'g07', front: 'Schaltung, bei der die Bauteile nebeneinander liegen und der Strom mehrere Wege hat', back: 'Parallelschaltung' },
    { id: 'g08', front: 'Messgerät für die Stromstärke, wird in Reihe eingebaut', back: 'Amperemeter', alt: ['Strommessgerät', 'Strommesser'] },
    { id: 'g09', front: 'Messgerät für die Spannung, wird parallel angeschlossen', back: 'Voltmeter', alt: ['Spannungsmessgerät', 'Spannungsmesser'] },
    { id: 'g10', front: 'Widerstand in Reihe vor einer LED, der den Strom begrenzt', back: 'Vorwiderstand', alt: ['Vor-Widerstand'] },
    { id: 'g11', front: 'Bauteil, das nur schließt, solange man drückt (wie eine Klingel)', back: 'Taster' },
    { id: 't01', front: 'Elektronischer Schalter ohne bewegte Teile mit Basis, Kollektor und Emitter', back: 'Transistor' },
    { id: 't02', front: 'Anschluss des Transistors, in den der kleine Steuerstrom fließt', back: 'Basis' },
    { id: 't03', front: 'Anschluss des npn-Transistors, in den der große Arbeitsstrom fließt', back: 'Kollektor' },
    { id: 't04', front: 'Anschluss des npn-Transistors, aus dem beide Ströme herausfließen', back: 'Emitter' },
    { id: 't05', front: 'Ab dieser Spannung zwischen Basis und Emitter wird ein Transistor leitend (in V)', back: '0,7', alt: ['0,7 V', '0.7', '0.7 V', '0,7V', '0.7V', '0,7 Volt', '0.7 Volt'] },
    { id: 't06', front: 'Stromkreis mit dem kleinen Basisstrom', back: 'Steuerstromkreis', alt: ['Steuerkreis'] },
    { id: 't07', front: 'Stromkreis mit dem großen Kollektorstrom, z. B. durch die LED', back: 'Arbeitsstromkreis', alt: ['Arbeitskreis'] },
    { id: 't08', front: 'Lichtabhängiger Widerstand: hell klein, dunkel groß (Abkürzung)', back: 'LDR', alt: ['Fotowiderstand', 'Photowiderstand'] },
    { id: 't09', front: 'Heißleiter: Widerstand wird bei Wärme kleiner (Abkürzung)', back: 'NTC' },
    { id: 't10', front: 'Zwei Widerstände in Reihe, an deren Mittelpunkt man eine Teilspannung abgreift', back: 'Spannungsteiler', alt: ['Spannungsteilerschaltung'] },
    { id: 't11', front: 'Prinzip: Eingabe, Verarbeitung, Ausgabe (Abkürzung)', back: 'EVA', alt: ['EVA-Prinzip'] },
    { id: 'r01', front: 'Was gilt in der Reihen- und was in der Parallelschaltung für Strom und Spannung?', back: 'Reihe: Strom überall gleich, Spannung teilt sich auf. Parallel: Spannung überall gleich, Strom teilt sich auf.', mode: 'reveal' },
    { id: 'r02', front: 'Wie berechnest du den Vorwiderstand einer LED?', back: 'UR = Uges − ULED, dann RV = UR / I (I vorher in A umrechnen). Gibt es den Wert nicht, den nächstgrößeren Normwert nehmen.', mode: 'reveal' },
    { id: 'r03', front: 'Erkläre die Dunkelschaltung in einer Kette.', back: 'Es wird dunkel → LDR (unten) wird groß → am LDR fällt mehr Spannung ab → über 0,7 V an der Basis → Transistor leitet → LED leuchtet.', mode: 'reveal' },
    { id: 'r04', front: 'Woran erkennst du, ob eine LDR-Schaltung eine Hell- oder Dunkelschaltung ist?', back: 'Die Basis bekommt die Spannung des unteren Bauteils. LDR unten = Dunkelschaltung, LDR oben = Hellschaltung.', mode: 'reveal' }
  ]
};
