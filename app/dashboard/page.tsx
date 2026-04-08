import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, BookOpen, Star, Clock, ArrowRight, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Get user's sessions
  const { data: sessions, count: sessionCount } = await supabase
    .from('sessions')
    .select('*, tutor:profiles!sessions_tutor_id_fkey(*), student:profiles!sessions_student_id_fkey(*), skill:skills(*)', { count: 'exact' })
    .or(`tutor_id.eq.${user?.id},student_id.eq.${user?.id}`)
    .order('scheduled_at', { ascending: true })
    .limit(5)

  // Get upcoming sessions
  const upcomingSessions = sessions?.filter(
    (s) => new Date(s.scheduled_at) > new Date() && s.status !== 'cancelled'
  ) || []

  // Get user's skills count
  const { count: skillsCount } = await supabase
    .from('profile_skills')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user?.id)

  // Get reviews received
  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('reviewee_id', user?.id)

  // Get average rating
  const { data: avgRating } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewee_id', user?.id)

  const averageRating = avgRating?.length 
    ? (avgRating.reduce((acc, r) => acc + r.rating, 0) / avgRating.length).toFixed(1)
    : '0.0'

  const isTutor = profile?.role === 'tutor' || profile?.role === 'both'

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your learning journey.
          </p>
        </div>
        <div className="flex gap-3">
          {isTutor && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/skills">
                Manage Skills
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/skills">
              Find a Tutor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingSessions.length} upcoming
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              In your catalog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              From your sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled learning sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/skills">Book a Session</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map((session) => {
                  const isStudent = session.student_id === user?.id
                  const otherPerson = isStudent ? session.tutor : session.student
                  return (
                    <div key={session.id} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                      <div className="h-10 w-10 rounded-full bg-foreground flex items-center justify-center text-background font-semibold text-sm">
                        {otherPerson?.full_name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{session.skill?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          with {otherPerson?.full_name} ({isStudent ? 'Tutor' : 'Student'})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(session.scheduled_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {upcomingSessions.length > 3 && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/dashboard/sessions">
                      View all sessions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to help you get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link
                href="/skills"
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-foreground/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
                  <Users className="h-5 w-5 text-background" />
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:underline">Browse Tutors</p>
                  <p className="text-sm text-muted-foreground">Find skilled peers to learn from</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
              <Link
                href="/dashboard/skills"
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-foreground/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-background" />
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:underline">Manage Skills</p>
                  <p className="text-sm text-muted-foreground">Add skills you can teach or want to learn</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
              <Link
                href="/dashboard/sessions"
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-foreground/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-foreground flex items-center justify-center">
                  <Clock className="h-5 w-5 text-background" />
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:underline">Session History</p>
                  <p className="text-sm text-muted-foreground">Track your past and upcoming sessions</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
