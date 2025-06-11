"use client";

import {
  Award,
  BarChart,
  Calculator,
  Info,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import type { AnalysisResponse } from "../types/types";
import { MathDisplay } from "./math-display";

interface ResultsDisplayProps {
  data: AnalysisResponse;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, methodNames }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
        <p className="text-slate-200 font-medium">{`x = ${label}`}</p>
        {payload.map((entry: any, index: number) => {
          // Get method name from our mapping
          const methodName = methodNames[entry.dataKey] || entry.dataKey;
          return (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${methodName}: ${Number(entry.value).toFixed(4)}`}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export function ResultsDisplay({ data }: ResultsDisplayProps) {
  const formatNumber = (num: number) => {
    if (Math.abs(num) < 0.0001) return num.toExponential(4);
    return num.toFixed(6);
  };

  // Convert function text back to LaTeX for display
  const convertTextToLatex = (text: string): string => {
    return text
      .replace(/\*\*/g, "^")
      .replace(/\*/g, " \\cdot ")
      .replace(/sqrt$$([^)]+)$$/g, "\\sqrt{$1}")
      .replace(/sin\(/g, "\\sin(")
      .replace(/cos\(/g, "\\cos(")
      .replace(/tan\(/g, "\\tan(")
      .replace(/log\(/g, "\\ln(")
      .replace(/log10\(/g, "\\log(")
      .replace(/exp\(/g, "e^{")
      .replace(/pi/g, "\\pi")
      .replace(/\^(\w+)/g, "^{$1}");
  };

  // Define colors for each method
  const methodColors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
  ];

  // Get method color based on index
  const getMethodColor = (index: number): string => {
    return methodColors[index % methodColors.length];
  };

  // Get badge color based on method name
  const getBadgeClass = (methodName: string): string => {
    if (methodName.toLowerCase().includes("trap")) {
      return "bg-blue-900/30 text-blue-300";
    } else if (methodName.toLowerCase().includes("simp")) {
      return "bg-green-900/30 text-green-300";
    } else if (methodName.toLowerCase().includes("romb")) {
      return "bg-purple-900/30 text-purple-300";
    } else if (methodName.toLowerCase().includes("gauss")) {
      return "bg-amber-900/30 text-amber-300";
    } else if (methodName.toLowerCase().includes("monte")) {
      return "bg-red-900/30 text-red-300";
    }
    return "bg-slate-700/50 text-slate-300";
  };

  // Get icon based on method name
  const getMethodIcon = (methodName: string) => {
    if (methodName.toLowerCase().includes("trap")) {
      return <BarChart className="h-5 w-5 text-blue-400" />;
    } else if (methodName.toLowerCase().includes("simp")) {
      return <TrendingUp className="h-5 w-5 text-green-400" />;
    } else if (methodName.toLowerCase().includes("romb")) {
      return <Calculator className="h-5 w-5 text-purple-400" />;
    } else if (methodName.toLowerCase().includes("gauss")) {
      return <Zap className="h-5 w-5 text-amber-400" />;
    } else if (methodName.toLowerCase().includes("monte")) {
      return <LineChart className="h-5 w-5 text-red-400" />;
    }
    return <Calculator className="h-5 w-5 text-slate-400" />;
  };

  // Get error order based on method name
  const getErrorOrder = (methodName: string): string => {
    if (methodName.toLowerCase().includes("trap")) {
      return "O(h²)";
    } else if (methodName.toLowerCase().includes("simp")) {
      return "O(h⁴)";
    } else if (methodName.toLowerCase().includes("romb")) {
      return "O(h²ᵏ)";
    } else if (methodName.toLowerCase().includes("gauss")) {
      return "O(h²ⁿ)";
    } else if (methodName.toLowerCase().includes("monte")) {
      return "O(1/√n)";
    }
    return "O(hᵏ)";
  };

  // Get formula based on method name
  const getMethodFormula = (methodName: string): string => {
    if (methodName.toLowerCase().includes("trap")) {
      return "\\frac{h}{2}[f(a) + 2\\sum_{i=1}^{n-1}f(x_i) + f(b)]";
    } else if (methodName.toLowerCase().includes("simp")) {
      return "\\frac{h}{3}[f(a) + 4\\sum_{odd}f(x_i) + 2\\sum_{even}f(x_i) + f(b)]";
    } else if (methodName.toLowerCase().includes("romb")) {
      return "R_{k,j} = R_{k,j-1} + \\frac{R_{k,j-1} - R_{k-1,j-1}}{4^j - 1}";
    } else if (methodName.toLowerCase().includes("gauss")) {
      return "\\int_{a}^{b} f(x) dx \\approx \\frac{b-a}{2} \\sum_{i=1}^{n} w_i f(\\frac{b-a}{2}x_i + \\frac{a+b}{2})";
    } else if (methodName.toLowerCase().includes("monte")) {
      return "\\frac{b-a}{n} \\sum_{i=1}^{n} f(x_i), \\quad x_i \\sim U[a,b]";
    }
    return "";
  };

  // Create a mapping of dataKey to method name for tooltips
  const methodNameMap: Record<string, string> = {};

  const functionPlotData = useMemo(
    () =>
      data.function_plot_data.points.map((p, i) => ({
        x: p,
        "Función Original": data.function_plot_data.values[i],
      })),
    [data.function_plot_data]
  );

  // 2. Preparamos los datos para CADA método de aproximación
  const approximationPlots = useMemo(
    () =>
      data.results.map((result) => ({
        name: result.method_name,
        data: result.points.map((p, i) => ({
          x: p,
          [result.method_name]: result.values[i],
        })),
      })),
    [data.results]
  );
  // Add debug logging right after data preparation

  // Check if all methods have identical values (debugging)
  const checkIdenticalValues = () => {
    if (data.results.length > 1) {
      const firstMethodValues = data.results[0].values;
      const allIdentical = data.results.every(
        (result) =>
          result.values.length === firstMethodValues.length &&
          result.values.every(
            (value, index) => Math.abs(value - firstMethodValues[index]) < 1e-10
          )
      );

      if (allIdentical) {
        console.warn(
          "⚠️ All methods have identical values - this suggests a backend issue"
        );
        console.log(
          "Methods should show different approximations, not the same function values"
        );
      }
    }
  };

  checkIdenticalValues();

  // Prepare chart data for derivative
  const derivativeChartData = data.derivative_info.points.map(
    (point, index) => ({
      x: Number(point.toFixed(3)),
      derivative: data.derivative_info.values[index],
    })
  );

  const derivativeLatex = convertTextToLatex(data.derivative_info.expression);

  return (
    <div className="space-y-6">
      {/* Best Method Alert */}
      <Alert className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-amber-700">
        <Award className="h-5 w-5 text-amber-400" />
        <AlertTitle className="text-amber-300 font-medium">
          Mejor Método: {data.best_method}
        </AlertTitle>
        <AlertDescription className="text-amber-200/80">
          {data.analysis_summary}
        </AlertDescription>
      </Alert>

      {/* Function Info */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Resultados del Análisis
          </CardTitle>
          <CardDescription className="text-slate-400">
            {data.true_integral_value !== null && (
              <span>
                Valor exacto de la integral:{" "}
                <strong className="text-white">
                  {formatNumber(data.true_integral_value)}
                </strong>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded p-4 text-center">
            <MathDisplay
              latex={`f'(x) = ${derivativeLatex}`}
              className="text-xl"
              block={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="integration" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-slate-700">
          <TabsTrigger
            value="integration"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Métodos de Integración
          </TabsTrigger>
          <TabsTrigger
            value="derivative"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Análisis de Derivada
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integration" className="space-y-4">
          {/* Integration Chart */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-100 text-lg flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-400" />
                Visualización de la Función
              </CardTitle>
              <CardDescription className="text-slate-400">
                Comparación gráfica de los diferentes métodos de integración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      domain={["dataMin", "dataMax"]}
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={(v) => v.toFixed(1)}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={(v) => v.toFixed(2)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                              <p className="text-slate-200 font-medium">{`x = ${Number(
                                label
                              ).toFixed(4)}`}</p>
                              {payload.map((entry: any) => (
                                <p
                                  key={entry.dataKey}
                                  style={{ color: entry.stroke }}
                                  className="text-sm"
                                >
                                  {`${entry.name}: ${Number(
                                    entry.value
                                  ).toFixed(4)}`}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />

                    {/* LÍNEA 1: La Verdad (curva suave de fondo) */}
                    <Line
                      data={functionPlotData}
                      type="monotone"
                      dataKey="Función Original"
                      stroke="#6b7280" // Gris oscuro
                      strokeWidth={3} // Más gruesa para que se vea
                      dot={false}
                      name="Función Original"
                    />

                    {/* Bucle para dibujar las líneas de aproximación */}
                    {approximationPlots.map((plot, index) => (
                      <Line
                        key={plot.name}
                        data={plot.data}
                        // El trapecio se dibuja con líneas rectas, los demás como curvas
                        type={plot.name === "Trapecio" ? "linear" : "monotone"}
                        dataKey={plot.name}
                        stroke={getMethodColor(index)}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name={`Aprox. (${plot.name})`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Integration Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.results.map((result, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-100 flex items-center gap-2 text-lg">
                    {getMethodIcon(result.method_name)}
                    {result.method_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div
                      className="text-3xl font-bold"
                      style={{ color: getMethodColor(index) }}
                    >
                      {formatNumber(result.integral_value)}
                    </div>
                    <div className="flex justify-center gap-2">
                      <Badge
                        variant="secondary"
                        className={getBadgeClass(result.method_name)}
                      >
                        {getErrorOrder(result.method_name)} precisión
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-slate-800/50 text-slate-300"
                      >
                        Error: {formatNumber(result.absolute_error)}
                      </Badge>
                    </div>
                    {getMethodFormula(result.method_name) && (
                      <div className="bg-white rounded p-2">
                        <MathDisplay
                          latex={getMethodFormula(result.method_name)}
                          className="text-sm"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* True Value Comparison */}
          {data.true_integral_value !== null && (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-400" />
                  Comparación con Valor Exacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-medium">
                          Método
                        </th>
                        <th className="text-right py-3 px-4 text-slate-300 font-medium">
                          Valor
                        </th>
                        <th className="text-right py-3 px-4 text-slate-300 font-medium">
                          Error Absoluto
                        </th>
                        <th className="text-right py-3 px-4 text-slate-300 font-medium">
                          Error Relativo (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.results.map((result, index) => (
                        <tr key={index} className="border-b border-slate-800">
                          <td className="py-3 px-4 text-slate-200">
                            {result.method_name}
                          </td>
                          <td
                            className="py-3 px-4 text-right font-mono"
                            style={{ color: getMethodColor(index) }}
                          >
                            {formatNumber(result.integral_value)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-300">
                            {formatNumber(result.absolute_error)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-300">
                            {formatNumber(
                              (result.absolute_error /
                                Math.abs(data.true_integral_value || 1)) *
                                100
                            )}
                            %
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-700/20">
                        <td className="py-3 px-4 text-amber-300 font-medium">
                          Valor Exacto
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-amber-300 font-medium">
                          {formatNumber(data.true_integral_value || 0)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-amber-300">
                          -
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-amber-300">
                          -
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="derivative" className="space-y-4">
          {/* Derivative Chart */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-100 text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Análisis de la Derivada
              </CardTitle>
              <CardDescription className="text-slate-400">
                Visualización de la derivada de la función
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded p-4 text-center mb-4">
                <MathDisplay
                  latex={`f'(x) = ${derivativeLatex}`}
                  className="text-xl"
                  block={true}
                />
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={derivativeChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="x"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={(value) => value.toFixed(1)}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={(value) => value.toFixed(2)}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                              <p className="text-slate-200 font-medium">{`x = ${label}`}</p>
                              <p
                                style={{ color: "#8b5cf6" }}
                                className="text-sm"
                              >
                                {`f'(x) = ${Number(payload[0].value).toFixed(
                                  4
                                )}`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="derivative"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={false}
                      fill="#8b5cf6"
                      fillOpacity={0.1}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Derivative Analysis */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-100">
                Puntos Críticos y Análisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">
                    Características de la Derivada
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h5 className="text-purple-300 font-medium mb-2">
                        Valor Máximo
                      </h5>
                      <div className="text-slate-200 font-mono">
                        {formatNumber(Math.max(...data.derivative_info.values))}
                      </div>
                    </div>
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <h5 className="text-purple-300 font-medium mb-2">
                        Valor Mínimo
                      </h5>
                      <div className="text-slate-200 font-mono">
                        {formatNumber(Math.min(...data.derivative_info.values))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">
                    Interpretación
                  </h4>
                  <div className="bg-slate-700/30 p-4 rounded-lg text-slate-300">
                    <p>
                      La derivada representa la tasa de cambio instantánea de la
                      función. Valores positivos indican que la función está
                      creciendo, mientras que valores negativos indican que está
                      decreciendo.
                    </p>
                    <p className="mt-2">
                      Los puntos donde la derivada cruza el eje x (f'(x) = 0)
                      son puntos críticos que pueden representar máximos,
                      mínimos o puntos de inflexión.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
