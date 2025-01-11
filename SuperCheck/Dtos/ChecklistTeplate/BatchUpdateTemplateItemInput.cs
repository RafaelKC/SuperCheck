using SuperCheck.Entities;

namespace SuperCheck.Dtos.ChecklistTeplate;

public class BatchUpdateTemplateItemInput
{
    public List<TemplateItem> Items { get; set; }
}