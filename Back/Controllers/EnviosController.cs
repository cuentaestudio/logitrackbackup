using Back.Domain.Models;
using Back.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/envios")]
    public class EnviosController : ControllerBase
    {
        private readonly IEnviosRepository _enviosRepository;


        public EnviosController(IEnviosRepository enviosRepository)
        {
            _enviosRepository = enviosRepository;
        }

        [HttpPost("registrar-paquete")]
        public async Task<IResult> RegistrarPaquete([FromBody] RegistrarPaqueteRequest request)
        {


           
            return Results.Ok();
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

        [HttpPost("cancelar-ruta/{rutaId:guid}")]
        public async Task<IResult> CancelarRuta(Guid rutaId, [FromBody] string razon)
        {
            var ruta = await _enviosRepository.GetRutaById(rutaId);

            if (ruta is null)
                return Results.NotFound();

            ruta.Cancelar(razon);

            return Results.Ok();
        }


        [HttpGet("seguimiento/{codigoSeguimiento}")]
        public async Task<IResult> Seguimiento(string codigoSeguimiento)
        {

            var paquete = await _enviosRepository.GetPaqueteByCodigoSeguimiento(codigoSeguimiento);

            if (paquete is null)
                return Results.NotFound();

            return Results.Ok(paquete);
        }


        [HttpGet("paquetes-en-sucursal")]
        public async Task<IResult> GetPaquetesEnSucursal()
        {

            var paquetes = await _enviosRepository.GetPaquetesEnSucursal();


            return Results.Ok(paquetes);

        }
    }


    public class RegistrarPaqueteRequest
    {
        public string Destinatario { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Localidad { get; set; } = string.Empty;
        public string CP { get; set; } = string.Empty;

        public string? Comentarios { get; set; }

    }
}