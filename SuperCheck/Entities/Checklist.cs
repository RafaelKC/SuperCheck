using SuperCheck.Enums;

namespace SuperCheck.Entities;

public class Checklist
{
    public Guid Id { get; set; }
    public Guid CategoriaId { get; set; }
    public Guid? TemplateId { get; set; }
    public Guid CaminhaoId { get; set; }
    public Guid MotoristaId { get; set; }
    public Guid? ExecutorId { get; set; }
    public DateTime Data { get; set; }
    public string Observacao { get; set; }
    public ChecklistStatus Status { get; set; }
    
    public virtual Categoria Categoria { get; set; }
    public virtual ChecklistTemplate Template { get; set; }
    public virtual Caminhao Caminhao { get; set; }
    public virtual Usuario Motorista { get; set; }
    public virtual Usuario Executor { get; set; }
    public virtual ICollection<ChecklistItem> Items { get; set; }
}