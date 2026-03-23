using Back.Application.Services;
using Back.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{

    [ApiController]
    [Route("api/rutas")]
    public class RutasController : ControllerBase
    {
        private readonly IEnviosRepository _enviosRepository;
        private readonly EnviosService _enviosService;

        private readonly RutasService _rutasService;

        private readonly IRutasRepository _rutasRepository;

        public RutasController(IEnviosRepository enviosRepository, EnviosService enviosService, RutasService rutasService,IRutasRepository rutasRepository)
        {
            _rutasService = rutasService;
            _rutasRepository = rutasRepository;
            _enviosRepository = enviosRepository;
            _enviosService = enviosService;
        }

        [HttpGet()]
        public async Task<IResult> Index()
        {
            var rutas = await _rutasRepository.GetRutas();

            return Results.Ok(rutas);
        }

        [HttpGet("historial")]
        public async Task<IResult> GetHistorialRutas()
        {
            var rutas = await _rutasRepository.GetHistorialRutas(HttpContext.User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value is string userIdStr && Guid.TryParse(userIdStr, out var userId) ? userId : Guid.Empty);

            return Results.Ok(rutas);
        }

        [HttpPost("comenzar-ruta/{rutaId:guid}")]
        public async Task<IResult> AddRuta(Guid rutaId)
        {

            var ruta = await _rutasRepository.GetRutaById(rutaId);

            if (ruta is null)
                return Results.NotFound();

            ruta.Iniciar();

            return Results.Ok();
        }

        [HttpPost("finalizar-ruta/{rutaId:guid}")]
        public async Task<IResult> FinalizarRuta(Guid rutaId)
        {
            var ruta = await _rutasRepository.GetRutaById(rutaId);

            if (ruta is null)
                return Results.NotFound();

            ruta.Finalizar();

            return Results.Ok();
        }

        [HttpPost("cancelar-ruta/{rutaId:guid}")]
        public async Task<IResult> CancelarRuta(Guid rutaId, [FromBody] string razon)
        {
            var ruta = await _rutasRepository.GetRutaById(rutaId);

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

        [HttpPost("crear-ruta")]
        public async Task<IResult> CrearRuta([FromBody] CrearRutaRequest request)
        {

            await _rutasService.CrearRuta(request);

            
            return Results.Ok();
        }
    }


    public class CrearRutaRequest
    {
        public Guid VehiculoId { get; set; }
        public Guid TransportistaId { get; set; }
        public List<Guid> PaqueteIds { get; set; }
    }
}