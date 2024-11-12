'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Send, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Question, Questionary, QuestionType } from '@/interfaces/questionary'
import Cookies from 'js-cookie'
import axios from 'axios'
import LoadingSpinner from '@/components/loadingSpinner'

export default function QuestionaryResponsePage({
  params,
}: {
  params: { id: string }
}) {
  const [currentQuestionary, setCurrentQuestionary] =
    useState<Questionary | null>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {},
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const { id } = params

  const fetchQuestionnaire = useCallback(async () => {
    setLoading(true)
    try {
      const token = Cookies.get('token')

      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await axios.get(`/questionary/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
      })

      setCurrentQuestionary(response.data || null)
      setAnswers({})
    } catch (error) {
      console.error('Ocorreu um erro ao encontrar os questionários', error)
      setError('Ocorreu um erro ao encontrar os questionários')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    fetchQuestionnaire()
  }, [id, fetchQuestionnaire])

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleCheckboxChange = (
    questionId: string,
    option: string,
    checked: boolean,
  ) => {
    setAnswers((prev) => {
      const currentAnswers = (prev[questionId] as string[]) || []
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, option] }
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((item) => item !== option),
        }
      }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const requestBody = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
      }

      await axios.post(`/questionary/${id}/submit`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
        },
      })

      toast({
        title: 'Success',
        description: 'Formulário enviado com sucesso!',
      })

      setAnswers({})
      fetchQuestionnaire()
    } catch (error) {
      console.error('Erro ao enviar o formulário', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar o formulário',
      })
    }
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!currentQuestionary) {
    return <div>Questionário não encontrado.</div>
  }

  const handleClearAnswers = () => {
    setAnswers({})
    setCurrentQuestionary({ ...currentQuestionary })
  }

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <div className="min-h-screen bg-zinc-100">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-950">
              {currentQuestionary.title}
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {currentQuestionary.questions.map((question: Question) => (
              <div key={question.id} className="mb-8">
                <Label
                  htmlFor={`question-${question.id}`}
                  className="text-lg text-zinc-900"
                >
                  {question.text}
                </Label>
                {question.type === QuestionType.TEXT && (
                  <Input
                    id={`question-${question.id}`}
                    value={(answers[question.id.toString()] as string) || ''}
                    onChange={(e) =>
                      handleInputChange(question.id.toString(), e.target.value)
                    }
                    placeholder="Digite sua resposta"
                    className="w-full mt-2 resize-none"
                  />
                )}
                {question.type === QuestionType.MULTIPLE_CHOICE && (
                  <RadioGroup
                    onValueChange={(value) =>
                      handleInputChange(question.id.toString(), value)
                    }
                    value={answers[question.id.toString()] as string}
                  >
                    {question.options?.map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-2 mt-3"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`question-${question.id}-${option}`}
                        />
                        <Label
                          htmlFor={`question-${question.id}-${option}`}
                          className="text-zinc-700"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {question.type === QuestionType.BOOLEAN && (
                  <div className="space-y-2">
                    <Checkbox
                      id={`question-${question.id}`}
                      checked={(
                        answers[question.id.toString()] as string[]
                      )?.includes('Sim')}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          question.id.toString(),
                          'Sim',
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`question-${question.id}`}
                      className="text-zinc-700"
                    >
                      Sim
                    </Label>
                  </div>
                )}
              </div>
            ))}
            <div className="flex space-x-4">
              <Button
                onClick={handleClearAnswers}
                variant="outline"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2 text-zinc-700" />
                <Label className="text-zinc-700">Recomeçar</Label>
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
