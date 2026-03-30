namespace Back.ML.Abstractions
{
    public interface IPrioridadPrediction
    {
        Task<double> Predecir(PrioridadPredictionInput input);
    }

    public class PrioridadPredictionInput
    {
        public double Distancia { get; set; }
        public double Peso { get; set; }
        public bool EsReentega { get; set; }
    }
}