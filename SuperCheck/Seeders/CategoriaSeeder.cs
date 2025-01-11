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
        var seederManager = _context.SeederManagers.First();
        if (seederManager.CategoriasSeeded) return;
        
        _context.Categorias.AddRange([
            new Categoria { Descricao = "Entrada caminhão" },
            new Categoria { Descricao = "Saída caminhão" },
            new Categoria { Descricao = "Carregamento caminhão" },
            new Categoria { Descricao = "Descarregamento caminhão" }
        ]);
        seederManager.CategoriasSeeded = true;
        _context.SaveChanges();
    }
}