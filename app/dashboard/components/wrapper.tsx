'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import Dashboard from '@/components/dashboard'
import {
  responseData,
  completionRateData,
  satisfactionData,
  demographicData,
  forms,
} from '@/data/mock-data'
import Questionnaires from '@/components/questionnaires'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const totalResponses = responseData.reduce(
    (sum, item) => sum + item.responses,
    0,
  )
  const averageResponseRate = (totalResponses / 6).toFixed(2)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto mt-2 px-4 py-8">
        {activeTab === 'dashboard' ? (
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
          <Questionnaires questionnaires={forms} />
        )}
      </main>
    </div>
  )
}
