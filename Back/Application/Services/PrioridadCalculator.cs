using Back.Domain.Models;
using NetTopologySuite.Geometries;

namespace Back.Application.Services
{
    public class PrioridadCalculator
    {

        static public Ubicacion sucursal = new Ubicacion(-34.6486884, -58.7911853);
        static public float CalcularPrioridad(double peso, Ubicacion destino, bool esReEntrega)
        {
            // Ejemplo de cálculo de prioridad basado en peso y dimensiones

            // 1. Base de prioridad
            // Si es re-entrega arranca con 5 (alta), si no, arranca en 0.
            float prioridad = esReEntrega ? 5.0f : 0.0f;

            // 2. Criterio de peso (Máximo +2.5)
            // Si el tope es 50kg, dividimos por 20 para que 50/20 = 2.5
            prioridad += (float)Math.Min(peso / 20.0, 2.5);

            // 3. Criterio de distancia (Máximo +2.5)
            // Queremos que a MENOR distancia, MÁS prioridad.
            // Asumiendo que 'distancia' viene en km y el radio local máximo es 200km.
            double distancia = DistanciasService.CalcularDistancia(sucursal, destino);

            float puntosDistancia = (float)Math.Max(0, 2.5 - (distancia / 80.0)); // A los 200km ya suma 0

            prioridad += puntosDistancia;

            // 4. Bonus por peso crítico (Opcional)
            if (peso > 10 && !esReEntrega) prioridad += 0.5f;

            // Capar el resultado a un máximo de 10
            return Math.Min(prioridad, 10.0f);
        }
    }
}