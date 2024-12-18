import { Metadata } from 'next'
import QuestionnairesPage from './components/wrapper'

export const metadata: Metadata = {
  title: 'Questionários',
  description: 'Acesse os questionários criados',
}

export default function Questionnaires() {
  return <QuestionnairesPage />
}
