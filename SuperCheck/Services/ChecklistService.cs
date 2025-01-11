using Microsoft.EntityFrameworkCore;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Checklists;
using SuperCheck.Entities;
using SuperCheck.Enums;
using SuperCheck.Extensions;
using SuperCheck.Infra;

namespace SuperCheck.Services;

public interface IChecklistService
{
    Task<PagedOutput<Checklist>> GetList(GetChecklistListInput input);
    Task<Checklist?> GetById(Guid id);
    Task<Checklist> Create(CreateChecklistDto checklist);
    Task<bool> Update(Guid id, UpdateChecklistDto checklist);
    Task Delete(Guid id);

    Task<bool> IniciarExecucao(Guid id, Guid executorId);
    Task<bool> Finalizar(Guid id, Guid executorId);
    Task<bool> Aprovar(Guid id, Guid supervisorId);
    Task<bool> Reprovar(Guid id, Guid supervisorId, string observacao);
    Task<bool> Cancelar(Guid id, Guid supervisorId);
    Task<bool> Reabrir(Guid id, Guid supervisorId);
}

public class ChecklistService : IChecklistService
{
    private readonly SuperCheckDbContext _context;

    public ChecklistService(SuperCheckDbContext context)
    {
        _context = context;
    }

    public async Task<PagedOutput<Checklist>> GetList(GetChecklistListInput input)
    {
        DateTime? startDateFilter = !input.Data.HasValue
            ? null
            : new DateTime(input.Data.Value.Year, input.Data.Value.Month, input.Data.Value.Day, 0, 0, 0);
        DateTime? endDateFilter = !input.Data.HasValue
            ? null
            : new DateTime(input.Data.Value.Year, input.Data.Value.Month, input.Data.Value.Day, 23, 59, 59);

        return await _context.Checklists
            .WhereIf(!string.IsNullOrWhiteSpace(input.Filter),
                checklistTemplate => checklistTemplate.Observacao.ToLower().Contains(input.Filter.ToLower()))
            .WhereIf(input.CategoriasIds != null && input.CategoriasIds.Any(),
                c => c.CategoriaId.HasValue && input.CategoriasIds.Contains(c.CategoriaId.Value))
            .WhereIf(input.CaminhoesIds != null && input.CaminhoesIds.Any(),
                c => input.CaminhoesIds.Contains(c.CaminhaoId))
            .WhereIf(input.MotoristasIds != null && input.MotoristasIds.Any(),
                c => input.MotoristasIds.Contains(c.MotoristaId))
            .WhereIf(input.Statuses != null && input.Statuses.Any(), c => input.Statuses.Contains(c.Status))
            .WhereIf(input.Data.HasValue, c => startDateFilter <= c.Data && c.Data <= endDateFilter)
            .OrderBy(checklistTemplate => checklistTemplate.Data)
            .ToPagedOutput(input);
    }

