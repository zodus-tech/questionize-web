export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  BOOLEAN = 'BOOLEAN',
  TEXT = 'TEXT',
  RATING = 'RATING',
}

export interface Question {
  id: number
  text: string
  type: QuestionType
  statistics: unknown
  options?: string[]
}

interface Options {
  startDate: Date
  endDate: Date
  answersLimit: number
  anonymous: boolean
}

export interface Questionary {
  id: number
  title: string
  createdAt?: Date
  options: Options
  questions: Question[]
  submissionToken?: string
}

export interface QuestionnairesProps {
  questionnaires: Questionary[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setQuestionnaires: any
}
