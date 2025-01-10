using SuperCheck.Seeders;
using SuperCheck.Services;

namespace SuperCheck.Extensions;

public static class AppBuilderExtensions
{
    public static void AddSuperCheckTransients(this WebApplicationBuilder builder)
    {
        builder.Services.AddTransient<ICategoriaService, CategoriaService>();
        
        var seederTypes = typeof(Program).Assembly.GetTypes()
            .Where(t => typeof(ISeeder).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

        foreach (var seederType in seederTypes)
        {
            builder.Services.AddTransient(seederType);
        }
    }

    public static void UseSeeders(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var seeders = new List<Type>
            {
                typeof(SeederManagerSeeder),
                typeof(CategoriaSeeder)
            };
            
            var serviceProvider = scope.ServiceProvider;
            foreach (var seederType in seeders)
            {
                var seeder = (ISeeder)serviceProvider.GetRequiredService(seederType);
                seeder.Seed();
            }
        }
    }
}