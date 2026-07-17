// Tipos que espelham os DTOs devolvidos pela API .NET

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export type TipoTransacaoTexto = "Receita" | "Despesa";

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacaoTexto;
  pessoaId: string;
  pessoaNome: string;
}

export interface TotalPessoa {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisGerais {
  pessoas: TotalPessoa[];
  totalReceitasGeral: number;
  totalDespesasGeral: number;
  saldoGeral: number;
}
