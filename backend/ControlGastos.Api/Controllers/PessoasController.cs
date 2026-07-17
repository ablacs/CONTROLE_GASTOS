using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Endpoints responsáveis pelo cadastro de pessoas: criação, listagem e exclusão.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context) => _context = context;

    /// <summary>GET api/pessoas — lista todas as pessoas cadastradas.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaResponseDto>>> Listar()
    {
        var pessoas = await _context.Pessoas
            .OrderBy(p => p.Nome)
            .Select(p => new PessoaResponseDto(p.Id, p.Nome, p.Idade))
            .ToListAsync();

        return Ok(pessoas);
    }

    /// <summary>POST api/pessoas — cria uma nova pessoa (Id gerado automaticamente).</summary>
    [HttpPost]
    public async Task<ActionResult<PessoaResponseDto>> Criar(CriarPessoaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest("O nome é obrigatório.");

        if (dto.Idade < 0)
            return BadRequest("A idade não pode ser negativa.");

        var pessoa = new Pessoa
        {
            Nome = dto.Nome.Trim(),
            Idade = dto.Idade
        };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        var response = new PessoaResponseDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
        return CreatedAtAction(nameof(Listar), new { id = pessoa.Id }, response);
    }

    /// <summary>
    /// DELETE api/pessoas/{id} — remove a pessoa. Graças ao
    /// OnDelete(DeleteBehavior.Cascade) configurado no AppDbContext, o EF Core
    /// remove automaticamente todas as transações vinculadas a essa pessoa.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa is null)
            return NotFound($"Pessoa com id {id} não encontrada.");

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
