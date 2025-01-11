namespace SuperCheck.Dtos.Checklists;

public class UpdateChecklistDto
{
    public Guid? CategoriaId { get; set; }
    public Guid CaminhaoId { get; set; }
    public Guid MotoristaId { get; set; }
    public DateTime Data { get; set; }
    public string Observacao { get; set; }
}