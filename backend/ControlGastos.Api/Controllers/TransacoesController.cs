using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoints responsáveis pelo cadastro de transações e pela consulta de totais.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context) => _context = context;

    /// <summary>GET api/transacoes — lista todas as transações cadastradas.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoResponseDto>>> Listar()
    {
        var transacoes = await _context.Transacoes
            .Include(t => t.Pessoa)
            .OrderByDescending(t => t.Id)
            .Select(t => new TransacaoResponseDto(
                t.Id, t.Descricao, t.Valor, t.Tipo.ToString(), t.PessoaId, t.Pessoa!.Nome))
            .ToListAsync();

        return Ok(transacoes);
    }

    /// <summary>
    /// POST api/transacoes — cria uma nova transação.
    /// Regras de negócio aplicadas:
    ///  1) A pessoa informada precisa existir no cadastro.
    ///  2) Pessoas menores de 18 anos só podem cadastrar despesas (nunca receitas).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransacaoResponseDto>> Criar(CriarTransacaoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Descricao))
            return BadRequest("A descrição é obrigatória.");

        if (dto.Valor <= 0)
            return BadRequest("O valor deve ser maior que zero.");

        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
            return BadRequest("A pessoa informada não está cadastrada.");

        if (pessoa.EhMenorDeIdade && dto.Tipo == TipoTransacao.Receita)
            return BadRequest("Pessoas menores de 18 anos só podem ter despesas cadastradas.");

        var transacao = new Transacao
        {
            Descricao = dto.Descricao.Trim(),
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        var response = new TransacaoResponseDto(
            transacao.Id, transacao.Descricao, transacao.Valor,
            transacao.Tipo.ToString(), transacao.PessoaId, pessoa.Nome);

        return CreatedAtAction(nameof(Listar), new { id = transacao.Id }, response);
    }

    /// <summary>
    /// GET api/transacoes/totais — consulta de totais: para cada pessoa exibe o
    /// total de receitas, total de despesas e saldo (receita - despesa); ao final,
    /// devolve também o total geral somando todas as pessoas.
    /// </summary>
    [HttpGet("totais")]
    public async Task<ActionResult<TotaisGeraisDto>> Totais()
    {
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        var totaisPorPessoa = pessoas.Select(p =>
        {
            var receitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);
            return new TotalPessoaDto(p.Id, p.Nome, receitas, despesas, receitas - despesas);
        }).ToList();

        var totalReceitasGeral = totaisPorPessoa.Sum(p => p.TotalReceitas);
        var totalDespesasGeral = totaisPorPessoa.Sum(p => p.TotalDespesas);
        var saldoGeral = totalReceitasGeral - totalDespesasGeral;

        var resultado = new TotaisGeraisDto(totaisPorPessoa, totalReceitasGeral, totalDespesasGeral, saldoGeral);
        return Ok(resultado);
    }
}
