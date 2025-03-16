'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Send, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Question, Questionary, QuestionType } from '@/interfaces/questionary'
import axios from 'axios'
import LoadingSpinner from '@/components/loadingSpinner'
import { baseUrl } from '@/utils/endpoints'
import { useRouter } from 'next/navigation'
import { questionaryService } from '@/services/questionary-service'
import { ToastAction } from '@radix-ui/react-toast'
import { MemberSelector } from './components/member-selector'
import { Member } from '@/interfaces/member'

axios.defaults.baseURL = baseUrl

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | undefined>()
  const [members, setMembers] = useState<Member[] | undefined>()

  const { toast } = useToast()
  const router = useRouter()

  const { id } = params

  const fetchQuestionnaire = useCallback(async () => {
    setLoading(true)
    try {
      const data = await questionaryService.getQuestionnaireById(id)
      setCurrentQuestionary(data)
      setAnswers({})

      const members = data?.options?.members || []
      if (members.length > 0) {
        setMembers(members)
      } else {
        setMembers(undefined)
      }
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

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const requestBody = {
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer: Array.isArray(answer) ? answer.join(' :z:o:d:u:s: ') : answer,
        })),
        memberId: selectedMember?.id,
      }

      const success = await questionaryService.answerQuestionnaire(
        id,
        requestBody,
        currentQuestionary?.submissionToken,
      )
      if (success) {
        toast({
          title: 'Success',
          description: 'Formulário enviado com sucesso!',
        })
        setSelectedMember(undefined)
        setAnswers({})
        fetchQuestionnaire()
      } else {
        toast({
          variant: 'destructive',
          title: 'Falha',
          description: `Não foi possível enviar sua resposta, tente novamente mais tarde`,
          action: (
            <ToastAction
              altText="Tentar novamente"
              onClick={() => {
                handleSubmit()
              }}
            >
              Tentar novamente
            </ToastAction>
          ),
        })
      }
    } catch (error) {
      console.error('Erro ao enviar o formulário', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar o formulário',
        variant: 'destructive',
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
    setSelectedMember(undefined)
    setCurrentQuestionary((prev) => (prev ? { ...prev } : null))
  }

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <div className="relative min-h-screen bg-tile-pattern bg-repeat bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        <div className="relative min-h-screen">
          <div className="bg-white shadow sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center relative">
              <div className="z-10">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="border-red-500 cursor-pointer hover:bg-red-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 text-red-700 cursor-pointer" />
                  <Label className="text-red-700 cursor-pointer">Voltar</Label>
                </Button>
              </div>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <h1 className="text-2xl font-bold text-gray-950">
                  {currentQuestionary.title}
                </h1>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {members && members.length > 0 && (
                <div className="mb-8">
                  <Label className="text-lg text-zinc-900 mb-2 block">
                    Selecione o atendente que você deseja avaliar:
                  </Label>
                  <MemberSelector
                    members={members}
                    onSelect={setSelectedMember}
                    selectedMember={selectedMember}
                  />
                </div>
              )}
              {(!members || members.length === 0 || selectedMember) && (
                <>
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
                          value={
                            (answers[question.id.toString()] as string) || ''
                          }
                          onChange={(e) =>
                            handleInputChange(
                              question.id.toString(),
                              e.target.value,
                            )
                          }
                          placeholder="Digite sua resposta"
                          className="w-full mt-2 resize-none"
                        />
                      )}
                      {question.type === QuestionType.MULTIPLE_CHOICE && (
                        <div>
                          {question.options?.map((option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2 mt-3"
                            >
                              <input
                                type="checkbox"
                                id={`question-${question.id}-${option}`}
                                checked={
                                  (
                                    answers[question.id.toString()] as string[]
                                  )?.includes(option) || false
                                }
                                onChange={(e) => {
                                  const isChecked = e.target.checked
                                  setAnswers((prev) => {
                                    const currentAnswers =
                                      (prev[
                                        question.id.toString()
                                      ] as string[]) || []
                                    if (isChecked) {
                                      return {
                                        ...prev,
                                        [question.id.toString()]: [
                                          ...currentAnswers,
                                          option,
                                        ],
                                      }
                                    } else {
                                      return {
                                        ...prev,
                                        [question.id.toString()]:
                                          currentAnswers.filter(
                                            (item) => item !== option,
                                          ),
                                      }
                                    }
                                  })
                                }}
                              />
                              <Label
                                htmlFor={`question-${question.id}-${option}`}
                                className="text-zinc-700"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                      {question.type === QuestionType.BOOLEAN && (
                        <RadioGroup
                          onValueChange={(value) =>
                            handleInputChange(question.id.toString(), value)
                          }
                          value={
                            (answers[question.id.toString()] as string) || ''
                          }
                        >
                          <div className="flex items-center space-x-2 mt-3">
                            <RadioGroupItem
                              value="true"
                              id={`question-${question.id}-true`}
                            />
                            <Label
                              htmlFor={`question-${question.id}-true`}
                              className="text-zinc-700"
                            >
                              Sim
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <RadioGroupItem
                              value="false"
                              id={`question-${question.id}-false`}
                            />
                            <Label
                              htmlFor={`question-${question.id}-false`}
                              className="text-zinc-700"
                            >
                              Não
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                      {question.type === QuestionType.RATING && (
                        <div>
                          {[
                            'VERY_DISSATISFIED',
                            'DISSATISFIED',
                            'NEUTRAL',
                            'SATISFACTORY',
                            'VERY_SATISFACTORY',
                          ].map((option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2 mt-3"
                            >
                              <input
                                type="radio"
                                id={`question-${question.id}-${option}`}
                                checked={
                                  (answers[
                                    question.id.toString()
                                  ] as string) === option
                                }
                                onChange={() =>
                                  handleInputChange(
                                    question.id.toString(),
                                    option,
                                  )
                                }
                              />
                              <Label
                                htmlFor={`question-${question.id}-${option}`}
                                className="text-zinc-700"
                              >
                                {option === 'VERY_DISSATISFIED'
                                  ? 'Muito Insatisfeito'
                                  : option === 'DISSATISFIED'
                                    ? 'Insatisfeito'
                                    : option === 'NEUTRAL'
                                      ? 'Neutro'
                                      : option === 'SATISFACTORY'
                                        ? 'Satisfeito'
                                        : 'Muito Satisfeito'}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

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
      </div>
    </>
  )
}
