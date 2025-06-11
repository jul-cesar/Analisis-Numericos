"use client";

import { Calculator, Play, Settings } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { MathDisplay } from "./math-display";
import { MathInput } from "./math-input";

interface InputFormProps {
  onAnalyze: (func: string, a: number, b: number, n: number) => void;
  isLoading: boolean;
}

export function InputForm({ onAnalyze, isLoading }: InputFormProps) {
  const [funcLatex, setFuncLatex] = useState("x^2");
  const [funcText, setFuncText] = useState("x^2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [n, setN] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { funcText, a, b, n }); // Debug log
    onAnalyze(funcText, a, b, n);
  };

  const handleMathChange = (
    latex: string,
    text: string,
    newA?: number,
    newB?: number,
    newN?: number
  ) => {
    console.log("Math changed:", { latex, text, newA, newB, newN }); // Debug log
    setFuncLatex(latex);
    setFuncText(text);

    // Update integration parameters if provided
    if (newA !== undefined) setA(newA);
    if (newB !== undefined) setB(newB);
    if (newN !== undefined) setN(newN);
  };

  // Initialize with default values
  useEffect(() => {
    handleMathChange("x^2", "x^2");
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Function Input */}
      <MathInput
        value={funcLatex}
        onChange={handleMathChange}
        placeholder="Enter your function..."
      />

      {/* Function Preview */}
      {funcLatex && (
        <Card className="bg-slate-700/20 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Function Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded p-4 text-center">
              <div className="text-lg">
                f(x) ={" "}
                <MathDisplay latex={funcLatex} className="inline-block" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-400 text-center">
              Backend format:{" "}
              <code className="bg-slate-800 px-1 rounded">{funcText}</code>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="bg-slate-600" />

      {/* Parameters */}
      <Card className="bg-slate-700/20 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-slate-200 text-sm flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Integration Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="a" className="text-slate-200 font-medium">
                Lower Bound (a)
              </Label>
              <Input
                id="a"
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(Number.parseFloat(e.target.value) || 0)}
                className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="b" className="text-slate-200 font-medium">
                Upper Bound (b)
              </Label>
              <Input
                id="b"
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(Number.parseFloat(e.target.value) || 1)}
                className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="n" className="text-slate-200 font-medium">
              Number of Points (n)
            </Label>
            <Input
              id="n"
              type="number"
              min="4"
              max="10000"
              value={n}
              onChange={(e) => setN(Number.parseInt(e.target.value) || 100)}
              className="bg-slate-700/50 border-slate-600 text-slate-100 focus:border-blue-400"
              required
            />
            <p className="text-xs text-slate-500">
              Higher values provide more accuracy but take longer to compute
            </p>
          </div>

          {/* Integration Preview */}
          {funcLatex && (
            <div className="bg-white rounded p-3 text-center">
              <MathDisplay
                latex={`\\int_{${a}}^{${b}} ${funcLatex} \\, dx`}
                className="text-lg"
                block={true}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isLoading || !funcText.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
      >
        {isLoading ? (
          <>
            <Calculator className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Analyze Function
          </>
        )}
      </Button>
    </form>
  );
}
