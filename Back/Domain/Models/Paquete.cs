using Back.Application.Util;

namespace Back.Domain.Models
{
    public enum PaqueteStatus
    {
        EnSucursal,
        EnTransito,
        Entregado,
        Cancelado
    }

    public class Paquete
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public string CodigoSeguimiento { get; set; } = TrackIdGenerator.GenerateTrackId();
        public double Peso { get; set; }
        public double Altura { get; set; }
        public double Ancho { get; set; }

        public DateTime CreadoEn { get; init; } = DateTime.UtcNow;
        public PaqueteStatus Status { get; private set; } = PaqueteStatus.EnSucursal;
        public Cliente Remitente { get; set; }
        public Cliente Destinatario { get; set; }
        public string DestinatarioCompleto => $"{Destinatario.Nombre} {Destinatario.Apellido}";
        public string? Descripcion { get; set; } = string.Empty;
        public string? RazonCancelacion { get; private set; }

        public bool EstaEnSucursal => Status == PaqueteStatus.EnSucursal;

        private Paquete()
        {
        }

        public Paquete(double peso, double altura, double ancho, Cliente origen, Cliente destino, string? descripcion)
        {
            Peso = peso;
            Altura = altura;
            Ancho = ancho;
            Remitente = origen;
            Destinatario = destino;
            Descripcion = descripcion;
        }

        public void EnTransito()
        {
            if (Status != PaqueteStatus.EnSucursal)
                throw new InvalidOperationException("Solo se pueden enviar paquetes que están en sucursal.");

            Status = PaqueteStatus.EnTransito;
        }
        public void Entregar()
        {
            if (Status == PaqueteStatus.Cancelado)
                throw new InvalidOperationException("No se puede entregar un paquete cancelado.");

            Status = PaqueteStatus.Entregado;
        }

        public void ReEnviar()
        {
            if (Status != PaqueteStatus.Cancelado)
                throw new InvalidOperationException("Solo se pueden reenviar paquetes cancelados.");

            Status = PaqueteStatus.EnSucursal;
            RazonCancelacion = null;
        }

        public void Cancelar(string razon)
        {
            if (Status == PaqueteStatus.Entregado)
                throw new InvalidOperationException("No se puede cancelar un paquete entregado.");

            Status = PaqueteStatus.Cancelado;

            RazonCancelacion = razon;
        }

        public void CambiarEstado(PaqueteStatus status)
        {
            Status = status;
        }
    
    }
}