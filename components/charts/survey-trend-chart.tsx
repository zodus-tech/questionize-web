import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { styleDefinition } from '@/utils/style-def'

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface SurveyTrendChartProps {
  data: { name: string; responses: number; period?: string }[]
}

const SurveyTrendChart: React.FC<SurveyTrendChartProps> = ({ data }) => {
  // Prepare a more vibrant color scheme
  const barColor = styleDefinition.graphColor
  const lineColor = '#ff6b6b' // A contrasting color for the trend line

  // Calculate cumulative responses for trend line
  const dataWithCumulative = data.map((item, index, array) => {
    const cumulative = array
      .slice(0, index + 1)
      .reduce((sum, current) => sum + current.responses, 0)

    return {
      ...item,
      cumulative,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Respostas por Período</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={330}>
          <ComposedChart data={dataWithCumulative}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="name"
              label={{
                value: 'Período',
                position: 'insideBottomRight',
                offset: 0,
              }}
              tick={{ fontSize: 11 }}
              angle={-25}
              textAnchor="end"
              height={70}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Respostas',
                angle: -90,
                position: 'insideLeft',
                offset: -5,
              }}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Total Acumulado',
                angle: 90,
                position: 'insideRight',
                offset: 5,
              }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'Respostas') return [`${value}`, 'No período']
                if (name === 'Total') return [`${value}`, 'Acumulado']
                return [value, name]
              }}
              labelFormatter={(label: string) => `Período: ${label}`}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              yAxisId="left"
              dataKey="responses"
              name="Respostas"
              radius={[4, 4, 0, 0]}
            >
              {dataWithCumulative.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColor} />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              name="Total"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default SurveyTrendChart
