import { api } from './api'
import Cookies from 'js-cookie'

export const questionaryService = {
  async getAllQuestionnaires(departmentId?: string) {
    const { data } = await api.get(
      `/questionary/all${departmentId ? `?departmentId=${departmentId}` : ''}`,
    )
    return data.content
  },

  async getGeneralStatistics(
    start: string,
    end: string,
    questionaryId?: string,
    departmentId?: string,
  ) {
    const { data } = await api.get(
      `/statistics/general?period=P1M&from=${start}&to=${end}&onlyActive=true${questionaryId ? `&questionaryId=${questionaryId}` : ''}${departmentId ? `&departmentId=${departmentId}` : ''}`,
    )
    return data
  },

  async getQuestionnaireById(id: string | number) {
    const isAdmin = Cookies.get('token')
    const { data } = await api.get(
      `/questionary/${isAdmin ? 'admin/' : ''}${id}`,
    )
    return data
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createQuestionnaire(requestBody: any): Promise<boolean> {
    try {
      if (!requestBody?.options?.startDate || !requestBody?.options?.endDate) {
        throw new Error(
          'Datas inválidas. O questionário precisa de um período válido.',
        )
      }
      const formatISOWithoutZ = (date: string) => date.slice(0, -1)
      const today = new Date()
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const oneYearLater = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000)

      const yesterdayFormatted = yesterday.toISOString()
      const oneYearLaterFormatted = oneYearLater.toISOString()

      requestBody.options.startDate = formatISOWithoutZ(
        requestBody.options.startDate,
      )
      requestBody.options.endDate = formatISOWithoutZ(
        requestBody.options.endDate,
      )

      if (requestBody) {
        requestBody.options.startDate = yesterdayFormatted
        requestBody.options.endDate = oneYearLaterFormatted
      }
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
    submissionToken?: string,
  ): Promise<boolean> {
    try {
      await api.post(
        `/questionary/${id}/submit${submissionToken ? '?submissionToken=' + submissionToken : ''}`,
        requestBody,
      )
      return true
    } catch (error) {
      console.error(
        '[QuestionaryService] Error answering questionnaire:',
        error,
      )
      return false
    }
  },

  async getQuestionnaireSubmissions(id: string | number) {
    const { data } = await api.get(`/questionary/${id}/submissions`)
    return data
  },
}
