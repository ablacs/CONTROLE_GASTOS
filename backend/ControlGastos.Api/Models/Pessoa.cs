namespace ControleGastos.Api.Models;

/// <summary>
/// Representa uma pessoa do lar cujas transações serão controladas.
/// </summary>
public class Pessoa
{
    /// <summary>Identificador único, gerado automaticamente.</summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Nome { get; set; } = string.Empty;

    public int Idade { get; set; }

    /// <summary>Transações associadas a esta pessoa (relacionamento 1:N).</summary>
    public List<Transacao> Transacoes { get; set; } = new();

    /// <summary>
    /// Regra de negócio central: pessoas com menos de 18 anos são consideradas
    /// menores de idade e só podem ter despesas cadastradas (nunca receitas).
    /// </summary>
    public bool EhMenorDeIdade => Idade < 18;
}
