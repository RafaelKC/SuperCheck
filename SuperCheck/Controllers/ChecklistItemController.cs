using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Checklists;
using SuperCheck.Entities;
using SuperCheck.Enums;
using SuperCheck.Extensions;
using SuperCheck.Services;

namespace SuperCheck.Controllers;

[Route("checklists/{checklistId:guid}/items")]
[Authorize]
public class ChecklistItemController : ControllerBase
{
    private readonly IChecklistItemService _checklistItemService;

    public ChecklistItemController(IChecklistItemService checklistItemService)
    {
        _checklistItemService = checklistItemService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedOutput<ChecklistItem>>> GetList([FromRoute] Guid checklistId,
        [FromQuery] PagedAndFilteredGetListInput input)
    {
        return Ok(await _checklistItemService.GetList(checklistId, input));
    }

    [HttpPost]
    [Authorize(Roles = "Supervisor,Executor")]
    public async Task<ActionResult> BacthUpdateItems([FromRoute] Guid checklistId,
        [FromBody] BatchUpdateChecklistItemInput input)
    {
        try
        {
            await _checklistItemService.BatchUpdateItems(checklistId, input.Items);
            return Ok();
        }
        catch (InvalidOperationException e)
        {
            return UnprocessableEntity(e.Message);
        }
    }

    [HttpPatch("{itemId:guid}")]
    [Authorize(Roles = "Supervisor,Executor")]
    public async Task<ActionResult> AvaliarItem([FromRoute] Guid itemId, [FromBody] ItemStatus status)
    {
        try
        {
            var userId = User.GetUserId();
            var avaliado = await _checklistItemService.AvaliarItem(itemId, userId.Value, status);
            return avaliado ? Ok() : NotFound();
        }
        catch (InvalidOperationException e)
        {
            return UnprocessableEntity(e.Message);
        }
    }
}