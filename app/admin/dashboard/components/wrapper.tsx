'use client'

import { useState } from 'react'
import Dashboard from '@/components/dashboard'
import { useStatistics } from '@/hooks/use-stats'
import {
  completionRateData,
  satisfactionData,
  demographicData,
} from '@/data/mock-data'
import { addDays } from 'date-fns'
import { DateRange } from 'react-day-picker'

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const {
    totalResponses,
    totalQuestionnairesActive,
    averageResponseRate,
    loading,
    error,
    responseData,
  } = useStatistics(date)

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
          demographicData={demographicData}
          date={date}
          setDate={setDate}
        />
        {loading && <p>Carregando Dados...</p>}
        {error && (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-red-500">{error}</p>
          </div>
        )}
      </main>
    </div>
  )
}
