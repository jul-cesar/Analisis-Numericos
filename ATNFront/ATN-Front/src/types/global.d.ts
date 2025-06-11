// Global type declarations for external libraries

declare global {
  interface Window {
    MQ: any
    katex: {
      render: (
        tex: string,
        element: HTMLElement,
        options?: {
          displayMode?: boolean
          throwOnError?: boolean
          errorColor?: string
          macros?: Record<string, string>
        },
      ) => void
    }
    jQuery: any
  }
}

// KaTeX types
declare module "katex" {
  export function render(
    tex: string,
    element: HTMLElement,
    options?: {
      displayMode?: boolean
      throwOnError?: boolean
      errorColor?: string
      macros?: Record<string, string>
    },
  ): void
}

// Chart.js types
declare module "chart.js" {
  export * from "chart.js/dist/chart.js"
}

export { }

