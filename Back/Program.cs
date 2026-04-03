using Back.Application.Services;
using Back.Domain.Repositories;
using System.Text.Json;
using System.Text.Json.Serialization;
using Back.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Back.Infrastructure.Database.Repositories;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- CONFIGURACIÓN DE SERVICIOS (Dependency Injection) ---

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Configuración de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath)) 
    {
        options.IncludeXmlComments(xmlPath);
    }
});

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Base de Datos
var connectionString = builder.Configuration.GetConnectionString("PostgresConnection");
builder.Services.AddDbContext<LogiTrackDbContext>(options =>
    options.UseNpgsql(connectionString));

// Inyección de Dependencias de la Lógica de Negocio
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<EnviosService>();
builder.Services.AddScoped<RutasService>();
builder.Services.AddScoped<DatabaseSeeder>();

builder.Services.AddScoped<IUserRepository, UsuariosRepository>();
builder.Services.AddScoped<IEnviosRepository, EnviosRepository>();
builder.Services.AddScoped<IVehiculoRepository, VehiculosRepository>();
builder.Services.AddScoped<IRutasRepository, RutasRepository>();

// Configuración de Autenticación JWT
var jwtSecretKey = "Grupo8SuperSecretKeyWithAtLeast32Characters";
var key = Encoding.ASCII.GetBytes(jwtSecretKey);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidIssuer = "LogiTrack",
            ValidateAudience = true,
            ValidAudience = "LogiTrack",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// --- CONFIGURACIÓN DEL PIPELINE DE PETICIONES (HTTP Request Pipeline) ---

// 1. Swagger siempre disponible al inicio
app.UseSwagger();
app.UseSwaggerUI();

// 2. Routing: Crucial para que CORS sepa a qué endpoint va la petición
app.UseRouting();

// 3. CORS: Debe ir después de Routing y ANTES de Auth
app.UseCors("AllowAll");

// 4. Seguridad: Autenticación antes que Autorización
app.UseAuthentication();
app.UseAuthorization();

// 5. Mapeo de Controladores
app.MapControllers();

// --- TAREAS DE INICIO (Migraciones y Seed) ---

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try 
    {
        var context = services.GetRequiredService<LogiTrackDbContext>();
        await context.Database.MigrateAsync();

        var configuration = services.GetRequiredService<IConfiguration>();
        if (configuration.GetValue<bool>("EnableDatabaseSeeder"))
        {
            var seeder = services.GetRequiredService<DatabaseSeeder>();
            await seeder.SeedAsync();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocurrió un error durante la migración o el seeding de la base de datos.");
    }
}
Console.WriteLine($"Verificando modelo...");


void PrintDirectoryTree(string path, string indent)
{
    try
    {
        foreach (var directory in Directory.GetDirectories(path))
        {
            var dirName = Path.GetFileName(directory);
            Console.WriteLine($"{indent}└── {dirName}/");
            PrintDirectoryTree(directory, indent + "    ");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"{indent}[Error accediendo a {path}: {ex.Message}]");
    }
}

Console.WriteLine("Estructura de carpetas desde la raíz del proyecto:");
PrintDirectoryTree(AppContext.BaseDirectory, "");


var model = @"./ML/Models/prioridad_model.zip";
var modelPath = Path.Combine(@"./ML/Models/prioridad_model.zip");

if (File.Exists(modelPath))
{
    Console.WriteLine($"Modelo de ML encontrado en: {modelPath}");
}
else
{
    Console.WriteLine("Advertencia: No se encontró el archivo del modelo de ML en la ruta esperada.");
}


app.Run();// Verificar existencia del modelo de ML en ruta relativa para despliegue
