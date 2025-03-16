'use client'

import * as React from 'react'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  variant?: 'light' | 'dark'
  allowPastDates?: boolean
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
  variant = 'light',
  allowPastDates = false,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2 w-full', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={variant === 'dark' ? 'default' : 'outline'}
            className={cn(
              'w-full justify-start text-left font-normal gap-3',
              !date && 'text-muted-foreground',
              variant === 'dark' &&
                'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            <CalendarIcon
              className={variant === 'dark' ? 'text-primary-foreground' : ''}
            />
            {date?.from ? (
              date.to ? (
                <p className="font-medium">
                  {format(date.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                  {format(date.to, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              ) : (
                format(date.from, 'dd/MM/yyyy', { locale: ptBR })
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'w-auto p-0',
            variant === 'dark' && 'bg-card border-border',
          )}
          align="end"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newRange) => {
              if (newRange?.from) {
                const today = new Date()
                // Only correct dates if past dates are not allowed
                const correctedFrom =
                  !allowPastDates && newRange.from < today
                    ? today
                    : newRange.from

                setDate({
                  from: correctedFrom,
                  to: newRange.to ?? addDays(correctedFrom, 7),
                })
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
            disabled={!allowPastDates ? { before: new Date() } : undefined}
            className={variant === 'dark' ? 'bg-card text-card-foreground' : ''}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
