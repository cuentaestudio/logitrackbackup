using Back.Application.Services;
using Back.Domain.Models;
using Back.Domain.Repositories;

namespace Back.Infrastructure
{
    /// <summary>
    /// Seeder para cargar datos de prueba en memoria
    /// Solo ejecuta si EnableSeedData = true en configuración
    /// </summary>
    public class DatabaseSeeder
    {
        private readonly IUserRepository _userRepository;
        private readonly IEnviosRepository _enviosRepository;
        private readonly IVehiculoRepository _vehiculoRepository;
        private readonly IRutasRepository _rutasRepository;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(
            IUserRepository userRepository,
            IEnviosRepository enviosRepository,
            IVehiculoRepository vehiculoRepository,
            IRutasRepository rutasRepository,
            ILogger<DatabaseSeeder> logger)
        {
            _userRepository = userRepository;
            _enviosRepository = enviosRepository;
            _vehiculoRepository = vehiculoRepository;
            _rutasRepository = rutasRepository;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                _logger.LogInformation("[SEED] Iniciando carga de datos de prueba...");

                // Crear usuarios
                var supervisor = await SeedSupervisor();
                var operador = await SeedOperador();
                var transportista = await SeedTransportista();

                _logger.LogInformation($"[SEED] ✓ 3 usuarios creados");

                // Los vehículos ya existen en LocalVehiculoRepository (20 por defecto)
                var vehiculos = await _vehiculoRepository.GetAll();
                _logger.LogInformation($"[SEED] ✓ {vehiculos.Count} vehículos disponibles");

                // Crear paquetes/envíos
                await SeedPaquetes();
                _logger.LogInformation($"[SEED] ✓ Paquetes creados");

                // Crear rutas
                await SeedRutas(transportista, vehiculos);
                _logger.LogInformation($"[SEED] ✓ Rutas creadas");

                _logger.LogInformation("[SEED] ✓ Datos de prueba cargados exitosamente");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[SEED] ✗ Error al cargar datos: {ex.Message}");
                throw;
            }
        }

        private async Task<Supervisor> SeedSupervisor()
        {
            var passwordHash = PasswordHasher.HashPassword("password123");
            var supervisor = new Supervisor(
                "María",
                "García",
                "supervisor@logitrack.com",
                passwordHash,
                "12345678"
            );
            await _userRepository.Add(supervisor);
            _logger.LogInformation($"[SEED] Usuario Supervisor: {supervisor.Email}");
            return supervisor;
        }

        private async Task<Operador> SeedOperador()
        {
            var passwordHash = PasswordHasher.HashPassword("password123");
            var operador = new Operador(
                "Juan",
                "López",
                "operador@logitrack.com",
                passwordHash,
                "87654321"
            );
            await _userRepository.Add(operador);
            _logger.LogInformation($"[SEED] Usuario Operador: {operador.Email}");
            return operador;
        }

        private async Task<Transportista> SeedTransportista()
        {
            var passwordHash = PasswordHasher.HashPassword("password123");
            var transportista = new Transportista(
                "Carlos",
                "Rodríguez",
                "transportista@logitrack.com",
                passwordHash,
                "11111111"
            );
            await _userRepository.Add(transportista);
            _logger.LogInformation($"[SEED] Usuario Transportista: {transportista.Email}");
            return transportista;
        }

        private async Task SeedPaquetes()
        {
            // Sucursales (clientes)
            var sucursalBsAs = new Cliente(
                "Sucursal",
                "Buenos Aires",
                new Direccion("Av. Corrientes 1234", "Buenos Aires", "1043", "Centro comercial")
            );

            var sucursalLaPlata = new Cliente(
                "Sucursal",
                "La Plata",
                new Direccion("Calle 8 y 50", "La Plata", "1900", "Cerca de plaza")
            );

            var clientesDestino = new[]
            {
                new Cliente("Roberto", "García", new Direccion("Calle 25 de Mayo 500", "Buenos Aires", "1002", "Apto 5")),
                new Cliente("Laura", "Martínez", new Direccion("Diagonal 80 y 5", "La Plata", "1900", "Casa azul")),
                new Cliente("Pedro", "López", new Direccion("Ruta 2 km 50", "Berazategui", "1884", "Galpón amarillo")),
                new Cliente("Ana", "Fernández", new Direccion("Consti 1200", "La Plata", "1900", "Oficina")),
                new Cliente("Diego", "Romero", new Direccion("San Martín 234", "Buenos Aires", "1004", "Apto 12")),
            };

            var paquetes = new List<Paquete>();

            // Paquete 1: En sucursal (sin entregar)
            paquetes.Add(new Paquete(
                "LOG-2024-001",
                2.5,
                30,
                20,
                sucursalBsAs,
                clientesDestino[0],
                "Libros técnicos"
            ));

            // Paquete 2: En tránsito
            var p2 = new Paquete(
                "LOG-2024-002",
                5.0,
                40,
                30,
                sucursalBsAs,
                clientesDestino[1],
                "Equipamiento de oficina"
            );
            p2.EnTransito();
            paquetes.Add(p2);

            // Paquete 3: Entregado
            var p3 = new Paquete(
                "LOG-2024-003",
                1.5,
                25,
                15,
                sucursalLaPlata,
                clientesDestino[2],
                "Electrónica"
            );
            p3.EnTransito();
            p3.Entregar();
            paquetes.Add(p3);

            // Paquete 4: Cancelado
            var p4 = new Paquete(
                "LOG-2024-004",
                3.0,
                35,
                25,
                sucursalBsAs,
                clientesDestino[3],
                "Productos frágiles"
            );
            p4.Cancelar("Cliente solicita cancelación");
            paquetes.Add(p4);

            // Paquete 5: En sucursal pequeño
            paquetes.Add(new Paquete(
                "LOG-2024-005",
                0.5,
                15,
                10,
                sucursalLaPlata,
                clientesDestino[4],
                "Documentos"
            ));

            // Paquete 6: En tránsito grande
            var p6 = new Paquete(
                "LOG-2024-006",
                15.0,
                50,
                40,
                sucursalBsAs,
                clientesDestino[0],
                "Maquinaria"
            );
            p6.EnTransito();
            paquetes.Add(p6);

            // Paquete 7: Entregado hace tiempo
            var p7 = new Paquete(
                "LOG-2024-007",
                2.0,
                30,
                20,
                sucursalLaPlata,
                clientesDestino[1],
                "Repuestos"
            );
            p7.EnTransito();
            p7.Entregar();
            paquetes.Add(p7);

            // Agregar todos los paquetes
            foreach (var paquete in paquetes)
            {
                await _enviosRepository.Add(paquete);
            }

            _logger.LogInformation($"[SEED] {paquetes.Count} paquetes creados con diferentes estados (EnSucursal, EnTransito, Entregado, Cancelado)");
        }

