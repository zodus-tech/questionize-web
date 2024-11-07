import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
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

interface SatisfactionBarChartProps {
  data: { name: string; value: number }[]
}

export const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-1 border-black/20">
        <p>{`${payload[0].payload.name}`}</p>
        <p className="text-[#CD5362]">{`Votos: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const SatisfactionBarChart: React.FC<SatisfactionBarChartProps> = ({
  data,
}) => {
  const localizedData = data.map((item) => ({
    ...item,
    name:
      item.name === 'Very Satisfied'
        ? 'Muito Satisfeito'
        : item.name === 'Satisfied'
          ? 'Satisfeito'
          : item.name === 'Neutral'
            ? 'Neutro'
            : item.name === 'Dissatisfied'
              ? 'Insatisfeito'
              : item.name === 'Very Dissatisfied'
                ? 'Muito Insatisfeito'
                : item.name,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Satisfação</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={localizedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{
                value: '',
                position: 'insideBottom',
                offset: -5,
              }}
            />
            <YAxis
              label={{ value: 'Contagem', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={() => `Votos`} />
            <Bar dataKey="value" fill="#CD5362" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default SatisfactionBarChart
