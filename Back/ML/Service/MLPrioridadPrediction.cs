namespace Back.Ml.Service
{
    using Back.Application.Abstractions;
    using Microsoft.Extensions.ML;

    public class MLNetPrioridadService : IMLPrioridadPrediction
    {
        private readonly PredictionEnginePool<PaqueteData, PrioridadPrediction> _modelPool;

        public MLNetPrioridadService(PredictionEnginePool<PaqueteData, PrioridadPrediction> modelPool)
        {
            _modelPool = modelPool;
        }

        public Task<PrioridadPrediction> Predecir(PaqueteData input)
        {
            var prediccion = _modelPool.Predict(input);
            
            return Task.FromResult(prediccion);
        }
    }
}