using ControleGastos.Api.Models;

namespace ControleGastos.Api.DTOs;

/// <summary>Dados recebidos para cadastrar uma nova transação.</summary>
public record CriarTransacaoDto(string Descricao, decimal Valor, TipoTransacao Tipo, Guid PessoaId);
