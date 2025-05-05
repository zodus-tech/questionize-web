export interface ResponseData {
  name: string
  responses: number
  period?: string
}

export interface CompletionRateData {
  name: string
  value: number
}

export interface SatisfactionData {
  name: string
  value: number
}

export interface DemographicData {
  age: string
  male: number
  female: number
}
