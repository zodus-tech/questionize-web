'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, PlusCircle, FileText, Edit, Trash2 } from 'lucide-react'
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
    title: 'Customer Satisfaction Survey',
    description: 'Annual survey to gather feedback from our customers',
  },
  {
    id: 2,
    title: 'Employee Engagement Form',
    description: 'Quarterly check-in on employee satisfaction and engagement',
  },
  {
    id: 3,
    title: 'Product Feedback',
    description:
      'Ongoing collection of user feedback on our latest product release',
  },
  {
    id: 4,
    title: 'Event Registration',
    description: 'Sign-up form for our upcoming conference',
  },
  {
    id: 5,
    title: 'Market Research Survey',
    description: 'Survey to understand market trends and consumer preferences',
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
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="space-x-4">
            <Link
              href="#"
              className={`text-lg font-semibold ${activeTab === 'dashboard' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </Link>
            <Link
              href="#"
              className={`text-lg font-semibold ${activeTab === 'questionarios' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
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
      <main className="flex-grow container mx-auto px-4 py-8">
        {mountedTab === 'dashboard' ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{totalResponses}</p>
                  <p className="text-sm text-muted-foreground">
                    Across all surveys
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Average Monthly Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{averageResponseRate}</p>
                  <p className="text-sm text-muted-foreground">Per month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Surveys</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{forms.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Currently running
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Response Trend</CardTitle>
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
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rate</CardTitle>
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
                        fill="#8884d8"
                        dataKey="value"
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Satisfaction Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={satisfactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Demographic Breakdown</CardTitle>
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
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                      <Area
                        type="monotone"
                        dataKey="female"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
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
              <h2 className="text-2xl font-bold">Your forms</h2>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create new form
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
        <footer className="py-6 text-center">
          <Button className="px-8">Imprimir</Button>
        </footer>
      )}
    </div>
  )
}
