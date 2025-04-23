'use client'

import { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Question, Questionary, QuestionType } from '@/interfaces/questionary'
import LoadingSpinner from '@/components/loadingSpinner'
import { questionaryService } from '@/services/questionary-service'
import BannerImage from '@/components/banner-image'

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

  const { id } = params

  const fetchQuestionnaire = useCallback(async () => {
    setLoading(true)
    try {
      const data = await questionaryService.getQuestionnaireById(id)
      setCurrentQuestionary(data)
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

  if (error) {
    return <div>{error}</div>
  }

  if (!currentQuestionary) {
    return <div>Questionário não encontrado.</div>
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
            {currentQuestionary.bannerId && (
              <BannerImage bannerId={currentQuestionary.bannerId} />
            )}
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
                {question.type === QuestionType.RATING && (
                  <RadioGroup
                    onValueChange={(value) =>
                      handleInputChange(question.id.toString(), value)
                    }
                    value={(answers[question.id.toString()] as string) || ''}
                  >
                    {[
                      {
                        value: 'VERY_DISSATISFIED',
                        label: 'Muito Insatisfeito',
                      },
                      { value: 'DISSATISFIED', label: 'Insatisfeito' },
                      { value: 'NEUTRAL', label: 'Neutro' },
                      { value: 'SATISFACTORY', label: 'Satisfeito' },
                      { value: 'VERY_SATISFACTORY', label: 'Muito Satisfeito' },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 mt-3"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`question-${question.id}-${option.value}`}
                        />
                        <Label
                          htmlFor={`question-${question.id}-${option.value}`}
                          className="text-zinc-700"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                                (prev[question.id.toString()] as string[]) || []
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
                    value={(answers[question.id.toString()] as string) || ''}
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
                {question.type === QuestionType.ALTERNATIVE && (
                  <div>
                    {question.options?.map((option) => (
                      <div
                        key={option}
                        className="flex items-center space-x-2 mt-3"
                      >
                        <input
                          type="radio"
                          id={`question-${question.id}-${option}`}
                          checked={
                            (answers[question.id.toString()] as string) ===
                            option
                          }
                          onChange={() =>
                            handleInputChange(question.id.toString(), option)
                          }
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
