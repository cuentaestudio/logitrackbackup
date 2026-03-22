
using Back.Domain.Models;

namespace Back.Domain.Repositories;

public interface IUserRepository
{
    public Task<Usuario?> GetUsuarioByEmail(string email);

    Task<Usuario?> GetUsuarioById(Guid id);
    public Task Add(Usuario usuario);

}