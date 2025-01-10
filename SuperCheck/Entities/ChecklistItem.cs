using SuperCheck.Enums;

namespace SuperCheck.Entities;

public class ChecklistItem
{
    public Guid Id { get; set; }
    public Guid ChecklistId { get; set; }
    public string Nome { get; set; }
    public string Observacao { get; set; }
    public ItemStatus Status { get; set; }
}