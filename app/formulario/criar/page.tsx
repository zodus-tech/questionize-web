import { useReducer, useCallback } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from 'react-beautiful-dnd'
import {
  Undo2,
  Redo2,
  Send,
  Plus,
  Copy,
  Trash2,
  GripVertical,
} from 'lucide-react'
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

type FormState = {
  title: string
  description: string
  questions: {
    id: string
    type: string
    title: string
    options: string[] | null
  }[]
}

type Action =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'ADD_QUESTION' }
  | { type: 'UPDATE_QUESTION_TITLE'; payload: { id: string; title: string } }
  | {
      type: 'UPDATE_QUESTION_TYPE'
      payload: { id: string; questionType: string }
    }
  | { type: 'ADD_OPTION'; payload: string }
  | {
      type: 'UPDATE_OPTION'
      payload: { id: string; optionIndex: number; value: string }
    }
  | { type: 'CLONE_QUESTION'; payload: string }
  | { type: 'REMOVE_QUESTION'; payload: string }
  | { type: 'REORDER_QUESTIONS'; payload: FormState['questions'] }
  | { type: 'UNDO' }
  | { type: 'REDO' }

type HistoryState = {
  past: FormState[]
  present: FormState
  future: FormState[]
}

const initialState: HistoryState = {
  past: [],
  present: {
    title: 'Untitled Form',
    description: '',
    questions: [
      {
        id: '1',
        type: 'multiple_choice',
        title: 'Question',
        options: ['Option 1'],
      },
    ],
  },
  future: [],
}

function formReducer(state: HistoryState, action: Action): HistoryState {
  const updateHistory = (newPresent: FormState): HistoryState => ({
    past: [...state.past, state.present],
    present: newPresent,
    future: [],
  })

  switch (action.type) {
    case 'SET_TITLE':
      return updateHistory({ ...state.present, title: action.payload })
    case 'SET_DESCRIPTION':
      return updateHistory({ ...state.present, description: action.payload })
    case 'ADD_QUESTION':
      return updateHistory({
        ...state.present,
        questions: [
          ...state.present.questions,
          {
            id: String(state.present.questions.length + 1),
            type: 'multiple_choice',
            title: 'Question',
            options: ['Option 1'],
          },
        ],
      })
    case 'UPDATE_QUESTION_TITLE':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.map((q) =>
          q.id === action.payload.id
            ? { ...q, title: action.payload.title }
            : q,
        ),
      })
    case 'UPDATE_QUESTION_TYPE':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.map((q) => {
          if (q.id === action.payload.id) {
            if (action.payload.questionType === 'checkbox') {
              return {
                ...q,
                type: action.payload.questionType,
                options: ['Sim', 'Não'],
              }
            } else if (action.payload.questionType === 'short_answer') {
              return { ...q, type: action.payload.questionType, options: null }
            } else {
              return {
                ...q,
                type: action.payload.questionType,
                options: q.options || ['Opção 1'],
              }
            }
          }
          return q
        }),
      })
    case 'ADD_OPTION':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.map((q) => {
          if (
            q.id === action.payload &&
            q.type === 'multiple_choice' &&
            q.options
          ) {
            return {
              ...q,
              options: [...q.options, `Opção ${q.options.length + 1}`],
            }
          }
          return q
        }),
      })
    case 'UPDATE_OPTION':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.map((q) => {
          if (q.id === action.payload.id && q.options) {
            const newOptions = [...q.options]
            newOptions[action.payload.optionIndex] = action.payload.value
            return { ...q, options: newOptions }
          }
          return q
        }),
      })
    case 'CLONE_QUESTION':
      // eslint-disable-next-line no-case-declarations
      const questionToClone = state.present.questions.find(
        (q) => q.id === action.payload,
      )
      if (questionToClone) {
        const clonedQuestion = {
          ...questionToClone,
          id: String(state.present.questions.length + 1),
          title: `${questionToClone.title} (Cópia)`,
        }
        return updateHistory({
          ...state.present,
          questions: [...state.present.questions, clonedQuestion],
        })
      }
      return state
    case 'REMOVE_QUESTION':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.filter(
          (q) => q.id !== action.payload,
        ),
      })
    case 'REORDER_QUESTIONS':
      return updateHistory({
        ...state.present,
        questions: [...action.payload],
      })
    case 'UNDO':
      if (state.past.length === 0) return state
      // eslint-disable-next-line no-case-declarations
      const previous = state.past[state.past.length - 1]
      // eslint-disable-next-line no-case-declarations
      const newPast = state.past.slice(0, state.past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      }
    case 'REDO':
      if (state.future.length === 0) return state
      // eslint-disable-next-line no-case-declarations
      const next = state.future[0]
      // eslint-disable-next-line no-case-declarations
      const newFuture = state.future.slice(1)
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      }
    default:
      return state
  }
}

