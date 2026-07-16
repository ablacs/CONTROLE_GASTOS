namespace ControleGastos.Api.Models;

/// <summary>
/// Representa um lançamento financeiro (receita ou despesa) associado a uma pessoa.
/// </summary>
public class Transacao
{
    /// <summary>Identificador único, gerado automaticamente.</summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    /// <summary>Chave estrangeira: precisa corresponder a uma Pessoa já cadastrada.</summary>
    public Guid PessoaId { get; set; }

    public Pessoa? Pessoa { get; set; }
}
