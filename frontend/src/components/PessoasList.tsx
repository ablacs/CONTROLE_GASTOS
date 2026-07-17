import type { Pessoa } from "../types";

interface Props {
  pessoas: Pessoa[];
  aoDeletar: (id: string) => void;
}

/** Lista as pessoas cadastradas e permite a remoção de cada uma. */
export default function PessoasList({ pessoas, aoDeletar }: Props) {
  return (
    <div>
      <h2>Pessoas cadastradas</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Idade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>
                {p.idade}
                {p.idade < 18 && " (menor de idade)"}
              </td>
              <td>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Remover ${p.nome}? Todas as transações dessa pessoa também serão apagadas.`,
                      )
                    ) {
                      aoDeletar(p.id);
                    }
                  }}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {pessoas.length === 0 && (
            <tr>
              <td colSpan={3}>Nenhuma pessoa cadastrada ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
