using Microsoft.EntityFrameworkCore;
using SuperCheck.Dtos;
using SuperCheck.Entities;
using SuperCheck.Extensions;
using SuperCheck.Infra;

namespace SuperCheck.Services;

public interface ITemplateItemService
{
    Task<PagedOutput<TemplateItem>> GetList(Guid templateId, PagedAndFilteredGetListInput input);
    Task BatchUpdateItems(Guid templateId, List<TemplateItem> templateItems);
}

public class TemplateItemService: ITemplateItemService
{
    private readonly SuperCheckDbContext _context;

    public TemplateItemService(SuperCheckDbContext context)
    {
        _context = context;
    }
    
    public async Task<PagedOutput<TemplateItem>> GetList(Guid templateId, PagedAndFilteredGetListInput input)
    {
        return await _context.TemplateItems
            .Where(item => item.TemplateId == templateId)
            .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), templateItem => templateItem.Nome.ToLower().Contains(input.Filter.ToLower()))
            .OrderBy(templateItem => templateItem.Order)
            .ToPagedOutput(input);
    }

    public async Task BatchUpdateItems(Guid templateId, List<TemplateItem> templateItems)
    {
        var existingItems = await _context.TemplateItems
            .Where(item => item.TemplateId == templateId)
            .ToListAsync();

        var itemsToCreate = templateItems
            .Where(newItem => existingItems.All(existingItem => existingItem.Id != newItem.Id))
            .ToList();

        var itemsToUpdate = templateItems
            .Where(newItem => existingItems.Any(existingItem => existingItem.Id == newItem.Id))
            .ToList();

        var itemsToDelete = existingItems
            .Where(existingItem => templateItems.All(newItem => newItem.Id != existingItem.Id))
            .ToList();

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            if (itemsToDelete.Any())
            {
                _context.TemplateItems.RemoveRange(itemsToDelete);
            }
            foreach (var item in itemsToUpdate)
            {
                var existingItem = existingItems.First(e => e.Id == item.Id);
                _context.Entry(existingItem).CurrentValues.SetValues(item);
            }
            foreach (var item in itemsToCreate)
            {
                item.TemplateId = templateId;
                await _context.TemplateItems.AddAsync(item);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}