import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { styleDefinition } from '@/utils/style-def'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface SurveyTrendChartProps {
  data: { name: string; responses: number }[]
}

const SurveyTrendChart: React.FC<SurveyTrendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência das Pesquisas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: '', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Respostas', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => `${value}`}
              labelFormatter={(label: string) => `${label}`}
            />
            <Legend formatter={(value) => `${value}`} />
            <Line
              type="monotone"
              dataKey="responses"
              stroke={styleDefinition.graphColor}
              activeDot={{ r: 8 }}
              name="Respostas"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default SurveyTrendChart
