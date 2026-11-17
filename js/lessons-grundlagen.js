/**
 * Modul 1: Grundlagen Elektrotechnik (Wiederholung Reihen- und Parallelschaltung)
 * Lektionen 1-6. Alle Rechenaufgaben werden in pruefung/nachrechnen.js nachgerechnet.
 */
const IMG = (file, alt, cls) => '<img src="assets/' + file + '" alt="' + alt + '" class="' + (cls || 'schaltbild') + '">';

window.LESSON_DATA = (window.LESSON_DATA || []).concat([
  // ---------------------------------------------------------------- L1
  {
    id: 1,
    title: 'Spannung, Strom, Widerstand',
    explanation: {
      html: `
        <p>Jeder Stromkreis wird mit drei Größen beschrieben: <strong>Spannung</strong>, <strong>Stromstärke</strong> und <strong>Widerstand</strong>.</p>
        <div class="analogy-box"><strong>Wie ein Wasserkreislauf:</strong> Eine Pumpe drückt Wasser durch Rohre.
          <ul>
            <li><strong>Spannung U</strong> ist wie der <strong>Druck der Pumpe</strong>. Die Batterie liefert die Spannung.</li>
            <li><strong>Stromstärke I</strong> ist wie die <strong>Wassermenge pro Sekunde</strong>, die durchs Rohr fließt.</li>
            <li><strong>Widerstand R</strong> ist wie eine <strong>Engstelle im Rohr</strong>. Je enger, desto weniger fließt.</li>
          </ul></div>
        <table class="info-table">
          <tr><th>Größe</th><th>Formelzeichen</th><th>Einheit</th></tr>
          <tr><td>Spannung</td><td>U</td><td>Volt (V)</td></tr>
          <tr><td>Stromstärke</td><td>I</td><td>Ampere (A)</td></tr>
          <tr><td>Widerstand</td><td>R</td><td>Ohm (Ω)</td></tr>
        </table>
        <h3>Einheiten umrechnen: mA und A</h3>
        <p class="formel">1 A = 1000 mA</p>
        <ul>
          <li><strong>mA → A:</strong> durch 1000 teilen, Komma 3 Stellen nach <strong>links</strong>. 20 mA = 0,02 A</li>
          <li><strong>A → mA:</strong> mal 1000, Komma 3 Stellen nach <strong>rechts</strong>. 0,3 A = 300 mA</li>
        </ul>
        <div class="tip-box"><strong>Tipp:</strong> Bei kleinen Zahlen füllst du beim Kommaverschieben mit Nullen auf: 40 mA → Komma 3 Stellen nach links → 0,04 A.</div>
        <div class="warning-box"><strong>Typischer Fehler:</strong> Mit mA statt A rechnen. Dann ist dein Ergebnis 1000-mal zu groß oder zu klein. Vor dem Rechnen <strong>immer in A umrechnen</strong>.</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> LEDs und Transistoren arbeiten mit Strömen von wenigen Milliampere. Fast jede Prüfungsaufgabe beginnt damit, mA in A umzurechnen.</div>`
    },
    example: {
      title: 'Umrechnen Schritt für Schritt',
      steps: [
        { label: '250 mA in A', html: '<p>mA → A heißt: durch 1000, Komma 3 Stellen nach links.<br>250 mA → 0,250 A = <strong>0,25 A</strong></p>' },
        { label: '0,08 A in mA', html: '<p>A → mA heißt: mal 1000, Komma 3 Stellen nach rechts.<br>0,08 A = <strong>80 mA</strong></p>' },
        { label: '5 mA in A', html: '<p>Komma 3 Stellen nach links, vorne mit Nullen auffüllen: 5 → 0,005.<br>5 mA = <strong>0,005 A</strong></p>' }
      ]
    },
    exercises: [
      {
        type: 'matching',
        question: 'Ordne jeder Größe den passenden Vergleich im Wasserkreislauf zu.',
        pairs: [
          { left: 'Spannung U', right: 'Druck der Pumpe' },
          { left: 'Stromstärke I', right: 'Wassermenge pro Sekunde' },
          { left: 'Widerstand R', right: 'Engstelle im Rohr' }
        ],
        explanation: 'Die Spannung treibt an (Druck), der Strom ist das, was fließt (Wassermenge), der Widerstand bremst (Engstelle).'
      },
      {
        type: 'fill-in-blank',
        question: 'Ergänze Formelzeichen und Einheit.',
        text: 'Die Stromstärke hat das Formelzeichen {{blank}} und die Einheit {{blank}}. Der Widerstand hat das Formelzeichen {{blank}} und die Einheit {{blank}}.',
        blanks: [
          { correct: 'I' },
          { correct: 'Ampere', alternatives: ['A'] },
          { correct: 'R' },
          { correct: 'Ohm', alternatives: ['Ω'] }
        ],
        explanation: 'I kommt von Intensität, R von Resistance (englisch: Widerstand). Die Einheiten sind nach Forschern benannt: André-Marie Ampère und Georg Simon Ohm.'
      },
      {
        type: 'fill-in-blank',
        question: 'Rechne um.',
        text: '40 mA = {{blank}} A &nbsp;&nbsp; 250 mA = {{blank}} A &nbsp;&nbsp; 0,5 A = {{blank}} mA &nbsp;&nbsp; 0,08 A = {{blank}} mA',
        blanks: [
          { correct: '0,04', alternatives: ['0.04', '0,040'] },
          { correct: '0,25', alternatives: ['0.25', '0,250'] },
          { correct: '500' },
          { correct: '80' }
        ],
        explanation: 'mA → A: Komma 3 Stellen nach links. A → mA: Komma 3 Stellen nach rechts.'
      },
      {
        type: 'multiple-choice',
        question: 'Wie viel sind 20 mA in Ampere?',
        options: ['0,02 A', '0,2 A', '2 A', '20 000 A'],
        correct: 0,
        wrongExplanations: {
          1: 'Du hast das Komma nur 2 Stellen verschoben. Es müssen 3 sein: 20 mA = 0,020 A.',
          2: 'Du hast durch 10 geteilt. 1 A = 1000 mA, also durch 1000 teilen.',
          3: 'Du hast mal 1000 gerechnet. Von mA nach A wird die Zahl kleiner, nicht größer.'
        }
      },
      {
        type: 'multiple-choice',
        question: 'In einem Stromkreis wird der Widerstand größer, die Spannung bleibt gleich. Was passiert mit der Stromstärke?',
        options: ['Sie wird kleiner.', 'Sie wird größer.', 'Sie bleibt gleich.', 'Sie wird zur Spannung.'],
        correct: 0,
        wrongExplanations: {
          1: 'Denk an das Wasserrohr: Eine engere Stelle lässt weniger Wasser durch, nicht mehr.',
          2: 'Der Widerstand bremst den Strom. Ändert er sich, ändert sich auch die Stromstärke.',
          3: 'Spannung und Stromstärke sind zwei verschiedene Größen mit verschiedenen Einheiten (V und A).'
        }
      }
    ]
  },

  // ---------------------------------------------------------------- L2
  {
    id: 2,
    title: 'Schaltzeichen und Schaltpläne',
    explanation: {
      html: `
        <p>In einem Schaltplan hat jedes Bauteil ein festes Zeichen, das <strong>Schaltzeichen</strong>. So kann jede Fachkraft auf der Welt den Plan lesen.</p>
        <table class="info-table sym-table">
          <tr><th>Zeichen</th><th>Bauteil</th><th>Woran erkenne ich es?</th></tr>
          <tr><td>${IMG('sym-batt.svg', 'Batterie', 'sym')}</td><td>Batterie (Spannungsquelle)</td><td>Langer dünner Strich = Pluspol, kurzer dicker Strich = Minuspol</td></tr>
          <tr><td>${IMG('sym-lamp.svg', 'Lampe', 'sym')}</td><td>Lampe</td><td>Kreis mit Kreuz</td></tr>
          <tr><td>${IMG('sym-res.svg', 'Widerstand', 'sym')}</td><td>Widerstand</td><td>Leeres Rechteck</td></tr>
          <tr><td>${IMG('sym-led.svg', 'LED', 'sym')}</td><td>LED (Leuchtdiode)</td><td>Dreieck mit Querstrich und zwei Pfeilen nach außen (Licht). Strom fließt nur in eine Richtung.</td></tr>
          <tr><td>${IMG('sym-switch.svg', 'Schalter', 'sym')}</td><td>Schalter</td><td>Schräger Hebel. Bleibt in seiner Stellung (wie ein Lichtschalter).</td></tr>
          <tr><td>${IMG('sym-button.svg', 'Taster', 'sym')}</td><td>Taster</td><td>Querbalken mit Druckknopf. Schließt nur, solange man drückt (wie eine Klingel).</td></tr>
          <tr><td>${IMG('sym-amp.svg', 'Amperemeter', 'sym')}</td><td>Amperemeter</td><td>Kreis mit A, misst die Stromstärke</td></tr>
          <tr><td>${IMG('sym-volt.svg', 'Voltmeter', 'sym')}</td><td>Voltmeter</td><td>Kreis mit V, misst die Spannung</td></tr>
        </table>
        <div class="analogy-box"><strong>Wie Verkehrszeichen:</strong> Ein Stoppschild versteht man überall, ohne dass &bdquo;Stopp&ldquo; in der Landessprache daraufsteht. Schaltzeichen funktionieren genauso: Ein Bild, das alle kennen.</div>
        <div class="tip-box"><strong>Verbunden oder nicht?</strong> Ein <strong>dicker Punkt</strong> an einer Kreuzung bedeutet: Hier sind die Leitungen verbunden. Ohne Punkt kreuzen sie sich nur.</div>
        <div class="warning-box"><strong>Typischer Fehler:</strong> Lampe und Widerstand verwechseln. Die Lampe ist ein <strong>Kreis mit Kreuz</strong>, der Widerstand ein <strong>leeres Rechteck</strong>.</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> Ab der Transistor-Lektion liest du ganze Schaltpläne. Wer die Zeichen sicher kennt, sieht dort sofort, wo der Strom langfließt.</div>`
    },
    example: {
      title: 'Einen Schaltplan lesen',
      steps: [
        { label: 'Quelle suchen', html: IMG('led-9v.svg', 'Batterie, Vorwiderstand und LED in Reihe') + '<p>Links siehst du die Batterie (9 V). Von hier startet der Strom am Pluspol (langer Strich).</p>' },
        { label: 'Bauteile der Reihe nach', html: '<p>Oben auf der Leitung: zuerst ein <strong>Rechteck</strong> = Widerstand R<sub>v</sub>, dann das <strong>Dreieck mit Pfeilen</strong> = LED.</p>' },
        { label: 'Weg des Stroms', html: '<p>Es gibt keine Abzweigung (kein dicker Punkt). Der Strom fließt also durch den Widerstand, durch die LED und zurück zur Batterie. Das ist eine <strong>Reihenschaltung</strong>.</p>' }
      ]
    },
    exercises: [
      {
        type: 'matching',
        question: 'Welches Bauteil gehört zu welchem Schaltzeichen?',
        pairs: [
          { left: IMG('sym-led.svg', 'Zeichen 1', 'sym'), right: 'LED' },
          { left: IMG('sym-res.svg', 'Zeichen 2', 'sym'), right: 'Widerstand' },
          { left: IMG('sym-volt.svg', 'Zeichen 3', 'sym'), right: 'Voltmeter' },
          { left: IMG('sym-button.svg', 'Zeichen 4', 'sym'), right: 'Taster' },
          { left: IMG('sym-lamp.svg', 'Zeichen 5', 'sym'), right: 'Lampe' },
          { left: IMG('sym-switch.svg', 'Zeichen 6', 'sym'), right: 'Schalter' }
        ],
        explanation: 'LED: Dreieck mit Pfeilen. Widerstand: leeres Rechteck. Voltmeter: Kreis mit V. Taster: Druckknopf über einem Querbalken. Lampe: Kreis mit Kreuz. Schalter: schräger Hebel.'
      },
      {
        type: 'multiple-choice',
        question: 'Was bedeutet ein dicker Punkt an einer Leitungskreuzung?',
        options: ['Die Leitungen sind verbunden.', 'Die Leitungen kreuzen sich nur.', 'Dort sitzt ein Messgerät.', 'Dort ist der Minuspol.'],
        correct: 0,
        wrongExplanations: {
          1: 'Genau umgekehrt: Kreuzen sich Leitungen nur, steht dort kein Punkt.',
          2: 'Messgeräte haben ein eigenes Zeichen: einen Kreis mit A oder V.',
          3: 'Den Minuspol erkennst du am kurzen dicken Strich der Batterie.'
        }
      },
      {
        type: 'multiple-choice',
        question: 'Du drückst auf eine Klingel, und sie klingelt nur so lange, wie du drückst. Welches Bauteil ist das?',
        options: ['Taster', 'Schalter', 'Widerstand', 'LED'],
        correct: 0,
        wrongExplanations: {
          1: 'Ein Schalter bleibt in seiner Stellung, wie ein Lichtschalter. Eine Klingel hört aber auf, wenn du loslässt.',
          2: 'Ein Widerstand schaltet nichts ein oder aus, er begrenzt den Strom.',
          3: 'Eine LED leuchtet, sie schaltet nicht.'
        }
      },
      {
        type: 'fill-in-blank',
        question: 'Ergänze.',
        text: 'Bei der Batterie ist der lange dünne Strich der {{blank}}pol. Die Lampe zeichnet man als Kreis mit {{blank}}.',
        blanks: [
          { correct: 'Plus', alternatives: ['plus', '+'] },
          { correct: 'Kreuz', alternatives: ['einem Kreuz', 'ein Kreuz', 'x'] }
        ],
        explanation: 'Merkhilfe: Das Pluszeichen hat einen Strich mehr als das Minus. Der längere Strich ist Plus.'
      }
    ]
  },

  // ---------------------------------------------------------------- L3
  {
    id: 3,
    title: 'Das Ohmsche Gesetz',
    explanation: {
      html: `
        <p>Spannung, Stromstärke und Widerstand hängen fest zusammen. Das beschreibt das <strong>Ohmsche Gesetz</strong>:</p>
        <p class="formel">U = R · I</p>
        <p>Kennst du zwei der drei Größen, kannst du die dritte ausrechnen. Dabei hilft das <strong>Formeldreieck</strong>: Halte den Finger auf die gesuchte Größe. Was übrig bleibt, ist deine Formel.</p>
        ${IMG('dreieck.svg', 'Formeldreieck mit U oben, R und I unten', 'schaltbild klein')}
        <table class="info-table">
          <tr><th>Gesucht</th><th>Formel</th><th>Warum?</th></tr>
          <tr><td>U</td><td><strong>U = R · I</strong></td><td>R und I stehen nebeneinander → malnehmen</td></tr>
          <tr><td>R</td><td><strong>R = U / I</strong></td><td>U steht über I → teilen</td></tr>
          <tr><td>I</td><td><strong>I = U / R</strong></td><td>U steht über R → teilen</td></tr>
        </table>
        <div class="analogy-box"><strong>Wie beim Gartenschlauch:</strong> Drehst du den Wasserhahn weiter auf (mehr Druck = mehr Spannung), kommt mehr Wasser (mehr Strom). Drückst du den Schlauch zusammen (mehr Widerstand), kommt weniger.</div>
        <div class="tip-box"><strong>Rechnen wie in der Prüfung, immer 3 Schritte:</strong><br>1. Formel &nbsp; 2. Einsetzen mit Einheiten &nbsp; 3. Ergebnis mit Einheit</div>
        <div class="warning-box"><strong>Achtung:</strong> Stromstärke in mA? Erst in A umrechnen! Ein Ergebnis ohne Einheit gibt in der Prüfung nur die halbe Punktzahl.</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> Mit dieser einen Formel rechnest du später Vorwiderstände für LEDs und den Basisstrom am Transistor aus.</div>`
    },
    example: {
      title: 'Musterbeispiel: Widerstand gesucht',
      steps: [
        { label: 'Aufgabe', html: '<p>An einem Widerstand liegen <strong>6 V</strong> an, es fließen <strong>0,2 A</strong>. Wie groß ist R?</p>' },
        { label: 'Formel', html: '<p>R ist gesucht. Finger auf R im Dreieck: U steht über I. <br><strong>R = U / I</strong></p>' },
        { label: 'Einsetzen mit Einheiten', html: '<p><strong>R = 6 V / 0,2 A</strong><br>Warum? Die Einheiten zeigen dir, ob du richtig eingesetzt hast: V geteilt durch A ergibt Ω.</p>' },
        { label: 'Ergebnis mit Einheit', html: '<p><strong>R = 30 Ω</strong></p>' },
        { label: 'Zweites Beispiel mit mA', html: '<p>U = 9 V, I = 30 mA, gesucht R.<br>Umrechnen: 30 mA = 0,03 A<br>R = U / I = 9 V / 0,03 A = <strong>300 Ω</strong></p>' }
      ]
    },
    exercises: [
      {
        type: 'fill-in-blank',
        question: 'Ergänze mit dem Formeldreieck.',
        text: 'I gesucht: I = U {{blank}} R. &nbsp; U gesucht: U = R {{blank}} I. &nbsp; R gesucht: R = {{blank}} / I',
        blanks: [
          { correct: '/', alternatives: [':', 'geteilt durch', 'durch', 'geteilt', '÷'] },
          { correct: '·', alternatives: ['*', 'x', 'mal', '•', '×', '⋅', '∙'] },
          { correct: 'U' }
        ],
        explanation: 'Stehen zwei Größen nebeneinander, wird malgenommen. Steht eine über der anderen, wird geteilt.'
      },
      {
        type: 'fill-in-blank',
        question: 'Ergänze die fehlenden Schritte. Gegeben: U = 12 V, R = 60 Ω. Gesucht: I.',
        text: '1. Formel: I = U / R &nbsp; 2. Einsetzen: I = 12 V / 60 Ω &nbsp; 3. Ergebnis: I = {{blank}} A',
        blanks: [{ correct: '0,2', alternatives: ['0.2', '0,20'] }],
        explanation: '12 : 60 = 0,2. Volt geteilt durch Ohm ergibt Ampere.'
      },
      {
        type: 'fill-in-blank',
        question: 'Jetzt fehlen die letzten zwei Schritte. Gegeben: R = 150 Ω, I = 0,04 A. Gesucht: U.',
        text: '1. Formel: U = R · I &nbsp; 2. Einsetzen: U = {{blank}} Ω · {{blank}} A &nbsp; 3. Ergebnis: U = {{blank}} V',
        blanks: [
          { correct: '150' },
          { correct: '0,04', alternatives: ['0.04'] },
          { correct: '6' }
        ],
        explanation: '150 · 0,04 = 6. Ohm mal Ampere ergibt Volt.'
      },
      {
        type: 'number',
        question: 'Ganz allein: An einem Widerstand liegen U = 9 V. Es fließen I = 30 mA. Berechne R.',
        answer: 300,
        unit: 'Ω',
        hint: 'Zuerst 30 mA in A umrechnen. Dann R = U / I.',
        solution: '30 mA = 0,03 A<br>R = U / I = 9 V / 0,03 A = <strong>300 Ω</strong>'
      },
      {
        type: 'multiple-choice',
        question: 'Finde den Fehler! Ben rechnet: U = 6 V, I = 20 mA. &bdquo;R = U / I = 6 V / 20 mA = 0,3 Ω.&ldquo; Was hat er falsch gemacht?',
        options: ['Er hat mA nicht in A umgerechnet.', 'Er hätte U = R · I nehmen müssen.', 'Er hat falsch geteilt, 6 : 20 ist nicht 0,3.', 'Er hätte das Ergebnis in Volt angeben müssen.'],
        correct: 0,
        wrongExplanations: {
          1: 'R ist gesucht, also ist R = U / I die richtige Formel.',
          2: '6 : 20 ist tatsächlich 0,3. Der Fehler steckt woanders.',
          3: 'Ein Widerstand wird in Ohm angegeben. Das hat Ben richtig gemacht.'
        },
        explanation: 'Richtig: 20 mA = 0,02 A, also R = 6 V / 0,02 A = 300 Ω. Bens Ergebnis war 1000-mal zu klein.'
      }
    ]
  },

  // ---------------------------------------------------------------- L4
  {
    id: 4,
    title: 'Die Reihenschaltung',
    explanation: {
      html: `
        <p>Bei der <strong>Reihenschaltung</strong> sind die Bauteile <strong>hintereinander</strong> geschaltet. Der Strom hat nur einen einzigen Weg.</p>
        ${IMG('reihe-40-80.svg', 'R1 = 40 Ohm und R2 = 80 Ohm in Reihe an 12 V')}
        <div class="analogy-box"><strong>Wie eine einspurige Straße:</strong> Alle Autos fahren hintereinander durch dieselben Baustellen. Kein Auto kann ausweichen. Genauso fließt derselbe Strom durch jedes Bauteil.</div>
        <table class="info-table">
          <tr><th>Größe</th><th>Regel</th></tr>
          <tr><td>Stromstärke</td><td><strong>überall gleich</strong>: I = I<sub>1</sub> = I<sub>2</sub></td></tr>
          <tr><td>Spannung</td><td><strong>teilt sich auf</strong>: U<sub>ges</sub> = U<sub>1</sub> + U<sub>2</sub></td></tr>
          <tr><td>Widerstand</td><td><strong>wird addiert</strong>: R<sub>ges</sub> = R<sub>1</sub> + R<sub>2</sub> (wird größer)</td></tr>
          <tr><td>Ein Bauteil kaputt</td><td>Der einzige Weg ist unterbrochen: <strong>alles aus</strong></td></tr>
        </table>
        <div class="tip-box"><strong>Rechenweg:</strong> 1. R<sub>ges</sub> addieren &nbsp; 2. I = U / R<sub>ges</sub> &nbsp; 3. Teilspannungen U<sub>1</sub> = R<sub>1</sub> · I usw. &nbsp; 4. Kontrolle: Teilspannungen zusammen = Gesamtspannung</div>
        <div class="warning-box"><strong>Typischer Fehler:</strong> Mit 12 V an jedem Widerstand rechnen. In der Reihe bekommt jedes Bauteil nur einen <strong>Teil</strong> der Spannung. Der größere Widerstand bekommt mehr.</div>
        <h3>Reihenschaltung mit LEDs: die Lichterkette</h3>
        ${IMG('reihe-lichterkette.svg', 'Vorwiderstand und drei LEDs in Reihe an 9 V')}
        <p>Drei LEDs und ein Vorwiderstand hängen hintereinander. Durch alle fließt <strong>derselbe Strom</strong>, und die 9 V teilen sich auf: Jede LED nimmt sich ihre 2 V, den Rest bekommt der Vorwiderstand.</p>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> Vorwiderstand und LED sind immer eine Reihenschaltung. Und der Spannungsteiler in jeder Sensorschaltung ist auch eine.</div>`
    },
    example: {
      title: 'Musterbeispiel: R1 = 40 Ω, R2 = 80 Ω an 12 V',
      steps: [
        { label: 'Gesamtwiderstand', html: '<p>In Reihe wird addiert:<br>R<sub>ges</sub> = R<sub>1</sub> + R<sub>2</sub> = 40 Ω + 80 Ω = <strong>120 Ω</strong></p>' },
        { label: 'Strom', html: '<p>I = U / R<sub>ges</sub> = 12 V / 120 Ω = <strong>0,1 A = 100 mA</strong><br>Warum nur einmal rechnen? In Reihe ist der Strom überall gleich.</p>' },
        { label: 'Teilspannungen', html: '<p>U<sub>1</sub> = R<sub>1</sub> · I = 40 Ω · 0,1 A = <strong>4 V</strong><br>U<sub>2</sub> = R<sub>2</sub> · I = 80 Ω · 0,1 A = <strong>8 V</strong></p>' },
        { label: 'Kontrolle', html: '<p>4 V + 8 V = 12 V ✓ Die Teilspannungen ergeben zusammen die Batteriespannung.</p>' }
      ]
    },
    exercises: [
      {
        type: 'fill-in-blank',
        question: 'Gleiche Schaltung wie im Beispiel (40 Ω und 80 Ω an 12 V). Der letzte Schritt fehlt.',
        text: 'R<sub>ges</sub> = 120 Ω, I = 0,1 A, U<sub>1</sub> = 4 V, U<sub>2</sub> = R<sub>2</sub> · I = 80 Ω · 0,1 A = {{blank}} V',
        blanks: [{ correct: '8' }],
        explanation: '80 · 0,1 = 8. Kontrolle: 4 V + 8 V = 12 V.'
      },
      {
        type: 'fill-in-blank',
        question: 'Drei Widerstände in Reihe: R<sub>1</sub> = 20 Ω, R<sub>2</sub> = 30 Ω, R<sub>3</sub> = 50 Ω an U = 10 V.<br>' + IMG('reihe-20-30-50.svg', 'Drei Widerstände in Reihe an 10 V'),
        text: 'R<sub>ges</sub> = {{blank}} Ω &nbsp; I = {{blank}} mA &nbsp; U<sub>1</sub> = {{blank}} V &nbsp; U<sub>2</sub> = {{blank}} V &nbsp; U<sub>3</sub> = {{blank}} V',
        blanks: [
          { correct: '100' },
          { correct: '100' },
          { correct: '2' },
          { correct: '3' },
          { correct: '5' }
        ],
        explanation: 'R<sub>ges</sub> = 20 + 30 + 50 = 100 Ω. I = 10 V / 100 Ω = 0,1 A = 100 mA. U<sub>1</sub> = 20 Ω · 0,1 A = 2 V, U<sub>2</sub> = 3 V, U<sub>3</sub> = 5 V. Kontrolle: 2 + 3 + 5 = 10 V ✓'
      },
      {
        type: 'number',
        question: 'Zwei Widerstände R<sub>1</sub> = 100 Ω und R<sub>2</sub> = 200 Ω liegen in Reihe an 9 V. Welche Spannung liegt an R<sub>2</sub>?',
        answer: 6,
        unit: 'V',
        hint: 'Erst R<sub>ges</sub>, dann I, dann U<sub>2</sub> = R<sub>2</sub> · I.',
        solution: 'R<sub>ges</sub> = 100 Ω + 200 Ω = 300 Ω<br>I = 9 V / 300 Ω = 0,03 A<br>U<sub>2</sub> = 200 Ω · 0,03 A = <strong>6 V</strong> (Kontrolle: U<sub>1</sub> = 3 V, 3 V + 6 V = 9 V ✓)'
      },
      {
        type: 'multiple-choice',
        question: 'In der Lichterkette (Vorwiderstand und drei LEDs in Reihe) geht eine LED kaputt. Was passiert?',
        options: ['Alle LEDs gehen aus.', 'Die beiden anderen leuchten weiter.', 'Die beiden anderen leuchten heller.', 'Nur die LED daneben geht aus.'],
        correct: 0,
        wrongExplanations: {
          1: 'Das gilt für die Parallelschaltung. In der Reihe gibt es nur einen Stromweg, und der ist jetzt unterbrochen.',
          2: 'Es fließt gar kein Strom mehr, weil der einzige Weg unterbrochen ist.',
          3: 'In Reihe hängen alle an demselben Weg. Ist er unterbrochen, sind alle aus.'
        }
      },
      {
        type: 'number',
        question: 'Lichterkette: Drei LEDs (je 2 V, 20 mA) und ein Vorwiderstand sind in Reihe an 9 V angeschlossen. Berechne den Vorwiderstand R<sub>V</sub>.<br>' + IMG('reihe-lichterkette.svg', 'Vorwiderstand und drei LEDs in Reihe an 9 V'),
        answer: 150,
        unit: 'Ω',
        hint: 'In Reihe teilt sich die Spannung auf: Erst ausrechnen, wie viel Spannung die drei LEDs zusammen brauchen. Der Rest liegt am Vorwiderstand.',
        solution: 'U<sub>LEDs</sub> = 3 · 2 V = 6 V<br>U<sub>R</sub> = 9 V − 6 V = 3 V<br>I = 20 mA = 0,02 A (in Reihe überall gleich)<br>R<sub>V</sub> = U<sub>R</sub> / I = 3 V / 0,02 A = <strong>150 Ω</strong>'
      },
      {
        type: 'multiple-choice',
        question: 'In einer Reihenschaltung aus 10 Ω und 50 Ω: An welchem Widerstand liegt die größere Spannung?',
        options: ['An 50 Ω', 'An 10 Ω', 'An beiden gleich viel', 'Das kann man ohne Batteriespannung nicht sagen'],
        correct: 0,
        wrongExplanations: {
          1: 'Der Strom ist in Reihe überall gleich. Mit U = R · I bekommt der größere Widerstand die größere Spannung.',
          2: 'Gleiche Spannung an allen Bauteilen gibt es in der Parallelschaltung, nicht in der Reihe.',
          3: 'Für den Vergleich reicht U = R · I mit gleichem I: Der größere Widerstand hat immer die größere Spannung.'
        },
        explanation: 'Merke: Am größeren Widerstand fällt mehr Spannung ab. Diesen Satz brauchst du gleich beim Spannungsteiler!'
      }
    ]
  },

  // ---------------------------------------------------------------- L5
  {
    id: 5,
    title: 'Die Parallelschaltung',
    explanation: {
      html: `
        <p>Bei der <strong>Parallelschaltung</strong> liegen die Bauteile <strong>nebeneinander</strong>. Der Strom hat mehrere Wege (Zweige). An den Abzweigungen (Knotenpunkten) steht ein dicker Punkt.</p>
        ${IMG('parallel-led.svg', 'Zwei Zweige parallel an 12 V: rote LED mit 500 Ohm und weiße LED mit 900 Ohm')}
        <p>Im Bild hat jeder Zweig seine eigene LED mit eigenem <strong>Vorwiderstand</strong>. Innerhalb eines Zweigs sind LED und Vorwiderstand in Reihe, die beiden Zweige liegen parallel.</p>
        <div class="analogy-box"><strong>Wie eine Straße, die sich in mehrere Spuren teilt:</strong> Die Autos verteilen sich auf die Spuren und kommen danach wieder zusammen. Mehr Spuren = mehr Autos kommen durch. Darum wird der Gesamtwiderstand kleiner.</div>
        <table class="info-table">
          <tr><th>Größe</th><th>Regel</th></tr>
          <tr><td>Spannung</td><td><strong>an jedem Zweig gleich</strong>: U = U<sub>1</sub> = U<sub>2</sub></td></tr>
          <tr><td>Stromstärke</td><td><strong>teilt sich auf</strong>: I<sub>ges</sub> = I<sub>1</sub> + I<sub>2</sub></td></tr>
          <tr><td>Widerstand (nur Widerstände)</td><td>1/R<sub>ges</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub>. R<sub>ges</sub> ist <strong>kleiner als der kleinste</strong> Einzelwiderstand.</td></tr>
          <tr><td>Ein Bauteil kaputt</td><td>Die anderen Zweige <strong>laufen weiter</strong></td></tr>
        </table>
        <div class="tip-box"><strong>Einfacher Rechenweg für R<sub>ges</sub>:</strong> Erst alle Teilströme ausrechnen, addieren zu I<sub>ges</sub>, dann R<sub>ges</sub> = U / I<sub>ges</sub>. Beispiel: 40 Ω und 120 Ω parallel an 12 V: 0,3 A + 0,1 A = 0,4 A, also R<sub>ges</sub> = 12 V / 0,4 A = 30 Ω.</div>
        <div class="merke">Was in der Reihe gleich bleibt, teilt sich parallel auf, und umgekehrt.</div>
        <div class="warning-box"><strong>Typischer Fehler:</strong> Parallele Widerstände einfach addieren. 40 Ω parallel zu 120 Ω sind <strong>nicht</strong> 160 Ω, sondern 30 Ω.</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> Alle Steckdosen in deiner Wohnung sind parallel geschaltet. Darum bekommt jedes Gerät 230 V, und darum darf man eine Mehrfachsteckdose nicht beliebig vollstecken.</div>`
    },
    example: {
      title: 'Musterbeispiel: Zwei LED-Leuchten im Wohnmobil (12 V)',
      steps: [
        { label: 'Aufgabe', html: IMG('parallel-led.svg', 'Zwei Zweige parallel an 12 V: rote LED mit 500 Ohm und weiße LED mit 900 Ohm') + '<p>Zweig 1: rote LED (2 V) mit R<sub>V1</sub> = 500 Ω. Zweig 2: weiße LED (3 V) mit R<sub>V2</sub> = 900 Ω. Wie viel Strom liefert die Batterie?</p>' },
        { label: 'Spannung', html: '<p>Parallel liegt an jedem Zweig die volle Spannung: <strong>12 V</strong> pro Zweig.<br>Warum? Jeder Zweig hängt direkt an der Batterie.</p>' },
        { label: 'Teilströme', html: '<p>In jedem Zweig wie beim Vorwiderstand rechnen:<br>Zweig 1: U<sub>R1</sub> = 12 V − 2 V = 10 V, I<sub>1</sub> = 10 V / 500 Ω = <strong>0,02 A = 20 mA</strong><br>Zweig 2: U<sub>R2</sub> = 12 V − 3 V = 9 V, I<sub>2</sub> = 9 V / 900 Ω = <strong>0,01 A = 10 mA</strong></p>' },
        { label: 'Gesamtstrom', html: '<p>I<sub>ges</sub> = I<sub>1</sub> + I<sub>2</sub> = 20 mA + 10 mA = <strong>30 mA</strong></p>' },
        { label: 'Eine LED kaputt', html: '<p>Geht die rote LED kaputt, ist nur Zweig 1 unterbrochen. Die weiße LED leuchtet weiter, die Batterie liefert nur noch <strong>10 mA</strong>.</p>' }
      ]
    },
    exercises: [
      {
        type: 'fill-in-blank',
        question: 'Gleiche Schaltung wie im Beispiel (zwei LED-Zweige an 12 V). Die letzten zwei Schritte fehlen.',
        text: 'I<sub>1</sub> = 20 mA, I<sub>2</sub> = 10 mA. &nbsp; I<sub>ges</sub> = {{blank}} mA. &nbsp; Die rote LED geht kaputt: I<sub>ges</sub> = {{blank}} mA',
        blanks: [
          { correct: '30' },
          { correct: '10' }
        ],
        explanation: 'Ströme addieren: 20 mA + 10 mA = 30 mA. Fällt Zweig 1 weg, fließt nur noch der Strom von Zweig 2: 10 mA.'
      },
      {
        type: 'fill-in-blank',
        question: 'R<sub>1</sub> = 60 Ω und R<sub>2</sub> = 30 Ω liegen parallel an U = 6 V.<br>' + IMG('parallel-60-30.svg', '60 Ohm und 30 Ohm parallel an 6 V'),
        text: 'I<sub>1</sub> = {{blank}} mA &nbsp; I<sub>2</sub> = {{blank}} mA &nbsp; I<sub>ges</sub> = {{blank}} mA &nbsp; R<sub>ges</sub> = {{blank}} Ω',
        blanks: [
          { correct: '100' },
          { correct: '200' },
          { correct: '300' },
          { correct: '20' }
        ],
        explanation: 'I<sub>1</sub> = 6 V / 60 Ω = 0,1 A = 100 mA, I<sub>2</sub> = 6 V / 30 Ω = 0,2 A = 200 mA, I<sub>ges</sub> = 300 mA = 0,3 A, R<sub>ges</sub> = 6 V / 0,3 A = 20 Ω. Kleiner als 30 Ω ✓'
      },
      {
        type: 'number',
        question: 'Zu den beiden LED-Zweigen (20 mA und 10 mA) kommt ein dritter Zweig dazu: grüne LED (2 V) mit R<sub>V3</sub> = 1 kΩ. Wie groß ist jetzt der Gesamtstrom I<sub>ges</sub>?<br>' + IMG('parallel-led-3.svg', 'Drei LED-Zweige parallel an 12 V'),
        answer: 40,
        unit: 'mA',
        hint: 'Der neue Zweig bekommt auch 12 V. Erst U<sub>R3</sub> = 12 V − 2 V, dann I<sub>3</sub> = U<sub>R3</sub> / R<sub>V3</sub> (1 kΩ = 1000 Ω), dann alle drei Ströme addieren.',
        solution: 'U<sub>R3</sub> = 12 V − 2 V = 10 V<br>I<sub>3</sub> = 10 V / 1000 Ω = 0,01 A = 10 mA<br>I<sub>ges</sub> = 20 mA + 10 mA + 10 mA = <strong>40 mA</strong><br>Jeder neue Zweig lässt mehr Strom aus der Batterie fließen.'
      },
      {
        type: 'multiple-choice',
        question: 'Zwei Widerstände mit 100 Ω und 50 Ω werden parallel geschaltet. Wie groß kann R<sub>ges</sub> sein?',
        options: ['33 Ω', '150 Ω', '75 Ω', '50 Ω'],
        correct: 0,
        wrongExplanations: {
          1: 'Addieren gilt nur in der Reihe. Parallel wird der Gesamtwiderstand kleiner.',
          2: 'Das ist der Mittelwert. Parallel ist R<sub>ges</sub> aber kleiner als der kleinste Einzelwiderstand.',
          3: 'Kleiner als der kleinste Widerstand heißt: echt kleiner als 50 Ω. Zwei Wege lassen mehr Strom durch als einer.'
        },
        explanation: 'Nachgerechnet bei 10 V: I<sub>1</sub> = 0,1 A, I<sub>2</sub> = 0,2 A, I<sub>ges</sub> = 0,3 A, R<sub>ges</sub> = 10 V / 0,3 A ≈ 33 Ω.'
      },
      {
        type: 'matching',
        question: 'Reihe oder parallel? Ordne die Regel zu.',
        pairs: [
          { left: 'Strom überall gleich', right: 'Reihenschaltung: I = I₁ = I₂' },
          { left: 'Spannung überall gleich', right: 'Parallelschaltung: U = U₁ = U₂' },
          { left: 'Widerstand wird größer', right: 'Reihenschaltung: Rges = R₁ + R₂' },
          { left: 'Ein Bauteil kaputt, Rest läuft weiter', right: 'Parallelschaltung: mehrere Stromwege' }
        ],
        explanation: 'Was in der Reihe gleich bleibt (Strom), teilt sich parallel auf, und umgekehrt (Spannung).'
      },
      {
        type: 'free-text',
        question: 'Warum soll man an eine Mehrfachsteckdose nicht beliebig viele Geräte gleichzeitig anschließen? Erkläre mit der Parallelschaltung.',
        minWords: 15,
        modelAnswer: 'Jedes weitere Gerät ist ein weiterer paralleler Zweig. Dadurch wird der Gesamtwiderstand kleiner und der Gesamtstrom in der Zuleitung größer. Bei zu vielen Geräten wird der Strom zu groß: Die Leitung kann heiß werden (Brandgefahr) oder die Sicherung löst aus.'
      }
    ]
  },

  // ---------------------------------------------------------------- L6
  {
    id: 6,
    title: 'Messgeräte und LED-Vorwiderstand',
    explanation: {
      html: `
        <h3>Messgeräte richtig einbauen</h3>
        <ul>
          <li><strong>Amperemeter (Strom messen): in Reihe.</strong> Leitung auftrennen, Messgerät hineinsetzen. Der Strom muss hindurchfließen. Es hat einen <strong>sehr kleinen</strong> Innenwiderstand.</li>
          <li><strong>Voltmeter (Spannung messen): parallel</strong> zum Bauteil, je eine Leitung links und rechts davon. Es hat einen <strong>sehr großen</strong> Innenwiderstand und stört den Stromkreis darum nicht.</li>
        </ul>
        ${IMG('ampere-richtig.svg', 'Richtig: Amperemeter in Reihe zwischen Vorwiderstand und LED')}
        <div class="analogy-box"><strong>Wie Wasserzähler und Druckmesser:</strong> Der Wasserzähler sitzt <strong>im</strong> Rohr, alles Wasser fließt durch (Amperemeter). Der Druckmesser wird nur <strong>seitlich angesteckt</strong> und vergleicht den Druck vorher und nachher (Voltmeter).</div>
        <div class="tip-box"><strong>Eselsbrücke:</strong> <strong>A</strong> wie <strong>A</strong>chtung, in die Leitung rein. <strong>V</strong> wie <strong>V</strong>erbinden, nebendran.</div>
        <h3>LED mit Vorwiderstand</h3>
        <p>Eine LED braucht nur etwa 2 bis 3 V und hat fast keinen eigenen Widerstand. Deshalb bekommt sie <strong>immer einen Vorwiderstand R<sub>V</sub> in Reihe</strong>. Er nimmt die überschüssige Spannung auf und begrenzt den Strom. Ohne ihn wird der Strom viel zu groß und die LED brennt durch.</p>
        <p class="formel">U<sub>R</sub> = U<sub>ges</sub> − U<sub>LED</sub> &nbsp;&nbsp; R<sub>V</sub> = U<sub>R</sub> / I</p>
        <div class="tip-box"><strong>Normwerte:</strong> Widerstände gibt es nur in festen Werten (E12-Reihe: … 270, 330, 390, 470 …). Gibt es den berechneten Wert nicht, nimmt man den <strong>nächstgrößeren</strong>. Dann fließt etwas weniger Strom, das ist sicher.</div>
        <div class="warning-box"><strong>Typischer Fehler:</strong> R<sub>V</sub> = U<sub>ges</sub> / I rechnen. Am Vorwiderstand liegt aber nur die <strong>übrige</strong> Spannung, nicht die ganze.</div>
        <div class="why-context"><strong>Warum ist das wichtig?</strong> In jeder Transistorschaltung dieser App sitzt eine LED mit Vorwiderstand R<sub>1</sub> = 390 Ω. Gleich rechnest du nach, warum genau dieser Wert.</div>`
    },
    example: {
      title: 'Musterbeispiel: Nachtlicht am USB-Anschluss',
      steps: [
        { label: 'Aufgabe', html: IMG('led-usb.svg', 'USB 5 V, Vorwiderstand und LED 3 V, 20 mA') + '<p>U<sub>ges</sub> = 5 V, weiße LED: U<sub>LED</sub> = 3 V, I = 20 mA. Wie groß muss R<sub>V</sub> sein?</p>' },
        { label: 'Spannung am Vorwiderstand', html: '<p>In Reihe teilt sich die Spannung auf:<br>U<sub>R</sub> = 5 V − 3 V = <strong>2 V</strong></p>' },
        { label: 'Strom umrechnen', html: '<p>I = 20 mA = <strong>0,02 A</strong></p>' },
        { label: 'Vorwiderstand', html: '<p>R<sub>V</sub> = U<sub>R</sub> / I = 2 V / 0,02 A = <strong>100 Ω</strong><br>Kontrolle: 100 Ω · 0,02 A = 2 V ✓</p>' }
      ]
    },
    exercises: [
      {
        type: 'fill-in-blank',
        question: 'Rote LED (U<sub>LED</sub> = 2 V, I = 20 mA) an 9 V. Der letzte Schritt fehlt.<br>' + IMG('led-9v.svg', '9 V, Vorwiderstand und LED 2 V, 20 mA'),
        text: 'U<sub>R</sub> = 9 V − 2 V = 7 V. &nbsp; I = 0,02 A. &nbsp; R<sub>V</sub> = 7 V / 0,02 A = {{blank}} Ω',
        blanks: [{ correct: '350' }],
        explanation: '7 : 0,02 = 350. Tipp: 7 : 0,02 ist dasselbe wie 700 : 2.'
      },
      {
        type: 'multiple-choice',
        question: 'Für die rote LED an 9 V hast du 350 Ω ausgerechnet. In der Kiste gibt es nur 330 Ω und 390 Ω. Welchen nimmst du?',
        options: ['390 Ω, dann fließt etwas weniger als 20 mA.', '330 Ω, weil er näher an 350 Ω liegt.', '330 Ω, dann leuchtet die LED heller und das ist besser.', 'Keinen, ohne genau 350 Ω geht es nicht.'],
        correct: 0,
        wrongExplanations: {
          1: 'Näher dran ist nicht entscheidend. Mit 330 Ω flössen 7 V / 330 Ω ≈ 21 mA, mehr als die LED verträgt.',
          2: 'Mehr Strom als vorgesehen schadet der LED auf Dauer. Sicherheit geht vor Helligkeit.',
          3: 'Man nimmt einfach den nächstgrößeren Normwert. Ein paar Milliampere weniger sind kein Problem.'
        },
        explanation: 'Mit 390 Ω: I = 7 V / 390 Ω ≈ 0,018 A = 18 mA, sicher unter 20 mA. Deshalb sitzt in allen Transistorschaltungen dieser App R<sub>1</sub> = 390 Ω.'
      },
      {
        type: 'number',
        question: 'Eine grüne LED (U<sub>LED</sub> = 2 V, I = 20 mA) soll an einer 6-V-Batterie leuchten. Berechne den Vorwiderstand R<sub>V</sub>.',
        answer: 200,
        unit: 'Ω',
        hint: 'Erst U<sub>R</sub> = U<sub>ges</sub> − U<sub>LED</sub>, dann 20 mA in A umrechnen, dann R<sub>V</sub> = U<sub>R</sub> / I. Gib den berechneten Wert ein, nicht den Normwert.',
        solution: 'U<sub>R</sub> = 6 V − 2 V = 4 V<br>I = 20 mA = 0,02 A<br>R<sub>V</sub> = 4 V / 0,02 A = <strong>200 Ω</strong><br>200 Ω gibt es nicht als Normwert, also den nächstgrößeren nehmen: 220 Ω.'
      },
      {
        type: 'multiple-choice',
        question: 'Finde den Fehler! Tim will den Strom durch die LED messen und baut das Amperemeter so ein:<br>' + IMG('ampere-falsch.svg', 'Amperemeter parallel zur LED') + 'Was passiert?',
        options: ['Der Strom fließt durchs Messgerät, die LED geht aus.', 'Nichts, er misst genau den Strom durch die LED.', 'Es fließt gar kein Strom mehr im ganzen Stromkreis.', 'Die LED leuchtet heller, weil zwei Wege da sind.'],
        correct: 0,
        wrongExplanations: {
          1: 'Das Amperemeter hängt parallel zur LED. Wegen seines winzigen Innenwiderstands nimmt der Strom fast nur diesen Weg.',
          2: 'Das würde passieren, wenn ein Voltmeter (sehr großer Widerstand) in Reihe säße. Hier ist es umgekehrt.',
          3: 'Der Strom nimmt den bequemsten Weg: durchs Amperemeter. Die LED wird überbrückt wie bei einem Kurzschluss.'
        },
        explanation: 'Richtig wäre: Leitung auftrennen und das Amperemeter in Reihe mit der LED einbauen, z. B. zwischen R<sub>V</sub> und LED.'
      },
      {
        type: 'matching',
        question: 'Ordne richtig zu.',
        pairs: [
          { left: 'Amperemeter', right: 'in Reihe, sehr kleiner Innenwiderstand' },
          { left: 'Voltmeter', right: 'parallel, sehr großer Innenwiderstand' },
          { left: 'Vorwiderstand', right: 'begrenzt den Strom durch die LED' },
          { left: 'Normwert', right: 'nächstgrößeren Widerstand nehmen' }
        ],
        explanation: 'A wie Achtung, in die Leitung rein. V wie Verbinden, nebendran.'
      },
      {
        type: 'free-text',
        question: 'Mia will die Spannung an der LED messen und baut das Voltmeter in Reihe ein. Was passiert, und wie macht sie es richtig?<br>' + IMG('volt-falsch.svg', 'Voltmeter in Reihe mit der LED'),
        minWords: 15,
        modelAnswer: 'Das Voltmeter hat einen sehr großen Innenwiderstand. In Reihe fließt deshalb fast kein Strom mehr und die LED bleibt dunkel. Mia muss den Stromkreis wieder schließen und das Voltmeter parallel zur LED anschließen: eine Messleitung vor der LED, eine dahinter.'
      }
    ]
  }
]);
