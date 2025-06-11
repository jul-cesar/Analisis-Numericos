



import { Calculator, Loader2, TrendingUp } from "lucide-react";
import { useState } from "react";
import type { AnalysisResponse } from "./types/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { InputForm } from "./components/InputForm";
import { Alert, AlertDescription } from "./components/ui/alert";
import { ResultsDisplay } from "./components/ResultsDisplay";

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (
    func: string,
    a: number,
    b: number,
    n: number
  ) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ function: func, a, b, n }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error occurred on the server.");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-12 w-12 text-blue-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Analizador Numérico
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Evalúa derivadas e integrales usando varios métodos numéricos con
            precisión y visualización.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-4">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Análisis de Función
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Ingresa tu función y parámetros para el análisis numérico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-8">
            {isLoading && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-400 mb-4" />
                  <p className="text-slate-300 text-lg">
                    Analizando función...
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Esto puede tomar unos momentos
                  </p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Alert className="bg-red-900/20 border-red-800 text-red-200">
                <AlertDescription className="text-base">
                  <strong className="font-semibold">Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {analysisData && !isLoading && (
              <ResultsDisplay data={analysisData} />
            )}

            {!analysisData && !isLoading && !error && (
              <Card className="bg-slate-800/30 border-slate-700 border-dashed backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Calculator className="h-16 w-16 text-slate-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">
                    Listo para Analizar
                  </h3>
                  <p className="text-slate-500 max-w-md">
                    Ingresa una función matemática y parámetros en el formulario
                    para comenzar el análisis numérico.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}