using Back.Domain.Models;

namespace Back.Domain.Repositories
{
    public interface IEnviosRepository
    {
        Task Add(Paquete envio);
        Task Add(Ruta ruta);
        Task Add(Sucursal sucursal);

        Task<Paquete?> GetPaquete(Guid id);
        Task<Paquete?> GetPaqueteByCodigoSeguimiento(string codigoSeguimiento);
        Task<Ruta?> GetRutaById(Guid id);
        Task<List<Paquete>>GetPaquetesEnSucursal ();
        Task<List<Ruta>> GetHistorialRutas(Guid transportista);
        Task<List<Ruta>> GetMisRutasSupervisadas(Guid supervisor);
        Task<List<Ruta>> GetRutas();
        Task<List<Sucursal>> GetSucursales();
    
    }
}