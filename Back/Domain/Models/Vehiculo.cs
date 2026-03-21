namespace Back.Domain.Models
{
    public class Vehiculo
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Patente { get; set; } = string.Empty;
        public bool Activo { get; private set; } = true;

        public void Suspender() => Activo = false;
    }
}