namespace Back.Domain.Models
{
    public class Vehiculo
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Patente { get; set; } = string.Empty;

        public string Marca { get; set; } = string.Empty;
        public double CapacidadCarga { get; set; }
        public bool Activo { get; private set; } = true;
        public void Suspender() => Activo = false;

        private Vehiculo()
        {
        }

        public Vehiculo(string patente, string marca, double capacidadCarga)
        {
            Patente = patente;
            Marca = marca;
            CapacidadCarga = capacidadCarga;
        }
    }
}