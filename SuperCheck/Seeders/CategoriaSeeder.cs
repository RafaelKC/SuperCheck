using SuperCheck.Entities;
using SuperCheck.Infra;

namespace SuperCheck.Seeders;

public class CategoriaSeeder: ISeeder
{
    private readonly SuperCheckDbContext _context;

    public CategoriaSeeder(SuperCheckDbContext context)
    {
        _context = context;
    }

    public void Seed()
    {
        if (_context.SeederManagers.Any(c => c.CategoriasSeeded)) return;
        
        _context.Categorias.AddRange([
            new Categoria { Descricao = "Entrada caminhão" },
            new Categoria { Descricao = "Saída caminhão" },
            new Categoria { Descricao = "Carregamento caminhão" },
            new Categoria { Descricao = "Descarregamento caminhão" }
        ]);
        _context.SaveChanges();
    }
}