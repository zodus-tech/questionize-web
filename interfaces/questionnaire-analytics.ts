import { Member } from "./member"

export enum QuestionType {
  TEXT = 'TEXT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  BOOLEAN = 'BOOLEAN',
  RATING = 'RATING',
}

export interface QuestionnaireOptions {
  startDate: string
  endDate: string
  answersLimit: number,
  members: Member[]
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
}

export interface Questionnaire {
  departmentId: string
  title: string
  createdAt: string
  options: QuestionnaireOptions
  questions: Question[]
  imageId: string | null
}

export interface Answer {
  id: string
  question: string
  answer: string
}

export interface Submission {
  id: string
  title: string
  submittedAt: string
  memberId: string
  answers: Answer[]
}

export interface PaginatedResponse<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

// Chart data interfaces
export interface MultipleChoiceDataPoint {
  name: string
  count: number
}

export interface TextResponseDataPoint {
  name: string
  value: number
}

export interface BooleanDataPoint {
  name: string
  value: number
}

export interface RatingDataPoint {
  name: string
  count: number
}

// Props interfaces
export interface QuestionnaireAnalyticsProps {
  params: {
    id: string
  }
}
