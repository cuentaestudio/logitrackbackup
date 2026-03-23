using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Repositories
{
    public class LocalEnviosRepository : IEnviosRepository
    {

        List<Paquete> _paquetes = [
            new Paquete( 2.5, 20, 15, new Cliente("Juan", "Pérez", new Direccion("Calle 1", "CABA", "1001")), new Cliente("María", "García", new Direccion("Calle 10", "CABA", "1010")), "Documentos"),
            new Paquete( 5.0, 30, 25, new Cliente("Carlos", "López", new Direccion("Calle 2", "CABA", "1002")), new Cliente("Ana", "Martínez", new Direccion("Calle 11", "Rosario", "2000")), "Electrónicos"),
            new Paquete(1.2, 10, 10, new Cliente("Luis", "Rodríguez", new Direccion("Calle 3", "La Plata", "1900")), new Cliente("Sofía", "Sánchez", new Direccion("Calle 12", "CABA", "1012")), "Ropa"),
            new Paquete( 10.5, 50, 40, new Cliente("Elena", "Gómez", new Direccion("Calle 4", "Córdoba", "5000")), new Cliente("Pedro", "Díaz", new Direccion("Calle 13", "Mendoza", "5500")), "Herramientas"),
            new Paquete(0.8, 15, 5, new Cliente("Marta", "Fernández", new Direccion("Calle 5", "CABA", "1005")), new Cliente("Diego", "Ruiz", new Direccion("Calle 14", "CABA", "1014")), "Libros"),
            new Paquete(3.4, 25, 20, new Cliente("Roberto", "Álvarez", new Direccion("Calle 6", "Rosario", "2000")), new Cliente("Lucía", "Torres", new Direccion("Calle 15", "La Plata", "1900")), "Juguetes"),
            new Paquete(1.5, 15, 10, new Cliente("Hugo", "Sosa", new Direccion("Av. Siempreviva 742", "CABA", "1400")), new Cliente("Bart", "Simpson", new Direccion("Calle Falsa 123", "CABA", "1400")), "Skate"),
            new Paquete(4.2, 35, 30, new Cliente("Miguel", "Angel", new Direccion("Vaticano 1", "CABA", "1000")), new Cliente("Leonardo", "Da Vinci", new Direccion("Florencia 500", "CABA", "1000")), "Pinturas"),
            new Paquete(0.5, 5, 5, new Cliente("Jorge", "Luis", new Direccion("Maipú 900", "CABA", "1006")), new Cliente("Adolfo", "Bioy", new Direccion("Posadas 1600", "CABA", "1011")), "Manuscritos"),
            new Paquete(12.0, 60, 50, new Cliente("Esteban", "Quito", new Direccion("Lomas 45", "Lomas de Zamora", "1832")), new Cliente("Aquiles", "Bailo", new Direccion("Paz 100", "Tandil", "7000")), "Muebles"),
            new Paquete(2.1, 20, 20, new Cliente("Inés", "Table", new Direccion("Ruta 2", "Mar del Plata", "7600")), new Cliente("Elsa", "Pato", new Direccion("Laguna 4", "Chascomús", "7130")), "Inflables"),
            new Paquete(1.8, 15, 15, new Cliente("Marcos", "Paz", new Direccion("Belgrano 200", "CABA", "1000")), new Cliente("Julia", "Domínguez", new Direccion("San Martín 450", "Salta", "4400")), "Indumentaria"),
            new Paquete(0.3, 5, 5, new Cliente("Luciano", "Pereyra", new Direccion("Luján 123", "Luján", "6700")), new Cliente("Abel", "Pintos", new Direccion("Bahía Blanca 800", "Bahía Blanca", "8000")), "CDs Autografiados"),
            new Paquete(7.5, 40, 30, new Cliente("Ricardo", "Darin", new Direccion("Corrientes 1500", "CABA", "1000")), new Cliente("Guillermo", "Francella", new Direccion("Avellaneda 300", "Avellaneda", "1870")), "Premios"),
            new Paquete(2.2, 20, 10, new Cliente("Lionel", "Messi", new Direccion("Rosario 10", "Rosario", "2000")), new Cliente("Angel", "Di Maria", new Direccion("Funes 50", "Funes", "2132")), "Botines"),
            new Paquete(15.0, 80, 60, new Cliente("Mirtha", "Legrand", new Direccion("Libertador 2000", "CABA", "1425")), new Cliente("Susana", "Gimenez", new Direccion("Barrio Parque 1", "CABA", "1425")), "Vajilla de Cristal"),
        ];

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