namespace SuperCheck.Dtos.ChecklistTeplate;

public class GetChecklistTeplateListInput: PagedAndFilteredGetListInput
{
    public List<Guid>? CategoriasIds { get; set; } = new();
}