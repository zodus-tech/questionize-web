import React, { useCallback, useEffect, useRef, useState } from 'react'
import ActiveSurveysChart from '../charts/active-surveys-chart'
import AverageResponseRateChart from '../charts/average-response-rate-chart'
import CompletionRatePieChart from '../charts/completion-rate-pie-chart'
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
import {
  CompletionRateData,
  ResponseData,
  SatisfactionData,
} from '@/interfaces/stats'
import { Department } from '@/interfaces/department'
import { departmentService } from '@/services/department-service'
import { questionaryService } from '@/services/questionary-service'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Questionary } from '@/interfaces/questionary'

interface DashboardProps {
  totalResponses: number
  averageResponseRate: string
  formsLength: number
  responseData: ResponseData[]
  completionRateData: CompletionRateData[]
  satisfactionData: SatisfactionData[]
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  questionaryId: string | undefined
  setQuestionaryId: React.Dispatch<React.SetStateAction<string | undefined>>
  departmentId: string | undefined
  setDepartmentId: React.Dispatch<React.SetStateAction<string | undefined>>
  refetch: () => void
}

const Dashboard: React.FC<DashboardProps> = ({
  totalResponses,
  averageResponseRate,
  formsLength,
  responseData,
  completionRateData,
  satisfactionData,
  date,
  setDate,
  questionaryId,
  setQuestionaryId,
  departmentId,
  setDepartmentId,
  refetch,
}) => {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [questionnaires, setQuestionnaires] = useState<
    { id: string; title: string }[]
  >([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isChangingFilters, setIsChangingFilters] = useState(false)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getAllDepartments()
        setDepartments(data)
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }

    fetchDepartments()
  }, [])

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const data = await questionaryService.getAllQuestionnaires(departmentId)
        setQuestionnaires(
          data.map((q: Questionary) => ({ id: q.id, title: q.title })),
        )
      } catch (error) {
        console.error('Error fetching questionnaires:', error)
      } finally {
        setIsChangingFilters(false)
      }
    }

    fetchQuestionnaires()
  }, [departmentId])

  const handleDepartmentChange = useCallback(
    (value: string) => {
      setIsChangingFilters(true)
      const newDepartmentId = value === 'all' ? undefined : value
      setDepartmentId(newDepartmentId)
      if (questionaryId) {
        setQuestionaryId(undefined)
      }
      setTimeout(() => {
        refetch()
      }, 50)
    },
    [questionaryId, setDepartmentId, setQuestionaryId, refetch],
  )

  const handleQuestionaryChange = useCallback(
    (value: string) => {
      setIsChangingFilters(true)
      const newQuestionaryId = value === 'all' ? undefined : value
      setQuestionaryId(newQuestionaryId)
      setTimeout(() => {
        refetch()
      }, 50)
    },
    [setQuestionaryId, refetch],
  )

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
        <div className="flex justify-between items-center p-2 flex-col gap-2 md:gap-0 md:flex-row">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <div className="w-fit h-full gap-2 flex justify-center flex-col md:flex-row">
            <DatePickerWithRange
              date={date}
              setDate={(newDate) => {
                setDate(newDate)
                setTimeout(() => refetch(), 50)
              }}
              className="justify-self-end w-fit"
              variant={'dark'}
              allowPastDates={true}
            />
            <Select
              onValueChange={handleDepartmentChange}
              value={departmentId === undefined ? 'all' : departmentId}
              defaultValue="all"
              disabled={isChangingFilters}
            >
              <SelectTrigger className="min-w-[200px] w-fit bg-primary text-primary-foreground border-none">
                <SelectValue placeholder="Selecione um setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os setores</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleQuestionaryChange}
              value={questionaryId === undefined ? 'all' : questionaryId}
              defaultValue="all"
              disabled={isChangingFilters}
            >
              <SelectTrigger className="min-w-[200px] w-fit bg-primary text-primary-foreground border-none">
                <SelectValue placeholder="Selecione um questionário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os questionários</SelectItem>
                {questionnaires.map((q) => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>
        <div className="grid gap-6">
          <SatisfactionBarChart data={satisfactionData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