        private async Task SeedRutas(Transportista transportista, List<Vehiculo> vehiculos)
        {
            // Obtener paquetes
            var allPaquetes = await _enviosRepository.GetAll();

            if (vehiculos.Count < 2)
            {
                _logger.LogWarning("[SEED] No hay suficientes vehículos para crear rutas");
                return;
            }

            // Crear paquetes frescos SOLO para las rutas (sin modificar otros)
            var sucursalBsAs = new Cliente(
                "Sucursal",
                "Buenos Aires",
                new Direccion("Av. Corrientes 1234", "Buenos Aires", "1043", "Centro comercial")
            );

            var cliente1 = new Cliente("Cliente Ruta 1", "A", new Direccion("Calle 1", "Buenos Aires", "1000", ""));
            var cliente2 = new Cliente("Cliente Ruta 2", "B", new Direccion("Calle 2", "Buenos Aires", "1000", ""));
            var cliente3 = new Cliente("Cliente Ruta 3", "C", new Direccion("Calle 3", "Buenos Aires", "1000", ""));
            var cliente4 = new Cliente("Cliente Ruta 4", "D", new Direccion("Calle 4", "Buenos Aires", "1000", ""));
            var cliente5 = new Cliente("Cliente Ruta 5", "E", new Direccion("Calle 5", "Buenos Aires", "1000", ""));
            var cliente6 = new Cliente("Cliente Ruta 6", "F", new Direccion("Calle 6", "Buenos Aires", "1000", ""));

            // Ruta 1: Pendiente (sin iniciar) - Paquetes en EnSucursal
            var ruta1 = new Ruta(transportista, vehiculos[0]);
            var p1_1 = new Paquete("LOG-RUTA1-001", 2.0, 30, 20, sucursalBsAs, cliente1, "Envío Ruta 1 - Paquete 1");
            var p1_2 = new Paquete("LOG-RUTA1-002", 1.5, 25, 15, sucursalBsAs, cliente2, "Envío Ruta 1 - Paquete 2");
            await _enviosRepository.Add(p1_1);
            await _enviosRepository.Add(p1_2);
            ruta1.AgregarPaquete(p1_1);
            ruta1.AgregarPaquete(p1_2);
            await _rutasRepository.Add(ruta1);

            // Ruta 2: En curso - Paquetes en EnSucursal al inicio, se pasan a EnTransito
            var ruta2 = new Ruta(transportista, vehiculos[1]);
            var p2_1 = new Paquete("LOG-RUTA2-001", 3.0, 35, 25, sucursalBsAs, cliente3, "Envío Ruta 2 - Paquete 1");
            var p2_2 = new Paquete("LOG-RUTA2-002", 2.5, 30, 20, sucursalBsAs, cliente4, "Envío Ruta 2 - Paquete 2");
            await _enviosRepository.Add(p2_1);
            await _enviosRepository.Add(p2_2);
            ruta2.AgregarPaquete(p2_1);
            ruta2.AgregarPaquete(p2_2);
            ruta2.Iniciar(); // Aquí se cambian a EnTransito
            await _rutasRepository.Add(ruta2);

            // Ruta 3: Finalizada - Paquetes en EnSucursal, se pasan a EnTransito y Entregado
            var ruta3 = new Ruta(transportista, vehiculos[0]);
            var p3_1 = new Paquete("LOG-RUTA3-001", 1.0, 20, 15, sucursalBsAs, cliente5, "Envío Ruta 3 - Paquete 1");
            var p3_2 = new Paquete("LOG-RUTA3-002", 2.0, 30, 20, sucursalBsAs, cliente6, "Envío Ruta 3 - Paquete 2");
            await _enviosRepository.Add(p3_1);
            await _enviosRepository.Add(p3_2);
            ruta3.AgregarPaquete(p3_1);
            ruta3.AgregarPaquete(p3_2);
            ruta3.Iniciar(); // Aquí se cambian a EnTransito
            ruta3.Finalizar(); // Finaliza ruta (paquetes siguen en EnTransito)
            await _rutasRepository.Add(ruta3);

            _logger.LogInformation($"[SEED] 3 rutas creadas (Pendiente, EnCurso, Finalizada)");
        }
    }
}
