using Microsoft.EntityFrameworkCore;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Checklists;
using SuperCheck.Entities;
using SuperCheck.Enums;
using SuperCheck.Extensions;
using SuperCheck.Infra;

namespace SuperCheck.Services;

public interface IChecklistItemService
{
    Task<PagedOutput<ChecklistItem>> GetList(Guid checklistId, PagedAndFilteredGetListInput input);
    Task BatchUpdateItems(Guid checklistId, List<CreateOrUpdateChecklistItemDto> checklistItems);
    Task<bool> AvaliarItem(Guid itemId, Guid executorId, ItemStatus status);
}

public class ChecklistItemService: IChecklistItemService
{
    private readonly SuperCheckDbContext _context;

    public ChecklistItemService(SuperCheckDbContext context)
    {
        _context = context;
    }
    
    public async Task<PagedOutput<ChecklistItem>> GetList(Guid checklistId, PagedAndFilteredGetListInput input)
    {
        return await _context.ChecklistItems
            .Where(item => item.ChecklistId == checklistId)
            .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), checklistItem => checklistItem.Nome.ToLower().Contains(input.Filter.ToLower()))
            .OrderBy(checklistItem => checklistItem.Order)
            .ToPagedOutput(input);
    }

    public async Task BatchUpdateItems(Guid checklistId, List<CreateOrUpdateChecklistItemDto> checklistItems)
    {
        if (await _context.Checklists.AnyAsync(c => c.Id == checklistId && c.Status != ChecklistStatus.Aberta))
            throw new InvalidOperationException("Checklist deve estar aberta para atualizar itens.");
        
        var existingItems = await _context.ChecklistItems
            .Where(item => item.ChecklistId == checklistId)
            .ToListAsync();

        var itemsToCreate = checklistItems
            .Where(newItem => existingItems.All(existingItem => existingItem.Id != newItem.Id))
            .Select(newItem => new ChecklistItem
            {
                ChecklistId = checklistId,
                Nome = newItem.Nome,
                Observacao = newItem.Observacao,
                Order = newItem.Order,
                Status = ItemStatus.NaoAvaliada,
            })
            .ToList();

        var itemsToUpdate = checklistItems
            .Where(newItem => existingItems.Any(existingItem => existingItem.Id == newItem.Id))
            .Select(newItem => new ChecklistItem
            {
                Id = newItem.Id,
                ChecklistId = checklistId,
                Nome = newItem.Nome,
                Observacao = newItem.Observacao,
                Order = newItem.Order,
                Status = ItemStatus.NaoAvaliada,
            })
            .ToList();

        var itemsToDelete = existingItems
            .Where(existingItem => checklistItems.All(newItem => newItem.Id != existingItem.Id))
            .ToList();

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            if (itemsToDelete.Any())
            {
                _context.ChecklistItems.RemoveRange(itemsToDelete);
            }
            foreach (var item in itemsToUpdate)
            {
                var existingItem = existingItems.First(e => e.Id == item.Id);
                _context.Entry(existingItem).CurrentValues.SetValues(item);
            }
            await _context.ChecklistItems.AddRangeAsync(itemsToCreate);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> AvaliarItem(Guid itemId, Guid executorId, ItemStatus status)
    {
        var item = await _context.ChecklistItems.FirstOrDefaultAsync(i => i.Id == itemId);
        if (item == null) return false;

        var checklist = await _context.Checklists.FirstAsync(c => c.Id == item.ChecklistId);
        if (checklist.Status != ChecklistStatus.EmProgresso)
            throw new InvalidOperationException("Checklist deve estar em progresso para avaliar item.");
        if(checklist.ExecutorId != executorId)
            throw new InvalidOperationException("Apenas o executor do checklist pode avaliar um item..");
        
        item.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }
}