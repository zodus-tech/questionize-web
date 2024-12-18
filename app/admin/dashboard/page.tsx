import { Metadata } from 'next'
import DashboardPage from './components/wrapper'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Acesse o dashboard',
}

export default function Dashboard() {
  return <DashboardPage />
}
