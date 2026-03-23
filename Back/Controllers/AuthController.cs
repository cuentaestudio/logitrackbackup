
using System.ComponentModel.DataAnnotations;
using Back.Application.Services;
using Back.Domain.Models;
using Back.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;


namespace Back.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {

        private readonly AuthService _authService;
        private readonly IUserRepository _userRepository;

        public AuthController(AuthService authService, IUserRepository userRepository)
        {
            _authService = authService;
            _userRepository = userRepository;
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
            await _authService.Registrarse(request);

            return Ok();
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
                Role = "Transportista"
            }).ToList();

            return Ok(transportistasList);
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

