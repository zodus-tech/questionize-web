// components/charts/demographic-area-chart.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { styleDefinition } from '@/utils/style-def'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent'

interface DemographicAreaChartProps {
  data: { age: string; male: number; female: number }[]
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-1 border-black/20">
        <p>{`${payload[0].payload.age}`}</p>
        <p
          className={`text-[${styleDefinition.graphColor}]`}
        >{`${payload[0].name === 'male' ? 'Homens' : 'Mulheres'}: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
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
            <XAxis
              dataKey="age"
              label={{ value: '', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{
                value: 'Quantidade',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (value === 'male' ? 'Homens' : 'Mulheres')}
            />
            <Area
              type="monotone"
              dataKey="male"
              name="Homens"
              stackId="1"
              stroke="#C4081F"
              fill="#C4081F"
            />
            <Area
              type="monotone"
              dataKey="female"
              name="Mulheres"
              stackId="1"
              stroke={styleDefinition.strokeColor}
              fill={styleDefinition.graphColor}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default DemographicAreaChart
