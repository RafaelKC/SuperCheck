using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SuperCheck.Entities;
using SuperCheck.Enums;

namespace SuperCheck.Infra.Authentication;

public interface ITokensService
{
    public string GenerateToken(Usuario usuario);
}

public class TokensService: ITokensService
{
    private readonly IConfiguration _configuration;

    public TokensService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Usuario usuario)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["AuthSecrete"]);
        
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new []
            {
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Role, usuario.Role.ToString()),
                new Claim("Id", usuario.Id.ToString()),
            }),
            Expires = DateTime.UtcNow.AddDays(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
    }

    private string GetRoleDescription(UsuarioRole role)
    {
        return role switch
        {
            UsuarioRole.Motorista => "Motorista",
            UsuarioRole.Executor => "Executor",
            UsuarioRole.Supervisor => "Supervisor",
            _ => throw new ArgumentOutOfRangeException(nameof(role), role, null)
        };
    }
}