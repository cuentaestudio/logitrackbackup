using Back.Application.Services;
using Back.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Back.Infrastructure.Database
{
    public class DatabaseSeeder
    {

        private readonly LogiTrackDbContext _context;

        public DatabaseSeeder(LogiTrackDbContext context)
        {
            this._context = context;
        }

        public async Task SeedAsync()
        {
            _context.Database.EnsureCreated();

            List<Operador> operadores = UsuarioGenerator.GenerarOperadores(20);

            List<Supervisor> supervisores = UsuarioGenerator.GenerarSupervisores(20);

            List<Transportista> transportistas = UsuarioGenerator.GenerarTransportistas(50);


            _context.Usuarios.AddRange([.. operadores, .. supervisores, .. transportistas]);

            _context.Sucursales.AddRange(new List<Sucursal>
            {

                new Sucursal("Sucursal Principal", "Calle", "Ciudad", "123456789"),
                new Sucursal("Sucursal Secundaria", "Avenida", "Ciudad", "987654321"),
                new Sucursal("Sucursal Secundaria", "Avenida", "Ciudad", "987654321"),
                new Sucursal("Sucursal Secundaria", "Avenida", "Ciudad", "987654321"),
                new Sucursal("Sucursal Secundaria", "Avenida", "Ciudad", "987654321"),
                new Sucursal("Sucursal Secundaria", "Avenida", "Ciudad", "987654321"),
                new Sucursal("Sucursal Secundaria", "Avenida", "Ciudad", "987654321")
            });

            var vehiculos = PaquetesGenerator.GenerarVehiculos(20);

            await _context.Vehiculos.AddRangeAsync();


            var paquetes = PaquetesGenerator.GenerarPaquetes(500);


            var rutas = RutasGenerator.GenerarRutas(paquetes, transportistas, vehiculos);

            RutaRandomizerManager.Randomizar(rutas);


            _context.Rutas.AddRange(rutas);

            await _context.SaveChangesAsync();
        }
    }

    public static class PaquetesGenerator
    {
        private static List<string> nombres = new List<string>
        {
            "Juan", "María", "Carlos", "Ana", "Luis", "Sofía", "Diego", "Valentina",
            "Matías", "Camila", "Federico", "Lucía", "Martín", "Isabella", "Santiago", "Alejandro",
            "Beatriz", "Daniel", "Elena", "Facundo", "Gabriela", "Hugo", "Irene", "Javier",
            "Karina", "Leonardo", "Mónica", "Nicolás", "Olivia", "Pablo", "Raquel", "Sebastián",
            "Teresa", "Ulises", "Victoria", "Roberto", "Adrián", "Bárbara", "Cristian", "Delfina"

        };

        private static List<string> apellidos = new List<string>
        {
            "Pérez", "Gómez", "Rodríguez", "Martínez", "López", "Fernández", "Díaz", "Morales",
            "Castro", "Ortiz", "Sánchez", "Torres", "Ramírez", "Flores", "Herrera", "García",
            "Pellegrini", "Sarmiento", "Vázquez", "Blanco", "Ramos", "Ruiz", "Medina", "Suárez",
            "Castillo", "Romero", "Méndez", "Guzmán", "Álvarez", "Moreno", "Ibarra", "Rojas",
            "Ortega", "Vargas", "Mendoza", "Silva", "Farías", "Acosta", "Ríos", "Benítez"
        };

        private static Random _random = new Random();

        public static Cliente GenerarCliente()
        {
            return new Cliente(
                nombres[_random.Next(nombres.Count)],
                apellidos[_random.Next(apellidos.Count)],
                new Direccion("Calle Falsa 123", "Springfield", "12345")
            );
        }

        public static List<Vehiculo> GenerarVehiculos(int count)
        {
            var marcas = new List<string> { "Ford", "Chevrolet", "Toyota", "Renault", "Volkswagen" };
            var result = new List<Vehiculo>();

            for (int i = 0; i < count; i++)
            {
                var patente = $"PAT{_random.Next(100, 999)}{(char)_random.Next('A', 'Z' + 1)}";
                var marca = marcas[_random.Next(marcas.Count)];
                var capacidad = _random.Next(500, 2000);

                result.Add(new Vehiculo(patente, marca, capacidad));
            }

            return result;
        }

        public static List<Paquete> GenerarPaquetes(int count)
        {
            var descripciones = new List<string>
            {
                "Electrónicos", "Elementos de cocina", "Productos de limpieza",
                "Indumentaria", "Libros", "Juguetes", "Herramientas", "Documentación",
                "Artículos de oficina", "Calzado deportivo", "Repuestos automotrices",
                "Pequeños electrodomésticos", "Materiales de construcción", "Insumos médicos",
                "Artículos de jardinería", "Decoración para el hogar", "Instrumentos musicales",
                "Equipamiento de camping", "Suplementos dietarios", "Cosméticos",
                "Perfumería", "Relojería", "Joyería de fantasía", "Papelería",
                "Muebles para armar", "Cuadros y marcos", "Lámparas", "Alfombras",
                "Vajilla de vidrio", "Cubiertos", "Mantelería", "Blanquería",
                "Alimentos no perecederos", "Bebidas embotelladas", "Café y té",
                "Golosinas", "Artículos para mascotas", "Accesorios de telefonía",
                "Componentes de PC", "Cámaras fotográficas", "Videojuegos",
                "Películas y música", "Equipos de sonido", "Bicicletas",
                "Artículos de pesca", "Pelotas y balones", "Pesas y mancuernas",
                "Ropa de cama"

            };

            var result = new List<Paquete>();

            for (int i = 0; i < count; i++)
            {

                Paquete paquete = new Paquete(_random.NextDouble() * 20 + 0.5, _random.Next(10, 100), _random.Next(10, 100), GenerarCliente(), GenerarCliente(), descripciones[_random.Next(descripciones.Count)]);


                result.Add(paquete);
            }

            return result;
        }

    }


    public static class RutasGenerator
    {

        public static List<Ruta> GenerarRutas(List<Paquete> paquetes, List<Transportista> transportistas, List<Vehiculo> vehiculos)
        {
            var rutas = new List<Ruta>();

            var paquetesDisponibles = paquetes.Where(p => p.EstaEnSucursal).ToList();

            var transportistasActivos = transportistas.Where(t => t.PuedeSerAsignado).ToList();
            var vehiculosDisponibles = vehiculos.Where(v => v.Estado == VehiculoEstado.Disponible).ToList();

            if (!paquetesDisponibles.Any() || !transportistasActivos.Any() || !vehiculosDisponibles.Any())
                return rutas;

            int cantidadRutas = Math.Min(transportistasActivos.Count, vehiculosDisponibles.Count);

            int paquetesPorRuta = (int)Math.Ceiling((double)paquetesDisponibles.Count / cantidadRutas);

            for (int i = 0; i < cantidadRutas; i++)
            {
                var transportista = transportistasActivos[i];
                var vehiculo = vehiculosDisponibles[i];
                var paquetesAsignados = paquetesDisponibles.Skip(i * paquetesPorRuta).Take(paquetesPorRuta).ToList();

                if (paquetesAsignados.Any())
                {
                    var ruta = new Ruta(transportista, vehiculo);
                    ruta.AgregarPaquetes(paquetesAsignados);

                    rutas.Add(ruta);
                }

            }
            return rutas;
        }
    }


    public static class RutaRandomizerManager
    {
        private static readonly Random _random = new Random();

        public static void Randomizar(List<Ruta> rutas)
        {
            foreach (var ruta in rutas)
            {
                Randomizar(ruta);
            }
        }

        public static void Randomizar(Ruta ruta)
        {
            var decision = _random.Next(0, 100);

            if (decision < 10) // 10% chance to cancel the route
            {
                ruta.Cancelar("Cancelación aleatoria por simulación");
                return;
            }

            // Start the route to put packages in transit
            ruta.Iniciar();

            if (decision < 30) // 20% chance to stay in progress with all packages in transit
            {
                return;
            }

            if (decision < 80) // 50% chance to deliver some packages
            {
                var paquetesAEntregar = ruta.Paquetes.Take(_random.Next(1, ruta.Paquetes.Count)).ToList();
                foreach (var p in paquetesAEntregar)
                {
                    ruta.EntregarPaquete(p.Id);
                }
            }
            else // 20% chance to complete everything
            {
                var paquetesIds = ruta.Paquetes.Select(p => p.Id).ToList();
                foreach (var id in paquetesIds)
                {
                    ruta.EntregarPaquete(id);
                }
            }

        }

        public static void FinalizarRuta(Ruta ruta)
        {
        }
    }
}