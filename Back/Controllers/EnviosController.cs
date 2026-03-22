using Back.Application.Services;
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
        private readonly IVehiculoRepository _vehiculoRepository;
        private readonly EnviosService _enviosService;

        public EnviosController(IEnviosRepository enviosRepository, IVehiculoRepository vehiculoRepository, EnviosService enviosService)
        {
            _enviosService = enviosService;
            _vehiculoRepository = vehiculoRepository;
            _enviosRepository = enviosRepository;
        }

        [HttpPost("registrar-paquete")]
        public async Task<IResult> RegistrarPaquete([FromBody] RegistrarPaqueteRequest request)
        {
            await _enviosService.RegistrarPaquete(request);

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


        [HttpPost("vehiculos/registrar-vehiculo")]
        public async Task<IResult> RegistrarVehiculo([FromBody] RegistrarVehiculoRequest request)
        {
            var vehiculo = new Vehiculo(
                request.Patente,
                request.Modelo,
                request.Capacidad
            );

            await _vehiculoRepository.Add(vehiculo);

            return Results.Ok();
        }

        [HttpGet("vehiculos/activos")]
        public async Task<IResult> GetVehiculos()
        {
            var vehiculos = await _vehiculoRepository.GetVehiculosActivos();

            return Results.Ok(vehiculos);
        }

        [HttpPost("sucursales/registrar-sucursal")]
        public async Task<IResult> RegistrarSucursal([FromBody] RegistarSucursal request)
        {
            var sucursal = new Sucursal(
                request.Nombre,
                request.Direccion,
                request.Ciudad,
                request.Telefono
            );

            await _enviosRepository.Add(sucursal);

            return Results.Ok();
        }


        [HttpPost("cambiar-estado-paquete/{paqueteId:guid}/estado/{status}")]
        public async Task<IResult> CambiarEstadoPaquete(Guid paqueteId, PaqueteStatus status)
        {
            var paquete = await _enviosRepository.GetPaquete(paqueteId);

            if (paquete is null)
                return Results.NotFound();


            paquete.CambiarEstado(status);

            return Results.Ok();
        }

        [HttpPost("entregar-paquete/ruta/{rutaId:guid}/paquete/{paqueteId:guid}")]
        public async Task<IResult> EntregarPaquete(Guid rutaId, Guid paqueteId)
        {
            var ruta = await _enviosRepository.GetRutaById(rutaId);


            if (ruta is null)
                return Results.NotFound();

            ruta.EntregarPaquete(paqueteId);


            return Results.Ok();
        }
}


public class RegistrarPaqueteRequest
{
    public double Peso { get; set; }
    public string? Comentarios { get; set; }
    public RegistrarClienteRequest Remitente { get; set; }
    public RegistrarClienteRequest Destinatario { get; set; }
}

public class RegistrarClienteRequest
{
    public string Direccion { get; set; } = string.Empty;
    public string Localidad { get; set; } = string.Empty;
    public string CP { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
}

public class RegistrarVehiculoRequest
{
    public string Patente { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public double Capacidad { get; set; }
}

public class RegistarSucursal
{
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;

}
}