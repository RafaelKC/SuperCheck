using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperCheck.Dtos;
using SuperCheck.Dtos.ChecklistTeplate;
using SuperCheck.Entities;
using SuperCheck.Services;

namespace SuperCheck.Controllers;

[Route("checklists/templates")]
[Authorize]
public class ChecklistTemplateController: ControllerBase
{
    private readonly IChecklistTemplateService _checklistTemplateService;

    public ChecklistTemplateController(IChecklistTemplateService checklistTemplateService)
    {
        _checklistTemplateService = checklistTemplateService;
    }


    [HttpGet]
    public async Task<ActionResult<PagedOutput<ChecklistTemplate>>> GetAll([FromQuery] GetChecklistTeplateListInput input)
    {
        var checklistTemplates = await _checklistTemplateService.GetList(input);
        return Ok(checklistTemplates);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ChecklistTemplate>> GetById([FromRoute] Guid id)
    {
        var checklistTemplate = await _checklistTemplateService.GetById(id);
        return checklistTemplate != null ? Ok(checklistTemplate) : NotFound();
    }

    [HttpPost]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult<ChecklistTemplate>> Create([FromBody] ChecklistTemplate createDto)
    {
        var checklistTemplate = await _checklistTemplateService.Create(createDto);
        return CreatedAtAction(nameof(GetById), new { id = checklistTemplate.Id }, checklistTemplate);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] ChecklistTemplate updateDto)
    {
        var updated = await _checklistTemplateService.Update(id, updateDto);
        return updated ? Ok() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Supervisor")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        await _checklistTemplateService.Delete(id);
        return Ok();
    }
}