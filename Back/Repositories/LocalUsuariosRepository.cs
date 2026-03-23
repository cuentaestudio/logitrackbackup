using Back.Domain.Models;
using Back.Domain.Repositories;
using Back.Application.Services;

namespace Back.Repositories
{
    public class LocalUsuariosRepository : IUserRepository
    {
        private readonly List<Usuario> _usuarios = new List<Usuario>()
        {
            new Supervisor("Juan", "Pérez", "juan.perez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "11111111"),
            new Supervisor("Marta", "Gómez", "marta.gomez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "22222222"),
            new Supervisor("Roberto", "Sánchez", "roberto.sanchez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "33333333"),
            new Operador("Ana", "López", "ana.lopez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "44444444"),
            new Operador("Carlos", "Rodríguez", "carlos.rodriguez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "55555555"),
            new Operador("Lucía", "Fernández", "lucia.fernandez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "66666666"),
            new Operador("Diego", "Martínez", "diego.martinez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "77777777"),
            new Operador("Elena", "Vázquez", "elena.vazquez@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "88888888"),
            new Operador("Sofía", "Castro", "sofia.castro@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "99999999"),
            new Operador("Javier", "Ruiz", "javier.ruiz@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "10101010"),
            new Transportista("Pedro", "García", "pedro.garcia@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "12121212"),
            new Transportista("Luis", "Torres", "luis.torres@logitrack.com", "$2a$11$xn5SmOrtPqherZH8ODaCLOoa9s8285SIAUC3VOHhVaU58LYk28pEO", "13131313")
        };

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
            Console.WriteLine($"Usuario agregado: {usuario.Email} (ID: {usuario.Id}) Password: {usuario.Password}"+ usuario.GetType());
            
            return Task.CompletedTask;
        }

        public Task<List<Operador>> GetOperadores()
        {
            return Task.FromResult(_usuarios.OfType<Operador>().ToList());
        }

        public Task<List<Supervisor>> GetSupervisores()
        {
            return Task.FromResult(_usuarios.OfType<Supervisor>().ToList());
        }

        public Task<List<Transportista>> GetTransportistas()
        {
            return Task.FromResult(_usuarios.OfType<Transportista>().ToList());
        }

        public Task<Usuario?> GetUsuarioByDni(string dni)
        {
            var usuario = _usuarios.FirstOrDefault(u => u.DNI == dni);
            return Task.FromResult(usuario);
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

        public Task<List<Usuario>> GetAll()
        {
            return Task.FromResult(_usuarios.ToList());
        }
    }
}