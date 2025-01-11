using Microsoft.EntityFrameworkCore;
using SuperCheck.Dtos;
using SuperCheck.Entities;
using SuperCheck.Extensions;
using SuperCheck.Infra;

namespace SuperCheck.Services;

public interface ICaminhaoService
{
    Task<PagedOutput<Caminhao>> GetList(PagedAndFilteredGetListInput input);
    Task<Caminhao?> GetById(Guid id);
    Task<Caminhao> Create(Caminhao caminhao);
    Task<bool> Update(Guid id, Caminhao caminhao);
    Task<bool> Delete(Guid id);
}

public class CaminhaoService: ICaminhaoService
{
    private readonly SuperCheckDbContext _context;

    public CaminhaoService(SuperCheckDbContext context)
    {
        _context = context;
    }
    
    public async Task<PagedOutput<Caminhao>> GetList(PagedAndFilteredGetListInput input)
    {
        return await _context.Caminhoes
            .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), caminhao => caminhao.Descricao.ToLower().Contains(input.Filter.ToLower()) || caminhao.Placa.ToLower().Contains(input.Filter.ToLower()))
            .OrderBy(caminhao => caminhao.Descricao)
            .ToPagedOutput(input);
    }

    public async Task<Caminhao?> GetById(Guid id)
    {
        return await _context.Caminhoes.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Caminhao> Create(Caminhao caminhao)
    {
        _context.Caminhoes.Add(caminhao);
        await _context.SaveChangesAsync();

        return caminhao;
    }

    public async Task<bool> Update(Guid id, Caminhao caminhao)
    {
        var existingCaminhao = await _context.Caminhoes.FindAsync(id);
        if (existingCaminhao == null) return false;
        
        existingCaminhao.Descricao = caminhao.Descricao;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> Delete(Guid id)
    {
        var caminhao = await _context.Caminhoes.FirstOrDefaultAsync(c => c.Id == id);
        if (caminhao == null) return true;

        try
        {
            _context.Caminhoes.Remove(caminhao);
            await _context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return false;
        }
        return true;
    }
}