using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client.Platforms.Features.DesktopOs.Kerberos;
using SuperCheck.Dtos;
using SuperCheck.Dtos.Usuarios;
using SuperCheck.Entities;
using SuperCheck.Enums;
using SuperCheck.Extensions;
using SuperCheck.Helpes;
using SuperCheck.Infra;

namespace SuperCheck.Services;

public interface IUsuarioService
{
    public Task<PagedOutput<Usuario>> GetList(GetUsuarioListInput input);
    public Task<Usuario?> GetById(Guid id);
    
    public Task<Usuario> Create(CreateUsuarioDto input);
    public Task<Usuario> CreateMotorista(CreateMoristaDto input);
}

public class UsuarioService: IUsuarioService
{
    private readonly SuperCheckDbContext _context;

    public UsuarioService(SuperCheckDbContext context)
    {
        _context = context;
    }

    public async Task<PagedOutput<Usuario>> GetList(GetUsuarioListInput input)
    {
        return await _context.Usuarios
            .WhereIf(!string.IsNullOrWhiteSpace(input.Filter), usuario => usuario.Nome.ToLower().Contains(input.Filter.ToLower()))
            .WhereIf(input.Roles != null && input.Roles.Any(), usuario => input.Roles.Contains(usuario.Role))
            .OrderBy(categoria => categoria.Nome)
            .ToPagedOutput(input);
    }

    public async Task<Usuario?> GetById(Guid id)
    {
        return await _context.Usuarios.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<Usuario> Create(CreateUsuarioDto input)
    {
        var usuario = new Usuario
        {
            Nome = input.Nome,
            Role = input.Role,
            Id = Guid.NewGuid(),
        };
        var credential = input.Credential == null ? null : new UserCredential
        {
            UserId = usuario.Id,
            Login = input.Credential.Login,
            Password = EncryptHelper.Hash(input.Credential.Password)
        };
        
        _context.Usuarios.Add(usuario);
        if (credential != null) _context.UserCredentials.Add(credential);
        
        await _context.SaveChangesAsync();

        return usuario;
    }

    public async Task<Usuario> CreateMotorista(CreateMoristaDto input)
    {
        return await Create(new CreateUsuarioDto
        {
            Nome = input.Nome,
            Role = UsuarioRole.Motorista
        });
    }
}