using System.Security.Cryptography.X509Certificates;
using Back.Domain.Models;
using Back.Domain.Repositories;
using Back.Infrastructure.Database;
using Microsoft.AspNetCore.Mvc;

namespace Back.Controllers
{
    [ApiController]
    [Route("api/seed")]
    public class SeedController
    {

        private readonly IUserRepository _userRepository;
        private readonly IRutasRepository _rutasRepository;
        private readonly IEnviosRepository _enviosRepository;
        private readonly IVehiculoRepository _vehiculoRepository;
        private readonly LogiTrackDbContext _context;


        public SeedController(IUserRepository userRepository, IRutasRepository rutasRepository, IEnviosRepository enviosRepository, IVehiculoRepository vehiculoRepository, LogiTrackDbContext context )
        {

            _userRepository = userRepository;
            _rutasRepository = rutasRepository;
            _enviosRepository = enviosRepository;
            _vehiculoRepository = vehiculoRepository;
            _context = context;
        }

        [HttpPost]
        public async Task<IResult> Seed()
        {
            var transportistas = await _userRepository.GetTransportistas();
            var paquetes = await _enviosRepository.GetPaquetesEnSucursal();
            
            var vehiculos = await _vehiculoRepository.GetVehiculosActivos();

            if (!transportistas.Any() || !paquetes.Any() || !vehiculos.Any())
                return Results.BadRequest("No hay suficientes datos para generar rutas.");

            int paquetesPorRuta = (int)Math.Ceiling((double)paquetes.Count / transportistas.Count);

            for (int i = 0; i < transportistas.Count; i++)
            {
                var transportista = transportistas[i];
                var vehiculo = vehiculos[i % vehiculos.Count];
                var paquetesAsignados = paquetes.Skip(i * paquetesPorRuta).Take(paquetesPorRuta).ToList();

                if (paquetesAsignados.Any())
                {
                    var ruta = new Ruta(transportista, vehiculo);

                    ruta.AgregarPaquetes(paquetesAsignados);

                    await _rutasRepository.Add(ruta);
                }
            }

            await _context.SaveChangesAsync();

            return Results.Ok();
        }
    }
}