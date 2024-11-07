export interface Questionary {
  id: number
  title: string
  description: string
}

export interface QuestionnairesProps {
  questionnaires: Questionary[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setQuestionnaires: any
}
