using Back.Domain.Models;
using Back.Domain.Repositories;
using Back.Application.Services;

namespace Back.Repositories
{
    public class LocalUsuariosRepository : IUserRepository
    {
        private readonly List<Usuario> _usuarios = new List<Usuario>();

        public LocalUsuariosRepository()
        {
            // Agregar usuarios de prueba
            var passwordHash = PasswordHasher.HashPassword("password123");
            _usuarios.Add(new Supervisor("Admin", "Usuario", "admin@logitrack.com", passwordHash, "12345678"));
            _usuarios.Add(new Operador("Juan", "Operador", "operador@logitrack.com", passwordHash, "87654321"));
            _usuarios.Add(new Transportista("Carlos", "Transportista", "transportista@logitrack.com", passwordHash, "11111111"));
            Console.WriteLine("[INIT] Usuarios de prueba cargados en memoria");
        }

        public Task Add(Usuario usuario)
        {
            _usuarios.Add(usuario);
            Console.WriteLine($"Usuario agregado: {usuario.Email} (ID: {usuario.Id}) "+ "TYpe "+ usuario.GetType());
            
            return Task.CompletedTask;
        }

        public Task<Usuario?> GetUsuarioByEmail(string email)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.Email == email);
            return Task.FromResult(usuario);
        }

        public Task<Usuario?> GetUsuarioById(Guid id)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.Id == id);
            return Task.FromResult(usuario);
        }
    }
}