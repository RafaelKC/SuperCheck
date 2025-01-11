using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace SuperCheck.Infra.Authentication;

public static class AddAuthenticationExtension
{
    public static IServiceCollection AddSuperChackAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<ITokensService, TokensService>();
        services.AddTransient<ILoginService, LoginService>();
        
        var key = Encoding.ASCII.GetBytes(configuration["AuthSecrete"]);
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
            };
        });
        
        return services;
    }
}