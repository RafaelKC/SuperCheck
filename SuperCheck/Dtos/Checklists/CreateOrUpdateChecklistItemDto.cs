namespace SuperCheck.Dtos.Checklists;

public class CreateOrUpdateChecklistItemDto
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public int Order { get; set; }
    public string? Observacao { get; set; }
}