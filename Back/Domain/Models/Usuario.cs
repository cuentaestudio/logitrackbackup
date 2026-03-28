

using Back.Application.Services;

namespace Back.Domain.Models
{
    public abstract class Usuario
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Nombre { get; private set; }
        public string Apellido { get; private set; }
        public string Email { get; private set; }
        public string Password { get; private set; }
        public string DNI { get; private set; }

        public Usuario()
        {
        }

        public Usuario(string nombre, string apellido, string email, string password, string dni)
        {
            Nombre = nombre;
            Apellido = apellido;
            Email = email;
            Password = password;
            DNI = dni;
        }
    }

    public class Supervisor : Usuario
    {

        public Supervisor()
        {
        }

        public Supervisor(string nombre, string apellido, string email, string password, string dni) : base(nombre, apellido, email, password, dni) { }
    }

    public class Operador : Usuario
    {

        public Operador() { }

        public Operador(string nombre, string apellido, string email, string password, string dni) : base(nombre, apellido, email, password, dni)
        {
        }
    }

    public class Transportista : Usuario
    {
        public enum EstadoTransportista
        {
            Activo,
            Suspendido,
            Inhabilitado,
        }

        public string Licencia { get; private set; }
        public EstadoTransportista Estado { get; private set; } = EstadoTransportista.Activo;

        public Transportista()
        {
            Licencia = string.Empty;
        }

        public Transportista(string nombre, string apellido, string email, string password, string dni, string licencia = "No informada") : base(nombre, apellido, email, password, dni)
        {
            Licencia = licencia;
        }

        public void ActualizarLicencia(string licencia)
        {
            if (string.IsNullOrWhiteSpace(licencia))
                throw new InvalidOperationException("La licencia es obligatoria.");

            Licencia = licencia.Trim();
        }

        public void CambiarEstado(EstadoTransportista estado)
        {
            Estado = estado;
        }

        public bool PuedeSerAsignado => Estado == EstadoTransportista.Activo;

        public string EstadoLabel => Estado.ToString();

        public bool EstaSuspendido => Estado != EstadoTransportista.Activo;
    }


    public static class UsuarioGenerator
    {


        private static List<string> nombres = new List<string>
        {
            "Juan",
            "María",
            "Carlos",
            "Ana",
            "Luis",
            "Sofía",
            "Diego",
            "Valentina",
            "Matías",
            "Camila",
            "Federico",
            "Lucía",
            "Martín",
            "Isabella",
            "Santiago",
            "Alejandro",
            "Beatriz",
            "Daniel",
            "Elena",
            "Facundo",
            "Gabriela",
            "Hugo",
            "Irene",
            "Javier",
            "Karina",
            "Leonardo",
            "Mónica",
            "Nicolás",
            "Olivia",
            "Pablo",
            "Raquel",
            "Sebastián",
            "Teresa",
            "Ulises",
            "Victoria",

            "Roberto",  
        };
        
        private static List<string> apellidos = new List<string>
        {
            "Pérez",
            "Gómez",
            "Rodríguez",
            "Martínez",
            "López",
            "Fernández",
            "Díaz",
            "Morales",
            "Castro",
            "Ortiz",
            "Sánchez",
            "Torres",
            "Ramírez",
            "Flores",
            "Herrera",
            "García",
            "Pellegrini",
            "Sarmiento",
            "Vázquez",
            "Blanco",
            "Ramos",
            "Ruiz",
            "Medina",
            "Suárez",
            "Castillo",
            "Romero",
            "Méndez",
            "Guzmán",
            "Álvarez",
            "Moreno"

        };


        private static readonly Random random = new Random();
        public static Supervisor GenerateSupervisor(string nombre, string apellido, string email, string password, string dni)
        {
            return new Supervisor(nombre, apellido, email, password, dni);
        }

        public static Operador GenerateOperador(string nombre, string apellido, string email, string password, string dni)
        {
            return new Operador(nombre, apellido, email, password, dni);
        }

        public static Transportista GenerateTransportista(string nombre, string apellido, string email, string password, string dni, string licencia)
        {
            return new Transportista(nombre, apellido, email, password, dni, licencia);
        }

        public static List<Transportista> GenerarTransportistas(int count )
        {
            var result = new List<Transportista>();

            for (int i = 0; i < count; i++)
            {
                var nombre = nombres[random.Next(nombres.Count)];
                var apellido = apellidos[random.Next(apellidos.Count)];

                result.Add(new Transportista(
                    nombre,
                    apellido,
                    $"transportista{i + 1}@example.com",
                    PasswordHasher.HashPassword($"kjkszpj"),
                    $"{random.Next(10000000, 99999999)}",
                    $"LIC-{random.Next(1000, 9999)}"
                ));
            }

            return result;
        }

        public static List<Operador> GenerarOperadores(int count)
        {
            var result = new List<Operador>();

            for (int i = 0; i < count; i++)
            {
                var nombre = nombres [random.Next(nombres.Count)];
                var apellido = apellidos[random.Next(apellidos.Count)];

                result.Add(new Operador(
                    nombre,
                    apellido,
                    $"operador{i + 1}@example.com",
                    PasswordHasher.HashPassword($"kjkszpj"),
                    $"{random.Next(10000000, 99999999)}"
                ));
            }

            return result;
        }


        public static List<Supervisor> GenerarSupervisores(int count)
        {
            var result = new List<Supervisor>();

            for (int i = 0; i < count; i++)
            {
                var nombre = nombres[random.Next(nombres.Count)];
                var apellido = apellidos[random.Next(apellidos.Count)];


                result.Add(new Supervisor(
                    nombre,
                    apellido,
                    $"supervisor{i + 1}@example.com",
                    PasswordHasher.HashPassword($"kjkszpj"),
                    $"{random.Next(10000000, 99999999)}"
                ));
            }

            return result;
        }
    }

}