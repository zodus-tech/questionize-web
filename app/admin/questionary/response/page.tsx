'use client'
import QuestionaryResponsePage from './[id]/page'

export default function FormResponse({ params }: { params: { id: string } }) {
  return <QuestionaryResponsePage params={params} />
}
