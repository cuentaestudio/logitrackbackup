using Back.Application.Util;
using Back.Controllers;
using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Application.Services
{
    public class EnviosService
    {
        private readonly IEnviosRepository _enviosRepository;

        public EnviosService(IEnviosRepository enviosRepository)
        {
            _enviosRepository = enviosRepository;
        }


        public async Task RegistrarPaquete(RegistrarPaqueteRequest request)
        {

            var paquete = new Paquete(
                TrackIdGenerator.GenerateTrackId(),
                request.Peso,
                0,
                0,
                new Cliente(request.Remitente.Nombre, request.Remitente.Apellido, new Direccion(request.Remitente.Direccion, request.Remitente.Localidad, request.Remitente.CP)),
                new Cliente(request.Destinatario.Nombre, request.Destinatario.Apellido, new Direccion(request.Destinatario.Direccion, request.Destinatario.Localidad, request.Destinatario.CP)),
                request.Comentarios
            );

            await _enviosRepository.Add(paquete);
        }
    }
}