using Microsoft.EntityFrameworkCore;
using SuperCheck.Helpes;
using SuperCheck.Infra.Authentication.Dtos;

namespace SuperCheck.Infra.Authentication;

public interface ILoginService
{
    public Task<LoginOutput> Login(LoginInput input);
}

public class LoginService: ILoginService
{
    private readonly SuperCheckDbContext _context;
    private readonly ITokensService _tokensService;

    public LoginService(SuperCheckDbContext context, ITokensService tokensService)
    {
        _context = context;
        _tokensService = tokensService;
    }

    public async Task<LoginOutput> Login(LoginInput input)
    {
       var credential = await _context.UserCredentials
           .Include(u => u.Usuario)
           .FirstOrDefaultAsync(u => u.Login == input.Login);
       
       if (credential == null) return new LoginOutput{ Success = false };
       var passwordMatch = EncryptHelper.Verify(input.Password, credential.Password);
       if (!passwordMatch) return new LoginOutput{ Success = false };

       var token = _tokensService.GenerateToken(credential.Usuario);
       return new LoginOutput { Success = true, Token = token };
    }
}