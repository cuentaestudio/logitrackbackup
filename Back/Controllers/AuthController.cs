
using System.ComponentModel.DataAnnotations;
using Back.Application.Services;
using Back.Domain.Models;
using Back.Domain.Repositories;
using Back.Infrastructure.Database;
using Microsoft.AspNetCore.Mvc;
using static Back.Domain.Models.Transportista;


namespace Back.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {

        private readonly AuthService _authService;
        private readonly IUserRepository _userRepository;
        private readonly LogiTrackDbContext _context;

        public AuthController(AuthService authService, IUserRepository userRepository, LogiTrackDbContext context)
        {
            _authService = authService;
            _userRepository = userRepository;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.Login(request);
            return Ok(result);
        }


        [HttpPost("registrarse")]
        public async Task<IActionResult> Registrarse([FromBody] RegisterRequest request)
        {
            try
            {
                await _authService.Registrarse(request);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("transportistas")]
        public async Task<IActionResult> GetTransportistas()
        {
            var transportistas = await _userRepository.GetAll();
            var transportistasList = transportistas.OfType<Transportista>().Select(t => new UserInfoResponse
            {
                Id = t.Id.ToString(),
                Nombre = t.Nombre,
                Apellido = t.Apellido,
                Email = t.Email,
                DNI = t.DNI,
                Role = "Transportista",
                Licencia = t.Licencia,
                Estado = t.EstadoLabel
            }).ToList();

            return Ok(transportistasList);
        }

        [HttpPost("transportistas")]
        public async Task<IActionResult> RegistrarTransportista([FromBody] RegistrarTransportistaRequest request)
        {
            var result = await _authService.RegistrarTransportista(request);
            var transportista = result.Transportista;

            await _context.SaveChangesAsync();

            return Ok(new UserInfoResponse
            {
                Id = transportista.Id.ToString(),
                Nombre = transportista.Nombre,
                Apellido = transportista.Apellido,
                Email = transportista.Email,
                DNI = transportista.DNI,
                Role = "Transportista",
                Licencia = transportista.Licencia,
                Estado = transportista.EstadoLabel,
                TemporaryPassword = result.TemporaryPassword
            });
        }

        [HttpPut("transportistas/{transportistaId:guid}/licencia")]
        public async Task<IActionResult> ActualizarLicenciaTransportista(Guid transportistaId, [FromBody] ActualizarLicenciaTransportistaRequest request)
        {
            var transportista = await _authService.ActualizarLicenciaTransportista(transportistaId, request.Licencia);

            await _context.SaveChangesAsync();

            return Ok(new UserInfoResponse
            {
                Id = transportista.Id.ToString(),
                Nombre = transportista.Nombre,
                Apellido = transportista.Apellido,
                Email = transportista.Email,
                DNI = transportista.DNI,
                Role = "Transportista",
                Licencia = transportista.Licencia,
                Estado = transportista.EstadoLabel
            });
        }

        [HttpPut("transportistas/{transportistaId:guid}/estado")]
        public async Task<IActionResult> CambiarEstadoTransportista(Guid transportistaId, [FromBody] CambiarEstadoTransportistaRequest request)
        {
            var transportista = await _authService.CambiarEstadoTransportista(transportistaId, request.Estado);

            await _context.SaveChangesAsync();

            return Ok(new UserInfoResponse
            {
                Id = transportista.Id.ToString(),
                Nombre = transportista.Nombre,
                Apellido = transportista.Apellido,
                Email = transportista.Email,
                DNI = transportista.DNI,
                Role = "Transportista",
                Licencia = transportista.Licencia,
                Estado = transportista.EstadoLabel
            });
        }

        [HttpGet("usuarios")]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _userRepository.GetAll();
            var usuariosList = usuarios.Select(u => new UserInfoResponse
            {
                Id = u.Id.ToString(),
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Email = u.Email,
                DNI = u.DNI,
                Licencia = u is Transportista t ? t.Licencia : null,
                Estado = u is Transportista t2 ? t2.EstadoLabel : null,
                Role = u switch
                {
                    Supervisor => "Supervisor",
                    Operador => "Operador",
                    Transportista => "Transportista",
                    _ => "Usuario"
                }
            }).ToList();

            return Ok(usuariosList);
        }
    }

    public class UserInfoResponse
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string DNI { get; set; }
        public string Role { get; set; }
        public string? Licencia { get; set; }
        public string? Estado { get; set; }
        public string? TemporaryPassword { get; set; }
    }

    public class RegistrarTransportistaRequest
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;
        [Required]
        public string Apellido { get; set; } = string.Empty;
        [Required]
        [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
        public string Email { get; set; } = string.Empty;
        [Required]
        [Length(8, 8, ErrorMessage = "El DNI debe tener exactamente 8 caracteres.")]
        public string DNI { get; set; } = string.Empty;
        [Required]
        public string Licencia { get; set; } = string.Empty;
    }

    public class ActualizarLicenciaTransportistaRequest
    {
        [Required]
        public string Licencia { get; set; } = string.Empty;
    }

    public class CambiarEstadoTransportistaRequest
    {
        [Required]
        public EstadoTransportista Estado { get; set; }
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
        public string Email { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public UserInfo User { get; set; }
    }

    public class UserInfo
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }

    public class RegisterRequest
    {
        [Required]
        public string Nombre { get; set; }
        [Required]
        public string Apellido { get; set; }
        [Required]
        [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]   
        public string Email { get; set; }
        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
        public string Password { get; set; }
        [Required]
        [Length(8, 8, ErrorMessage = "El DNI debe tener exactamente 8 caracteres.")]
        public string DNI { get; set; }
        public string Role { get; set; }
    }
}

