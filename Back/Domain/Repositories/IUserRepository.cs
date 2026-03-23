
using Back.Domain.Models;

namespace Back.Domain.Repositories;

public interface IUserRepository
{
    Task<Usuario?> GetUsuarioByEmail(string email);
    Task<Usuario?> GetUsuarioByDni(string dni);
    Task<Usuario?> GetUsuarioById(Guid id);
    Task Add(Usuario usuario);

}