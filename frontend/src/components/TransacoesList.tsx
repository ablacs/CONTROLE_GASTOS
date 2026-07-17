import type { Transacao } from "../types";

interface Props {
  transacoes: Transacao[];
}

const formatar = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Lista simples de todas as transações cadastradas. */
export default function TransacoesList({ transacoes }: Props) {
  return (
    <div>
      <h2>Transações cadastradas</h2>
      <table>
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr key={t.id}>
              <td>{t.pessoaNome}</td>
              <td>{t.descricao}</td>
              <td>{t.tipo === "Receita" ? "Receita" : "Despesa"}</td>
              <td>{formatar(t.valor)}</td>
            </tr>
          ))}
          {transacoes.length === 0 && (
            <tr>
              <td colSpan={4}>Nenhuma transação cadastrada ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
