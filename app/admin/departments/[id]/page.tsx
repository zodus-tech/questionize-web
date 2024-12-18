import DepartmentDetailsPage from './components/department-details-page'

export default function DepartmentsDetailsPageWrapper({
  params,
}: {
  params: { id: string }
}) {
  return <DepartmentDetailsPage params={params} />
}
