using Microsoft.EntityFrameworkCore;
using SuperCheck.Dtos;
using SuperCheck.Dtos.ChecklistTeplate;
using SuperCheck.Entities;
using SuperCheck.Extensions;
using SuperCheck.Infra;

namespace SuperCheck.Services;

public interface IChecklistTemplateService
{
    Task<PagedOutput<ChecklistTemplate>> GetList(GetChecklistTeplateListInput input);
    Task<ChecklistTemplate?> GetById(Guid id);
    Task<ChecklistTemplate> Create(ChecklistTemplate checklistTemplate);
    Task<bool> Update(Guid id, ChecklistTemplate checklistTemplate);
    Task Delete(Guid id);
}

public class ChecklistTemplateService: IChecklistTemplateService
{
    private readonly SuperCheckDbContext _context;

    public ChecklistTemplateService(SuperCheckDbContext context)
    {
        _context = context;
    }
    
    public async Task<PagedOutput<ChecklistTemplate>> GetList(GetChecklistTeplateListInput input)
    {
        return await _context.Templates
            .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), checklistTemplate => checklistTemplate.Nome.ToLower().Contains(input.Filter.ToLower()))
            .WhereIf(input.CategoriasIds != null && input.CategoriasIds.Any(), c => c.CategoriaId.HasValue && input.CategoriasIds.Contains(c.CategoriaId.Value))
            .OrderBy(checklistTemplate => checklistTemplate.Nome)
            .ToPagedOutput(input);
    }

    public async Task<ChecklistTemplate?> GetById(Guid id)
    {
        return await _context.Templates.Include(c => c.Items).FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<ChecklistTemplate> Create(ChecklistTemplate checklistTemplate)
    {
        _context.Templates.Add(checklistTemplate);
        await _context.SaveChangesAsync();

        return checklistTemplate;
    }

    public async Task<bool> Update(Guid id, ChecklistTemplate checklistTemplate)
    {
        var existingChecklistTemplate = await _context.Templates.FindAsync(id);
        if (existingChecklistTemplate == null) return false;
        
        existingChecklistTemplate.Nome = checklistTemplate.Nome;
        existingChecklistTemplate.CategoriaId = checklistTemplate.CategoriaId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task Delete(Guid id)
    {
        var checklistTemplate = await _context.Templates.FirstOrDefaultAsync(c => c.Id == id);
        if (checklistTemplate == null) return;
        
        _context.Templates.Remove(checklistTemplate);
        await _context.SaveChangesAsync();
    }
}