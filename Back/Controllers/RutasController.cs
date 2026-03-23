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
        public async Task<IActionResult> Index()
        {
            var rutas = await _rutasRepository.GetRutas();

            return Ok(rutas);
        }

        [HttpGet("transportista/{transportistaId:guid}")]
        public async Task<IActionResult> GetRutasByTransportista(Guid transportistaId)
        {
            var rutas = await _rutasRepository.GetHistorialRutas(transportistaId);

            // Mapear a un objeto sin referencias circulares
            var rutasResponse = rutas.Select(r => new
            {
                id = r.Id,
                estado = r.Estado.ToString(),
                iniciadoEn = r.IniciadoEn,
                finalizadoEn = r.FinalizadoEn,
                razonCancelacion = r.RazonCancelacion,
                transportista = new
                {
                    id = r.Transportista.Id,
                    nombre = r.Transportista.Nombre,
                    apellido = r.Transportista.Apellido,
                    email = r.Transportista.Email
                },
                vehiculo = new
                {
                    id = r.Vehiculo.Id,
                    patente = r.Vehiculo.Patente,
                    marca = r.Vehiculo.Marca,
                    capacidadCarga = r.Vehiculo.CapacidadCarga,
                    estado = r.Vehiculo.Estado.ToString()
                },
                paquetes = r.Paquetes.Select(p => new
                {
                    id = p.Id,
                    codigoSeguimiento = p.CodigoSeguimiento,
                    peso = p.Peso,
                    descripcion = p.Descripcion,
                    status = p.Status.ToString(),
                    creadoEn = p.CreadoEn,
                    remitente = new
                    {
                        nombre = p.Remitente.Nombre,
                        apellido = p.Remitente.Apellido,
                        direccion = new
                        {
                            calle = p.Remitente.Direccion.Calle,
                            ciudad = p.Remitente.Direccion.Ciudad,
                            cp = p.Remitente.Direccion.CP
                        }
                    },
                    destinatario = new
                    {
                        nombre = p.Destinatario.Nombre,
                        apellido = p.Destinatario.Apellido,
                        direccion = new
                        {
                            calle = p.Destinatario.Direccion.Calle,
                            ciudad = p.Destinatario.Direccion.Ciudad,
                            cp = p.Destinatario.Direccion.CP
                        }
                    }
                }).ToList()
            }).ToList();

            return Ok(rutasResponse);
        }

        [HttpGet("historial")]
        public async Task<IActionResult> GetHistorialRutas()
        {
            var rutas = await _rutasRepository.GetHistorialRutas(HttpContext.User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value is string userIdStr && Guid.TryParse(userIdStr, out var userId) ? userId : Guid.Empty);

            return Ok(rutas);
        }

        [HttpPost("comenzar-ruta/{rutaId:guid}")]
        public async Task<IActionResult> AddRuta(Guid rutaId)
        {

            var ruta = await _rutasRepository.GetRutaById(rutaId);

            if (ruta is null)
                return NotFound();

            ruta.Iniciar();

            return Ok();
        }

        [HttpPost("finalizar-ruta/{rutaId:guid}")]
        public async Task<IActionResult> FinalizarRuta(Guid rutaId)
        {
            var ruta = await _rutasRepository.GetRutaById(rutaId);

            if (ruta is null)
                return NotFound();

            ruta.Finalizar();

            return Ok();
        }

        [HttpPost("cancelar-ruta/{rutaId:guid}")]
        public async Task<IActionResult> CancelarRuta(Guid rutaId, [FromBody] string razon)
        {
            var ruta = await _rutasRepository.GetRutaById(rutaId);

            if (ruta is null)
                return NotFound();

            ruta.Cancelar(razon);

            return Ok();
        }


        [HttpPost("reasignar-ruta/ruta/{rutaId:guid}/transportista/{transportistaId:guid}")]
        public async Task<IActionResult> ReasignarRuta(Guid rutaId, Guid transportistaId)
        {

            await _enviosService.ReasignarRuta(rutaId, transportistaId);

            return Ok();
        }

        [HttpPost("crear-ruta")]
        public async Task<IActionResult> CrearRuta([FromBody] CrearRutaRequest request)
        {

            await _rutasService.CrearRuta(request);


            return Ok();
        }
    }


    public class CrearRutaRequest
    {
        public Guid VehiculoId { get; set; }
        public Guid TransportistaId { get; set; }
        public List<Guid> PaqueteIds { get; set; }
    }
}