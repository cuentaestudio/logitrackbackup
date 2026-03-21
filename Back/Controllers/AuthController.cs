
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
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
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

