import "./nimbus-components.css";

export interface NimbusTableRow {
  texto: string;
  palabras: number;
  caracteres: number;
  fecha: string;
}

interface NimbusTableProps {
  rows: NimbusTableRow[];
}

export function NimbusTable({ rows }: NimbusTableProps) {
  if (rows.length === 0) return null;

  return (
    <div className="nimbus-table-shell">
      <table className="nimbus-table">
        <thead>
          <tr>
            <th>Texto</th>
            <th>Palabras</th>
            <th>Caracteres</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.fecha}-${i}`} style={{ animationDelay: `${i * 60}ms` }}>
              <td className="nimbus-table__texto">{r.texto}</td>
              <td className="nimbus-table__num">{r.palabras}</td>
              <td className="nimbus-table__num">{r.caracteres}</td>
              <td className="nimbus-table__fecha">
                {new Date(r.fecha).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
