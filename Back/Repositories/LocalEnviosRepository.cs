using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalEnviosRepository : IEnviosRepository
    {

        private readonly List<Paquete> _paquetes = new List<Paquete>();

        private readonly List<Ruta> _rutas = new List<Ruta>();
        private readonly List<Vehiculo> _vehiculos = new List<Vehiculo>();
        private readonly List<Sucursal> _sucursales = new List<Sucursal>();



        public Task Add(Paquete envio)
        {
            _paquetes.Add(envio);

            Console.WriteLine($"Paquete agregado: {envio.CodigoSeguimiento}, Peso: {envio.Peso}, Remitente: {envio.Remitente.Nombre} {envio.Remitente.Apellido}, Destinatario: {envio.Destinatario.Nombre} {envio.Destinatario.Apellido}");
            return Task.CompletedTask;
        }

        public Task Add(Ruta ruta)
        {
            _rutas.Add(ruta);
            return Task.CompletedTask;
        }

        public Task Add(Vehiculo vehiculo)
        {
            _vehiculos.Add(vehiculo);
            return Task.CompletedTask;
        }

        public Task Add(Sucursal sucursal)
        {
            _sucursales.Add(sucursal);
            return Task.CompletedTask;

        }

        public Task<List<Ruta>> GetHistorialRutas(Guid transportista)
        {
            var rutas = _rutas.Where(r => r.Transportista.Id == transportista).ToList();
            return Task.FromResult(rutas);

        }

        public Task<List<Ruta>> GetMisRutasSupervisadas(Guid supervisor)
        {
            var rutas = _rutas.Where(r => r.Id == supervisor).ToList();
            return Task.FromResult(rutas);
        }

        public Task<Paquete?> GetPaquete(Guid id)
        {
            var paquete = _paquetes.FirstOrDefault(p => p.Id == id);
            return Task.FromResult(paquete);

        }

        public Task<Paquete?> GetPaqueteByCodigoSeguimiento(string codigoSeguimiento)
        {
            var paquete = _paquetes.FirstOrDefault(p => p.CodigoSeguimiento == codigoSeguimiento);
            return Task.FromResult(paquete);
        }

        public Task<List<Paquete>> GetPaquetesEnSucursal()
        {
            var paquetes = _paquetes.Where(p => p.EstaEnSucursal).ToList();
            return Task.FromResult(paquetes);

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

        public Task<List<Sucursal>> GetSucursales()
        {
            return Task.FromResult(_sucursales);
        }

        public Task<Transportista?> GetTransportistaById(Guid id)
        {   
            return Task.FromResult(_rutas.Select(r => r.Transportista).FirstOrDefault(t => t.Id == id));
        }

        public Task<List<Vehiculo>> GetVehiculosActivos()
        {
            var vehiculos = _vehiculos.Where(v => v.Activo).ToList();
            return Task.FromResult(vehiculos);
        }
    }
}