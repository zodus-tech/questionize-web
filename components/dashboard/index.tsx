import React from 'react'
import ActiveSurveysChart from '../charts/active-surveys-chart'
import AverageResponseRateChart from '../charts/average-response-rate-chart'
import CompletionRatePieChart from '../charts/completion-rate-pie-chart'
import DemographicAreaChart from '../charts/demographic-area-chart'
import SatisfactionBarChart from '../charts/satisfaction-bar-chart'
import SurveyTrendChart from '../charts/survey-trend-chart'
import TotalResponsesChart from '../charts/total-responses-chart'
import { DatePickerWithRange } from '../date-picker-with-range'
import { DateRange } from 'react-day-picker'
import { Link, PlusCircle } from 'lucide-react'
import { Button } from '../ui/button'

interface ResponseData {
  name: string
  responses: number
}

interface CompletionRateData {
  name: string
  value: number
}

interface SatisfactionData {
  name: string
  value: number
}

interface DemographicData {
  age: string
  male: number
  female: number
}

interface DashboardProps {
  totalResponses: number
  averageResponseRate: string
  formsLength: number
  responseData: ResponseData[]
  completionRateData: CompletionRateData[]
  satisfactionData: SatisfactionData[]
  demographicData: DemographicData[]
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const Dashboard: React.FC<DashboardProps> = ({
  totalResponses,
  averageResponseRate,
  formsLength,
  responseData,
  completionRateData,
  satisfactionData,
  demographicData,
  date,
  setDate,
}) => {
  return (
    <div className="space-y-6">
      <main className="z-10 px-4 py-4 bg-tile-pattern bg-center bg-repeat rounded-lg w-full">
        <div className="flex justify-between items-center p-2">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <DatePickerWithRange
            date={date}
            setDate={setDate}
            className="justify-self-end w-fit"
          />
        </div>
      </main>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TotalResponsesChart totalResponses={totalResponses} />
        <AverageResponseRateChart averageResponseRate={averageResponseRate} />
        <ActiveSurveysChart formsLength={formsLength} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SurveyTrendChart data={responseData} />
        <CompletionRatePieChart data={completionRateData} />
        <SatisfactionBarChart data={satisfactionData} />
        <DemographicAreaChart data={demographicData} />
      </div>
    </div>
  )
}

export default Dashboard
