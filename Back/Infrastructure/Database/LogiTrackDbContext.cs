using Back.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Back.Infrastructure.Database
{

    public class LogiTrackDbContext : DbContext
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Vehiculo> Vehiculos { get; set; }
        public DbSet<Ruta> Rutas { get; set; }
        public DbSet<Sucursal> Sucursales { get; set; }
        public DbSet<Paquete> Paquetes { get; set; }
        public DbSet<Direccion> Direcciones { get; set; }

        public LogiTrackDbContext(DbContextOptions<LogiTrackDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Paquete>(p =>
            {
                // Esto le dice a EF: "Lo que ves en el objeto Remitente, 
                // guárdalo en estas columnas específicas de la tabla Paquetes"
                p.OwnsOne(x => x.Remitente, r =>
                {
                    r.Property(c => c.Nombre).HasColumnName("Remitente_Nombre");
                    r.Property(c => c.Apellido).HasColumnName("Remitente_Apellido");

                    r.OwnsOne(x => x.Direccion, d =>
                    {
                    });
                });

                p.OwnsOne(x => x.Destinatario, d =>
                {
                    d.Property(c => c.Nombre).HasColumnName("Destinatario_Nombre");
                    d.Property(c => c.Apellido).HasColumnName("Destinatario_Apellido");

                    d.OwnsOne(x => x.Direccion, d =>
           {
                    });
                });
            });

        modelBuilder.Entity<Usuario>()
        .HasDiscriminator<string>("Discriminator")
        .HasValue<Transportista>("Transportista")
        .HasValue<Supervisor>("Supervisor")
        .HasValue<Operador>("Operador");

        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<Paquete>())
            {
                if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
                {
                
                }
            }
            return await base.SaveChangesAsync(cancellationToken);
        }

    }
}
