'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { calendarEvents } from '@/lib/data';
import type { CalendarEvent } from '@/lib/types';
import { isSameDay, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '../ui/separator';

const eventTypeStyles = {
  payday: 'bg-green-500',
  bill: 'bg-red-500',
  shift: 'bg-blue-500',
};

const eventBadgeStyles: { [key: string]: string } = {
    payday: 'bg-green-100 text-green-800 border-green-200',
    bill: 'bg-red-100 text-red-800 border-red-200',
    shift: 'bg-blue-100 text-blue-800 border-blue-200',
}

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const selectedDayEvents = date
    ? calendarEvents.filter((event) => isSameDay(event.date, date))
    : [];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: ({ date, ...props }) => {
              const dayEvents = calendarEvents.filter((event) =>
                isSameDay(event.date, date)
              );
              return (
                <div className="relative">
                  {props.children}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
                      {dayEvents.slice(0, 3).map((event, index) => (
                        <div
                          key={index}
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            eventTypeStyles[event.type]
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </div>
      <div className="md:col-span-1">
        <h3 className="text-lg font-semibold font-headline mb-4">
          Events for {date ? format(date, 'MMMM d, yyyy') : '...'}
        </h3>
        <Separator className="mb-4" />
        <ScrollArea className="h-72">
          {selectedDayEvents.length > 0 ? (
            <div className="space-y-4 pr-4">
              {selectedDayEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{event.title}</p>
                  </div>
                  <Badge variant="outline" className={cn(eventBadgeStyles[event.type])}>{event.type}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground h-full flex items-center justify-center">
              No events for this day.
            </p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
