using Back.Application.Util;
using Back.Controllers;
using Back.Domain.Models;
using Back.Domain.Repositories;
using static Back.Domain.Models.Transportista;

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

            var existingByDni = await _userRepository.GetUsuarioByDni(request.DNI);
            if (existingByDni != null)
            {
                throw new InvalidOperationException("El DNI ya se encuentra registrado");
            }

            var hashedPassword = PasswordHasher.HashPassword(request.Password);

            if (request.Role == "Transportista")
                throw new InvalidOperationException("El rol Transportista solo puede ser registrado por un Supervisor.");
            
            Usuario newUser = request.Role switch
            {
                "Supervisor" => new Supervisor(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI),
                "Operador" => new Operador(request.Nombre, request.Apellido, request.Email, hashedPassword, request.DNI),
                _ => throw new InvalidOperationException("Rol no válido"),
            };
            await _userRepository.Add(newUser);
        }

        public async Task<Transportista> RegistrarTransportista(RegistrarTransportistaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre) || string.IsNullOrWhiteSpace(request.Apellido))
                throw new InvalidOperationException("Nombre y apellido son obligatorios.");

            if (string.IsNullOrWhiteSpace(request.DNI) || request.DNI.Trim().Length != 8)
                throw new InvalidOperationException("El DNI debe tener exactamente 8 caracteres.");

            if (string.IsNullOrWhiteSpace(request.Licencia))
                throw new InvalidOperationException("La licencia es obligatoria.");

            var existingByDni = await _userRepository.GetUsuarioByDni(request.DNI.Trim());
            if (existingByDni is not null)
                throw new InvalidOperationException("El DNI ya está registrado.");

            // Mantener la creación simple: email técnico interno y contraseña temporal.
            var generatedEmail = $"transportista.{request.DNI.Trim()}@logitrack.local";
            var generatedPassword = PasswordHasher.HashPassword("password123");

            var existingByEmail = await _userRepository.GetUsuarioByEmail(generatedEmail);
            if (existingByEmail is not null)
                throw new InvalidOperationException("No se pudo generar un email único para el transportista.");

            var transportista = new Transportista(
                request.Nombre.Trim(),
                request.Apellido.Trim(),
                generatedEmail,
                generatedPassword,
                request.DNI.Trim(),
                request.Licencia.Trim()
            );

            await _userRepository.Add(transportista);
            return transportista;
        }

        public async Task<Transportista> ActualizarLicenciaTransportista(Guid transportistaId, string licencia)
        {
            var user = await _userRepository.GetUsuarioById(transportistaId);
            if (user is not Transportista transportista)
                throw new InvalidOperationException("Transportista no encontrado.");

            transportista.ActualizarLicencia(licencia);
            return transportista;
        }

        public async Task<Transportista> CambiarEstadoTransportista(Guid transportistaId, EstadoTransportista estado)
        {
            var user = await _userRepository.GetUsuarioById(transportistaId);
            if (user is not Transportista transportista)
                throw new InvalidOperationException("Transportista no encontrado.");

            transportista.CambiarEstado(estado);
            return transportista;
        }
    }
}