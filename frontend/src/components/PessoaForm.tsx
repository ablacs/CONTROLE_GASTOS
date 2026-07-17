import { useState } from "react";
import type { FormEvent } from "react";

interface Props {
  aoCriar: (nome: string, idade: number) => void;
}

/** Formulário simples para cadastro de uma nova pessoa. */
export default function PessoaForm({ aoCriar }: Props) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || idade === "") return;
    aoCriar(nome.trim(), Number(idade));
    setNome("");
    setIdade("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Nova pessoa</h2>
      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        placeholder="Idade"
        type="number"
        min={0}
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
        required
      />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
