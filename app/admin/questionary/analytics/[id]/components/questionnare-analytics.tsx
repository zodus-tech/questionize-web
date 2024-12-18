'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { questionaryService } from '@/services/questionary-service'
import _ from 'lodash'
import {
  Answer,
  BooleanDataPoint,
  MultipleChoiceDataPoint,
  Question,
  Questionnaire,
  QuestionnaireAnalyticsProps,
  QuestionType,
  Submission,
  TextResponseDataPoint,
} from '@/interfaces/questionnaire-analytics'
import { AlertCircle, BarChart2, PieChartIcon, FileText } from 'lucide-react'
import LoadingSpinner from '@/components/loadingSpinner'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const COLORS = ['#4299E1', '#48BB78', '#ECC94B', '#ED64A6', '#9F7AEA']

const QuestionnaireAnalytics: React.FC<QuestionnaireAnalyticsProps> = ({
  params,
}) => {
  const [questionnaireData, setQuestionnaireData] =
    useState<Questionnaire | null>(null)
  const [submissions, setSubmissions] = useState<Submission[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [questionnaire, submissionsData] = await Promise.all([
        questionaryService.getQuestionnaireById(params.id),
        questionaryService.getQuestionnaireSubmissions(params.id),
      ])
      setQuestionnaireData(questionnaire)
      setSubmissions(submissionsData.content)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      setError('Falha ao carregar dados do questionário')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const processMultipleChoiceData = (
    question: Question,
    answers: Answer[],
  ): MultipleChoiceDataPoint[] => {
    const optionCounts = _.countBy(answers.map((a) => a.answer))
    return (question.options || []).map((option) => ({
      name: option,
      count: optionCounts[option] || 0,
    }))
  }

  const processRatingData = (
    question: Question,
    answers: Answer[],
  ): MultipleChoiceDataPoint[] => {
    const optionCounts = _.countBy(answers.map((a) => a.answer))
    return (question.options || []).map((option) => ({
      name: [
        {
          value: 'VERY_DISSATISFIED',
          label: 'Muito Insatisfeito',
        },
        {
          value: 'DISSATISFIED',
          label: 'Insatisfeito',
        },
        { value: 'NEUTRAL', label: 'Neutro' },
        {
          value: 'SATISFACTORY',
          label: 'Satisfeito',
        },
        {
          value: 'VERY_SATISFACTORY',
          label: 'Muito Satisfeito',
        },
      ].filter((v) => v.value === option)[0].label,
      count: optionCounts[option] || 0,
    }))
  }

  const processTextResponses = (answers: Answer[]): TextResponseDataPoint[] => {
    const responseCount = answers.length
    const averageLength = Math.round(
      answers.reduce((acc, curr) => acc + curr.answer.length, 0) /
        (responseCount || 1),
    )
    return [
      { name: 'Total de Respostas', value: responseCount },
      { name: 'Comprimento Médio Caracteres', value: averageLength },
    ]
  }

  const processBooleanData = (answers: Answer[]): BooleanDataPoint[] => {
    const counts: Record<string, number> = _.countBy(answers, 'answer')
    return [
      { name: 'Sim', value: counts.true || 0 },
      { name: 'Não', value: counts.false || 0 },
    ]
  }

  if (loading) return <LoadingSpinner isLoading={true} />
  if (error)
    return (
      <div className="p-4 text-red-500 flex items-center">
        <AlertCircle className="mr-2" />
        {error}
      </div>
    )
  if (!questionnaireData || !submissions)
    return (
      <div className="p-4 text-yellow-600 flex items-center">
        <AlertCircle className="mr-2" />
        Nenhum dado foi encontrado para esse questionário...
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {questionnaireData.title}
          </h1>
          <p className="text-gray-600 mt-2">Análise de Respostas</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="details">Detalhes por Pergunta</TabsTrigger>
            <TabsTrigger value="responses">Respostas Individuais</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Questionário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-800">
                      {submissions.length}
                    </p>
                    <p className="text-sm text-blue-600">Total de Respostas</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-800">
                      {questionnaireData.questions.length}
                    </p>
                    <p className="text-sm text-green-600">
                      Número de Perguntas
                    </p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-800">
                      {submissions.length > 0
                        ? Math.round(
                            submissions.reduce(
                              (acc, sub) => acc + sub.answers.length,
                              0,
                            ) / submissions.length,
                          )
                        : 0}
                    </p>
                    <p className="text-sm text-purple-600">
                      Média de Respostas por Submissão
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questionnaireData.questions.map((question) => {
                const questionAnswers = submissions.flatMap((s) =>
                  s.answers.filter((a) => a.question === question.text),
                )

                return (
                  <Card key={question.id} className="w-full">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {question.type === QuestionType.MULTIPLE_CHOICE && (
                          <BarChart2 className="mr-2" />
                        )}
                        {question.type === QuestionType.BOOLEAN && (
                          <PieChartIcon className="mr-2" />
                        )}
                        {question.type === QuestionType.TEXT && (
                          <FileText className="mr-2" />
                        )}
                        {question.text}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        {question.type === QuestionType.MULTIPLE_CHOICE ? (
                          <BarChart
                            data={processMultipleChoiceData(
                              question,
                              questionAnswers,
                            )}
                          >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number) => [
                                `${value}`,
                                'Contagem',
                              ]}
                              labelFormatter={(label) => `Opção: ${label}`}
                            />
                            <Legend formatter={() => `Contagem`} />
                            <Bar dataKey="count" fill="#4299E1" />
                          </BarChart>
                        ) : question.type === QuestionType.RATING ? (
                          <BarChart
                            data={processRatingData(question, questionAnswers)}
                          >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number) => [
                                `${value}`,
                                'Contagem',
                              ]}
                              labelFormatter={(value) => `Opção: ${value}`}
                            />
                            <Legend formatter={() => `Contagem`} />
                            <Bar dataKey="count" fill="#4299E1" />
                          </BarChart>
                        ) : question.type === QuestionType.BOOLEAN ? (
                          <PieChart>
                            <Pie
                              data={processBooleanData(questionAnswers)}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value, percent }) =>
                                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                              }
                              outerRadius={80}
                              dataKey="value"
                            >
                              {processBooleanData(questionAnswers).map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ),
                              )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        ) : (
                          <BarChart
                            data={processTextResponses(questionAnswers)}
                          >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number) => [
                                `${value}`,
                                'Valor',
                              ]}
                              labelFormatter={(label) => `Opção: ${label}`}
                            />
                            <Legend formatter={() => `Valor`} />
                            <Bar dataKey="value" fill="#48BB78" />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>Respostas Individuais</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {submissions.map((submission, index) => (
                    <AccordionItem value={`item-${index}`} key={submission.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex justify-between items-center w-full">
                          <span>Resposta #{index + 1}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          {submission.answers.map((answer) => (
                            <div key={answer.id} className="border-b pb-2">
                              <h4 className="font-semibold text-gray-700">
                                {answer.question}
                              </h4>
                              <p className="mt-1 text-gray-600">
                                {answer.answer === 'true'
                                  ? 'Sim'
                                  : answer.answer === 'false'
                                    ? 'Não'
                                    : answer.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default QuestionnaireAnalytics
