import { Metadata } from 'next'
import DepartmentsPage from './components/wrapper'

export const metadata: Metadata = {
  title: 'Departamentos',
  description: 'Acesse os departamentos disponíveis',
}

export default function Departments() {
  return <DepartmentsPage />
}
