using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalRutasReposiory : IRutasRepository
    {

        private readonly List<Ruta> _rutas = new();

        public Task Add(Ruta ruta)
        {
            _rutas.Add(ruta);
            return Task.CompletedTask;
        }

        public Task<List<Ruta>> GetHistorialRutas(Guid transportista)
        {
            var rutas = _rutas.Where(r => r.Transportista.Id == transportista).ToList();
            return Task.FromResult(rutas);
            
        }

        public Task<List<Ruta>> GetMisRutasSupervisadas(Guid supervisor)
        {
            throw new NotImplementedException();
        }

        public Task<Ruta?> GetRutaById(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Ruta>> GetRutas()
        {
            throw new NotImplementedException();
        }

        public Task<bool> IsVehiculoEnRuta(Guid vehiculoId)
        {
            throw new NotImplementedException();
        }
    }
}