
using Back.Domain.Models;

namespace Back.Domain.Repositories;

public interface IUserRepository
{
    public Task<Usuario?> GetUsuarioByEmail(string email);
    public Task Add(Usuario usuario);

}