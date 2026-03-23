using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalVehiculoRepository : IVehiculoRepository
    {

        private readonly List<Vehiculo> _vehiculos = new List<Vehiculo>()
        {
            new Vehiculo("AA123BB", "Mercedes-Benz Sprinter", 1500.0),
            new Vehiculo("AB456CD", "Ford Transit", 1200.0),
            new Vehiculo("AC789EF", "Renault Kangoo", 800.0),
            new Vehiculo("AD012GH", "Volkswagen Crafter", 2000.0),
            new Vehiculo("AE345IJ", "Iveco Daily", 2500.0),
            new Vehiculo("AF678KL", "Peugeot Partner", 750.0),
            new Vehiculo("AG901MN", "Citroën Berlingo", 750.0),
            new Vehiculo("AH234OP", "Fiat Ducato", 1800.0),
            new Vehiculo("AI567QR", "Toyota Hiace", 1100.0),
            new Vehiculo("AJ890ST", "Hyundai H1", 1000.0),
            new Vehiculo("AK123UV", "Chevrolet N300", 600.0),
            new Vehiculo("AL456WX", "Nissan NV350", 1300.0),
            new Vehiculo("AM789YZ", "Mitsubishi L300", 950.0),
            new Vehiculo("AN012AB", "Mercedes-Benz Vito", 1100.0),
            new Vehiculo("AO345CD", "Ford F-150", 1000.0),
            new Vehiculo("AP678EF", "Ram 1500", 900.0),
            new Vehiculo("AQ901GH", "Volkswagen Saveiro", 700.0),
            new Vehiculo("AR234IJ", "Renault Master", 1600.0),
            new Vehiculo("AS567KL", "Peugeot Expert", 1200.0),
            new Vehiculo("AT890MN", "Citroën Jumpy", 1000)
        };

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