using Microsoft.AspNetCore.Mvc;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Categorias;
using SuperCheck.Entities;
using SuperCheck.Services;

namespace SuperCheck.Controllers;

[Route("categorias")]
public class CategoriaController: ControllerBase
{
    private readonly ICategoriaService _categoriaService;

    public CategoriaController(ICategoriaService categoriaService)
    {
        _categoriaService = categoriaService;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedOutput<Categoria>>> GetAll([FromQuery] PagedAndFilteredGetListInput input)
    {
        var categorias = await _categoriaService.GetList(input);
        return Ok(categorias);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Categoria>> GetById([FromRoute] Guid id)
    {
        var categoria = await _categoriaService.GetById(id);
        return categoria != null ? Ok(categoria) : NotFound();
    }

    [HttpPost]
    public async Task<ActionResult<Categoria>> Create([FromBody] CreateCategoriaDTO createDto)
    {
        var categoria = await _categoriaService.Create(createDto);
        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCategoriaDTO updateDto)
    {
        var updated = await _categoriaService.Update(id, updateDto);
        return updated ? Ok() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        await _categoriaService.Delete(id);
        return Ok();
    }
}