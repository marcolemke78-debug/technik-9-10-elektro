/**
 * App-Einstieg: Navigation und Start. Daten zur Klassenarbeit stehen in js/ka-daten.js.
 */
// Seiten: 'start' | 'trainer' | 'mixed' | Lektions-ID (Zahl)
function navigate(route) {
  document.getElementById('sidebar').classList.remove('open');
  if (typeof route === 'number') {
    Progress.setLastLesson(route);
    if (Progress.getStatus(route) === 'not_started') Progress.setStatus(route, 'in_progress');
    Renderer.renderLesson(route);
  } else if (route === 'mixed') {
    Renderer.renderMixed();
  } else if (route === 'trainer') {
    Trainer.render(document.getElementById('lesson-container'));
  } else {
    Renderer.renderStart();
  }
  Renderer.current = route;
  Renderer.renderSidebar();
  Renderer.renderProgressBar();
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
  document.title = KA.title;
  // Konsistenz-Check für den Autor (Konsole): sonst bleiben Lektionen für immer "angefangen"
  if (KA.id === 'vorlage') console.warn('KA.id ist noch "vorlage": in js/ka-daten.js eindeutig setzen!');
  LESSONS.forEach(l => {
    const d = (window.LESSON_DATA || []).find(x => x.id === l.id);
    if (!d) console.warn('Lektion ' + l.id + ': kein Inhalt in LESSON_DATA');
    else if (!d.exercises || !d.exercises.length) console.warn('Lektion ' + l.id + ': keine Übungen, kann nie fertig werden');
    if (!MODULES[l.module]) console.warn('Lektion ' + l.id + ': Modul "' + l.module + '" fehlt in MODULES');
  });
  // Immer mit der Startseite "Das kommt dran" beginnen.
  navigate('start');

  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.getElementById('sidebar').addEventListener('click', e => {
    const li = e.target.closest('li[data-route]');
    if (!li) return;
    const r = li.dataset.route;
    navigate(/^\d+$/.test(r) ? parseInt(r, 10) : r);
  });
  document.getElementById('reset-progress').addEventListener('click', () => {
    if (confirm('Wirklich alles zurücksetzen? Dein ganzer Lernstand ist dann weg.')) {
      Progress.reset();
      location.reload();
    }
  });
});
