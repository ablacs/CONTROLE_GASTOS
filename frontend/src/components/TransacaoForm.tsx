import { useState } from "react";
import type { FormEvent } from "react";
import type { Pessoa } from "../types";

interface Props {
  pessoas: Pessoa[];
  aoCriar: (
    descricao: string,
    valor: number,
    tipo: number,
    pessoaId: string,
  ) => void;
}

/**
 * Formulário para cadastro de transações (receita ou despesa).
 * Regra de negócio: pessoas menores de 18 anos só podem cadastrar despesas —
 * por isso a opção "Receita" fica desabilitada no front-end quando a pessoa
 * selecionada é menor de idade (o back-end também valida isso).
 */
export default function TransacaoForm({ pessoas, aoCriar }: Props) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"1" | "2">("2"); // 1 = Receita, 2 = Despesa
  const [pessoaId, setPessoaId] = useState("");

  const pessoaSelecionada = pessoas.find((p) => p.id === pessoaId);
  const menorDeIdade = pessoaSelecionada ? pessoaSelecionada.idade < 18 : false;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!descricao.trim() || !valor || !pessoaId) return;
    aoCriar(descricao.trim(), Number(valor), Number(tipo), pessoaId);
    setDescricao("");
    setValor("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Nova transação</h2>
      <select
        value={pessoaId}
        onChange={(e) => {
          setPessoaId(e.target.value);
          const p = pessoas.find((x) => x.id === e.target.value);
          if (p && p.idade < 18) setTipo("2"); // força despesa se for menor
        }}
        required
      >
        <option value="">Selecione a pessoa</option>
        {pessoas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome} {p.idade < 18 ? "(menor)" : ""}
          </option>
        ))}
      </select>

      <input
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />

      <input
        placeholder="Valor"
        type="number"
        step="0.01"
        min={0.01}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
      />

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value as "1" | "2")}
      >
        <option value="2">Despesa</option>
        <option value="1" disabled={menorDeIdade}>
          Receita{menorDeIdade ? " (indisponível para menores)" : ""}
        </option>
      </select>

      <button type="submit">Cadastrar</button>
    </form>
  );
}
