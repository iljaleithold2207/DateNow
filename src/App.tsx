const tools = [
  'Aktuelles Datum und Uhrzeit auf einen Blick',
  'Schneller Fristen- und Countdown-Rechner',
  'Arbeitstage, Kalenderwochen und Zeitzonen als nächste Ausbaustufe',
];

const now = new Date();

function App() {
  const formattedDate = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(now);

  const formattedTime = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">DateNow MVP</p>
        <h1>Datum, Zeit und Fristen ohne unnötigen Ballast.</h1>
        <p className="hero-copy">
          DateNow wird ein schnelles Web-Tool für Datumsrechner, Countdowns,
          Fristen und produktive Zeitplanung.
        </p>

        <div className="date-panel" aria-label="Aktuelles Datum und aktuelle Uhrzeit">
          <div>
            <span>Heute</span>
            <strong>{formattedDate}</strong>
          </div>
          <div>
            <span>Uhrzeit</span>
            <strong>{formattedTime}</strong>
          </div>
        </div>

        <div className="actions">
          <a href="#roadmap" className="primary-action">Roadmap ansehen</a>
          <a href="https://github.com/iljaleithold2207/DateNow" className="secondary-action">
            GitHub Repo
          </a>
        </div>
      </section>

      <section id="roadmap" className="roadmap-grid" aria-label="Geplante Funktionen">
        {tools.map((tool) => (
          <article className="roadmap-card" key={tool}>
            <span>✓</span>
            <p>{tool}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
