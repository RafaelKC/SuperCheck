using Microsoft.EntityFrameworkCore;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Categorias;
using SuperCheck.Entities;
using SuperCheck.Extensions;
using SuperCheck.Infra;

namespace SuperCheck.Services;

public interface ICategoriaService
{
    Task<PagedOutput<Categoria>> GetList(PagedAndFilteredGetListInput input);
    Task<Categoria?> GetById(Guid id);
    Task<Categoria> Create(CreateCategoriaDTO categoria);
    Task<bool> Update(Guid id, UpdateCategoriaDTO categoria);
    Task Delete(Guid id);
}

public class CategoriaService: ICategoriaService
{
    private readonly SuperCheckDbContext _context;

    public CategoriaService(SuperCheckDbContext context)
    {
        _context = context;
    }
    
    public async Task<PagedOutput<Categoria>> GetList(PagedAndFilteredGetListInput input)
    {
        return await _context.Categorias
            .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), categoria => categoria.Descricao.ToLower().Contains(input.Filter.ToLower()))
            .OrderBy(categoria => categoria.Descricao)
            .ToPagedOutput(input);
    }

    public async Task<Categoria?> GetById(Guid id)
    {
        return await _context.Categorias.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Categoria> Create(CreateCategoriaDTO categoriaDto)
    {
        var categoria = new Categoria
        {
            Descricao = categoriaDto.Descricao,
        };
        
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return categoria;
    }

    public async Task<bool> Update(Guid id, UpdateCategoriaDTO categoria)
    {
        var existingCategoria = await _context.Categorias.FindAsync(id);
        if (existingCategoria == null) return false;
        
        existingCategoria.Descricao = categoria.Descricao;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task Delete(Guid id)
    {
        var categoria = await _context.Categorias.FirstOrDefaultAsync(c => c.Id == id);
        if (categoria == null) return;

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();
    }
}