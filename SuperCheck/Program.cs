using Microsoft.EntityFrameworkCore;
using SuperCheck.Extensions;
using SuperCheck.Infra;
using SuperCheck.Infra.Authentication;

void ConfigureServices(IServiceCollection services, IConfiguration configuration)
{
    services.AddDbContext<SuperCheckDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("SuperCheck")
            ))
        .AddSuperCheckTransients()
        .AddSuperChackAuthentication(configuration)
        .AddCors(options =>
        {
            options.AddDefaultPolicy(policyBuilder =>
            {
                policyBuilder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        })
        .AddControllers();
    services.AddOpenApi();
    services.AddSwaggerGen();
}


void ConfigureMiddleware(WebApplication app)
{
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
        app.MapOpenApi();
    }

    app.UseHttpsRedirection();
    app.MapControllers();

    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<SuperCheckDbContext>();
        dbContext.Database.Migrate();
    }
    app.UseSeeders();
    
    app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    app.UseAuthentication();
    app.UseAuthorization();
}

var builder = WebApplication.CreateBuilder(args);
ConfigureServices(builder.Services, builder.Configuration);

var app = builder.Build();
ConfigureMiddleware(app);

app.Run();
