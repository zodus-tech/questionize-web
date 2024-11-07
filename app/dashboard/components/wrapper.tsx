'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import Dashboard from '@/components/dashboard'
import {
  responseData,
  completionRateData,
  satisfactionData,
  demographicData,
} from '@/data/mock-data'
import Questionnaires from '@/components/questionnaires'
import { Questionary } from '@/interfaces/questionary'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const totalResponses = responseData.reduce(
    (sum, item) => sum + item.responses,
    0,
  )
  const averageResponseRate = (totalResponses / 6).toFixed(2)

  const [questionnaires, setQuestionnaires] = useState<Questionary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setLoading(true)

      try {
        const token = Cookies.get('token')

        if (!token) {
          throw new Error('Token não encontrado.')
        }

        const response = await axios.get(`/questionary/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
          },
        })
        const { content } = response.data
        setQuestionnaires(content)
      } catch (error) {
        console.error('Ocorreu um erro ao encontrar os questionários.', error)
        setError('Ocorreu um erro ao encontrar os questionários.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionnaires()
  }, [])

  return (
    <div className="flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto mt-2 px-4 py-8 bg-red-800">
        {activeTab === 'dashboard' ? (
          <Dashboard
            totalResponses={totalResponses}
            averageResponseRate={averageResponseRate}
            formsLength={questionnaires.length}
            responseData={responseData}
            completionRateData={completionRateData}
            satisfactionData={satisfactionData}
            demographicData={demographicData}
          />
        ) : (
          <Questionnaires
            questionnaires={questionnaires}
            setQuestionnaires={setQuestionnaires}
          />
        )}
        {loading && <p>Carregando Dados...</p>}
        {error && (
          <div className="text-center py-8">
            <p className="text-xl font-semibold text-red-500">{error}</p>
          </div>
        )}
      </main>
    </div>
  )
}
