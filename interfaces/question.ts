import { Question, Questionary, QuestionType } from './questionary'

export interface Action {
  type:
    | 'SET_TITLE'
    | 'ADD_QUESTION'
    | 'UNDO'
    | 'REDO'
    | 'UPDATE_QUESTION_TITLE'
    | 'UPDATE_QUESTION_TYPE'
    | 'ADD_OPTION'
    | 'UPDATE_OPTION'
    | 'CLONE_QUESTION'
    | 'REMOVE_QUESTION'
    | 'REORDER_QUESTIONS'
    | 'SET_ANONYMOUS'
    | 'SET_ANSWERS_LIMIT'
    | 'SET_END_DATE'
    | 'SET_START_DATE'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export interface UpdateQuestionTitleAction extends Action {
  type: 'UPDATE_QUESTION_TITLE'
  payload: { id: number; title: string }
}

export interface UpdateQuestionTypeAction extends Action {
  type: 'UPDATE_QUESTION_TYPE'
  payload: { id: number; questionType: keyof typeof QuestionType }
}

export interface AddOptionAction extends Action {
  type: 'ADD_OPTION'
  payload: number
}

export interface UpdateOptionAction extends Action {
  type: 'UPDATE_OPTION'
  payload: { id: number; optionIndex: number; value: string }
}

export interface CloneQuestionAction extends Action {
  type: 'CLONE_QUESTION'
  payload: number
}

export interface RemoveQuestionAction extends Action {
  type: 'REMOVE_QUESTION'
  payload: number
}

export interface ReorderQuestionsAction extends Action {
  type: 'REORDER_QUESTIONS'
  payload: Question[]
}

export type FormAction =
  | Action
  | UpdateQuestionTitleAction
  | UpdateQuestionTypeAction
  | AddOptionAction
  | UpdateOptionAction
  | CloneQuestionAction
  | RemoveQuestionAction
  | ReorderQuestionsAction

export interface HistoryState {
  past: Questionary[]
  present: Questionary
  future: Questionary[]
}
