export interface DerivativeInfo {
  expression: string
  points: number[]
  values: number[]
}
export interface FunctionPlotData {
  points: number[];
  values: (number | null)[];
}
export interface IntegrationResult {
  method_name: string
  integral_value: number
  absolute_error: number
  points: number[]
  values: number[]
}

export interface AnalysisResponse {
    function_plot_data: FunctionPlotData; 
  derivative_info: DerivativeInfo
  true_integral_value: number | null
  results: IntegrationResult[]
  best_method: string
  analysis_summary: string
}

export interface AnalysisRequest {
  function: string
  a: number
  b: number
  n: number
}
