using Back.Application.Services;
using Back.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{

    [ApiController]
    [Route("rutas")]
    public class RutasController : ControllerBase
    {
        private readonly IEnviosRepository _enviosRepository;
        private readonly EnviosService _enviosService;

        public RutasController(IEnviosRepository enviosRepository, EnviosService enviosService)
        {
            _enviosRepository = enviosRepository;
            _enviosService = enviosService;
        }

    [HttpGet()]
        public async Task<IResult> Index()
        {
            var rutas = await _enviosRepository.GetRutas();

            return Results.Ok(rutas);
        }

        [HttpGet("historial")]
        public async Task<IResult> GetHistorialRutas()
        {
            var rutas = await _enviosRepository.GetHistorialRutas(HttpContext.User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value is string userIdStr && Guid.TryParse(userIdStr, out var userId) ? userId : Guid.Empty);

            return Results.Ok(rutas);
        }

        [HttpPost("comenzar-ruta/{rutaId:guid}")]
        public async Task<IResult> AddRuta(Guid rutaId)
        {

            var ruta = await _enviosRepository.GetRutaById(rutaId);

            if (ruta is null)
                return Results.NotFound();

            ruta.Iniciar();

            return Results.Ok();
        }

        [HttpPost("finalizar-ruta/{rutaId:guid}")]
        public async Task<IResult> FinalizarRuta(Guid rutaId)
        {
            var ruta = await _enviosRepository.GetRutaById(rutaId);

            if (ruta is null)
                return Results.NotFound();

            ruta.Finalizar();

            return Results.Ok();
        }

        [HttpPost("cancelar-ruta/{rutaId:guid}")]
        public async Task<IResult> CancelarRuta(Guid rutaId, [FromBody] string razon)
        {
            var ruta = await _enviosRepository.GetRutaById(rutaId);

            if (ruta is null)
                return Results.NotFound();

            ruta.Cancelar(razon);

            return Results.Ok();
        }


        [HttpPost("reasignar-ruta/ruta/{rutaId:guid}/transportista/{transportistaId:guid}")]
        public async Task<IResult> ReasignarRuta(Guid rutaId, Guid transportistaId)
        {

            await _enviosService.ReasignarRuta(rutaId, transportistaId);

            return Results.Ok();

        }

    }
}