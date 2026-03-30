using Back.Application.Services;
using Back.Domain.Repositories;
using System.Text.Json;
using System.Text.Json.Serialization;
using Back.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Back.Infrastructure.Database.Repositories;

using System.Reflection;
using Microsoft.Extensions.ML;
using Back.Application.Abstractions;
using Back.Ml.Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen(options =>
{
    // 1. Obtener el nombre del archivo XML (suele ser NombreDeTuProyecto.xml)
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

    // 2. Decirle a Swagger que lo use
    options.IncludeXmlComments(xmlPath);
});


// Registrar el PredictionEnginePool
builder.Services.AddPredictionEnginePool<PaqueteData, PrioridadPrediction>()
    .FromFile("./ML/Models/prioridad_model.zip");
builder.Services.AddScoped<IMLPrioridadPrediction, MLNetPrioridadService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");

Console.WriteLine($"Connection String: {connectionString}"); // Agrega esta línea para verificar la cadena de conexión

// Configurar EF Core con PostgreSQL
builder.Services.AddDbContext<LogiTrackDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<AuthService>().AddScoped<EnviosService>().AddScoped<RutasService>();
builder.Services.AddScoped<DatabaseSeeder>();

builder.Services.AddScoped<IUserRepository, UsuariosRepository>().AddScoped<IEnviosRepository, EnviosRepository>().AddScoped<IVehiculoRepository, VehiculosRepository>().AddScoped<IRutasRepository, RutasRepository>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

// Habilitar CORS
app.UseCors("AllowAll");

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    
    var context = services.GetRequiredService<LogiTrackDbContext>();
    // 1. Esto CREA las tablas basadas en tus clases C#
    await context.Database.MigrateAsync();

    // 2. Esto CARGA los datos iniciales

    var configuration = services.GetRequiredService<IConfiguration>();
    
    if (configuration.GetValue<bool>("EnableDatabaseSeeder"))
    {

        var seeder = services.GetRequiredService<DatabaseSeeder>();

        await seeder.SeedAsync();
    }
}

app.Run();