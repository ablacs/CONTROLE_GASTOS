namespace ControleGastos.Api.DTOs;

/// <summary>Dados devolvidos ao cliente ao listar/criar uma transação.</summary>
public record TransacaoResponseDto(Guid Id, string Descricao, decimal Valor, string Tipo, Guid PessoaId, string PessoaNome);
