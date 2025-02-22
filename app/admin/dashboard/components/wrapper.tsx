'use client'

import { useState } from 'react'
import Dashboard from '@/components/dashboard'
import { useStatistics } from '@/hooks/use-stats'
import { addDays, subDays } from 'date-fns'
import { DateRange } from 'react-day-picker'

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 100),
    to: addDays(new Date(), 40),
  })

  const [questionaryId, setQuestionaryId] = useState<string | undefined>(
    undefined,
  )
  const [departmentId, setDepartmentId] = useState<string | undefined>(
    undefined,
  )

  const {
    totalResponses,
    totalQuestionnairesActive,
    averageResponseRate,
    loading,
    error,
    responseData,
    completionRateData,
    satisfactionData,
    refetch,
  } = useStatistics(date, questionaryId, departmentId)

  return (
    <div className="flex flex-col">
      <main className="flex-grow container mx-auto mt-2 px-4 py-4">
        <Dashboard
          totalResponses={totalResponses}
          averageResponseRate={averageResponseRate}
          formsLength={totalQuestionnairesActive}
          responseData={responseData}
          completionRateData={completionRateData}
          satisfactionData={satisfactionData}
          date={date}
          setDate={setDate}
          questionaryId={questionaryId}
          setQuestionaryId={setQuestionaryId}
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
          refetch={refetch}
        />
        {loading && <p>Carregando dados...</p>}
        {error && (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-red-500">{error}</p>
          </div>
        )}
      </main>
    </div>
  )
}
