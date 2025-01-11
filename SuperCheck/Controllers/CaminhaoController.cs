using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperCheck.Dtos;
using SuperCheck.Entities;
using SuperCheck.Services;

namespace SuperCheck.Controllers;

[Route("caminhoes")]
[Authorize]
public class CaminhaoController: ControllerBase
{
    private readonly ICaminhaoService _caminhaoService;

    public CaminhaoController(ICaminhaoService caminhaoService)
    {
        _caminhaoService = caminhaoService;
    }


    [HttpGet]
    public async Task<ActionResult<PagedOutput<Caminhao>>> GetAll([FromQuery] PagedAndFilteredGetListInput input)
    {
        var caminhaos = await _caminhaoService.GetList(input);
        return Ok(caminhaos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Caminhao>> GetById([FromRoute] Guid id)
    {
        var caminhao = await _caminhaoService.GetById(id);
        return caminhao != null ? Ok(caminhao) : NotFound();
    }

    [HttpPost]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<Caminhao>> Create([FromBody] Caminhao createDto)
    {
        var caminhao = await _caminhaoService.Create(createDto);
        return CreatedAtAction(nameof(GetById), new { id = caminhao.Id }, caminhao);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] Caminhao updateDto)
    {
        var updated = await _caminhaoService.Update(id, updateDto);
        return updated ? Ok() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var deleted = await _caminhaoService.Delete(id);
        return deleted ? Ok() : UnprocessableEntity("Caminhão em uso.");
    }
}