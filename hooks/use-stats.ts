'use client'

import { useState, useEffect, useCallback } from 'react'
import { questionaryService } from '@/services/questionary-service'
import { calculateMonthsBetween } from '@/utils/dates'
import type { Questionary } from '@/interfaces/questionary'
import type { DateRange } from 'react-day-picker'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ResponseData } from '@/interfaces/stats'

export function useStatistics(
  dateRange?: DateRange,
  questionaryId?: string,
  departmentId?: string,
) {
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

  const removeLastDigit = useCallback((str: string) => {
    return str.slice(0, -1)
  }, [])

  const fetchData = useCallback(async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setLoading(true)
    setError(null)

    try {
      const startDate = removeLastDigit(dateRange.from.toISOString())
      const endDate = removeLastDigit(dateRange.to.toISOString())

      const [questionnairesData, statsData] = await Promise.all([
        questionaryId
          ? questionaryService.getQuestionnaireById(questionaryId)
          : questionaryService.getAllQuestionnaires(departmentId),
        questionaryService.getGeneralStatistics(
          startDate,
          endDate,
          questionaryId,
          departmentId,
        ),
      ])

      const responseData = Object.entries(
        statsData.totalSubmissionsPerPeriod,
      ).map(([period, count]) => {
        const [startStr, endStr] = period.split(' - ')

        let formattedRange
        try {
          const startDate = parseISO(startStr)
          const endDate = parseISO(endStr)

          const startFormatted = format(startDate, 'dd/MM', { locale: ptBR })
          const endFormatted = format(endDate, 'dd/MM', { locale: ptBR })
          formattedRange = `${startFormatted} - ${endFormatted}`
        } catch (e) {
          formattedRange = period
        }

        return {
          name: formattedRange,
          period,
          responses: count,
        }
      })

      responseData.sort((a, b) => {
        const [aStartStr] = a.period.split(' - ')
        const [bStartStr] = b.period.split(' - ')
        return new Date(aStartStr).getTime() - new Date(bStartStr).getTime()
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
  }, [dateRange, questionaryId, departmentId, removeLastDigit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
