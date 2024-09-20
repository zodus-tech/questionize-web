'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Dashboard from '@/components/dashboard'
import Questionnaires from '@/components/questionnaires'
import {
  responseData,
  completionRateData,
  satisfactionData,
  demographicData,
  forms,
} from '@/data/mock-data'
import { useRouter } from 'next/navigation'

export default function DashboardPageWrap() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [mountedTab, setMountedTab] = useState(activeTab)

  useEffect(() => {
    setMountedTab(activeTab)
  }, [activeTab])

  const totalResponses = responseData.reduce(
    (sum, item) => sum + item.responses,
    0,
  )
  const averageResponseRate = (totalResponses / 6).toFixed(2)

  const handleEditForm = (id: number) => router.push(`formulario/editar/${id}`)
  const handleViewForm = (id: number) => router.push(`formulario/ver/${id}`)
  const handleDeleteForm = (id: number) =>
    console.log(`Deleting form with id: ${id}`)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto mt-16 px-4 py-8">
        {mountedTab === 'dashboard' ? (
          <Dashboard
            totalResponses={totalResponses}
            averageResponseRate={averageResponseRate}
            formsLength={forms.length}
            responseData={responseData}
            completionRateData={completionRateData}
            satisfactionData={satisfactionData}
            demographicData={demographicData}
          />
        ) : (
          <Questionnaires
            forms={forms}
            handleEditForm={handleEditForm}
            handleViewForm={handleViewForm}
            handleDeleteForm={handleDeleteForm}
          />
        )}
      </main>
    </div>
  )
}
