using SuperCheck.Enums;

namespace SuperCheck.Dtos.Checklists;

public class GetChecklistListInput: PagedAndFilteredGetListInput
{
    public List<Guid>? CategoriasIds { get; set; }
    public List<Guid>? CaminhoesIds { get; set; }
    public List<Guid>? MotoristasIds { get; set; }
    public DateTime? Data { get; set; }
    public List<ChecklistStatus>? Statuses { get; set; }
}