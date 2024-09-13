'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  HelpCircle,
  PlusCircle,
  FileText,
  Edit,
  Trash2,
  Printer,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Mock data for charts
const responseData = [
  { name: 'Jan', responses: 400 },
  { name: 'Feb', responses: 300 },
  { name: 'Mar', responses: 500 },
  { name: 'Apr', responses: 280 },
  { name: 'May', responses: 590 },
  { name: 'Jun', responses: 800 },
]

const completionRateData = [
  { name: 'Completed', value: 75 },
  { name: 'Incomplete', value: 25 },
]

const satisfactionData = [
  { name: 'Very Satisfied', value: 30 },
  { name: 'Satisfied', value: 45 },
  { name: 'Neutral', value: 15 },
  { name: 'Dissatisfied', value: 8 },
  { name: 'Very Dissatisfied', value: 2 },
]

const demographicData = [
  { age: '18-24', male: 20, female: 25 },
  { age: '25-34', male: 30, female: 35 },
  { age: '35-44', male: 25, female: 30 },
  { age: '45-54', male: 15, female: 20 },
  { age: '55+', male: 10, female: 15 },
]

// Mock data for forms
const forms = [
  {
    id: 1,
    title: 'Avaliação da Secretaria',
    description:
      'Pesquisa de Satisfação para Avaliar o Atendimento da Secretaria',
  },
  {
    id: 2,
    title: 'Avaliação do Financeiro',
    description:
      'Pesquisa de Satisfação para Avaliar o Atendimento do Financeiro',
  },
]

export default function Component() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mountedTab, setMountedTab] = useState(activeTab)

  useEffect(() => {
    setMountedTab(activeTab)
  }, [activeTab])

  const totalResponses = responseData.reduce(
    (sum, item) => sum + item.responses,
    0,
  )
  const averageResponseRate = (totalResponses / 6).toFixed(2) // Assuming 6 months of data

  const handleEditForm = (id: number) => {
    console.log(`Editing form with id: ${id}`)
    // Implement edit functionality here
  }

  const handleDeleteForm = (id: number) => {
    console.log(`Deleting form with id: ${id}`)
    // Implement delete functionality here
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-100">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="space-x-4">
            <Link
              href="#"
              className={`text-lg font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-primary text-zinc-900' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Relatório
            </Link>
            <Link
              href="#"
              className={`text-lg font-semibold ${activeTab === 'questionarios' ? 'border-b-2 border-primary text-zinc-900' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('questionarios')}
            >
              Questionários
            </Link>
          </div>
          <Button variant="ghost" size="icon" aria-label="Help">
            <HelpCircle className="h-6 w-6" />
          </Button>
        </nav>
      </header>
      <main className="flex-grow container mx-auto mt-16 px-4 py-8 bg-zinc-100">
        {mountedTab === 'dashboard' ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total de Respostas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{totalResponses}</p>
                  <p className="text-sm text-muted-foreground">
                    Em todas as pesquisas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Média de Respostas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{averageResponseRate}</p>
                  <p className="text-sm text-muted-foreground">Mensal</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pesquisas Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{forms.length}</p>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tendência das Pesquisas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={responseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="responses"
                        stroke="#CD5362"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Envio</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={completionRateData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#CD5362"
                        dataKey="value"
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Satisfação</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={satisfactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#CD5362" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Repartição Demográfica</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={demographicData}>
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
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-zinc-900">
                Questionários
              </h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {forms.map((form) => (
                <Card
                  key={form.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between space-x-4">
                      <CardTitle className="flex-1 flex items-center">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                        <span className="truncate">{form.title}</span>
                      </CardTitle>
                      <div className="flex-shrink-0 flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditForm(form.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteForm(form.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      {form.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      {mountedTab === 'dashboard' && (
        <footer className="py-6 text-center relative">
          <Button className="fixed bottom-4 right-4 px-8 flex items-center space-x-2 bg-zinc-900 text-white">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </footer>
      )}
    </div>
  )
}
