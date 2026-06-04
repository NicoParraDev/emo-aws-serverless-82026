import { useState } from "react";
import axios from "axios";
import { NimbusButton, NimbusInput, NimbusBadge, NimbusTable } from "./ui";
import type { NimbusTableRow } from "./ui";
import "./App.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3002/procesar"
    : "/procesar");

function App() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState<NimbusTableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const procesar = async () => {
    if (!texto.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(API_URL, { texto });
      setResultados((prev) => [res.data, ...prev]);
      setTexto("");
    } catch (e) {
      console.error(e);
      setError(`No se pudo conectar con la API (${API_URL})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nimbus-app">
      <div className="nimbus-app__aurora" aria-hidden />
      <div className="nimbus-app__grid" aria-hidden />

      <header className="nimbus-hero">
        <p className="nimbus-hero__eyebrow">Pipeline serverless · demo 82026</p>
        <h1 className="nimbus-hero__title">
          <span className="nimbus-hero__glyph">◈</span> Nimbus
        </h1>
        <p className="nimbus-hero__subtitle">
          Procesa texto en Lambda, persiste en S3 y consulta como Athena
        </p>
        <div className="nimbus-hero__badges">
          <NimbusBadge label="Lambda" variant="teal" />
          <NimbusBadge label="API Gateway" variant="amber" />
          <NimbusBadge label="S3" variant="teal" />
          <NimbusBadge label="Athena" variant="magenta" />
          <NimbusBadge label="CDK" variant="amber" />
        </div>
      </header>

      <section className="nimbus-panel">
        <div className="nimbus-panel__composer">
          <NimbusInput
            value={texto}
            onChange={setTexto}
            onEnter={procesar}
            placeholder="Ingresa un texto para procesar…"
            disabled={loading}
          />
          <NimbusButton onClick={procesar} disabled={loading}>
            {loading ? "Procesando…" : "Procesar"}
          </NimbusButton>
        </div>

        {error && <p className="nimbus-panel__error">{error}</p>}

        {resultados.length > 0 ? (
          <div className="nimbus-panel__results">
            <h2 className="nimbus-panel__results-title">
              Registros <span>{resultados.length}</span>
            </h2>
            <NimbusTable rows={resultados} />
          </div>
        ) : (
          <p className="nimbus-panel__empty">
            Los resultados aparecerán aquí tras procesar un texto.
          </p>
        )}
      </section>

      <footer className="nimbus-footer">
        <span>POST</span> {API_URL}
      </footer>
    </div>
  );
}

export default App;
