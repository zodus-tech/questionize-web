import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AverageResponseRateChartProps {
  averageResponseRate: string
}

const AverageResponseRateChart: React.FC<AverageResponseRateChartProps> = ({
  averageResponseRate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Média de Respostas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{averageResponseRate}</p>
        <p className="text-sm text-muted-foreground">Mensal</p>
      </CardContent>
    </Card>
  )
}

export default AverageResponseRateChart
