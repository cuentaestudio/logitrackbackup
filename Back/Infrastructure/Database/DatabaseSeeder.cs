using Back.Application.Services;
using Back.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Back.Infrastructure.Database
{
    public class DatabaseSeeder
    {

        private readonly LogiTrackDbContext _context;

        private readonly IConfiguration _configuration;

        public DatabaseSeeder(LogiTrackDbContext context, IConfiguration configuration)
        {
            this._context = context;
            this._configuration = configuration;

        }

        public async Task SeedAsync()
        {


            DatabaseSeederConfiguration config = _configuration.GetSection("DatabaseSeederConfiguration").Get<DatabaseSeederConfiguration>() ?? new DatabaseSeederConfiguration();

            List<Operador> operadores = UsuarioGenerator.GenerarOperadores(config.CantidadOperadores);

            List<Supervisor> supervisores = UsuarioGenerator.GenerarSupervisores(config.CantidadSupervisores);

            List<Transportista> transportistas = UsuarioGenerator.GenerarTransportistas(config.CantidadTransportistas);


            _context.Usuarios.AddRange([.. operadores, .. supervisores, .. transportistas]);

            _context.Sucursales.AddRange(new List<Sucursal>
            {
                new Sucursal("Sucursal Quilmes", "Rivadavia 350", "Quilmes", "4253-1122"),
                new Sucursal("Sucursal Morón", "9 de Julio 450", "Morón", "4483-5566"),
                new Sucursal("Sucursal Ramos Mejía", "Av. de Mayo 200", "La Matanza", "4654-7788"),
                new Sucursal("Sucursal Olivos", "Av. Maipú 2300", "Vicente López", "4799-3344"),
                new Sucursal("Sucursal Tigre", "Cazón 1100", "Tigre", "4749-0011"),
                new Sucursal("Sucursal Lanús", "25 de Mayo 150", "Lanús", "4241-9900")

            });

            var vehiculos = PaquetesGenerator.GenerarVehiculos(config.CantidadVehiculos);



            var paquetes = PaquetesGenerator.GenerarPaquetes(config.CantidadPaquetes);


            var rutas = RutasGenerator.GenerarRutas(paquetes, transportistas, vehiculos);

            RutaRandomizerManager.Randomizar(rutas);


            _context.Rutas.AddRange(rutas);

            await _context.SaveChangesAsync();
        }
    }

    public static class PaquetesGenerator
    {
        private static readonly Ubicacion BuenosAires = new Ubicacion(-34.6037, -58.3816);
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


        private static List<string> calles = new List<string>
        {
            "Avenida de Mayo", "9 de Julio", "Corrientes", "Rivadavia", "Belgrano",
            "San Martín", "Santa Fe", "Callao", "Córdoba", "Leandro N. Alem",
            "Paseo Colón", "Libertador", "Juan B. Justo", "Pueyrredón", "Jujuy",
            "Entre Ríos", "Las Heras", "Alvear", "Quintana", "Sarmiento",
            "Mitre", "Roca", "Urquiza", "Saavedra", "Moreno",
            "Castelli", "Paso", "Larrea", "Azcuénaga", "Matheu",
            "Alberti", "Hipólito Yrigoyen", "Florida", "Lavalle", "Esmeralda",
            "Maipú", "Chacabuco", "Suipacha", "Reconquista", "25 de Mayo",
            "Defensa", "Balcarce", "Bolívar", "Perú", "Chile",
            "México", "Venezuela", "Estados Unidos", "Carlos Calvo", "Humberto 1°",
            "San Juan", "Cochabamba", "Constitución", "Pavón", "Garay",
            "Brasil", "Caseros", "Monteagudo", "Iguazú", "Uspallata",
            "Almafuerte", "Pedro de Mendoza", "Regimiento de Patricios", "Montes de Oca", "Suárez",
            "Olavarría", "Brandsen", "Pinzón", "Aristóbulo del Valle", "Wenceslao Villafañe",
            "Benito Quinquela Martín", "Magallanes", "Rocha", "Mendoza", "Juramento",
            "Echeverría", "Sucre", "La Pampa", "Triunvirato", "Olazábal",
            "Blanco Encalada", "Monroe", "Roosevelt", "Congreso", "Ugarte",
            "Quesada", "Iberá", "Guayra", "Campos Salles", "Manuela Pedraza",
            "Juana Azurduy", "Crisólogo Larralde", "Núñez", "Comodoro Rivadavia", "Vilela",
            "Paroissien", "García del Río", "San Isidro Labrador", "Pico", "Deheza",
            "Arias", "Ramallo", "Correa", "Ruiz Huidobro", "Besares",
            "Vedia", "General Paz", "Donado", "Holmberg", "Estomba",
            "Tronador", "Plaza", "Melián", "Conesa", "Zapiola",
            "Pinto", "Freire", "Conde", "Superí", "Capdevila",
            "Bauness", "Bucarelli", "Andonaegui", "Barzana", "Mariano Acha",
            "Lugones", "Miller", "Valdenegro", "Galván", "Constituyentes",
            "Beiró", "Lope de Vega", "Segurola", "Chivilcoy", "Bahía Blanca",
            "Joaquín V. González", "Mercedes", "Gualeguaychú", "Cuenca", "Campana",
            "Llavallol", "Concordia", "Helguera", "Argerich", "Artigas",
            "Bolivia", "Condarco", "Terrada", "Nazca", "Argerich"
        };


        private static Random _random = new Random();

        public static Cliente GenerarCliente()
        {
            return new Cliente(
                nombres[_random.Next(nombres.Count)],
                apellidos[_random.Next(apellidos.Count)],
                new Direccion(calles[_random.Next(calles.Count)] + " " + _random.Next(100, 999), "Springfield", "12345", null, CoordenadasGenerator.GenerarCoodenadasEnRadio(BuenosAires, 150))
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
    }

    public class DatabaseSeederConfiguration
    {
        public int CantidadTransportistas { get; set; } = 50;
        public int CantidadOperadores { get; set; } = 20;
        public int CantidadSupervisores { get; set; } = 20;
        public int CantidadVehiculos { get; set; } = 20;
        public int CantidadPaquetes { get; set; } = 150;
    }

    public class CoordenadasGenerator
    {
        private static Random rand = new Random();
        public static Ubicacion GenerarCoodenadasEnRadio(Ubicacion ubicacion, double maxRadiusKm)
        {

            // 111km por grado de latitud
            // 111 * cos(lat) para longitud (aprox 91km en BA)
            double kgPerLat = 111.0;
            double kgPerLon = 111.0 * Math.Cos(ubicacion.Latitud * Math.PI / 180);

            // Generar desfase en KM
            double theta = rand.NextDouble() * 2 * Math.PI;
            double dist = maxRadiusKm * Math.Sqrt(rand.NextDouble());

            double deltaLat = dist * Math.Sin(theta) / kgPerLat;
            double deltaLon = dist * Math.Cos(theta) / kgPerLon;

            return new Ubicacion(ubicacion.Latitud + deltaLat, ubicacion.Longitud + deltaLon);
        }
    }
}