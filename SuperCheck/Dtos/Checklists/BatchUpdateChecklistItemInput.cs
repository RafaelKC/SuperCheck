namespace SuperCheck.Dtos.Checklists;

public class BatchUpdateChecklistItemInput
{
    public List<CreateOrUpdateChecklistItemDto> Items {get;set;} = new();
}