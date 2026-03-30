using Microsoft.ML.Data;

namespace Back.Application.Abstractions
{
    public interface IMLPrioridadPrediction
    {
        public Task<PrioridadPrediction> Predecir(PaqueteData input);
    }


public class PaqueteData
{
    // Datos que el usuario enviará a la API
    public float Peso { get; set; } 
    public float Distancia { get; set; }
    public float EsReentrega { get; set; }

    // El Label no es estrictamente necesario para predecir, 
    // pero puedes dejarlo si planeas re-entrenar luego.
    [ColumnName("Label")]
    public float Prioridad { get; set; }
}

public class PrioridadPrediction
{
    // ML.NET pone el resultado de la regresión en la columna "Score"
    [ColumnName("Score")]
    public float Prioridad { get; set; }
}}