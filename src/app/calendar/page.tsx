import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EventCalendar } from '@/components/calendar/event-calendar';

export default function CalendarPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Financial Calendar</CardTitle>
        <CardDescription>
          Visualize your shifts, bills, and paydays all in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EventCalendar />
      </CardContent>
    </Card>
  );
}
