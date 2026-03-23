
using System.ComponentModel.DataAnnotations;
using Back.Application.Services;
using Microsoft.AspNetCore.Mvc;


namespace Back.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {

        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.Login(request);

            return Results.Ok(result);
        }


        [HttpPost("registrarse")]
        public async Task<IResult> Registrarse([FromBody] RegisterRequest request)
        {
            await _authService.Registrarse(request);

            return Results.Ok();
        }
    }

    public class LoginRequest
    {
        [Required]
        [Length(8, 8, ErrorMessage = "El DNI debe tener exactamente 8 caracteres.")]
        public string DNI { get; set; }

        [Required]
        [MinLength(8, ErrorMessage = "La contraseña debe tener al menos 8 caracteres.")]
        public string Password { get; set; }
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
        public UserRole Role { get; set; }
    }

    public enum UserRole
    {
        Supervisor,
        Operador,
        Transportista
    }
}

