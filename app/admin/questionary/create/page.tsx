/* eslint-disable no-case-declarations */
'use client'

import { useReducer, useState, useEffect } from 'react'
import { Undo2, Redo2, Send, Plus, InfoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Question, Questionary, QuestionType } from '@/interfaces/questionary'
import { FormAction, HistoryState } from '@/interfaces/question'
import Cookies from 'js-cookie'
import LoadingSpinner from '@/components/loadingSpinner'
import { useRouter } from 'next/navigation'
import { questionaryService } from '@/services/questionary-service'
import { ToastAction } from '@/components/ui/toast'
import { Member } from '@/interfaces/member'
import { MemberSelect } from './components/member-select'
import { BannerUpload } from './components/banner-upload'
import { DraggableQuestions } from './components/draggable-questions'
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from '@/components/ui/tooltip'
import { DatePickerWithRange } from '@/components/date-picker-with-range'
import { DateRange } from 'react-day-picker'
import { addDays } from 'date-fns'

const initialState: HistoryState = {
  past: [],
  present: {
    id: '',
    title: 'Questionário sem nome',
    options: {
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      answersLimit: 100,
      anonymous: true,
    },
    questions: [
      {
        id: '1',
        text: 'Questão',
        type: QuestionType.TEXT,
        statistics: {},
        options: [],
      },
    ],
  },
  future: [],
}

function formReducer(state: HistoryState, action: FormAction): HistoryState {
  const updateHistory = (newPresent: Questionary): HistoryState => ({
    past: [...state.past, state.present],
    present: newPresent,
    future: [],
  })

  switch (action.type) {
    case 'SET_TITLE':
      return updateHistory({ ...state.present, title: action.payload })
    case 'ADD_QUESTION':
      return updateHistory({
        ...state.present,
        questions: [
          ...state.present.questions,
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            id: String(state.present.questions.length + 1),
            text: 'Nova Questão',
            type: QuestionType.MULTIPLE_CHOICE,
            statistics: {},
            options: [],
          },
        ],
      })
    case 'UPDATE_QUESTION_TITLE':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.map((q) =>
          q.id === action.payload.id ? { ...q, text: action.payload.title } : q,
        ),
      })
    case 'UPDATE_QUESTION_TYPE':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.map((q) => {
          if (q.id === action.payload.id) {
            let updatedOptions: string[] | undefined
            const questionType = action.payload.questionType as QuestionType
            if (
              questionType === QuestionType.MULTIPLE_CHOICE ||
              questionType === QuestionType.ALTERNATIVE
            ) {
              updatedOptions = []
            } else if (questionType === QuestionType.RATING) {
              updatedOptions = [
                'VERY_DISSATISFIED',
                'DISSATISFIED',
                'NEUTRAL',
                'SATISFACTORY',
                'VERY_SATISFACTORY',
              ]
            } else {
              updatedOptions = undefined
            }

            return {
              ...q,
              type: questionType,
              statistics: {},
              options: updatedOptions,
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
            (q.type === QuestionType.MULTIPLE_CHOICE ||
              q.type === QuestionType.ALTERNATIVE)
          ) {
            return {
              ...q,
              options: [...(q.options || []), ''],
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
            return {
              ...q,
              options: q.options.map((opt, index) =>
                index === action.payload.optionIndex
                  ? action.payload.value
                  : opt,
              ),
            }
          }
          return q
        }),
      })
    case 'REMOVE_QUESTION':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.filter(
          (q) => q.id !== action.payload,
        ),
      })
    case 'CLONE_QUESTION':
      return updateHistory({
        ...state.present,
        questions: state.present.questions.reduce<Question[]>((acc, q) => {
          acc.push(q)
          if (q.id === action.payload) {
            const newQuestion: Question = {
              ...q,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              id: String(state.present.questions.length + 1),
              text: `Cópia de ${q.text}`,
              options: q.options ? [...q.options] : undefined,
            }
            acc.push(newQuestion)
          }
          return acc
        }, []),
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
      const newPast = state.past.slice(0, state.past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      }
    case 'REDO':
      if (state.future.length === 0) return state
      const next = state.future[0]
      const newFuture = state.future.slice(1)
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      }
    case 'SET_DEPARTMENT_ID':
      return updateHistory({
        ...state.present,
        id: action.payload,
      })
    default:
      return state
  }
}

const formatDate = (date: Date | undefined) => {
  if (!date) return null

  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)

  return localDate.toISOString().slice(0, -1)
}

