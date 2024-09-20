import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ActiveSurveysChartProps {
  formsLength: number
}

const ActiveSurveysChart: React.FC<ActiveSurveysChartProps> = ({
  formsLength,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesquisas Ativas</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{formsLength}</p>
        <p className="text-sm text-muted-foreground">Ativas</p>
      </CardContent>
    </Card>
  )
}

export default ActiveSurveysChart
