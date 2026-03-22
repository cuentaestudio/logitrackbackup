using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalEnviosRepository : IEnviosRepository
    {

        List<Paquete> _paquetes = [];
        List<Ruta> _rutas = [];
        List<Sucursal> _sucursales = [];
        

        public Task Add(Paquete envio)
        {
            _paquetes.Add(envio);
            return Task.CompletedTask;
        }

        public Task Add(Ruta ruta)
        {
            _rutas.Add(ruta);
            return Task.CompletedTask;
        }

        public Task Add(Sucursal sucursal)
        {
            _sucursales.Add(sucursal);
            return Task.CompletedTask;
        }

        public Task<List<Ruta>> GetHistorialRutas(Guid id)
        {   
            var rutas = _rutas.Where(r => r.Transportista.Id == id).ToList();
            return Task.FromResult(rutas);
        }

        public Task<List<Ruta>> GetMisRutasSupervisadas(Guid supervisor)
        {

            throw new NotImplementedException();
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
    }
}