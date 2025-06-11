from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import sympy as sp
from fastapi.middleware.cors import CORSMiddleware
from scipy.integrate import romberg

app = FastAPI(
    title="API de Análisis Numérico",
    description="Evalúa derivadas e integrales definidas con múltiples métodos.",
    version="1.0.0",
)

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

x_sym = sp.symbols("x")

def trapezoid_rule(f, a, b, n):
    if n <= 0: return None, None, None
    x_points = np.linspace(a, b, n + 1)
    y_points = f(x_points)
    h = (b - a) / n
    integral = (h / 2) * (y_points[0] + 2 * np.sum(y_points[1:-1]) + y_points[-1])
    return integral, x_points, y_points

def simpson_13_rule(f, a, b, n):
    if n % 2 != 0 or n <= 0: return None, None, None
    x_points = np.linspace(a, b, n + 1)
    y_points = f(x_points)
    h = (b - a) / n
    integral = (h / 3) * (y_points[0] + 4 * np.sum(y_points[1:-1:2]) + 2 * np.sum(y_points[2:-2:2]) + y_points[-1])
    return integral, x_points, y_points

def simpson_38_rule(f, a, b, n):
    if n % 3 != 0 or n <= 0: return None, None, None
    h = (b - a) / n
    x_points = np.linspace(a, b, n + 1)
    y_points = f(x_points)
    integral = y_points[0] + y_points[n]
    for i in range(1, n):
        integral += (2 if i % 3 == 0 else 3) * y_points[i]
    integral = integral * 3 * h / 8
    return integral, x_points, y_points

def boole_rule(f, a, b, n):
    if n % 4 != 0 or n <= 0: return None, None, None
    h = (b - a) / n
    integral = 0
    for i in range(0, n, 4):
        x0, x1, x2, x3, x4 = [a + (i + j) * h for j in range(5)]
        integral += (2 * h / 45) * (7 * f(x0) + 32 * f(x1) + 12 * f(x2) + 32 * f(x3) + 7 * f(x4))
    x_points = np.linspace(a, b, n + 1)
    y_points = f(x_points)
    return integral, x_points, y_points

def romberg_integration(f, a, b, n):
    if n <= 0 or (n & (n - 1) != 0): return None, None, None
    num_iterations = int(np.log2(n)) + 1
    integral = romberg(f, a, b, tol=1e-10, rtol=1e-10, divmax=num_iterations)
    x_points = np.linspace(a, b, n + 1)
    y_points = f(x_points)
    return integral, x_points, y_points

class AnalysisRequest(BaseModel):
    function: str = Field(..., example="sin(x)")
    a: float = Field(..., example=0)
    b: float = Field(..., example=3.14159)
    n: int = Field(..., example=12, gt=0)

class FunctionPlotData(BaseModel):
    points: List[float]
    values: List[Optional[float]]

class DerivativeInfo(BaseModel):
    expression: str
    points: List[float]
    values: List[Optional[float]]

class IntegrationResult(BaseModel):
    method_name: str
    integral_value: float
    absolute_error: float
    points: List[float]
    values: List[float]

class AnalysisResponse(BaseModel):
    function_plot_data: FunctionPlotData
    derivative_info: DerivativeInfo
    true_integral_value: Optional[float]
    results: List[IntegrationResult]
    best_method: str
    analysis_summary: str

def sanitize_values(values_np):
    return [None if np.isinf(v) or np.isnan(v) else v for v in values_np]

@app.post("/analyze", response_model=AnalysisResponse)
def analyze_function(request: AnalysisRequest):
    try:
        f_expr = sp.sympify(request.function)
        f_lambda = sp.lambdify(x_sym, f_expr, "numpy")
    except (sp.SympifyError, SyntaxError):
        raise HTTPException(status_code=400, detail="Función inválida.")

    plot_points = np.linspace(request.a, request.b, 200)
    function_values_np = f_lambda(plot_points)

    if not hasattr(function_values_np, "__iter__"): # Comprueba si no es iterable
        function_values_np = np.full_like(plot_points, function_values_np)

    function_plot_data = FunctionPlotData(
        points=plot_points.tolist(),
        values=sanitize_values(function_values_np)
    )

    # Datos para la derivada
    deriv_expr = sp.diff(f_expr, x_sym)
    deriv_lambda = sp.lambdify(x_sym, deriv_expr, "numpy")
    deriv_values_np = deriv_lambda(plot_points)
    if not hasattr(deriv_values_np, "__iter__"):
        deriv_values_np = np.full_like(plot_points, deriv_values_np)

    deriv_info = DerivativeInfo(
    expression=str(deriv_expr),
    points=plot_points.tolist(),
    values=sanitize_values(deriv_values_np),
    )

    true_value = None
    try:
        true_value = float(sp.integrate(f_expr, (x_sym, request.a, request.b)))
    except (TypeError, NotImplementedError):
        true_value = romberg(f_lambda, request.a, request.b, divmax=20)

    methods = {
        "Trapecio": trapezoid_rule, "Simpson 1/3": simpson_13_rule,
        "Simpson 3/8": simpson_38_rule, "Boole": boole_rule,
        "Romberg": romberg_integration,
    }

    integration_results = []
    for name, func in methods.items():
        integral, points, values = func(f_lambda, request.a, request.b, request.n)
        if integral is not None:
            error = abs(integral - true_value) if true_value is not None else 0
            integration_results.append(
                IntegrationResult(
                    method_name=name, integral_value=integral,
                    absolute_error=error, points=points.tolist(),
                    values=values.tolist(),
                )
            )

    if not integration_results:
        raise HTTPException(status_code=400, detail=f"n={request.n} no es válido para ningún método.")

    best_result = min(integration_results, key=lambda x: x.absolute_error)
    analysis_summary = (
        f"Para n={request.n}, el método más preciso fue '{best_result.method_name}' "
        f"con un error de {best_result.absolute_error:.2e}. Los métodos de orden superior "
        "suelen converger más rápido al valor real."
    )

    return AnalysisResponse(
        function_plot_data=function_plot_data,
        derivative_info=deriv_info,
        true_integral_value=true_value,
        results=integration_results,
        best_method=best_result.method_name,
        analysis_summary=analysis_summary,
    )