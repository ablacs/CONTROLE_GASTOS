namespace ControleGastos.Api.DTOs;

/// <summary>Totais consolidados de uma única pessoa.</summary>
public record TotalPessoaDto(Guid PessoaId, string Nome, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);

/// <summary>Totais de todas as pessoas + o total geral (soma de todos).</summary>
public record TotaisGeraisDto(List<TotalPessoaDto> Pessoas, decimal TotalReceitasGeral, decimal TotalDespesasGeral, decimal SaldoGeral);
