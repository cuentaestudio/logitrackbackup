using NetTopologySuite.Geometries;

namespace Back.Application.Services
{
    public class DistanciasService
    {
        static public double CalcularDistancia(Coordinate origen, Coordinate destino)
        {
            var geometryFactory = new GeometryFactory();

            var pointOrigen = geometryFactory.CreatePoint(origen);
            var pointDestino = geometryFactory.CreatePoint(destino);

            // Distancia en metros
            return pointOrigen.Distance(pointDestino) * 100000; // Aproximación para convertir grados a metros
        }
    }
}