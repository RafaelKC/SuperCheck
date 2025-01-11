using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Checklists;
using SuperCheck.Entities;
using SuperCheck.Extensions;
using SuperCheck.Services;

namespace SuperCheck.Controllers;

[Route("checklists")]
[Authorize]
public class ChecklistController: ControllerBase
{ 
    private readonly IChecklistService _checklistService;

    public ChecklistController(IChecklistService checklistService)
    {
        _checklistService = checklistService;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedOutput<Checklist>>> GetList([FromQuery] GetChecklistListInput input)
    {
        return Ok(await _checklistService.GetList(input));
    }
    
    [HttpGet("{checklistId:guid}")]
    public async Task<ActionResult<Checklist>> GetById([FromRoute] Guid checklistId)
    {
        var checklist = await _checklistService.GetById(checklistId);
        return checklist != null ? Ok(checklist) : NotFound();
    }
    
    [HttpPost]
    [Authorize(Roles = "Supervisor,Executor")]
    public async Task<ActionResult<Checklist>> Create([FromBody] CreateChecklistDto checklistDto)
    {
        var checklist = await _checklistService.Create(checklistDto);
        return CreatedAtAction(nameof(GetById), new { checklistId = checklist.Id }, checklist);
    }
    
    [HttpPut("{checklistId:guid}")]
    [Authorize(Roles = "Supervisor,Executor")]
    public async Task<ActionResult> Update([FromRoute] Guid checklistId, [FromBody] UpdateChecklistDto checklistDto)
    {
        try
        {
            var update = await _checklistService.Update(checklistId, checklistDto);
            return update ? Ok() : NotFound();
        }
        catch (InvalidOperationException e)
        {
            return UnprocessableEntity(e.Message);
        }
    }
    
    [HttpDelete("{checklistId:guid}")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult> Delete([FromRoute] Guid checklistId)
    {
        await _checklistService.Delete(checklistId);
        return Ok();
    }
    
    [HttpPatch("{checklistId:guid}/iniciar")]
    [Authorize(Roles = "Supervisor,Executor")]
    public async Task<ActionResult> IniciarExecucao([FromRoute] Guid checklistId)
    {
        try
        {
            var update = await _checklistService.IniciarExecucao(checklistId, User.GetUserId().Value);
            return update ? Ok() : NotFound();
        }
        catch (InvalidOperationException e)
        {
            return UnprocessableEntity(e.Message);
        }
    }
    
    [HttpPatch("{checklistId:guid}/finalizar")]
    [Authorize(Roles = "Supervisor,Executor")]
    public async Task<ActionResult> Finalizar([FromRoute] Guid checklistId)
    {
        try
        {
            var update = await _checklistService.Finalizar(checklistId, User.GetUserId().Value);
            return update ? Ok() : NotFound();
        }
        catch (InvalidOperationException e)
        {
            return UnprocessableEntity(e.Message);
        }
    }
    
    [HttpPatch("{checklistId:guid}/aprovar")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult> Aprovar([FromRoute] Guid checklistId)
    {
        try
        {
            var update = await _checklistService.Aprovar(checklistId, User.GetUserId().Value);
            return update ? Ok() : NotFound();
        }
        catch (InvalidOperationException e)
        {
            return UnprocessableEntity(e.Message);
        }
    }
    
    [HttpPatch("{checklistId:guid}/reprovar")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult> Reprovar([FromRoute] Guid checklistId, [FromBody] string observacao)
    {
        try
        {
            var update = await _checklistService.Reprovar(checklistId, User.GetUserId().Value, observacao);
            return update ? Ok() : NotFound();
        }
        catch (InvalidOperationException e)
        {
            return UnprocessableEntity(e.Message);
        }
    }
    
    [HttpPatch("{checklistId:guid}/cancelar")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult> Cancelar([FromRoute] Guid checklistId)
    {
        var update = await _checklistService.Cancelar(checklistId, User.GetUserId().Value);
        return update ? Ok() : NotFound();
    }
    
    [HttpPatch("{checklistId:guid}/reabrir")]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult> Reabrir([FromRoute] Guid checklistId)
    {
        var update = await _checklistService.Reabrir(checklistId, User.GetUserId().Value);
        return update ? Ok() : NotFound();
    }
}