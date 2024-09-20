// components/charts/demographic-area-chart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DemographicAreaChartProps {
  data: { age: string; male: number; female: number }[]
}

const DemographicAreaChart: React.FC<DemographicAreaChartProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repartição Demográfica</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="male"
              stackId="1"
              stroke="#C4081F"
              fill="#C4081F"
            />
            <Area
              type="monotone"
              dataKey="female"
              stackId="1"
              stroke="#CD5362"
              fill="#CD5362"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default DemographicAreaChart
