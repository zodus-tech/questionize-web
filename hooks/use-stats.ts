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
  const [completionRateData, setCompletionRateData] = useState([
    { name: 'Completed', value: 0 },
    { name: 'Incomplete', value: 0 },
  ])
  const [satisfactionData, setSatisfactionData] = useState([
    { name: 'Very Dissatisfied', value: 0 },
    { name: 'Dissatisfied', value: 0 },
    { name: 'Neutral', value: 0 },
    { name: 'Satisfied', value: 0 },
    { name: 'Very Satisfied', value: 0 },
  ])

  const removeLastDigit = (str: string) => {
    return str.slice(0, -1)
  }

  const fetchData = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setLoading(true)
    setError(null)

    try {
      const startDate = removeLastDigit(dateRange.from.toISOString())
      const endDate = removeLastDigit(dateRange.to.toISOString())

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

      const completedResponses = statsData.totalSubmissions || 0
      const incompleteResponses = statsData.unfinishedSubmissions || 0
      const totalCompletions = completedResponses + incompleteResponses

      const completionRateData = [
        {
          name: 'Completed',
          value:
            totalCompletions > 0
              ? Math.round((completedResponses / totalCompletions) * 100)
              : 0,
        },
        {
          name: 'Incomplete',
          value:
            totalCompletions > 0
              ? Math.round((incompleteResponses / totalCompletions) * 100)
              : 0,
        },
      ]

      const satisfactionDistribution = statsData.satisfactionDistribution || {}
      const satisfactionData = [
        {
          name: 'Very Dissatisfied',
          value: satisfactionDistribution.VERY_DISSATISFIED || 0,
        },
        {
          name: 'Dissatisfied',
          value: satisfactionDistribution.DISSATISFIED || 0,
        },
        {
          name: 'Neutral',
          value: satisfactionDistribution.NEUTRAL || 0,
        },
        {
          name: 'Satisfied',
          value: satisfactionDistribution.SATISFACTORY || 0,
        },
        {
          name: 'Very Satisfied',
          value: satisfactionDistribution.VERY_SATISFACTORY || 0,
        },
      ]

      setResponseData(responseData as ResponseData[])
      setQuestionnaires(questionnairesData)
      setCompletionRateData(completionRateData)
      setSatisfactionData(satisfactionData)

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
    completionRateData,
    satisfactionData,
  }
}
