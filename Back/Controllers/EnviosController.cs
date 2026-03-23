using System.ComponentModel.DataAnnotations;
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

        private readonly IRutasRepository _rutasRepository;
        private readonly EnviosService _enviosService;

        public EnviosController(IEnviosRepository enviosRepository, IVehiculoRepository vehiculoRepository, EnviosService enviosService)
        {
            _enviosService = enviosService;
            _vehiculoRepository = vehiculoRepository;
            _enviosRepository = enviosRepository;
        }

        [HttpPost("registrar-paquete")]
        public async Task<IActionResult> RegistrarPaquete([FromBody] RegistrarPaqueteRequest request)
        {
            await _enviosService.RegistrarPaquete(request);

            return Ok();
        }


        [HttpGet("seguimiento/{codigoSeguimiento}")]
        public async Task<IActionResult> Seguimiento(string codigoSeguimiento)
        {

            var paquete = await _enviosRepository.GetPaqueteByCodigoSeguimiento(codigoSeguimiento);

            if (paquete is null)
                return NotFound();

            return Ok(paquete);
        }

        [HttpGet("paquete/{paqueteId:guid}")]
        public async Task<IActionResult> GetPaquete(Guid paqueteId)
        {
            var paquete = await _enviosRepository.GetPaquete(paqueteId);

            if (paquete is null)
                return NotFound();

            return Ok(paquete);
        }

        [HttpGet("paquetes-en-sucursal")]
        public async Task<IActionResult> GetPaquetesEnSucursal()
        {
            var paquetes = await _enviosRepository.GetPaquetesEnSucursal();

            return Ok(paquetes);
        }

        [HttpGet("todos-los-paquetes")]
        public async Task<IActionResult> GetTodosLosPaquetes()
        {
            var paquetes = await _enviosRepository.GetAll();
            return Ok(paquetes);
        }


        [HttpGet("busqueda-de-paquetes")]
        public async Task<IActionResult> BusquedaDePaquetes([FromBody] BusquedaDePaquetesRequest request)
        {
            var paquetes = await _enviosRepository.GetPaquetes(request.CodigoSeguimiento, request.Destinatario);

            return Ok(paquetes);
        }

        [HttpPost("vehiculos/registrar-vehiculo")]
        public async Task<IActionResult> RegistrarVehiculo([FromBody] RegistrarVehiculoRequest request)
        {
            var vehiculo = new Vehiculo(
                request.Patente,
                request.Modelo,
                request.Capacidad
            );

            await _vehiculoRepository.Add(vehiculo);

            return Ok();
        }

        [HttpGet("vehiculos/activos")]
        public async Task<IActionResult> GetVehiculos()
        {
            var vehiculos = await _vehiculoRepository.GetVehiculosActivos();

            return Ok(vehiculos);
        }

        [HttpGet("vehiculos/{vehiculoId:guid}")]
        public async Task<IActionResult> GetVehiculo(Guid vehiculoId)
        {
            var vehiculo = await _vehiculoRepository.GetVehiculo(vehiculoId);

            if (vehiculo is null)
                return NotFound("Vehículo no encontrado");

            return Ok(vehiculo);
        }

        [HttpPost("vehiculos/{vehiculoId:guid}/suspender")]
        public async Task<IActionResult> SuspenderVehiculo(Guid vehiculoId)
        {
            var vehiculo = await _vehiculoRepository.GetVehiculo(vehiculoId);

            if (vehiculo is null)
                return NotFound("Vehículo no encontrado");

            vehiculo.Suspender();

            return Ok();
        }

        [HttpPost("vehiculos/{vehiculoId:guid}/estado/{estado}")]
        public async Task<IActionResult> CambiarEstadoVehiculo(Guid vehiculoId, VehiculoEstado estado)
        {
            var vehiculo = await _vehiculoRepository.GetVehiculo(vehiculoId);

            if (vehiculo is null)
                return NotFound("Vehículo no encontrado");

            vehiculo.CambiarEstado(estado);

            return Ok();
        }

        [HttpGet("sucursales")]
        public async Task<IActionResult> GetSucursales()
        {
            var sucursales = await _enviosRepository.GetSucursales();
            return Ok(sucursales);
        }

        [HttpPost("sucursales/registrar-sucursal")]
        public async Task<IActionResult> RegistrarSucursal([FromBody] RegistarSucursal request)
        {
            var sucursal = new Sucursal(
                request.Nombre,
                request.Direccion,
                request.Ciudad,
                request.Telefono
            );

            await _enviosRepository.Add(sucursal);

            return Ok();
        }


        [HttpPost("cambiar-estado-paquete/{paqueteId:guid}/estado/{status}")]
        public async Task<IActionResult> CambiarEstadoPaquete(Guid paqueteId, PaqueteStatus status)
        {
            var paquete = await _enviosRepository.GetPaquete(paqueteId);

            if (paquete is null)
                return NotFound("Paquete no encontrado");

            try
            {
                // Usar los métodos del dominio que incluyen validaciones
                switch (status)
                {
                    case PaqueteStatus.EnTransito:
                        paquete.EnTransito();
                        break;
                    case PaqueteStatus.Entregado:
                        paquete.Entregar();
                        break;
                    case PaqueteStatus.Cancelado:
                        paquete.Cancelar("Cancelado desde el sistema");
                        break;
                    case PaqueteStatus.EnSucursal:
                        // Para volver a sucursal, usar reenvío si está cancelado
                        if (paquete.Status == PaqueteStatus.Cancelado)
                        {
                            paquete.ReEnviar();
                        }
                        else
                        {
                            return BadRequest("Transición de estado no válida");
                        }
                        break;
                    default:
                        return BadRequest("Estado no válido");
                }

                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("cancelar-paquete/{paqueteId:guid}")]
        public async Task<IActionResult> CancelarPaquete(Guid paqueteId, [FromBody] CancelarPaqueteRequest request)
        {
            var paquete = await _enviosRepository.GetPaquete(paqueteId);

            if (paquete is null)
                return NotFound("Paquete no encontrado");

            try
            {
                var motivo = !string.IsNullOrWhiteSpace(request.Motivo)
                    ? request.Motivo
                    : "Cancelado desde el sistema";

                paquete.Cancelar(motivo);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("reenviar-paquete/{paqueteId:guid}")]
        public async Task<IActionResult> ReenviarPaquete(Guid paqueteId)
        {
            var paquete = await _enviosRepository.GetPaquete(paqueteId);

            if (paquete is null)
                return NotFound("Paquete no encontrado");

            try
            {
                paquete.ReEnviar();
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("entregar-paquete/ruta/{rutaId:guid}/paquete/{paqueteId:guid}")]
        public async Task<IActionResult> EntregarPaquete(Guid rutaId, Guid paqueteId)
        {
            var ruta = await _rutasRepository.GetRutaById(rutaId);


            if (ruta is null)
                return NotFound();

            ruta.EntregarPaquete(paqueteId);


            return Ok();
        }
}


public class CancelarPaqueteRequest
{
    public string Motivo { get; set; } = string.Empty;
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
    [Required]
    public string Direccion { get; set; } = string.Empty;
    [Required]
    public string Localidad { get; set; } = string.Empty;
    [Required]
    public string CP { get; set; } = string.Empty;
    [Required]
    public string Nombre { get; set; } = string.Empty;
    [Required]
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
    [Required]
    public string Nombre { get; set; } = string.Empty;
    [Required]
    public string Direccion { get; set; } = string.Empty;
    [Required]
    public string Ciudad { get; set; } = string.Empty;
    [Required]
    public string Telefono { get; set; } = string.Empty;

}

public class BusquedaDePaquetesRequest
{
    public string? CodigoSeguimiento { get; set; }
    public string? Destinatario { get; set; }
}
}