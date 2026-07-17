import { useEffect, useState } from "react";
import type { Pessoa, Transacao, TotaisGerais } from "./types";
import { api } from "./api";
import PessoaForm from "./components/PessoaForm";
import PessoasList from "./components/PessoasList";
import TransacaoForm from "./components/TransacaoForm";
import TransacoesList from "./components/TransacoesList";
import Totais from "./components/Totais";

type Aba = "pessoas" | "transacoes" | "totais";

function App() {
  const [aba, setAba] = useState<Aba>("pessoas");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [totais, setTotais] = useState<TotaisGerais | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const carregarPessoas = async () => setPessoas(await api.listarPessoas());
  const carregarTransacoes = async () =>
    setTransacoes(await api.listarTransacoes());
  const carregarTotais = async () => setTotais(await api.obterTotais());

  // Carrega tudo assim que a aplicação abre
  useEffect(() => {
    const carregarTudo = async () => {
      await Promise.all([
        carregarPessoas(),
        carregarTransacoes(),
        carregarTotais(),
      ]);
    };
    carregarTudo();
  }, []);

  const handleErro = (e: unknown) => {
    setErro(e instanceof Error ? e.message : "Ocorreu um erro inesperado.");
    setTimeout(() => setErro(null), 4000);
  };

  return (
    <div className="container">
      <h1>Controle de Gastos Residenciais</h1>
      {erro && <div className="erro">{erro}</div>}

      <nav className="tabs">
        <button
          className={aba === "pessoas" ? "ativo" : ""}
          onClick={() => setAba("pessoas")}
        >
          Pessoas
        </button>
        <button
          className={aba === "transacoes" ? "ativo" : ""}
          onClick={() => setAba("transacoes")}
        >
          Transações
        </button>
        <button
          className={aba === "totais" ? "ativo" : ""}
          onClick={() => setAba("totais")}
        >
          Totais
        </button>
      </nav>

      {aba === "pessoas" && (
        <section>
          <PessoaForm
            aoCriar={async (nome, idade) => {
              try {
                await api.criarPessoa(nome, idade);
                await carregarPessoas();
              } catch (e) {
                handleErro(e);
              }
            }}
          />
          <PessoasList
            pessoas={pessoas}
            aoDeletar={async (id) => {
              try {
                await api.deletarPessoa(id);
                // Ao deletar uma pessoa, suas transações somem em cascata no
                // back-end, então recarregamos também transações e totais.
                await carregarPessoas();
                await carregarTransacoes();
                await carregarTotais();
              } catch (e) {
                handleErro(e);
              }
            }}
          />
        </section>
      )}

      {aba === "transacoes" && (
        <section>
          <TransacaoForm
            pessoas={pessoas}
            aoCriar={async (descricao, valor, tipo, pessoaId) => {
              try {
                await api.criarTransacao(descricao, valor, tipo, pessoaId);
                await carregarTransacoes();
                await carregarTotais();
              } catch (e) {
                handleErro(e);
              }
            }}
          />
          <TransacoesList transacoes={transacoes} />
        </section>
      )}

      {aba === "totais" && totais && <Totais totais={totais} />}
    </div>
  );
}

export default App;
