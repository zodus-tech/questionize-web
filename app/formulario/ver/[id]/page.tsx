'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Send, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const formData = {
  title: 'Formulário de Satisfação Universitária',
  description: 'Este é um formulário de satisfação para fins de demonstração.',
  questions: [
    { id: '1', type: 'short_answer', title: 'Qual é o seu nome?' },
    {
      id: '2',
      type: 'multiple_choice',
      title: 'Qual é sua cor favorita?',
      options: ['Vermelho', 'Azul', 'Verde', 'Amarelo'],
    },
    {
      id: '3',
      type: 'checkbox',
      title: 'Quais frutas você gosta?',
      options: ['Maçã', 'Banana', 'Laranja', 'Manga'],
    },
    {
      id: '4',
      type: 'long_answer',
      title: 'Fale sobre sua experiência na universidade.',
    },
  ],
}

type Answer = {
  [key: string]: string | string[]
}

export default function FormResponse() {
  const [answers, setAnswers] = useState<Answer>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // input
  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  // checkbox
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
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Form submitted:', answers)
    setIsSubmitting(false)
    toast({
      title: 'Questionário enviado.',
      description: 'Formulário enviado com successo!',
    })
  }

  const handleClearAnswers = () => {
    setAnswers({})
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* header */}

      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-950">{formData.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-zinc-600 mb-6">{formData.description}</p>

          {/* forms */}
          {formData.questions.map((question) => (
            <div key={question.id} className="mb-8">
              <Label htmlFor={question.id} className="text-lg text-zinc-900">
                {question.title}
              </Label>

              {question.type === 'short_answer' && (
                <Input
                  id={question.id}
                  value={(answers[question.id] as string) || ''}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  placeholder="Digite sua resposta"
                  className="w-full mt-2 resize-none"
                />
              )}

              {question.type === 'long_answer' && (
                <Textarea
                  id={question.id}
                  value={(answers[question.id] as string) || ''}
                  onChange={(e) =>
                    handleInputChange(question.id, e.target.value)
                  }
                  className="w-full"
                />
              )}

              {question.type === 'multiple_choice' && (
                <RadioGroup
                  onValueChange={(value) =>
                    handleInputChange(question.id, value)
                  }
                  value={answers[question.id] as string}
                >
                  {question.options?.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-2 mt-3"
                    >
                      <RadioGroupItem
                        value={option}
                        id={`${question.id}-${option}`}
                      />
                      <Label
                        htmlFor={`${question.id}-${option}`}
                        className="text-zinc-700"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-2 mt-3"
                    >
                      <Checkbox
                        id={`${question.id}-${option}`}
                        checked={(
                          (answers[question.id] as string[]) || []
                        ).includes(option)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            question.id,
                            option,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={`${question.id}-${option}`}
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
              disabled={isSubmitting}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