    public async Task<Checklist?> GetById(Guid id)
    {
        return await _context.Checklists
            .Include(c => c.Items)
            .Include(c => c.Categoria)
            .Include(c => c.Executor)
            .Include(c => c.Motorista)
            .Include(c => c.Caminhao)
            .Include(c => c.Supervisor)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Checklist> Create(CreateChecklistDto checklistDto)
    {
        var checklist = new Checklist
        {
            CategoriaId = checklistDto.CategoriaId,
            TemplateId = checklistDto.TemplateId,
            CaminhaoId = checklistDto.CaminhaoId,
            MotoristaId = checklistDto.MotoristaId,
            Data = checklistDto.Data,
            Observacao = checklistDto.Observacao,
            Status = ChecklistStatus.Aberta,
            Id = Guid.NewGuid(),
        };

        if (checklistDto.TemplateId.HasValue)
        {
            var template = await _context.Templates
                .Include(t => t.Items)
                .FirstOrDefaultAsync(t => t.Id == checklistDto.TemplateId.Value);
            if (template != null)
            {
                checklist.CategoriaId ??= template.CategoriaId;
                checklist.Items = template.Items.Select(i => new ChecklistItem
                {
                    Status = ItemStatus.NaoAvaliada,
                    Observacao = i.Observacao,
                    Nome = i.Nome,
                    Order = i.Order,
                    ChecklistId = checklist.Id,
                }).ToList();
            }
        }

        _context.Checklists.Add(checklist);
        await _context.SaveChangesAsync();
        return checklist;
    }

    public async Task<bool> Update(Guid id, UpdateChecklistDto checklistDto)
    {
        var checklist = await _context.Checklists.FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return false;

        if (checklist.Status != ChecklistStatus.Aberta && checklist.Status != ChecklistStatus.EmProgresso)
        {
            throw new InvalidOperationException("Checklist deve estar aberta ou em progresso para ser atualizada.");
        }
        
        checklist.CategoriaId = checklistDto.CategoriaId;
        checklist.CaminhaoId = checklistDto.CaminhaoId;
        checklist.MotoristaId = checklistDto.MotoristaId;
        checklist.Data = checklistDto.Data;
        checklist.Observacao = checklistDto.Observacao;
        
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task Delete(Guid id)
    {
        var checklist = await _context.Checklists.FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return;
        
        _context.Checklists.Remove(checklist);
    }

    public async Task<bool> IniciarExecucao(Guid id, Guid executorId)
    {
        var checklist = await _context.Checklists.FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return false;

        if (checklist.Status != ChecklistStatus.Aberta)
            throw new InvalidOperationException("Apenas checklists abertos podem ser iniciados.");

        checklist.ExecutorId = executorId;
        checklist.Status = ChecklistStatus.EmProgresso;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Finalizar(Guid id, Guid executorId)
    {
        var checklist = await _context.Checklists.Include(c => c.Items).FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return false;

        if (checklist.Status != ChecklistStatus.EmProgresso)
            throw new InvalidOperationException("Apenas checklists em progresso podem ser finalizados.");

        if (checklist.ExecutorId != executorId)
            throw new UnauthorizedAccessException("Apenas o executor do checklist pode finalizá-lo.");

        if (checklist.Items.Any(i => i.Status == ItemStatus.NaoAvaliada))
            throw new InvalidOperationException("Todos os itens devem ser avaliados antes de finalizar.");

        checklist.Status = ChecklistStatus.Completa;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Aprovar(Guid id, Guid supervisorId)
    {
        var checklist = await _context.Checklists.FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return false;

        if (checklist.Status != ChecklistStatus.Completa)
            throw new InvalidOperationException("Apenas checklists completos podem ser aprovados.");

        checklist.Status = ChecklistStatus.Completa;
        checklist.SupervisorId = supervisorId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Reprovar(Guid id, Guid supervisorId, string observacao)
    {
        var checklist = await _context.Checklists.FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return false;

        if (checklist.Status != ChecklistStatus.Completa)
            throw new InvalidOperationException("Apenas checklists completos podem ser reprovados.");

        checklist.Status = ChecklistStatus.NaoAprovada;
        checklist.ObservacaoReprovacao = observacao;
        checklist.SupervisorId = supervisorId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Cancelar(Guid id, Guid supervisorId)
    {
        var checklist = await _context.Checklists.FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return false;

        checklist.Status = ChecklistStatus.Cancelada;
        checklist.SupervisorId = supervisorId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Reabrir(Guid id, Guid supervisorId)
    {
        var checklist = await _context.Checklists.FirstOrDefaultAsync(c => c.Id == id);
        if (checklist == null) return false;

        checklist.Status = ChecklistStatus.Aberta;
        checklist.ObservacaoReprovacao = null;
        checklist.ExecutorId = null;
        checklist.SupervisorId = supervisorId;
        
        await _context.ChecklistItems
            .Where(i => i.ChecklistId == id)
            .ExecuteUpdateAsync(update => update.SetProperty(i => i.Status, ItemStatus.NaoAvaliada));
        
        await _context.SaveChangesAsync();
        return true;
    }
}