import type { TotaisGerais } from "../types";

interface Props {
  totais: TotaisGerais;
}

const formatar = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Exibe o total de receitas, despesas e saldo de cada pessoa, e o total geral ao final. */
export default function Totais({ totais }: Props) {
  return (
    <div>
      <h2>Totais por pessoa</h2>
      <table>
        <thead>
          <tr>
            <th>Pessoa</th>
            <th>Receitas</th>
            <th>Despesas</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {totais.pessoas.map((p) => (
            <tr key={p.pessoaId}>
              <td>{p.nome}</td>
              <td>{formatar(p.totalReceitas)}</td>
              <td>{formatar(p.totalDespesas)}</td>
              <td>{formatar(p.saldo)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <strong>Total geral</strong>
            </td>
            <td>
              <strong>{formatar(totais.totalReceitasGeral)}</strong>
            </td>
            <td>
              <strong>{formatar(totais.totalDespesasGeral)}</strong>
            </td>
            <td>
              <strong>{formatar(totais.saldoGeral)}</strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
