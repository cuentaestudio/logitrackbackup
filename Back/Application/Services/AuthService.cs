using Back.Application.Util;
using Back.Controllers;
using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Application.Services
{
    public class AuthService
    {

        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<dynamic> Login(LoginRequest request)
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

            var token = JWTservice.GenerateToken(user);
            
            // Retornar token + info del usuario
            return new
            {
                token = token,
                user = new
                {
                    id = user.Id.ToString(),
                    nombre = user.Nombre,
                    apellido = user.Apellido,
                    email = user.Email,
                    role = user.GetType().Name.ToLower()
                }
            };
        }

        public async Task Registrarse(RegisterRequest request)
        {
            Console.WriteLine($"Registrando usuario: {request.Email}, Role: {request.Role}");

            if (!EmailService.IsEmailValid(request.Email))
            {
                throw new InvalidOperationException("Correo electrónico no válido");
            }

            var existingUser = await _userRepository.GetUsuarioByEmail(request.Email);

            if (existingUser != null)
            {
                throw new InvalidOperationException("El correo electrónico ya está registrado");
            }

            var hashedPassword = PasswordHasher.HashPassword(request.Password);
            
            Usuario newUser = request.Role switch
            {
                "Supervisor" => new Supervisor(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI),
                "Operador" => new Operador(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI),
                "Transportista" => new Transportista(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI),
                _ => throw new InvalidOperationException("Rol no válido"),
            };
            await _userRepository.Add(newUser);
        }
    }
}