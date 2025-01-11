using SuperCheck.Entities;
using SuperCheck.Enums;
using SuperCheck.Helpes;
using SuperCheck.Infra;

namespace SuperCheck.Seeders;

public class UserAdminSeeder: ISeeder
{
    private readonly SuperCheckDbContext _context;

    public UserAdminSeeder(SuperCheckDbContext context)
    {
        _context = context;
    }

    public void Seed()
    {
        var seederManager = _context.SeederManagers.First();
        if (seederManager.UserSeeded) return;

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Nome = "admin",
            Role = UsuarioRole.Supervisor
        };
        var credentials = new UserCredential
        {
            UserId = usuario.Id,
            Login = usuario.Nome,
            Password = EncryptHelper.Hash("123qwe"),
        };
        
        _context.Usuarios.AddRange(usuario);
        _context.UserCredentials.AddRange(credentials);
        seederManager.UserSeeded = true;
        _context.SaveChanges();
    }
}