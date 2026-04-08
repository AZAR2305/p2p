'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createSessionBooking } from '@/app/dashboard/sessions/actions'

interface BookSessionButtonProps {
  tutorId: string
  skillId: string
  tutorName: string
  skillName: string
  hourlyRate: number | null
}

const durations = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
]

export function BookSessionButton({
  tutorId,
  skillId,
  tutorName,
  skillName,
  hourlyRate,
}: BookSessionButtonProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('60')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function handleBook() {
    if (!date || !time) {
      toast.error('Please select a date and time')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('You must be logged in')
      setLoading(false)
      return
    }

    const scheduledAt = new Date(`${date}T${time}`)
    const durationMinutes = parseInt(duration, 10)

    const result = await createSessionBooking({
      tutorId,
      skillId,
      scheduledAtIso: scheduledAt.toISOString(),
      durationMinutes,
      notes,
    })

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Session request sent!')
      setOpen(false)
      setDate('')
      setTime('')
      setDuration('60')
      setNotes('')
      router.push('/dashboard/sessions')
    }

    setLoading(false)
  }

  const estimatedPrice = hourlyRate
    ? ((hourlyRate * parseInt(duration)) / 60).toFixed(2)
    : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Book Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            Schedule a {skillName} session with {tutorName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What would you like to focus on?"
              rows={3}
            />
          </div>
          {estimatedPrice && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated Price</span>
                <span className="text-lg font-semibold">${estimatedPrice}</span>
              </div>
            </div>
          )}
          <Button onClick={handleBook} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              'Send Booking Request'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
