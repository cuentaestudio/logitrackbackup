namespace Back.Domain.Models
{
    public class Direccion
    {
        public string Calle { get; set; } = string.Empty;
        public string Ciudad { get; set; } = string.Empty;
        public string CP { get; set; } = string.Empty;
        public string? Referencia { get; set; }
        public Ubicacion? Ubicacion { get; set; }


        private Direccion()
        {
            
        }

        public Direccion(string calle, string ciudad, string cp, string? referencia = null, Ubicacion? ubicacion = null)
        {
            Calle = calle;
            Ciudad = ciudad;
            CP = cp;
            Referencia = referencia;
            Ubicacion = ubicacion;
        }
    }
    public class Ubicacion
    {
        public double Latitud { get; set; }
        public double Longitud { get; set; }
    }

    public class Cliente
    {
        public string Nombre { get; private set; } = string.Empty;  
        public string Apellido { get; private set; } = string.Empty;
        public Direccion Direccion { get; private set; }

        private Cliente()
        {
        }

        public Cliente(string nombre, string apellido, Direccion direccion)
        {
            Nombre = nombre;
            Apellido = apellido;
            Direccion = direccion;
        }
    }
}

 