using Back.Application.Services;
using Back.Domain.Repositories;
using Back.Infraestructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddScoped<AuthService>().AddSingleton<IUserRepository, LocalUsuariosRepository>().AddSingleton<IEnviosRepository, LocalEnviosRepository>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI();

app.Run();