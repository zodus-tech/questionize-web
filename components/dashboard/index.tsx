import React, { useRef } from 'react'
import ActiveSurveysChart from '../charts/active-surveys-chart'
import AverageResponseRateChart from '../charts/average-response-rate-chart'
import CompletionRatePieChart from '../charts/completion-rate-pie-chart'
import DemographicAreaChart from '../charts/demographic-area-chart'
import SatisfactionBarChart from '../charts/satisfaction-bar-chart'
import SurveyTrendChart from '../charts/survey-trend-chart'
import TotalResponsesChart from '../charts/total-responses-chart'
import { DatePickerWithRange } from '../date-picker-with-range'
import { DateRange } from 'react-day-picker'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { FileDown } from 'lucide-react'
import { Button } from '../ui/button'
import { format } from 'date-fns'

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
  const dashboardRef = useRef<HTMLDivElement>(null)

  const exportDashboardToPDF = async () => {
    if (!dashboardRef.current) return
    if (!date) return
    if (!date.from || !date.to) return

    try {
      const divElement = dashboardRef.current
      const { width, height } = divElement.getBoundingClientRect()

      const padding = 20
      const totalWidth = width + padding * 2
      const totalHeight = height + padding * 2

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: totalWidth,
        height: totalHeight,
        x: -padding,
        y: -padding,
      })

      // eslint-disable-next-line new-cap
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      })

      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)

      pdf.save(
        `relatorio-questionize-${format(date.from, 'dd-MM-yyyy')}-${format(date.to, 'dd-MM-yyyy')}.pdf`,
      )
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <div className="space-y-6">
      <main className="z-10 px-4 py-4 bg-tile-pattern bg-center bg-repeat rounded-lg w-full">
        <div className="flex justify-between items-center p-2">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <div className="w-fit h-full gap-2 flex justify-center flex-row">
            <DatePickerWithRange
              date={date}
              setDate={setDate}
              className="justify-self-end w-fit"
            />
            <Button
              onClick={exportDashboardToPDF}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <FileDown className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </main>

      <div ref={dashboardRef} className="space-y-6">
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
    </div>
  )
}

export default Dashboard
