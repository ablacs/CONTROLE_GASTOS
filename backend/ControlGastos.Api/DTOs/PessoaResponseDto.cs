namespace ControleGastos.Api.DTOs;

/// <summary>Dados devolvidos ao cliente ao listar/criar uma pessoa.</summary>
public record PessoaResponseDto(Guid Id, string Nome, int Idade);
