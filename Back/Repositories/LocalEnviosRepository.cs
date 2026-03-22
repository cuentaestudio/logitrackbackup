using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalEnviosRepository : IEnviosRepository
    {

        List<Paquete> _paquetes = [];
        List<Sucursal> _sucursales = [];
        

        public Task Add(Paquete envio)
        {
            _paquetes.Add(envio);
            return Task.CompletedTask;
        }


        public Task Add(Sucursal sucursal)
        {
            _sucursales.Add(sucursal);
            return Task.CompletedTask;
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

        public Task<List<Paquete>> GetPaquetes(List<Guid> paqueteIds)
        {
            var paquetes = _paquetes.Where(p => paqueteIds.Contains(p.Id)).ToList();
            return Task.FromResult(paquetes);
        }

        public Task<List<Paquete>> GetPaquetesEnSucursal()
        {     
            var paquetes = _paquetes.Where(p => p.EstaEnSucursal).ToList();
            return Task.FromResult(paquetes);
            
        }

        public Task<List<Sucursal>> GetSucursales()
        {
            return Task.FromResult(_sucursales);
        }
    }
}