using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalEnviosRepository : IEnviosRepository
    {

        List<Paquete> _paquetes = [];
        List<Sucursal> _sucursales = [new Sucursal("Sucursal Central", "Av. Corrientes 1234", "CABA", "011-4567-8901"),
            new Sucursal("Sucursal Almagro", "Rivadavia 3800", "CABA", "011-4981-2233"),
            new Sucursal("Sucursal Belgrano", "Cabildo 2100", "CABA", "011-4784-5566"),
            new Sucursal("Sucursal Flores", "Av. Gaona 2900", "CABA", "011-4612-7788"),
            new Sucursal("Sucursal Palermo", "Santa Fe 3200", "CABA", "011-4823-9900"),
            new Sucursal("Sucursal La Plata", "Calle 7 500", "La Plata", "0221-423-4455"),
            new Sucursal("Sucursal Mar del Plata", "Av. Luro 2500", "Mar del Plata", "0223-491-6677"),
            new Sucursal("Sucursal Rosario Centro", "Córdoba 1400", "Rosario", "0341-424-8899"),
            new Sucursal("Sucursal Rosario Norte", "Bv. Rondeau 300", "Rosario", "0341-455-1122"),
            new Sucursal("Sucursal Córdoba Capital", "Av. Colón 700", "Córdoba", "0351-421-3344"),
            new Sucursal("Sucursal Villa Carlos Paz", "Av. Libertad 150", "Villa Carlos Paz", "03541-422-5566"),
            new Sucursal("Sucursal Mendoza Centro", "Av. San Martín 1100", "Mendoza", "0261-423-7788"),
            new Sucursal("Sucursal San Rafael", "Hipólito Yrigoyen 500", "San Rafael", "0261-422-3344")];


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

        public Task<List<Paquete>> GetPaquetes(string? codigoSeguimiento, string? destinatario)
        {

            if (codigoSeguimiento is not null)
            {
                return GetPaqueteByCodigoSeguimiento(codigoSeguimiento).ContinueWith(t => t.Result is not null ? new List<Paquete> { t.Result } : new List<Paquete>());
            }

            var paquetes = _paquetes.Where(p => p.DestinatarioCompleto.Contains(destinatario ?? string.Empty, StringComparison.OrdinalIgnoreCase)).ToList();

            return Task.FromResult(paquetes);
        }

        public Task<List<Paquete>> GetPaquetesByIds(List<Guid> paqueteIds)
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