using SuperCheck.Services;

namespace SuperCheck.Extensions;

public static class AppBuilderExtensions
{
    public static void AddSuperCheckSingletons(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<ICategoriaService, CategoriaService>();
    }
}