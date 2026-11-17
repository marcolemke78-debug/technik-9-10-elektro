/**
 * Modul 2: Transistor und Sensorschaltungen
 * Lektionen 7-9. Bilder: eigene Schaltbilder der Unterrichtsreihe (assets/*.png).
 * Alle Rechenaufgaben werden in pruefung/nachrechnen.js nachgerechnet.
 */
const PIC = (file, alt) => '<img src="assets/' + file + '" alt="' + alt + '" class="schaltbild">';

window.LESSON_DATA = (window.LESSON_DATA || []).concat([
  // ---------------------------------------------------------------- L7
  {
    id: 7,
    title: 'Der Transistor als Schalter',
    explanation: {
      html: `
        <p>Ein <strong>Transistor</strong> ist ein elektronischer Schalter ohne bewegte Teile. Er hat drei Anschlüsse:</p>
        ${PIC('00_transistor_symbole.png', 'Schaltzeichen npn- und pnp-Transistor mit Basis, Kollektor, Emitter')}
        <table class="info-table">
          <tr><th>Kurzzeichen</th><th>Name</th><th>Welcher Strom? (npn)</th></tr>
          <tr><td>B</td><td>Basis</td><td>kleiner <strong>Steuerstrom</strong> (Basisstrom I<sub>B</sub>) fließt hinein</td></tr>
          <tr><td>C</td><td>Kollektor</td><td>großer <strong>Arbeitsstrom</strong> (Kollektorstrom I<sub>C</sub>) fließt hinein</td></tr>
          <tr><td>E</td><td>Emitter</td><td>beide Ströme fließen gemeinsam heraus zum Minuspol</td></tr>
        </table>
        <div class="tip-box"><strong>Merkhilfe npn:</strong> Der Pfeil am Emitter zeigt nach außen, dort fließt der Strom hinaus.</div>
        <h3>Zwei Stromkreise</h3>
        ${PIC('01_transistor_als_schalter.png', 'Transistor als Schalter: Steuerstromkreis mit S1 und R2, Arbeitsstromkreis mit R1 und LED')}
        <ul>
          <li><strong>Steuerstromkreis</strong> (orange): Batterie → Taster S1 → R<sub>2</sub> → Basis → Emitter. Hier fließt ein <strong>kleiner</strong> Strom I<sub>B</sub>.</li>
          <li><strong>Arbeitsstromkreis</strong> (blau): Batterie → R<sub>1</sub> → LED → Kollektor → Emitter. Hier fließt ein <strong>großer</strong> Strom I<sub>C</sub>.</li>
        </ul>
        <div class="merke">Ab etwa <strong>0,7 V</strong> zwischen Basis und Emitter wird der Transistor <strong>leitend</strong>. Ein kleiner Steuerstrom schaltet dann einen großen Arbeitsstrom. Ohne Basisstrom <strong>sperrt</strong> er.</div>
        <div class="analogy-box"><strong>Wie eine Schleuse am Fluss:</strong> Ein Mensch dreht mit wenig Kraft an einem kleinen Rad (Steuerstrom). Dadurch öffnet sich das große Tor und viel Wasser fließt durch (Arbeitsstrom).</div>
        <p><strong>R<sub>2</sub></strong> (Basiswiderstand) begrenzt den Basisstrom und schützt so den Transistor. <strong>R<sub>1</sub></strong> ist der Vorwiderstand der LED.</p>
        <table class="info-table">
          <tr><th></th><th>Relais</th><th>Transistor</th></tr>
          <tr><td>Gleich</td><td colspan="2">Steuerstromkreis und Arbeitsstromkreis. Ein kleiner Strom schaltet einen großen.</td></tr>
          <tr><td>Anders</td><td>bewegte Kontakte, klickt, langsamer</td><td>keine bewegten Teile, geräuschlos, sehr schnell</td></tr>
        </table>
        <div class="warning-box"><strong>Typischer Fehler:</strong> Denken, der Basisstrom fließe über den Kollektor ab. Beim npn-Transistor fließen <strong>beide</strong> Ströme über den <strong>Emitter</strong> heraus.</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> Ein Lichtsensor oder ein Zeitglied liefert nur einen winzigen Strom. Damit kann man keine LED, keinen Lüfter und keinen Motor sauber schalten. Der Transistor verstärkt das: Er macht aus dem kleinen Signal den großen Strom.</div>`
    },
    example: {
      title: 'Was passiert beim Drücken von S1?',
      steps: [
        { label: 'S1 offen', html: '<p>Kein Basisstrom, zwischen Basis und Emitter liegen 0 V. Der Transistor <strong>sperrt</strong>, durch die LED fließt nichts. LED <strong>aus</strong>.</p>' },
        { label: 'S1 gedrückt', html: '<p>Über R<sub>2</sub> fließt ein kleiner Basisstrom. Zwischen Basis und Emitter stellen sich etwa 0,7 V ein. Der Transistor wird <strong>leitend</strong>.</p>' },
        { label: 'Arbeitsstrom fließt', html: '<p>Jetzt fließt der große Kollektorstrom durch R<sub>1</sub> und die LED. LED <strong>an</strong>.</p>' },
        { label: 'Wie groß sind die Ströme?', html: '<p>An R<sub>2</sub> = 10 kΩ liegen etwa 9 V − 0,7 V = 8,3 V.<br>I<sub>B</sub> = U / R = 8,3 V / 10 000 Ω ≈ 0,00083 A = <strong>0,83 mA</strong><br>Durch die LED fließen etwa 7 V / 390 Ω ≈ <strong>18 mA</strong>. Das ist rund 20-mal so viel.</p>' }
      ]
    },
    exercises: [
      {
        type: 'matching',
        question: 'Ordne beim npn-Transistor jedem Anschluss den passenden Strom zu.',
        pairs: [
          { left: 'Basis (B)', right: 'kleiner Steuerstrom fließt hinein' },
          { left: 'Kollektor (C)', right: 'großer Arbeitsstrom fließt hinein' },
          { left: 'Emitter (E)', right: 'beide Ströme fließen heraus' }
        ],
        explanation: 'Der Pfeil am Emitter zeigt beim npn-Transistor nach außen: Dort kommt alles heraus.'
      },
      {
        type: 'fill-in-blank',
        question: 'Ergänze den Text zum Bild mit S1, R<sub>1</sub>, R<sub>2</sub> und LED.',
        text: 'Drückt man S1, fließt über R<sub>2</sub> ein kleiner {{blank}} in die Basis. Ab etwa {{blank}} V zwischen Basis und Emitter wird der Transistor {{blank}}. Jetzt fließt der große {{blank}} durch R<sub>1</sub> und die LED. Lässt man S1 los, {{blank}} der Transistor wieder.',
        blanks: [
          { correct: 'Basisstrom', alternatives: ['Steuerstrom'] },
          { correct: '0,7', alternatives: ['0.7'] },
          { correct: 'leitend', alternatives: ['leitfähig', 'durchgeschaltet'] },
          { correct: 'Kollektorstrom', alternatives: ['Arbeitsstrom'] },
          { correct: 'sperrt' }
        ],
        explanation: 'Kleiner Steuerstrom (Basisstrom) rein → Transistor leitet → großer Arbeitsstrom (Kollektorstrom) fließt.'
      },
      {
        type: 'matching',
        question: 'Welche Aufgabe hat das Bauteil in der Schaltung mit S1?',
        pairs: [
          { left: 'Taster S1', right: 'schaltet den Steuerstromkreis ein' },
          { left: 'Basiswiderstand R₂', right: 'begrenzt den kleinen Basisstrom' },
          { left: 'LED', right: 'leuchtet im Arbeitsstromkreis' },
          { left: 'Vorwiderstand R₁', right: 'begrenzt den großen Strom durch die LED' }
        ],
        explanation: 'Steuerstromkreis: Batterie, S1, R<sub>2</sub>, Basis und Emitter. Arbeitsstromkreis: Batterie, R<sub>1</sub>, LED, Kollektor und Emitter. Batterie und Emitter gehören zu beiden.'
      },
      {
        type: 'multiple-choice',
        question: 'Zwischen Basis und Emitter eines npn-Transistors liegen 0,3 V. Was gilt?',
        options: ['Er sperrt, die LED ist aus.', 'Er leitet, die LED ist an.', 'Er leitet halb, die LED leuchtet schwach.', 'Er geht kaputt, weil die Spannung zu klein ist.'],
        correct: 0,
        wrongExplanations: {
          1: 'Leitend wird er erst ab etwa 0,7 V. 0,3 V reichen nicht.',
          2: 'Unter 0,7 V fließt praktisch kein Basisstrom. Im Schalterbetrieb heißt das: aus.',
          3: 'Zu wenig Spannung schadet nicht. Gefährlich ist zu viel Basisstrom, dafür gibt es R<sub>2</sub>.'
        }
      },
      {
        type: 'multiple-choice',
        question: 'Wozu dient der Basiswiderstand R<sub>2</sub>?',
        options: ['Er begrenzt den Basisstrom.', 'Er ist der Vorwiderstand der LED.', 'Er macht den Transistor schneller.', 'Er misst den Basisstrom genau.'],
        correct: 0,
        wrongExplanations: {
          1: 'Der Vorwiderstand der LED ist R<sub>1</sub>, er sitzt im Arbeitsstromkreis.',
          2: 'Ein Widerstand macht nichts schneller. Er begrenzt den Strom.',
          3: 'Zum Messen bräuchte man ein Amperemeter.'
        }
      },
      {
        type: 'number',
        question: 'Bei gedrücktem S1 liegen an R<sub>2</sub> = 10 kΩ etwa 8,3 V. Berechne den Basisstrom I<sub>B</sub> in mA.',
        answer: 0.83,
        unit: 'mA',
        digits: 2,
        tolerance: 0.01,
        hint: '10 kΩ = 10 000 Ω. I = U / R ergibt Ampere, dann mal 1000 für mA.',
        solution: 'I<sub>B</sub> = U / R = 8,3 V / 10 000 Ω = 0,00083 A = <strong>0,83 mA</strong>'
      },
      {
        type: 'free-text',
        question: 'Man könnte den Taster S1 auch direkt in Reihe mit der LED schalten. Warum baut man trotzdem einen Transistor ein? Denk an Sensoren.',
        minWords: 15,
        modelAnswer: 'Ein Sensor wie der LDR ändert nur seinen Widerstand und ist kein richtiger Schalter, ein Zeitglied liefert nur einen kleinen Strom. Der Transistor braucht nur einen kleinen Steuerstrom und schaltet damit den großen Arbeitsstrom ein und aus, automatisch, schnell und ohne bewegte Teile.'
      }
    ]
  },

  // ---------------------------------------------------------------- L8
  {
    id: 8,
    title: 'Spannungsteiler und Dunkelschaltung',
    explanation: {
      html: `
        <p>Ein <strong>LDR</strong> (Fotowiderstand) ist ein lichtabhängiger Widerstand: Bei <strong>Helligkeit klein</strong>, bei <strong>Dunkelheit groß</strong>.</p>
        <h3>Der Spannungsteiler</h3>
        <p>Zwei Widerstände in Reihe bilden einen <strong>Spannungsteiler</strong>. Du kennst die Regel aus der Reihenschaltung: <strong>Am größeren Widerstand fällt mehr Spannung ab.</strong></p>
        <p>Die Basis des Transistors hängt am <strong>Mittelpunkt</strong>. Sie bekommt die Spannung des <strong>unteren</strong> Bauteils (zwischen Mittelpunkt und Minuspol).</p>
        <div class="analogy-box"><strong>Wie zwei Kinder, die sich eine Tafel Schokolade teilen:</strong> Wer &bdquo;stärker&ldquo; ist (größerer Widerstand), bekommt das größere Stück (mehr Spannung). Die ganze Tafel (9 V) bleibt immer gleich groß.</div>
        <h3>Die Dunkelschaltung</h3>
        ${PIC('02_dunkelschaltung.png', 'Dunkelschaltung: R3 = 10 kOhm oben, LDR unten, Mittelpunkt über R2 an der Basis')}
        <p>Oben sitzt R<sub>3</sub> = 10 kΩ, <strong>unten der LDR</strong>.</p>
        <table class="info-table">
          <tr><th>Licht</th><th>LDR</th><th>Spannung am LDR</th><th>Transistor</th><th>LED</th></tr>
          <tr><td>hell</td><td>klein</td><td>wenig (unter 0,7 V)</td><td>sperrt</td><td>aus</td></tr>
          <tr><td>dunkel</td><td>groß</td><td>viel (über 0,7 V)</td><td>leitet</td><td>an</td></tr>
        </table>
        <div class="sim" data-sim="sensor"></div>
        <div class="warning-box"><strong>Typischer Fehler:</strong> &bdquo;Dunkel → LDR groß → weniger Strom → LED aus.&ldquo; Der LDR sitzt aber nicht im LED-Stromkreis. Er steuert nur die <strong>Spannung an der Basis</strong>. Frag immer: Welches Bauteil liegt <strong>unten</strong>?</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> So funktionieren Straßenlaternen, Nachtlichter und Dämmerungsschalter am Haus: Sie gehen automatisch an, wenn es dunkel wird.</div>`
    },
    example: {
      title: 'Nachgerechnet: Dunkelschaltung mit Zahlen',
      steps: [
        { label: 'Werte', html: '<p>U<sub>ges</sub> = 9 V, oben R<sub>3</sub> = 10 kΩ = 10 000 Ω. Der LDR hat im Dunkeln 1 MΩ = 1 000 000 Ω, im Hellen 500 Ω. Den Basisstrom lassen wir weg.</p>' },
        { label: 'Hell: 1. Gesamtwiderstand', html: '<p>Reihenschaltung: R<sub>ges</sub> = 10 000 Ω + 500 Ω = <strong>10 500 Ω</strong></p>' },
        { label: 'Hell: 2. Strom', html: '<p>I = U / R<sub>ges</sub> = 9 V / 10 500 Ω ≈ <strong>0,00086 A</strong></p>' },
        { label: 'Hell: 3. Spannung am LDR', html: '<p>U<sub>LDR</sub> = R<sub>LDR</sub> · I = 500 Ω · 0,00086 A ≈ <strong>0,43 V</strong><br>Das ist weniger als 0,7 V: Transistor sperrt, LED aus.</p>' },
        { label: 'Dunkel: alle Schritte', html: '<p>R<sub>ges</sub> = 10 000 Ω + 1 000 000 Ω = 1 010 000 Ω<br>I = 9 V / 1 010 000 Ω ≈ 0,0000089 A<br>U<sub>LDR</sub> = 1 000 000 Ω · 0,0000089 A ≈ <strong>8,9 V</strong><br>Mehr als 0,7 V: Transistor leitet, LED an.</p>' }
      ]
    },
    exercises: [
      {
        type: 'fill-in-blank',
        question: 'Ergänze die Merksätze.',
        text: 'Bei Helligkeit ist der Widerstand des LDR {{blank}}, bei Dunkelheit {{blank}}. Im Spannungsteiler fällt am {{blank}} Widerstand mehr Spannung ab. Die Basis bekommt die Spannung des {{blank}} Bauteils.',
        blanks: [
          { correct: 'klein', alternatives: ['niedrig', 'gering'] },
          { correct: 'groß', alternatives: ['gross', 'hoch'] },
          { correct: 'größeren', alternatives: ['groesseren', 'grösseren', 'höheren'] },
          { correct: 'unteren' }
        ],
        explanation: 'LDR: hell = klein, dunkel = groß. Größerer Widerstand = mehr Spannung. Die Basis hängt am Mittelpunkt und bekommt die Spannung des unteren Bauteils.'
      },
      {
        type: 'ordering',
        question: 'Dunkelschaltung: Bring die Wirkungskette in die richtige Reihenfolge.',
        items: ['Es wird dunkel.', 'Der Widerstand des LDR wird groß.', 'Am unteren LDR fällt mehr Spannung ab.', 'An der Basis liegen über 0,7 V.', 'Der Transistor leitet.', 'Die LED leuchtet.'],
        correctOrder: [0, 1, 2, 3, 4, 5],
        explanation: 'Sensor (LDR) → Spannungsteiler → Transistor → LED. Genau diese Kette brauchst du in der Prüfung zum Erklären.'
      },
      {
        type: 'multiple-choice',
        question: 'In der Dunkelschaltung wird es hell. Was passiert?',
        options: ['Der LDR wird klein, an der Basis liegen unter 0,7 V, die LED geht aus.', 'Der LDR wird groß, an der Basis liegen über 0,7 V, die LED geht an.', 'Der LDR wird klein, es fließt mehr Strom, die LED wird heller.', 'Der LDR ändert sich nicht, nur die LED reagiert auf Licht.'],
        correct: 0,
        wrongExplanations: {
          1: 'Bei Helligkeit wird der LDR-Widerstand klein, nicht groß.',
          2: 'Der LDR sitzt nicht im LED-Stromkreis. Er bestimmt nur die Spannung an der Basis, und die sinkt.',
          3: 'Der LDR ist der Sensor: Sein Widerstand hängt vom Licht ab. Die LED ist nur die Ausgabe.'
        }
      },
      {
        type: 'number',
        question: 'Gleiche Dunkelschaltung, aber jetzt ist es dämmrig: Der LDR hat 2 kΩ (2000 Ω), oben R<sub>3</sub> = 10 kΩ, U<sub>ges</sub> = 9 V. Berechne die Spannung am LDR (ohne Basisstrom).',
        answer: 1.5,
        unit: 'V',
        hint: 'R<sub>ges</sub> = R<sub>3</sub> + R<sub>LDR</sub>, dann I = U<sub>ges</sub> / R<sub>ges</sub>, dann U<sub>LDR</sub> = R<sub>LDR</sub> · I.',
        solution: 'R<sub>ges</sub> = 10 000 Ω + 2000 Ω = 12 000 Ω<br>I = 9 V / 12 000 Ω = 0,00075 A<br>U<sub>LDR</sub> = 2000 Ω · 0,00075 A = <strong>1,5 V</strong><br>Mehr als 0,7 V: Die LED ist schon an.'
      },
      {
        type: 'fill-in-blank',
        question: 'Gemischt: In allen Schaltungen sitzt R<sub>1</sub> = 390 Ω vor der roten LED (2 V) an 9 V. Rechne den LED-Strom nach.',
        text: 'U<sub>R</sub> = 9 V − 2 V = {{blank}} V. &nbsp; I = U<sub>R</sub> / R<sub>1</sub> = 7 V / 390 Ω ≈ {{blank}} mA',
        blanks: [
          { correct: '7' },
          { correct: '18', alternatives: ['17,9', '17.9', '18,0'] }
        ],
        explanation: '7 V / 390 Ω ≈ 0,018 A = 18 mA. Das ist sicher unter den 20 mA, die die LED verträgt (Lektion 6).'
      }
    ]
  },

  // ---------------------------------------------------------------- L9
  {
    id: 9,
    title: 'Hell-, Warm- und Kaltschaltung, EVA',
    explanation: {
      html: `
        <h3>Hellschaltung: Bauteile tauschen</h3>
        ${PIC('03_hellschaltung.png', 'Hellschaltung: LDR oben, R3 = 10 kOhm unten')}
        <p>Jetzt sitzt der <strong>LDR oben</strong> und R<sub>3</sub> unten. Wird es hell, wird der LDR klein. Am LDR fällt dann wenig Spannung ab, am <strong>unteren</strong> R<sub>3</sub> viel. Die Basis bekommt über 0,7 V: Die LED leuchtet bei <strong>Helligkeit</strong>.</p>
        <h3>Warmschaltung mit NTC</h3>
        ${PIC('04_warmschaltung.png', 'Warmschaltung: NTC oben, R3 = 10 kOhm unten')}
        <p>Ein <strong>NTC</strong> (Heißleiter) wird bei Wärme <strong>kleiner</strong>. Er sitzt oben. Wird es warm, wird er klein, am unteren R<sub>3</sub> liegt mehr Spannung, der Transistor leitet. Statt der LED könnte z. B. ein <strong>Lüfter</strong> anspringen (PC-Lüfter).</p>
        <p><strong>Kaltschaltung:</strong> NTC und R<sub>3</sub> tauschen (NTC unten). Wird es kalt, wird der NTC groß, unten liegt viel Spannung, die Warn-LED geht an.</p>
        <div class="merke">Das Bauteil, das bei der gewünschten Bedingung <strong>groß</strong> wird, gehört <strong>nach unten</strong>. LED bei Dunkelheit an: LDR (im Dunkeln groß) unten. LED bei Helligkeit an: LDR oben.</div>
        <div class="tip-box"><strong>Kurz gemerkt:</strong> Sensor <strong>unten</strong> = Schaltung reagiert, wenn der Sensor groß wird (Dunkelheit, Kälte). Sensor <strong>oben</strong> = Schaltung reagiert, wenn der Sensor klein wird (Helligkeit, Wärme).</div>
        <h3>Das EVA-Prinzip</h3>
        <table class="info-table">
          <tr><th>Eingabe (E)</th><th>Verarbeitung (V)</th><th>Ausgabe (A)</th></tr>
          <tr><td>Sensor nimmt ein Signal auf: LDR, NTC, Taster</td><td>Spannungsteiler und Transistor mit Basiswiderstand werten aus</td><td>LED mit Vorwiderstand, Summer, Lüfter</td></tr>
        </table>
        <div class="analogy-box"><strong>Wie dein Körper:</strong> Die Haut spürt Kälte (Eingabe), das Gehirn entscheidet &bdquo;zu kalt&ldquo; (Verarbeitung), du bekommst Gänsehaut und ziehst eine Jacke an (Ausgabe).</div>
        <div class="warning-box"><strong>Typischer Fehler:</strong> Nur auf den Sensor schauen und die Lage vergessen. Ein LDR allein sagt nicht, ob es eine Hell- oder Dunkelschaltung ist. Entscheidend ist, ob er <strong>oben oder unten</strong> sitzt.</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> In der Prüfung bekommst du oft einen unbekannten Schaltplan und sollst sagen, was er macht. Mit &bdquo;Wer sitzt unten?&ldquo; und EVA kannst du jeden Sensorplan knacken.</div>`
    },
    example: {
      title: 'Rätsel: Welche Schaltung ist das?',
      steps: [
        { label: 'Schaltplan', html: PIC('04b_sensorschaltung_raetsel.png', 'Bauteil A oben, Bauteil B unten, Mittelpunkt an der Basis') + '<p>Bauteil A ist ein LDR, Bauteil B ein fester Widerstand.</p>' },
        { label: 'Wer sitzt unten?', html: '<p>Unten (am Minuspol) sitzt <strong>Bauteil B</strong>, der feste Widerstand. Die Basis bekommt also die Spannung von B.</p>' },
        { label: 'Was passiert bei Helligkeit?', html: '<p>Der LDR (oben) wird klein. Am LDR fällt wenig Spannung ab, an B viel. Die Basis bekommt über 0,7 V, der Transistor leitet.</p>' },
        { label: 'Ergebnis', html: '<p>Die LED leuchtet bei Helligkeit: <strong>Hellschaltung</strong>.</p>' }
      ]
    },
    exercises: [
      {
        type: 'multiple-choice',
        question: 'Im Rätsel-Schaltplan wird es <strong>dunkel</strong>. Was passiert?<br>' + PIC('04b_sensorschaltung_raetsel.png', 'Bauteil A (LDR) oben, Bauteil B unten'),
        options: ['Der LDR wird groß, an B liegt wenig Spannung, die LED ist aus.', 'Der LDR wird groß, an B liegt viel Spannung, die LED ist an.', 'Der LDR wird klein, an B liegt viel Spannung, die LED ist an.', 'Der LDR wird klein, an B liegt wenig Spannung, die LED ist aus.'],
        correct: 0,
        wrongExplanations: {
          1: 'Wird der obere LDR groß, bekommt er den größten Teil der Spannung. Für B unten bleibt wenig übrig.',
          2: 'Im Dunkeln wird ein LDR groß, nicht klein.',
          3: 'Im Dunkeln wird ein LDR groß, nicht klein. Das Ergebnis LED aus stimmt zwar, die Begründung nicht.'
        }
      },
      {
        type: 'matching',
        question: 'Ordne die Bauteile der Warmschaltung dem EVA-Prinzip zu.',
        pairs: [
          { left: 'NTC', right: 'Eingabe' },
          { left: 'Spannungsteiler und Transistor', right: 'Verarbeitung' },
          { left: 'LED mit Vorwiderstand R₁', right: 'Ausgabe' }
        ],
        explanation: 'Der NTC erfasst die Temperatur (Eingabe). Spannungsteiler, Basiswiderstand und Transistor werten aus (Verarbeitung). Die LED zeigt das Ergebnis (Ausgabe).'
      },
      {
        type: 'matching',
        question: 'Welche Schaltung brauchst du?',
        pairs: [
          { left: 'Straßenlaterne soll bei Dunkelheit angehen', right: 'Dunkelschaltung: LDR unten' },
          { left: 'PC-Lüfter soll bei Hitze anspringen', right: 'Warmschaltung: NTC oben' },
          { left: 'Warn-LED im Gewächshaus bei Frost', right: 'Kaltschaltung: NTC unten' },
          { left: 'Rollladen soll bei praller Sonne herunterfahren', right: 'Hellschaltung: LDR oben' }
        ],
        explanation: 'Das Bauteil, das bei der gewünschten Bedingung groß wird, gehört nach unten.'
      },
      {
        type: 'multiple-choice',
        question: 'Finde den Fehler! Lara erklärt die Warmschaltung (NTC oben, R<sub>3</sub> unten):<br><em>&bdquo;1. Es wird warm. 2. Der NTC wird groß. 3. Am unteren R<sub>3</sub> liegt mehr Spannung. 4. Der Transistor leitet, die LED geht an.&ldquo;</em><br>Welcher Schritt ist falsch?',
        options: ['Schritt 2: Ein NTC wird bei Wärme kleiner.', 'Schritt 3: An R<sub>3</sub> liegt weniger Spannung.', 'Schritt 4: Der Transistor sperrt.', 'Kein Fehler, alles stimmt.'],
        correct: 0,
        wrongExplanations: {
          1: 'Schritt 3 stimmt: Wird der obere NTC klein, bekommt der untere R<sub>3</sub> den größeren Teil der Spannung.',
          2: 'Schritt 4 stimmt: Über 0,7 V an der Basis leitet der Transistor.',
          3: 'NTC heißt Heißleiter: Heiß leitet er besser, sein Widerstand wird also kleiner.'
        },
        explanation: 'Richtig: Der NTC (Heißleiter) wird bei Wärme <strong>kleiner</strong>. Laras Ergebnis stimmt, aber mit &bdquo;NTC wird groß&ldquo; würde die Kette gar nicht aufgehen.'
      },
      {
        type: 'ordering',
        question: 'So plant man eine elektronische Schaltung. Bring die Schritte in die richtige Reihenfolge.',
        items: ['Problemstellung erfassen: Was soll die Schaltung leisten?', 'Anforderungsliste: Was wird erfasst, verglichen, geschaltet (EVA)?', 'Lösungsideen finden und die einfachste passende auswählen', 'Bauteile auswählen, Werte berechnen, nächsthöheren Normwert wählen'],
        correctOrder: [0, 1, 2, 3],
        explanation: 'Erst verstehen, was gebraucht wird, dann planen, dann rechnen. Wer gleich Bauteile kauft, baut oft das Falsche.'
      },
      {
        type: 'free-text',
        question: 'Im Winter soll im Gewächshaus eine Warn-LED angehen, wenn es zu kalt wird. Wie baust du die Warmschaltung um, und warum leuchtet die LED dann bei Kälte?',
        minWords: 20,
        modelAnswer: 'NTC und R3 werden vertauscht: R3 kommt nach oben, der NTC nach unten (Kaltschaltung). Wird es kalt, wird der Widerstand des NTC groß. Am unteren NTC fällt dann viel Spannung ab, die Basis bekommt mehr als 0,7 V. Der Transistor leitet und die Warn-LED leuchtet.'
      }
    ]
  }
]);
