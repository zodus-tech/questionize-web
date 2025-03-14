'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/date-picker-with-range'
import { DateRange } from 'react-day-picker'
import { Member } from '@/interfaces/member'
import { memberService } from '@/services/member-service'
import { MemberSelector } from '@/app/home/questionnaires/response/[id]/components/member-selector'

interface AnalyticsFiltersProps {
  departmentId: string
  onFiltersChange: (filters: {
    dateRange: DateRange | undefined
    memberId: string | undefined
  }) => void
}

export function AnalyticsFilters({
  departmentId,
  onFiltersChange,
}: AnalyticsFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedMember, setSelectedMember] = useState<Member>()
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { members } =
          await memberService.getDepartmentMembers(departmentId)
        setMembers(members)
      } catch (error) {
        console.error('Error fetching members:', error)
      }
    }

    if (departmentId) {
      fetchMembers()
    }
  }, [departmentId])

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange)
    onFiltersChange({ dateRange: newDateRange, memberId: selectedMember?.id })
  }

  const handleMemberChange = (member: Member) => {
    setSelectedMember(member)
    onFiltersChange({ dateRange, memberId: member.id })
  }

  const handleClearFilters = () => {
    setDateRange(undefined)
    setSelectedMember(undefined)
    onFiltersChange({ dateRange: undefined, memberId: undefined })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1">
          <DatePickerWithRange
            date={dateRange}
            setDate={(value) => {
              if (typeof value === 'function') {
                const newValue = value(dateRange)
                handleDateRangeChange(newValue)
              } else {
                handleDateRangeChange(value)
              }
            }}
          />
        </div>
        <div className="w-full md:w-[300px]">
          <MemberSelector
            members={members}
            onSelect={handleMemberChange}
            selectedMember={selectedMember}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="w-full md:w-auto"
        >
          Limpar filtros
        </Button>
      </div>
    </div>
  )
}
