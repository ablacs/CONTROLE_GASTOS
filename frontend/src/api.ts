// Camada responsável por toda a comunicação HTTP com o back-end (.NET API).
// Se a porta do back-end for alterada, basta ajustar BASE_URL aqui.
const BASE_URL = "http://localhost:5062/api";

async function tratarResposta(resposta: Response) {
  if (!resposta.ok) {
    const mensagem = await resposta.text();
    throw new Error(mensagem || `Erro ${resposta.status}`);
  }
  if (resposta.status === 204) return null;
  return resposta.json();
}

export const api = {
  // Pessoas
  listarPessoas: () => fetch(`${BASE_URL}/pessoas`).then(tratarResposta),

  criarPessoa: (nome: string, idade: number) =>
    fetch(`${BASE_URL}/pessoas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, idade }),
    }).then(tratarResposta),

  deletarPessoa: (id: string) =>
    fetch(`${BASE_URL}/pessoas/${id}`, { method: "DELETE" }).then(
      tratarResposta,
    ),

  // Transações
  listarTransacoes: () => fetch(`${BASE_URL}/transacoes`).then(tratarResposta),

  // tipo: 1 = Receita, 2 = Despesa (mesmo valor do enum TipoTransacao no back-end)
  criarTransacao: (
    descricao: string,
    valor: number,
    tipo: number,
    pessoaId: string,
  ) =>
    fetch(`${BASE_URL}/transacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descricao, valor, tipo, pessoaId }),
    }).then(tratarResposta),

  // Totais
  obterTotais: () =>
    fetch(`${BASE_URL}/transacoes/totais`).then(tratarResposta),
};
