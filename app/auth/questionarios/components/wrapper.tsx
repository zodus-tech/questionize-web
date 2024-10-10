'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import Questionnaires from '@/components/questionnaires'
import { forms } from '@/data/mock-data'
import { useRouter } from 'next/navigation'

export default function QuestionariosPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('questionarios')

  const handleEditForm = (id: number) => router.push(`formulario/editar/${id}`)
  const handleViewForm = (id: number) => router.push(`formulario/ver/${id}`)
  const handleDeleteForm = (id: number) =>
    console.log(`Deleting form with id: ${id}`)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto mt-16 px-4 py-8">
        <Questionnaires
          forms={forms}
          handleEditForm={handleEditForm}
          handleViewForm={handleViewForm}
          handleDeleteForm={handleDeleteForm}
        />
      </main>
    </div>
  )
}
