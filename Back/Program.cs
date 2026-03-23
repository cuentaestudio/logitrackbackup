using Back.Application.Services;
using Back.Domain.Repositories;
using Back.Repositories;
using Back.Infrastructure;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrWhiteSpace(origin)) return false;

                if (origin.Equals("http://localhost:5173", StringComparison.OrdinalIgnoreCase))
                    return true;

                if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                    return false;

                if (!uri.Scheme.Equals("https", StringComparison.OrdinalIgnoreCase))
                    return false;

                // Netlify dominio principal + deploy previews dinámicos del mismo sitio.
                return uri.Host.Equals("logitrack-08.netlify.app", StringComparison.OrdinalIgnoreCase)
                    || uri.Host.EndsWith("--logitrack-08.netlify.app", StringComparison.OrdinalIgnoreCase);
            })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddScoped<AuthService>().AddScoped<EnviosService>().AddScoped<RutasService>();
builder.Services.AddScoped<DatabaseSeeder>();

builder.Services.AddSingleton<IUserRepository, LocalUsuariosRepository>().AddSingleton<IEnviosRepository, LocalEnviosRepository>().AddSingleton<IVehiculoRepository, LocalVehiculoRepository>().AddSingleton<IRutasRepository, LocalRutasReposiory>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Habilitar CORS
app.UseCors("AllowFrontend");

// Cargar datos de prueba si está habilitado
var enableSeedData = app.Configuration.GetValue<bool>("Database:EnableSeedData");
if (enableSeedData)
{
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
    }
}

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

app.Run();