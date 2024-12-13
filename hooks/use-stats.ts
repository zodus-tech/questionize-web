import { useState, useEffect } from 'react'
import { questionaryService } from '@/services/questionary-service'
import { calculateMonthsBetween } from '@/utils/dates'
import { Questionary } from '@/interfaces/questionary'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ResponseData } from '@/interfaces/stats'
import { capitalizeFirst } from '@/utils/text'

export function useStatistics(dateRange?: DateRange) {
  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalQuestionnairesActive: 0,
    totalResponses: 0,
    averageResponseRate: '0.00',
  })
  const [responseData, setResponseData] = useState<ResponseData[]>([])

  const fetchData = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setLoading(true)
    setError(null)

    try {
      const startDate = format(dateRange.from, 'yyyy-MM-dd')
      const endDate = format(dateRange.to, 'yyyy-MM-dd')

      const [questionnairesData, statsData] = await Promise.all([
        questionaryService.getAllQuestionnaires(),
        questionaryService.getGeneralStatistics(startDate, endDate),
      ])

      const responseData = Object.entries(
        statsData.totalSubmissionsPerPeriod,
      ).map(([period, count]) => {
        const [startStr] = period.split(' - ')
        const monthDate = new Date(startStr)
        const formattedName = format(monthDate, 'MMMM', { locale: ptBR })
        return {
          name: capitalizeFirst(formattedName.toUpperCase()),
          responses: count,
        }
      })

      setResponseData(responseData as ResponseData[])
      setQuestionnaires(questionnairesData)

      if (statsData) {
        const monthsBetween = calculateMonthsBetween(startDate, endDate)
        const averageRate =
          Number(monthsBetween) <= 0
            ? '0.00'
            : (statsData.totalSubmissions / Number(monthsBetween)).toFixed(2)

        setStats({
          totalQuestionnairesActive: statsData.totalQuestionnairesActive,
          totalResponses: statsData.totalSubmissions,
          averageResponseRate: averageRate,
        })
      }
    } catch (err) {
      setError('Erro ao carregar dados do dashboard')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [dateRange?.from, dateRange?.to])

  return {
    ...stats,
    questionnaires,
    loading,
    error,
    refetch: fetchData,
    responseData,
  }
}
