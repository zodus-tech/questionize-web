import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { styleDefinition } from '@/utils/style-def'
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts'

interface CompletionRatePieChartProps {
  data: { name: string; value: number }[]
}

const CompletionRatePieChart: React.FC<CompletionRatePieChartProps> = ({
  data,
}) => {
  const localizedData = data.map((item) => ({
    ...item,
    name:
      item.name === 'Completed'
        ? 'Concluído'
        : item.name === 'Incomplete'
          ? 'Incompleto'
          : item.name,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Envio</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={localizedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill={styleDefinition.graphColor}
              dataKey="value"
            />
            <Tooltip
              formatter={(value: number) => `${value} itens`}
              labelFormatter={(label: string) => `Categoria: ${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CompletionRatePieChart
