'use client'

import { useEffect, useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProps,
} from 'react-beautiful-dnd'
import { Copy, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Question, QuestionType } from '@/interfaces/questionary'

// A simple component that implements the react-beautiful-dnd approach for Next.js
function StrictModeDroppable(props: DroppableProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // This is needed for ServerSideRendering with NextJS
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Droppable {...props} />
}

interface DraggableQuestionsProps {
  questions: Question[]
  onReorder: (questions: Question[]) => void
  onUpdateQuestionTitle: (id: string, title: string) => void
  onUpdateQuestionType: (
    id: string,
    questionType: keyof typeof QuestionType,
  ) => void
  onCloneQuestion: (id: string) => void
  onRemoveQuestion: (id: string) => void
  onAddOption: (id: string) => void
  onUpdateOption: (id: string, optionIndex: number, value: string) => void
}

export function DraggableQuestions({
  questions,
  onReorder,
  onUpdateQuestionTitle,
  onUpdateQuestionType,
  onCloneQuestion,
  onRemoveQuestion,
  onAddOption,
  onUpdateOption,
}: DraggableQuestionsProps) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(questions).map((q) => ({
      ...q,
      id: String(q.id),
    }))

    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onReorder(items)
  }

  // Show loading state when not in browser
  if (!isBrowser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6 w-full">
        <div className="text-center py-4 text-gray-500">
          Carregando questões...
        </div>
      </div>
    )
  }

  // Ensure all question IDs are strings
  const questionsWithStringIds = questions.map((q) => ({
    ...q,
    id: String(q.id),
  }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="min-h-[100px]"
            >
              {questionsWithStringIds.length > 0 ? (
                questionsWithStringIds.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-6 p-4 border rounded-lg relative bg-white"
                      >
                        <div className="grid grid-cols-[1fr,auto,auto,auto,auto,auto] gap-2 items-center mb-4">
                          <Input
                            value={question.text}
                            onChange={(e) =>
                              onUpdateQuestionTitle(question.id, e.target.value)
                            }
                            className="text-lg font-semibold"
                          />
                          <Select
                            defaultValue={question.type}
                            onValueChange={(value: keyof typeof QuestionType) =>
                              onUpdateQuestionType(question.id, value)
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Tipo Pergunta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={QuestionType.MULTIPLE_CHOICE}>
                                Múltipla Escolha
                              </SelectItem>
                              <SelectItem value={QuestionType.ALTERNATIVE}>
                                Alternativa
                              </SelectItem>
                              <SelectItem value={QuestionType.TEXT}>
                                Texto
                              </SelectItem>
                              <SelectItem value={QuestionType.BOOLEAN}>
                                Sim e Não
                              </SelectItem>
                              <SelectItem value={QuestionType.RATING}>
                                Avaliação
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => onCloneQuestion(question.id)}
                            size="icon"
                            variant="ghost"
                          >
                            <Copy className="w-5 h-5 text-gray-400" />
                          </Button>
                          <Button
                            onClick={() => onRemoveQuestion(question.id)}
                            size="icon"
                            variant="ghost"
                          >
                            <Trash2 className="w-5 h-5 text-gray-400" />
                          </Button>
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                          </div>
                        </div>

                        {(question.type === QuestionType.MULTIPLE_CHOICE ||
                          question.type === QuestionType.ALTERNATIVE) &&
                          (question.options || []).map(
                            (option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center mb-2"
                              >
                                <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                                <Input
                                  value={option}
                                  onChange={(e) =>
                                    onUpdateOption(
                                      question.id,
                                      optionIndex,
                                      e.target.value,
                                    )
                                  }
                                  className="flex-grow"
                                />
                              </div>
                            ),
                          )}

                        {question.type === QuestionType.RATING && (
                          <RadioGroup className="mt-2">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                              <Label
                                htmlFor={`${question.id}-very_dissatisfied`}
                              >
                                Muito Insatisfeito
                              </Label>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                              <Label htmlFor={`${question.id}-dissatisfied`}>
                                Insatisfeito
                              </Label>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                              <Label htmlFor={`${question.id}-neutral`}>
                                Neutro
                              </Label>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                              <Label htmlFor={`${question.id}-satisfied`}>
                                Satisfeito
                              </Label>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                              <Label htmlFor={`${question.id}-very_satisfied`}>
                                Muito Satisfeito
                              </Label>
                            </div>
                          </RadioGroup>
                        )}

                        {question.type === QuestionType.TEXT && (
                          <Textarea
                            placeholder="Campo de texto"
                            className="w-full mt-2 resize-none !cursor-default"
                            disabled
                          />
                        )}

                        {question.type === QuestionType.BOOLEAN && (
                          <RadioGroup className="mt-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                              <Label htmlFor={`${question.id}-yes`}>Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                              <Label htmlFor={`${question.id}-no`}>Não</Label>
                            </div>
                          </RadioGroup>
                        )}

                        {(question.type === QuestionType.MULTIPLE_CHOICE ||
                          question.type === QuestionType.ALTERNATIVE) && (
                          <Button
                            onClick={() => onAddOption(question.id)}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
                            Adicionar Opção
                          </Button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma questão adicionada
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  )
}
