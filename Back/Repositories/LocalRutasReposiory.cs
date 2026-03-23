using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalRutasReposiory : IRutasRepository
    {

        private readonly List<Ruta> _rutas = new();

        public Task Add(Ruta ruta)
        {
            var existingRuta = _rutas.FirstOrDefault(r => r.Id == ruta.Id);
            if (existingRuta != null)
            {
                _rutas.Remove(existingRuta);
            }
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
            return Task.FromResult(_rutas.ToList());
        }

        public Task<Ruta?> GetRutaById(Guid id)
        {
            var ruta = _rutas.FirstOrDefault(r => r.Id == id);
            return Task.FromResult(ruta);
        }

        public Task<List<Ruta>> GetRutas()
        {   
            return Task.FromResult(_rutas);
            
        }

        public Task<bool> IsVehiculoEnRuta(Guid vehiculoId)
        {   
            var isEnRuta = _rutas.Any(r =>r.Vehiculo.Id == vehiculoId && r.Estado != RutaStatus.Finalizada);
            return Task.FromResult(isEnRuta);
            
        }
    }
}