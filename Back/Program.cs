using Back.Application.Services;
using Back.Domain.Repositories;
using Back.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddScoped<AuthService>().AddScoped<EnviosService>().AddScoped<RutasService>();


builder.Services.AddSingleton<IUserRepository, LocalUsuariosRepository>().AddSingleton<IEnviosRepository, LocalEnviosRepository>().AddSingleton<IVehiculoRepository, LocalVehiculoRepository>().AddSingleton<IRutasRepository, LocalRutasReposiory>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

app.Run();