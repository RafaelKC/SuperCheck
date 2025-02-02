﻿using SuperCheck.Infra.Authentication;
using SuperCheck.Seeders;
using SuperCheck.Services;

namespace SuperCheck.Extensions;

public static class AppBuilderExtensions
{
    public static IServiceCollection AddSuperCheckTransients(this IServiceCollection services)
    {
        services.AddTransient<ICategoriaService, CategoriaService>();
        services.AddTransient<IUsuarioService, UsuarioService>();
        services.AddTransient<ICaminhaoService, CaminhaoService>();
        services.AddTransient<IChecklistTemplateService, ChecklistTemplateService>();
        services.AddTransient<ITemplateItemService, TemplateItemService>();
        services.AddTransient<IChecklistService, ChecklistService>();
        services.AddTransient<IChecklistItemService, ChecklistItemService>();
        
        var seederTypes = typeof(Program).Assembly.GetTypes()
            .Where(t => typeof(ISeeder).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

        foreach (var seederType in seederTypes)
        {
            services.AddTransient(seederType);
        }
        
        return services;
    }

    public static void UseSeeders(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var seeders = new List<Type>
            {
                typeof(SeederManagerSeeder),
                typeof(CategoriaSeeder),
                typeof(UserAdminSeeder)
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