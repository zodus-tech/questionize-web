import { api } from './api'
import Cookies from 'js-cookie'

// Define interface for banner upload response
interface BannerUploadResponse {
  id: string
  url?: string
  success: boolean
  error?: string
}

export const questionaryService = {
  async getAllQuestionnaires(departmentId?: string, onlyActive?: boolean) {
    const params = new URLSearchParams()

    if (departmentId) {
      params.append('departmentId', departmentId)
    }

    if (onlyActive) {
      params.append('active', 'true')
    }

    const queryString = params.toString()
    const url = `/questionary/all${queryString ? `?${queryString}` : ''}`

    const { data } = await api.get(url)
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
    try {
      const isAdmin = Cookies.get('token')
      const { data } = await api.get(
        `/questionary/${isAdmin ? 'admin/' : ''}${id}`,
      )

      // In development mode, check if we have a banner ID for this questionnaire
      if (
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost'
      ) {
        const localBannerId = localStorage.getItem(
          `questionnaire-${id}-bannerId`,
        )
        if (localBannerId) {
          // Add the banner ID to the data
          data.bannerId = localBannerId
        }
      }

      return data
    } catch (error) {
      console.error('[QuestionaryService] Error getting questionnaire:', error)
      throw error
    }
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

  async updateQuestionnaire(
    id: string | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestBody: { title?: string; startDate?: any; endDate?: any },
  ): Promise<boolean> {
    try {
      if (!requestBody?.startDate || !requestBody?.endDate) {
        throw new Error(
          'Datas inválidas. O questionário precisa de um período válido.',
        )
      }
      const formatDate = (date: Date | undefined) => {
        if (!date) return null
        date = new Date(date)
        const offset = date.getTimezoneOffset()
        const localDate = new Date(date.getTime() - offset * 60 * 1000)

        return localDate.toISOString().slice(0, -1)
      }

      requestBody.startDate = formatDate(requestBody.startDate)
      requestBody.endDate = formatDate(requestBody.endDate)

      // console.log(requestBody.endDate)

      await api.patch(`/questionary/update/${id}`, requestBody)
      return true
    } catch (error) {
      console.error('[QuestionaryService] Error updating questionnaire:', error)
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

      requestBody.options.startDate = formatISOWithoutZ(
        requestBody.options.startDate,
      )
      requestBody.options.endDate = formatISOWithoutZ(
        requestBody.options.endDate,
      )

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

  async getQuestionnaireSubmissions(
    id: string | number,
    filters?: { memberId?: string; from?: Date; to?: Date },
  ) {
    const formatISOWithoutZ = (date: Date) => date.toISOString().slice(0, -1)
    let url = `/questionary/${id}/submissions`
    const params = new URLSearchParams()

    if (filters?.memberId) {
      params.append('memberId', filters.memberId)
    }
    if (filters?.from) {
      params.append('from', formatISOWithoutZ(filters.from))
    }
    if (filters?.to) {
      params.append('to', formatISOWithoutZ(filters.to))
    }

    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const { data } = await api.get(url)
    return data
  },

  async uploadBanner(
    file: File,
    questionaryId: string,
    token: string,
  ): Promise<BannerUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('imageFile', file)
      const request = { questionaryId }
      formData.append('request', new Blob([JSON.stringify(request)], { type: "application/json" }))

      console.log(JSON.stringify(request))


      // Log the file details for debugging
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        questionaryId,
      })

      const url = `/images/save`

      // Production code path
      const { data } = await api.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
        timeout: 30000, // 30 second timeout
        maxBodyLength: Infinity, // Allow large files
        maxContentLength: Infinity,
      })
      console.log("teste 9444444: ", data)
      return data
    } catch (error) {
      console.error('[QuestionaryService] Error uploading banner:', error)
      // Return a default response instead of throwing
      return {
        id: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      } as BannerUploadResponse
    }
  },

  async getBannerImage(bannerId: string) {
    try {
      // Check if we're in development environment and if this is a locally stored banner
      if (
        typeof window !== 'undefined' &&
        window.location.hostname === 'localhost' &&
        bannerId.startsWith('banner-')
      ) {
        // Try to get from localStorage
        const localBanner = localStorage.getItem(bannerId)
        if (localBanner) {
          console.log('Loading banner from local storage:', bannerId)

          // For data URLs, we need to handle them differently
          if (localBanner.startsWith('data:')) {
            const base64Data = localBanner.split(',')[1]
            return { imageBytes: base64Data }
          }

          return { imageBytes: localBanner }
        }
      }

      // Default path - get from server
      const { data } = await api.get(`/images/${bannerId}`)
      return data
    } catch (error) {
      console.error('[QuestionaryService] Error fetching banner image:', error)
      throw error
    }
  },
}
