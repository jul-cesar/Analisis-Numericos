"use client";

import { ActivityIcon as Function, RotateCcw } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

interface MathInputProps {
  value: string;
  onChange: (
    latex: string,
    text: string,
    a?: number,
    b?: number,
    n?: number
  ) => void;
  placeholder?: string;
}

export function MathInput({
  value,
  onChange,
  placeholder = "Enter function...",
}: MathInputProps) {
  const [inputValue, setInputValue] = useState(value || "x^2");

  // Common mathematical functions and symbols with integration parameters
  const mathTemplates = [
    { label: "x²", text: "x^2", a: 0, b: 1, n: 10 },
    { label: "√x", text: "sqrt(x)", a: 0, b: 4, n: 10 },
    { label: "sin(x)", text: "sin(x)", a: 0, b: 3.14159, n: 20 },
    { label: "cos(x)", text: "cos(x)", a: 0, b: 3.14159, n: 20 },
    { label: "tan(x)", text: "tan(x)", a: 0, b: 1.5, n: 20 },
    { label: "eˣ", text: "exp(x)", a: 0, b: 2, n: 10 },
    { label: "ln(x)", text: "log(x)", a: 1, b: 10, n: 10 },
  ];

  const advancedTemplates = [
    { label: "sin²(x)", text: "sin(x)^2", a: 0, b: 3.14159, n: 20 },
    { label: "e^(x²)", text: "exp(x^2)", a: 0, b: 2, n: 20 },
    { label: "ln(sin(x))", text: "log(sin(x))", a: 0.1, b: 3, n: 20 },
    { label: "x·sin(x)", text: "x*sin(x)", a: 0, b: 6.28318, n: 20 },
    { label: "√(x²+1)", text: "sqrt(x^2+1)", a: 0, b: 5, n: 15 },
    { label: "1/(1+x²)", text: "1/(1+x^2)", a: -3, b: 3, n: 30 },
  ];

  const bookExamples = [
    // --- Categoría: Polinomios (Prueban la exactitud de los métodos) ---
    {
      text: "0.2 + 25*x - 200*x**2 + 675*x**3 - 900*x**4 + 400*x**5",
      label: "Polinomio de Chapra (Grado 5)",
      a: 0,
      b: 0.8,
      n: 15,
    },
    {
      text: "x**3 - 6*x**2 + 11*x - 6",
      label: "Polinomio Cúbico Simple",
      a: 1,
      b: 3,
      n: 10,
    },
    {
      text: "x**2",
      label: "Parábola Simple (x^2)",
      a: 0,
      b: 1,
      n: 4,
    },

    // --- Categoría: Funciones Trigonométricas (Curvas suaves y predecibles) ---
    {
      text: "sin(x)",
      label: "Seno Clásico (sin(x))",
      a: 0,
      b: 3.14159,
      n: 12,
    },
    {
      text: "exp(-x) * cos(2*x)",
      label: "Oscilación Amortiguada (e⁻ˣ cos(2x))",
      a: 0,
      b: 6.28318,
      n: 20,
    },
    {
      text: "sin(x)/x",
      label: "Función Sinc (sin(x)/x)",
      a: 0.0001, // Evitar la división por cero en x=0
      b: 3.14159,
      n: 20,
    },

    // --- Categoría: Funciones Exponenciales y Logarítmicas ---
    {
      text: "exp(-x**2)",
      label: "Curva de Gauss (e⁻ˣ²)",
      a: -1,
      b: 1,
      n: 30,
    },
    {
      text: "log(x)",
      label: "Logaritmo Natural (ln(x))",
      a: 1,
      b: 10,
      n: 15,
    },
    {
      text: "x * exp(x)",
      label: "Combinación x * eˣ",
      a: 0,
      b: 2,
      n: 10,
    },

    // --- Categoría: Casos "Difíciles" (Desafían a los métodos) ---
    {
      text: "1 / (1 + 25*x**2)",
      label: "Función de Runge (Picos agudos)",
      a: -1,
      b: 1,
      n: 50,
    },
    {
      text: "sqrt(x)",
      label: "Raíz Cuadrada (Derivada infinita en x=0)",
      a: 0,
      b: 1,
      n: 20,
    },
    {
      text: "abs(x - 1)",
      label: "Valor Absoluto (Esquina aguda)",
      a: 0,
      b: 2,
      n: 40,
    },
  ];
  // Convert text to LaTeX for display
  const convertTextToLatex = useCallback((text: string): string => {
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
      .replace(/\^(\w+)/g, "^{$1}")
      .replace(/\^{([^}]+)}/g, "^{$1}");
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      const latex = convertTextToLatex(newValue);
      onChange(latex, newValue);
    },
    [onChange, convertTextToLatex]
  );

  const insertTemplate = useCallback(
    (text: string, a?: number, b?: number, n?: number) => {
      console.log("Inserting template:", text, { a, b, n }); // Debug log
      setInputValue(text);
      const latex = convertTextToLatex(text);
      onChange(latex, text, a, b, n);
    },
    [onChange, convertTextToLatex]
  );

  const clearField = useCallback(() => {
    setInputValue("");
    onChange("", "");
  }, [onChange]);

  return (
    <div className="space-y-4">
      <Label className="text-slate-200 font-medium flex items-center gap-2">
        <Function className="h-4 w-4" />
        Mathematical Function
      </Label>

      {/* Math Input Field */}
      <Card className="bg-slate-700/30 border-slate-600">
        <CardContent className="p-4">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="min-h-[60px] text-lg bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-400"
          />

          <div className="flex justify-between items-center mt-2">
            <Badge
              variant="outline"
              className="text-xs text-slate-400 border-slate-600"
            >
              Type functions like: x^2, sin(x), sqrt(x), exp(x)
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearField}
              className="text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Templates */}
      <div className="space-y-3">
        <Label className="text-sm text-slate-300">Basic Functions</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {mathTemplates.map((template) => (
            <Button
              key={template.text}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Button clicked:", template.text, {
                  a: template.a,
                  b: template.b,
                  n: template.n,
                }); // Debug log
                insertTemplate(
                  template.text,
                  template.a,
                  template.b,
                  template.n
                );
              }}
              className="bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100 text-xs h-8"
            >
              {template.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-600" />

      {/* Advanced Templates */}
      <div className="space-y-3">
        <Label className="text-sm text-slate-300">Advanced Functions</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {advancedTemplates.map((template) => (
            <Button
              key={template.text}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Advanced button clicked:", template.text, {
                  a: template.a,
                  b: template.b,
                  n: template.n,
                }); // Debug log
                insertTemplate(
                  template.text,
                  template.a,
                  template.b,
                  template.n
                );
              }}
              className="bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100 text-xs h-8"
            >
              {template.label}
            </Button>
          ))}
        </div>
      </div>
      <Separator className="bg-slate-600" />

      {/* Book Examples */}

      <div className="space-y-3">
        <Label className="text-sm text-slate-300">Book Examples</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {bookExamples.map((example) => (
            <Button
              key={example.text}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Book example clicked:", example.text, {
                  a: example.a,
                  b: example.b,
                  n: example.n,
                }); // Debug log
                insertTemplate(example.text, example.a, example.b, example.n);
              }}
              className="bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100 text-xs h-8"
            >
              {example.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>
          <strong>Function syntax:</strong>
        </p>
        <p>• Use ^ for exponents: x^2, x^3</p>
        <p>• Use functions: sin(x), cos(x), sqrt(x), log(x), exp(x)</p>
        <p>• Use pi for π, * for multiplication</p>
        <p>• Examples: x^2 + 1, sin(x)*cos(x), sqrt(x^2+1)</p>
      </div>
    </div>
  );
}