export default function Component() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [state, dispatch] = useReducer(formReducer, initialState)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([])
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('')
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const router = useRouter()

  const handleCreateForm = async () => {
    setLoading(true)

    if (selectedMembers.length === 0) {
      toast({
        title: 'Atendentes Insuficientes',
        description: 'Selecione pelo menos um atendente para continuar.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const startDate = formatDate(dateRange?.from)
    const endDate = formatDate(dateRange?.to)

    if (!startDate || !endDate) {
      toast({
        title: 'Erro',
        description: 'Selecione um período válido para o questionário.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    // Log banner state before submission
    console.log(
      'Banner file before submission:',
      bannerFile
        ? {
            name: bannerFile.name,
            type: bannerFile.type,
            size: bannerFile.size,
            lastModified: new Date(bannerFile.lastModified).toISOString(),
          }
        : 'No banner file selected',
    )

    try {
      const token = Cookies.get('token')

      if (!token) {
        throw new Error('Token não encontrado')
      }

      // Log the questions before creating the request body to debug
      console.log(
        'Questions before submission:',
        JSON.stringify(state.present.questions),
      )

      const requestBody = {
        departmentId: state.present.id,
        title: state.present.title,
        createdAt: formatDate(new Date()),
        options: {
          startDate,
          endDate,
          answersLimit: state.present.options.answersLimit,
          anonymous: state.present.options.anonymous || true,
          membersIds: selectedMembers.map((member) => member.id),
        },
        questions: state.present.questions.map((q) => {
          // Ensure the question type is preserved as is
          return {
            id: q.id,
            text: q.text,
            // Explicitly cast the type to a string to ensure it's preserved correctly
            type: String(q.type),
            statistics: q.statistics || null,
            options: q.options || null,
          }
        }),
      }

      // Log the full request body
      console.log(
        'Creating questionnaire with data:',
        JSON.stringify(requestBody),
      )

      const success = await questionaryService.createQuestionnaire(requestBody)

      if (success) {
        // Handle banner upload if file exists
        if (bannerFile) {
          console.log(
            'Starting banner upload process for file:',
            bannerFile.name,
          )

          try {
            // Get the created questionnaire ID
            const questionnairesData =
              await questionaryService.getAllQuestionnaires(state.present.id)

            console.log('Retrieved questionnaires:', questionnairesData.length)

            const createdQuestionnaire = questionnairesData.find(
              (q: { id: string; title: string }) =>
                q.title === state.present.title,
            )

            if (createdQuestionnaire?.id) {
              console.log(
                'Found created questionnaire with ID:',
                createdQuestionnaire.id,
              )

              const bannerResult = await questionaryService.uploadBanner(
                bannerFile,
                createdQuestionnaire.id,
                token,
              )

              console.log('Banner upload result:', bannerResult)

              if (!bannerResult.success) {
                console.error('Error uploading banner:', bannerResult.error)
                toast({
                  title: 'Atenção',
                  description:
                    'Questionário criado, mas houve um erro ao fazer upload do banner: ' +
                    (bannerResult.error || 'Erro desconhecido'),
                  variant: 'destructive',
                })
              } else if (bannerResult.id) {
                // If we have a banner ID, update the questionnaire with it
                console.log(
                  'Banner uploaded successfully with ID:',
                  bannerResult.id,
                )

                // In a real implementation, we would update the questionnaire with the banner ID
                // This is a workaround for local development
                if (bannerResult.id.startsWith('banner-')) {
                  console.log('Using local banner storage for development')
                }
              }
            } else {
              console.error('Could not find the created questionnaire')
              toast({
                title: 'Atenção',
                description:
                  'Questionário criado, mas não foi possível encontrá-lo para anexar o banner.',
                variant: 'destructive',
              })
            }
          } catch (bannerError) {
            console.error('Error in banner upload process:', bannerError)
            toast({
              title: 'Atenção',
              description:
                'Questionário criado, mas houve um erro ao fazer upload do banner.',
              variant: 'destructive',
            })
          }
        } else {
          console.log('No banner file to upload')
        }

        toast({
          title: 'Success',
          description: 'Questionário criado com sucesso',
        })
        router.push('/admin/questionnaires')
      } else {
        toast({
          variant: 'destructive',
          title: 'Falha',
          description: `Não foi possível criar o questionário, tente novamente mais tarde`,
          action: (
            <ToastAction
              altText="Tentar novamente"
              onClick={() => {
                handleCreateForm()
              }}
            >
              Tentar novamente
            </ToastAction>
          ),
        })
      }
    } catch (error) {
      console.error('Ocorreu um erro inesperado ao criar o questionário', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado ao criar o questionário',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMembersChange = (members: Member[]) => {
    if (members.length > 0) {
      const departmentId = members[0].departmentId.toString()

      if (departmentId !== selectedDepartmentId) {
        const membersFromSameDepartment = members.filter(
          (member) => member.departmentId.toString() === departmentId,
        )
        setSelectedMembers(membersFromSameDepartment)
        setSelectedDepartmentId(departmentId)

        dispatch({
          type: 'SET_DEPARTMENT_ID',
          payload: departmentId,
        })
      } else {
        const validMembers = members.filter(
          (member) => member.departmentId.toString() === selectedDepartmentId,
        )
        setSelectedMembers(validMembers)

        if (validMembers.length === 0) {
          setSelectedDepartmentId('')
          dispatch({
            type: 'SET_DEPARTMENT_ID',
            payload: '',
          })
        }
      }
    } else {
      setSelectedMembers([])
      setSelectedDepartmentId('')
      dispatch({
        type: 'SET_DEPARTMENT_ID',
        payload: '',
      })
    }
  }

  useEffect(() => {
    if (selectedMembers.length > 0) {
      const departmentId = selectedMembers[0].departmentId.toString()
      if (departmentId !== state.present.id) {
        dispatch({
          type: 'SET_DEPARTMENT_ID',
          payload: departmentId,
        })
      }
    }
  }, [selectedMembers, state.present.id])

  return (
    <>
      <LoadingSpinner isLoading={loading} />
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow fixed w-screen z-20">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
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
              onClick={handleCreateForm}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-16 py-8">
          <div className="mt-10 w-full">
            <div className="flex flex-col md:flex-row gap-6 md:flex-nowrap w-full">
              <div className="flex-1 bg-white rounded-lg shadow-md px-6 pb-6 pt-5">
                <div className="w-full h-fit flex flex-start items-center gap-2 mb-3">
                  <h2 className="text-xl font-semibold">
                    Atendentes Avaliados
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="text-black/50 w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Escolha os atendentes a serem avaliados na hora de
                          preencher o questionário
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <MemberSelect
                  onMembersChange={handleMembersChange}
                  selectedDepartmentId={selectedDepartmentId}
                />
              </div>
              <div className="flex-1 bg-white rounded-lg shadow-md px-6 pb-6 pt-5">
                <div className="w-full h-fit flex flex-start items-center gap-2 mb-3">
                  <h2 className="text-xl font-semibold">
                    Validade do Questionário
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="text-black/50 w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Após o prazo de validade do questionário, ele não será
                          contabilizado no dashboard.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <DatePickerWithRange
                  date={dateRange}
                  setDate={setDateRange}
                  className="justify-self-end w-full"
                  allowPastDates={true}
                />
              </div>
            </div>

            <div className="mt-6 w-full bg-white rounded-lg shadow-md px-6 pb-6 pt-5">
              <div className="w-full h-fit flex flex-start items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold">
                  Banner do Questionário
                </h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="text-black/50 w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Adicione um banner personalizado para o seu
                        questionário. Será exibido no topo do formulário.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <BannerUpload onBannerChange={setBannerFile} />
            </div>
          </div>

          <DraggableQuestions
            questions={state.present.questions}
            onReorder={(questions) =>
              dispatch({ type: 'REORDER_QUESTIONS', payload: questions })
            }
            onUpdateQuestionTitle={(id, title) =>
              dispatch({
                type: 'UPDATE_QUESTION_TITLE',
                payload: { id, title },
              })
            }
            onUpdateQuestionType={(id, questionType) =>
              dispatch({
                type: 'UPDATE_QUESTION_TYPE',
                payload: { id, questionType },
              })
            }
            onCloneQuestion={(id) =>
              dispatch({ type: 'CLONE_QUESTION', payload: id })
            }
            onRemoveQuestion={(id) =>
              dispatch({ type: 'REMOVE_QUESTION', payload: id })
            }
            onAddOption={(id) => dispatch({ type: 'ADD_OPTION', payload: id })}
            onUpdateOption={(id, optionIndex, value) =>
              dispatch({
                type: 'UPDATE_OPTION',
                payload: { id, optionIndex, value },
              })
            }
          />

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
    </>
  )
}
