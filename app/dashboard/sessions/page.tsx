'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, Video, Star, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { Session, Profile, Skill } from '@/lib/types'
import { submitSessionReviewAction, updateSessionStatusAction } from './actions'

type SessionWithRelations = Session & {
  tutor: Profile
  student: Profile
  skill: Skill
}

const statusConfig = {
  pending: { label: 'Pending', icon: AlertCircle, className: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, className: 'bg-emerald-100 text-emerald-800' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'bg-foreground text-background' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'bg-red-100 text-red-800' },
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<SessionWithRelations | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewedSessionIds, setReviewedSessionIds] = useState<Set<string>>(new Set())

  const supabase = createClient()

  useEffect(() => {
    fetchSessions()
  }, [])

  async function fetchSessions() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setUserId(user.id)
      const { data } = await supabase
        .from('sessions')
        .select(`
          *,
          tutor:profiles!sessions_tutor_id_fkey(*),
          student:profiles!sessions_student_id_fkey(*),
          skill:skills(*)
        `)
        .or(`tutor_id.eq.${user.id},student_id.eq.${user.id}`)
        .order('scheduled_at', { ascending: false })

      setSessions(data || [])

      const { data: myReviews } = await supabase
        .from('reviews')
        .select('session_id')
        .eq('reviewer_id', user.id)

      setReviewedSessionIds(new Set((myReviews || []).map((r) => r.session_id)))
    }
    setLoading(false)
  }

  async function updateSessionStatus(sessionId: string, status: string) {
    if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
      toast.error('Invalid session status')
      return
    }

    const result = await updateSessionStatusAction(
      sessionId,
      status as 'confirmed' | 'completed' | 'cancelled'
    )

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(`Session ${status}!`)
      fetchSessions()
    }
  }

  async function submitReview() {
    if (!selectedSession || !userId) return
    
    setSubmittingReview(true)
    const result = await submitSessionReviewAction({
      sessionId: selectedSession.id,
      rating,
      comment,
    })

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Review submitted!')
      setReviewDialogOpen(false)
      setSelectedSession(null)
      setRating(5)
      setComment('')
    }
    setSubmittingReview(false)
  }

  const now = new Date()
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.scheduled_at) > now && s.status !== 'cancelled' && s.status !== 'completed'
  )
  const pastSessions = sessions.filter(
    (s) => new Date(s.scheduled_at) <= now || s.status === 'completed' || s.status === 'cancelled'
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
        <p className="text-muted-foreground mt-1">
          Manage your tutoring sessions and leave reviews
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <Clock className="h-4 w-4" />
            Past ({pastSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No upcoming sessions</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Book a session with a tutor to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                userId={userId!}
                onStatusChange={updateSessionStatus}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No past sessions</p>
              </CardContent>
            </Card>
          ) : (
            pastSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                userId={userId!}
                onStatusChange={updateSessionStatus}
                onLeaveReview={() => {
                  setSelectedSession(session)
                  setReviewDialogOpen(true)
                }}
                canLeaveReview={!reviewedSessionIds.has(session.id)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience from this session
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Set rating to ${star}`}
                    title={`Rate ${star} out of 5`}
                    onClick={() => setRating(star)}
                    className="p-1 transition-colors"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'fill-foreground text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about the session..."
                rows={4}
              />
            </div>
            <Button onClick={submitReview} className="w-full" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SessionCard({
  session,
  userId,
  onStatusChange,
  onLeaveReview,
  canLeaveReview,
}: {
  session: SessionWithRelations
  userId: string
  onStatusChange: (id: string, status: string) => void
  onLeaveReview?: () => void
  canLeaveReview?: boolean
}) {
  const isStudent = session.student_id === userId
  const otherPerson = isStudent ? session.tutor : session.student
  const status = statusConfig[session.status as keyof typeof statusConfig]
  const sessionDate = new Date(session.scheduled_at)
  const isPast = sessionDate <= new Date() || session.status === 'completed'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center text-background font-semibold">
              {otherPerson.full_name?.charAt(0) || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{session.skill.name}</h3>
                <Badge variant="secondary" className={status.className}>
                  <status.icon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                with {otherPerson.full_name} ({isStudent ? 'Tutor' : 'Student'})
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {sessionDate.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>{session.duration_minutes} min</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:flex-shrink-0">
            {session.status === 'pending' && !isStudent && (
              <>
                <Button
                  size="sm"
                  onClick={() => onStatusChange(session.id, 'confirmed')}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(session.id, 'cancelled')}
                >
                  Decline
                </Button>
              </>
            )}
            {session.status === 'confirmed' && (
              <>
                {session.meeting_link && (
                  <Button size="sm" asChild>
                    <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </a>
                  </Button>
                )}
                {!isStudent && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange(session.id, 'completed')}
                  >
                    Mark Complete
                  </Button>
                )}
              </>
            )}
            {isPast && session.status === 'completed' && canLeaveReview && onLeaveReview && (
              <Button size="sm" variant="outline" onClick={onLeaveReview}>
                <Star className="h-4 w-4 mr-2" />
                Leave Review
              </Button>
            )}
          </div>
        </div>
        {session.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{session.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
