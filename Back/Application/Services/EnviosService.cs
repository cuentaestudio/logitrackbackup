using Back.Application.Util;
using Back.Controllers;
using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Application.Services
{
    public class EnviosService
    {
        private readonly IEnviosRepository _enviosRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRutasRepository _rutasRepository;

        public EnviosService(IEnviosRepository enviosRepository, IUserRepository userRepository)
        {
            _enviosRepository = enviosRepository;
            _userRepository = userRepository;
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


        public async Task ReasignarRuta(Guid rutaId, Guid transportistaId)
        {
            var ruta = await _rutasRepository.GetRutaById(rutaId);
            if (ruta is null)
                throw new InvalidOperationException("Ruta no encontrada");

            Usuario? usuario = await _userRepository.GetUsuarioById(transportistaId);

            if (usuario is null || usuario is not Transportista transportista)
                throw new InvalidOperationException("Transportista no encontrado");

            ruta.ReasignarTransportista(transportista);

            await _rutasRepository.Add(ruta);
        }
    }
}