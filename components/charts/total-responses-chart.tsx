import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TotalResponsesChartProps {
  totalResponses: number
}

const TotalResponsesChart: React.FC<TotalResponsesChartProps> = ({
  totalResponses,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total de Respostas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{totalResponses}</p>
        <p className="text-sm text-muted-foreground">Em todas as pesquisas</p>
      </CardContent>
    </Card>
  )
}

export default TotalResponsesChart
