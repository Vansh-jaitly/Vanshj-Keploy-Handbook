type CompareRow = { topic: string; docs: string; mine: string };

/** "Quickstart says" vs "What I found". */
export function CompareTable({ rows }: { rows: CompareRow[] }) {
  return (
    <div className="table-wrap my-6">
      <table>
        <thead>
          <tr>
            <th scope="col" className="w-1/4">
              <span className="sr-only">Topic</span>
            </th>
            <th scope="col">Quickstart says</th>
            <th scope="col">What I found</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.topic}>
              <th scope="row" className="font-medium">
                {r.topic}
              </th>
              <td className="text-muted-foreground line-through decoration-[var(--faint)]">
                <code>{r.docs}</code>
              </td>
              <td>
                <code>{r.mine}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Endpoint = { method: string; path: string; response: string; quirk?: string };

export function EndpointTable({ rows }: { rows: Endpoint[] }) {
  return (
    <div className="table-wrap my-6">
      <table>
        <thead>
          <tr>
            <th scope="col">Request</th>
            <th scope="col">Response</th>
            <th scope="col">Worth knowing</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.method} ${r.path} ${r.response}`}>
              <td className="whitespace-nowrap">
                <span className="text-foreground inline-block w-14 font-mono text-[0.6875rem] font-semibold tracking-wide">
                  {r.method}
                </span>
                <code>{r.path}</code>
              </td>
              <td>
                <code>{r.response}</code>
              </td>
              <td className="text-muted-foreground">{r.quirk ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
