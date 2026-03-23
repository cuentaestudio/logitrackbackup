using Back.Application.Services;
using Back.Domain.Repositories;
using Back.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Configurar CORS para permitir requests desde el frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Puerto de desarrollo de Vite
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddScoped<AuthService>().AddScoped<EnviosService>().AddScoped<RutasService>();


builder.Services.AddSingleton<IUserRepository, LocalUsuariosRepository>().AddSingleton<IEnviosRepository, LocalEnviosRepository>().AddSingleton<IVehiculoRepository, LocalVehiculoRepository>().AddSingleton<IRutasRepository, LocalRutasReposiory>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Habilitar CORS
app.UseCors("AllowFrontend");

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

app.Run();