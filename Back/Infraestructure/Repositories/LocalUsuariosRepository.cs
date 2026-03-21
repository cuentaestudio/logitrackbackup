using Back.Domain.Models;
using Domain.Repositories;

namespace Back.Infraestructure.Repositories
{
    public class LocalUsuariosRepository : IUserRepository
    {
        private readonly List<Usuario> _usuarios = new List<Usuario>();

        public Task Add(Usuario usuario)
        {
            _usuarios.Add(usuario);
            return Task.CompletedTask;
        }

        public Task<Usuario?> GetUsuarioByEmail(string email)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.Email == email);
            return Task.FromResult(usuario);
        }
    }
}