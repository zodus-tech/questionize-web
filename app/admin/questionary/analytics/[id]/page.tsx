import { Metadata } from 'next'
import QuestionnaireAnalytics from './components/questionnare-analytics'

export const metadata: Metadata = {
  title: 'Análise',
  description: 'Analise os dados de formulários',
}

export default function Analytics({ params }: { params: { id: string } }) {
  return <QuestionnaireAnalytics params={params} />
}
