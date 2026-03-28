using Back.Domain.Models;
using Back.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Back.Infrastructure.Database.Repositories
{
    public class RutasRepository : IRutasRepository
    {
        private readonly LogiTrackDbContext _context;

        public RutasRepository(LogiTrackDbContext context)
        {
            _context = context;
        }

        public async Task Add(Ruta ruta)
        {
            await _context.Rutas.AddAsync(ruta);
        }

        public async Task<List<Ruta>> GetHistorialRutas(Guid transportista)
        {
            return await _context.Rutas.Where(r => r.Transportista.Id == transportista).Include(r=> r.Paquetes).ToListAsync();
        }

        public async Task<List<Ruta>> GetMisRutasSupervisadas(Guid supervisor)
        {
            return await _context.Rutas.Include(r=> r.Paquetes).Where(r=> true).ToListAsync();
        }

        public async  Task<Ruta?> GetRutaById(Guid id)
        {   
            return await _context.Rutas.Include(r=> r.Paquetes).FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<Ruta>> GetRutas()
        {
            return await _context.Rutas.Include(r=> r.Paquetes).ToListAsync();
        }

        public async Task<bool> IsVehiculoEnRuta(Guid vehiculoId)
        {   
            return await _context.Rutas.AnyAsync(r => r.Vehiculo.Id == vehiculoId && r.Estado == RutaStatus.EnCurso);
        }
    }
}