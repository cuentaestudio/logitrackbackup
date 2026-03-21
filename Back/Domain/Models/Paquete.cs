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
        public string CodigoSeguimiento { get; set; } = string.Empty;
        public double Peso { get; set; }
        public double Altura { get; set; }
        public double Ancho { get; set; }
        public PaqueteStatus Status { get; private set; } = PaqueteStatus.EnSucursal;
        public Direccion Origen { get; set; } = new();
        public Direccion Destino { get; set; } = new();


        public bool EstaEnSucursal => Status == PaqueteStatus.EnSucursal;

        public Paquete()
        {
            
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

        public void Cancelar()
        {
            if (Status == PaqueteStatus.Entregado)
                throw new InvalidOperationException("No se puede cancelar un paquete entregado.");

            Status = PaqueteStatus.Cancelado;
        }



    }
}