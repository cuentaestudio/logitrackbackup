namespace Back.Domain.Models
{
    public class Sucursal
    {
        public Guid Id { get; set; }  = Guid.NewGuid();
        public string Nombre { get; private set; }
        public string Direccion { get; private set; }
        public string Ciudad { get; private set; }
        public string Telefono { get; private set; }

        private Sucursal()
        {
        }

        public Sucursal(string nombre, string direccion, string ciudad, string telefono)
        {
            Nombre = nombre;
            Direccion = direccion;
            Ciudad = ciudad;
            Telefono = telefono;
        }
    }
}