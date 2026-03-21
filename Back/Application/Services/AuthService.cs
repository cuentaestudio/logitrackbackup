using Back.Application.Util;
using Back.Controllers;
using Back.Domain.Models;
using Domain.Repositories;

namespace Back.Application.Services
{
    public class AuthService
    {

        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> Login(LoginRequest request)
        {
            var user = await _userRepository.GetUsuarioByEmail(request.Email);

            if (user == null)
            {
                throw new InvalidOperationException("Usuario no encontrado");
            }

            if (!PasswordHasher.VerifyPassword(request.Password, user.Password))
            {
                throw new InvalidOperationException("Contraseña incorrecta");
            }

            return JWTservice.GenerateToken(user);
        }

        public async Task Registrarse(RegisterRequest request)
        {
            var existingUser = await _userRepository.GetUsuarioByEmail(request.Email);

            if (existingUser != null)
            {
                throw new InvalidOperationException("El correo electrónico ya está registrado");
            }

            var hashedPassword = PasswordHasher.HashPassword(request.Password);

            Usuario newUser;

            switch (request.Role)
            {
                case UserRole.Supervisor:
                    newUser = new Supervisor(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI);
                    break;
                case UserRole.Operador:
                    newUser = new Operador(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI);
                    break;
                case UserRole.Transportista:
                    newUser = new Transportista(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI);
                    break;
                default:
                    throw new InvalidOperationException("Rol no válido");
            }

            await _userRepository.Add(newUser);
        }
    }
}