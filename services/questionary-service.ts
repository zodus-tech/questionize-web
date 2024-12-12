import { api } from './api'

export const questionaryService = {
  async getAllQuestionnaires() {
    const { data } = await api.get('/questionary/all')
    return data.content
  },

  async getGeneralStatistics(start: string, end: string) {
    const { data } = await api.get(
      `/statistics/general?period=P1Y&from=${start}&to=${end}`,
    )
    return data.content
  },

  async getQuestionnaireById(id: string | number) {
    const { data } = await api.get(`/questionary/${id}`)
    return data.content
  },

  async deleteQuestionnaire(id: string | number): Promise<boolean> {
    try {
      await api.delete(`/questionary/delete/${id}`)
      return true
    } catch (error) {
      console.error('[QuestionaryService] Error deleting questionnaire:', error)
      return false
    }
  },

  async createQuestionnaire(requestBody: unknown): Promise<boolean> {
    try {
      await api.post(`/questionary/create`, requestBody)
      return true
    } catch (error) {
      console.error('[QuestionaryService] Error creating questionnaire:', error)
      return false
    }
  },

  async answerQuestionnaire(
    id: string | number,
    requestBody: unknown,
  ): Promise<boolean> {
    try {
      await api.post(`/questionary/${id}/submit`, requestBody)
      return true
    } catch (error) {
      console.error(
        '[QuestionaryService] Error answering questionnaire:',
        error,
      )
      return false
    }
  },
}
