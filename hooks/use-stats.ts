import { useState, useEffect } from 'react'
import { questionaryService } from '@/services/questionary-service'
import { getYearRange, calculateMonthsBetween } from '@/utils/dates'
import { Questionary } from '@/interfaces/questionary'

export function useStatistics() {
  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalQuestionnairesActive: 0,
    totalResponses: 0,
    averageResponseRate: '0.00',
  })

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [start, end] = getYearRange()

      const [questionnairesData, statsData] = await Promise.all([
        questionaryService.getAllQuestionnaires(),
        questionaryService.getGeneralStatistics(start, end),
      ])

      setQuestionnaires(questionnairesData)

      if (statsData) {
        const monthsBetween = calculateMonthsBetween(start, end)
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
  }, [])

  return { ...stats, questionnaires, loading, error, refetch: fetchData }
}
