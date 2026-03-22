namespace Back.Domain.Models
{
    public enum RutaStatus
    {
        Pendiente,
        EnCurso,
        Cancelada,
        Finalizada
    }

    public class Ruta
    {
        public Guid Id { get; private set; }
        public RutaStatus Estado { get; private set; } = RutaStatus.Pendiente;
        public DateTimeOffset? IniciadoEn { get; private set; }
        public DateTimeOffset? FinalizadoEn { get; private set; }
        public string? RazonCancelacion { get; private set; }
        public Transportista Transportista { get; private set; }

        public ICollection<Paquete> Paquetes { get; } = [];

        private Ruta()
        {
        }

        public Ruta(Transportista transportista, List<Paquete> paquetes)
        {
            Id = Guid.NewGuid();
            Transportista = transportista;
            Paquetes = paquetes;
        }

        public int TotalPaquetes => Paquetes.Count;
        public int PaquetesEntregados => Paquetes.Count(p => p.Status == PaqueteStatus.Entregado);
        public int PaquetesCancelados => Paquetes.Count(p => p.Status == PaqueteStatus.Cancelado);
        public int PaquetesPendientes => Paquetes.Count(p => p.Status == PaqueteStatus.EnTransito);


        public void Iniciar()
        {
            if (Estado != RutaStatus.Pendiente)
                throw new InvalidOperationException("Solo puede iniciar una ruta pendiente.");


            Estado = RutaStatus.EnCurso;
            IniciadoEn = DateTimeOffset.UtcNow;

            foreach (var paquete in Paquetes)
            {
                paquete.EnTransito();
            }
        }

        public void Cancelar(string razon)
        {
            if (Estado is RutaStatus.Finalizada or RutaStatus.Cancelada)
                throw new InvalidOperationException("Ruta ya finalizada o cancelada.");

            Estado = RutaStatus.Cancelada;
            RazonCancelacion = razon;
            FinalizadoEn = DateTimeOffset.UtcNow;
        }

        public void Finalizar()
        {
            if (Estado != RutaStatus.EnCurso)
                throw new InvalidOperationException("Solo se puede finalizar ruta en curso.");

            Estado = RutaStatus.Finalizada;
            FinalizadoEn = DateTimeOffset.UtcNow;
        }

        public void AgregarPaquete(Paquete paquete)
        {
            if (Estado != RutaStatus.Pendiente)
                throw new InvalidOperationException("Solo se pueden agregar paquetes a rutas pendientes.");

            Paquetes.Add(paquete);
        }

        public void ReasignarTransportista(Transportista nuevoTransportista)
        {
            if (Estado is RutaStatus.Finalizada or RutaStatus.Cancelada)
                throw new InvalidOperationException("No se puede reasignar transportista en una ruta finalizada o cancelada.");

            Transportista = nuevoTransportista;
        }

        public void EntregarPaquete(Guid id)
        {
            var paquete = Paquetes.FirstOrDefault(p => p.Id == id) ?? throw new InvalidOperationException("Paquete no encontrado en esta ruta.");

            paquete.Entregar();

            if (Paquetes.All(p => p.Status == PaqueteStatus.Entregado))
            {
                Finalizar();
            }
        }
    }
}