export default function Component() {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const items = Array.from(state.present.questions)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)

      dispatch({ type: 'REORDER_QUESTIONS', payload: items })
    },
    [state.present.questions],
  )

  const handleSendForm = async () => {
    console.log('Sending form:', state.present)
    // Simulating a delay for the API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Form sent successfully!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={state.past.length === 0}
            >
              <Undo2 className="w-5 h-5 text-gray-500" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={state.future.length === 0}
            >
              <Redo2 className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <Input
            value={state.present.title}
            onChange={(e) =>
              dispatch({ type: 'SET_TITLE', payload: e.target.value })
            }
            className="text-xl font-semibold text-center border-none shadow-none"
          />
          <Button
            onClick={handleSendForm}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Textarea
            value={state.present.description}
            onChange={(e) =>
              dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
            }
            placeholder="Form Description"
            className="w-full mb-4"
          />

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="questions">
              {(provided: DroppableProvided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {state.present.questions.map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-6 p-4 border rounded-lg relative bg-white"
                        >
                          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-2 items-center mb-4">
                            <Input
                              value={question.title}
                              onChange={(e) =>
                                dispatch({
                                  type: 'UPDATE_QUESTION_TITLE',
                                  payload: {
                                    id: question.id,
                                    title: e.target.value,
                                  },
                                })
                              }
                              className="text-lg font-semibold"
                            />
                            <Select
                              defaultValue={question.type}
                              onValueChange={(value) =>
                                dispatch({
                                  type: 'UPDATE_QUESTION_TYPE',
                                  payload: {
                                    id: question.id,
                                    questionType: value,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Question Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple_choice">
                                  Múltipla Escolha
                                </SelectItem>
                                <SelectItem value="short_answer">
                                  Texto
                                </SelectItem>
                                <SelectItem value="checkbox">
                                  Sim e Não
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: 'CLONE_QUESTION',
                                  payload: question.id,
                                })
                              }
                              size="icon"
                              variant="ghost"
                            >
                              <Copy className="w-5 h-5 text-gray-400" />
                            </Button>
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: 'REMOVE_QUESTION',
                                  payload: question.id,
                                })
                              }
                              size="icon"
                              variant="ghost"
                            >
                              <Trash2 className="w-5 h-5 text-gray-400" />
                            </Button>
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                            </div>
                          </div>

                          {question.type === 'multiple_choice' &&
                            question.options &&
                            question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center mb-2"
                              >
                                <div className="w-4 h-4 rounded-full border border-gray-300 mr-2"></div>
                                <Input
                                  value={option}
                                  onChange={(e) =>
                                    dispatch({
                                      type: 'UPDATE_OPTION',
                                      payload: {
                                        id: question.id,
                                        optionIndex,
                                        value: e.target.value,
                                      },
                                    })
                                  }
                                  className="flex-grow"
                                />
                              </div>
                            ))}

                          {question.type === 'short_answer' && (
                            <Textarea
                              placeholder="Short answer text"
                              className="w-full mt-2"
                            />
                          )}

                          {question.type === 'checkbox' && (
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="yes"
                                  id={`${question.id}-yes`}
                                />
                                <Label htmlFor={`${question.id}-yes`}>
                                  Sim
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="no"
                                  id={`${question.id}-no`}
                                />
                                <Label htmlFor={`${question.id}-no`}>Não</Label>
                              </div>
                            </RadioGroup>
                          )}

                          {question.type === 'multiple_choice' && (
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: 'ADD_OPTION',
                                  payload: question.id,
                                })
                              }
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="fixed right-8 bottom-8 bg-white rounded-full shadow-lg p-4">
          <Button
            onClick={() => dispatch({ type: 'ADD_QUESTION' })}
            size="icon"
            variant="ghost"
            className="rounded-full"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
