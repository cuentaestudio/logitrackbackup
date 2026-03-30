using Back.Domain.Models;
using NetTopologySuite.Geometries;

namespace Back.Application.Services
{
    public class DistanciasService
    {
        static public double CalcularDistancia(Ubicacion origen, Ubicacion destino)
        {
            var geometryFactory = new GeometryFactory();

            var pointOrigen = geometryFactory.CreatePoint(new Coordinate(origen.Longitud, origen.Latitud));
            var pointDestino = geometryFactory.CreatePoint(new Coordinate(destino.Longitud, destino.Latitud));

            // Distancia en metros
            return pointOrigen.Distance(pointDestino) * 100000; // Aproximación para convertir grados a metros
        }

        static public float CalcularDistanciaDeSucursalADestino(Ubicacion destino)
        {
            return (float)CalcularDistancia(PrioridadCalculator.sucursal, destino);
        }
    }
}