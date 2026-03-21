namespace Back.Domain.Models
{
    public class Direccion
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string Calle { get; set; } = string.Empty;
        public string Localidad { get; set; } = string.Empty;
        public string CP { get; set; } = string.Empty;
        public string? Referencia { get; set; }
        public Ubicacion? Ubicacion { get; set; }
    }
        public class Ubicacion
    {
        public double Latitud { get; set; }
        public double Longitud { get; set; }
    }
}

 