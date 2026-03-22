using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalUsuariosRepository : IUserRepository
    {
        private readonly List<Usuario> _usuarios = new List<Usuario>();

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