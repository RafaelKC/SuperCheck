namespace SuperCheck.Entities;

public class TemplateItem
{
    public Guid Id { get; set; }
    public Guid TemplateId { get; set; }
    public string Nome { get; set; }
    public string Observacao { get; set; }
}