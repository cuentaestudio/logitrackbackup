using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalVehiculoRepository : IVehiculoRepository
    {

        private readonly List<Vehiculo> _vehiculos = new List<Vehiculo>();

        public Task Add(Vehiculo vehiculo)
        {
            _vehiculos.Add(vehiculo);
            return Task.CompletedTask;
        }

        public Task<Vehiculo?> GetVehiculo(Guid id)
        {
            var vehiculo = _vehiculos.FirstOrDefault(v => v.Id == id);
            return Task.FromResult(vehiculo);
        }

        public Task<List<Vehiculo>> GetVehiculosActivos()
        {
            var vehiculos = _vehiculos.Where(v => v.Activo).ToList();
            return Task.FromResult(vehiculos); 
        }
    }
}