import { Metadata } from 'next'
import DepartmentsPage from './components/wrapper'

export const metadata: Metadata = {
  title: 'Setores',
  description: 'Acesse os setores disponíveis',
}

export default function Departments() {
  return <DepartmentsPage />
}
