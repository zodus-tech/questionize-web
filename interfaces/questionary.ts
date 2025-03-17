export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  BOOLEAN = 'BOOLEAN',
  TEXT = 'TEXT',
  RATING = 'RATING',
}

export interface Question {
  id: string
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
  membersIds?: string[]
}

export interface Questionary {
  id: string
  title: string
  createdAt?: Date
  options: Options
  questions: Question[]
  submissionToken?: string
  bannerId?: string
}

export interface QuestionnairesProps {
  questionnaires: Questionary[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setQuestionnaires: any
}
