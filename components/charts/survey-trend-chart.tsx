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
  const barColor = styleDefinition.graphColor
  const lineColor = '#ff6b6b'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Respostas por Período</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={330}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={1} />
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
              label={{
                value: 'Respostas',
                angle: -90,
                position: 'insideLeft',
                offset: 1,
              }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'Respostas') {
                  return [`${value}`, 'Respostas']
                } else if (name === 'Tendência') {
                  return [`${value}`, 'Tendência']
                }
                return [value, name]
              }}
              labelFormatter={(label: string) => `Período: ${label}`}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend verticalAlign="bottom" height={36} />
            <Bar dataKey="responses" name="Respostas" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColor} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="responses"
              name="Tendência"
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
