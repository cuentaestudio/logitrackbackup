namespace Back.Domain.Models
{
    public enum VehiculoEstado
    {
        Disponible,
        EnUso,
        Mantenimiento,
        Suspendido
    }

    public class Vehiculo
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Patente { get; set; } = string.Empty;
        public string Marca { get; set; } = string.Empty;
        public double CapacidadCarga { get; set; }
        public VehiculoEstado Estado { get; private set; } = VehiculoEstado.Disponible;

        // Mantener Activo para compatibilidad
        public bool Activo => Estado != VehiculoEstado.Suspendido;

        public void CambiarEstado(VehiculoEstado nuevoEstado) => Estado = nuevoEstado;
        public void Suspender() => Estado = VehiculoEstado.Suspendido;

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