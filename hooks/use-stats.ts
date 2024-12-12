import { useState, useEffect } from 'react'
import { questionaryService } from '@/services/questionary-service'
import { calculateMonthsBetween } from '@/utils/dates'
import { Questionary } from '@/interfaces/questionary'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

export function useStatistics(dateRange?: DateRange) {
  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalQuestionnairesActive: 0,
    totalResponses: 0,
    averageResponseRate: '0.00',
  })

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

      setQuestionnaires(questionnairesData)

      if (statsData) {
        const monthsBetween = calculateMonthsBetween(startDate, endDate)
        const averageRate = (
          statsData.totalSubmissions / Number(monthsBetween)
        ).toFixed(2)

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

  return { ...stats, questionnaires, loading, error, refetch: fetchData }
}
