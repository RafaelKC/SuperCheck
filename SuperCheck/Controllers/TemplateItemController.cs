using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperCheck.Dtos;
using SuperCheck.Dtos.ChecklistTeplate;
using SuperCheck.Entities;
using SuperCheck.Services;

namespace SuperCheck.Controllers;

[Route("checklists/templates/{templateId:guid}/items")]
[Authorize]
public class TemplateItemController: ControllerBase
{
    private readonly ITemplateItemService _templateItemService;

    public TemplateItemController(ITemplateItemService templateItemService)
    {
        _templateItemService = templateItemService;
    }


    [HttpGet]
    public async Task<ActionResult<PagedOutput<ChecklistTemplate>>> GetAll([FromRoute] Guid templateId, [FromQuery] PagedAndFilteredGetListInput input)
    {
        var checklistTemplates = await _templateItemService.GetList(templateId, input);
        return Ok(checklistTemplates);
    }
    
    [HttpPost]
    [Authorize(Roles = "Supervisor")]
    public async Task<ActionResult> BatchUpdateItems([FromRoute] Guid templateId, [FromBody] BatchUpdateTemplateItemInput input)
    {
        await _templateItemService.BatchUpdateItems(templateId, input.Items);
        return Ok();
    }
}