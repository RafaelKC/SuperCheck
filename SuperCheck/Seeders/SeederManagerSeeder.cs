using SuperCheck.Entities;
using SuperCheck.Infra;

namespace SuperCheck.Seeders;

public class SeederManagerSeeder: ISeeder
{
    private readonly SuperCheckDbContext _context;

    public SeederManagerSeeder(SuperCheckDbContext context)
    {
        _context = context;
    }

    public void Seed()
    {
        if (_context.SeederManagers.Any()) return;
        
        _context.SeederManagers.Add(new SeederManager());
        _context.SaveChanges();
    }
}