import { useEffect, useState } from "react";
import { api } from "./api";
import type { Pessoa } from "./types";

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  useEffect(() => {
    api.listarPessoas().then(setPessoas).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Controle de Gastos Residenciais</h1>
      <pre>{JSON.stringify(pessoas, null, 2)}</pre>
    </div>
  );
}

export default App;
