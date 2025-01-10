namespace SuperCheck.Entities;

public class ChecklistTemplate
{
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public Guid CategoriaId { get; set; }

    public virtual Categoria Categoria { get; set; }
    public virtual ICollection<TemplateItem> Items { get; set; }
}