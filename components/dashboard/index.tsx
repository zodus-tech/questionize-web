import ActiveSurveysChart from '../charts/active-surveys-chart'
import AverageResponseRateChart from '../charts/average-response-rate-chart'
import CompletionRatePieChart from '../charts/completion-rate-pie-chart'
import DemographicAreaChart from '../charts/demographic-area-chart'
import SatisfactionBarChart from '../charts/satisfaction-bar-chart'
import SurveyTrendChart from '../charts/survey-trend-chart'
import TotalResponsesChart from '../charts/total-responses-chart'

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
}

const Dashboard: React.FC<DashboardProps> = ({
  totalResponses,
  averageResponseRate,
  formsLength,
  responseData,
  completionRateData,
  satisfactionData,
  demographicData,
}) => {
  return (
    <div className="space-y-6">
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
