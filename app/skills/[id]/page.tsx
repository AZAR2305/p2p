import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, Clock, DollarSign } from 'lucide-react'
import { BookSessionButton } from '@/components/book-session-button'

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Get skill details
  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('id', id)
    .single()

  if (!skill) {
    notFound()
  }

  // Get tutors for this skill
  const { data: tutors } = await supabase
    .from('profile_skills')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('skill_id', id)
    .eq('is_teaching', true)

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Get reviews for each tutor
  const tutorsWithRatings = await Promise.all(
    (tutors || []).map(async (t) => {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', t.profile.id)

      const avgRating = reviews?.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
        : 0

      return {
        ...t,
        averageRating: avgRating,
        reviewCount: reviews?.length || 0,
      }
    })
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">SkillBridge</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Link href="/skills" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to skills
        </Link>

        {/* Skill Header */}
        <div className="mb-12">
          <Badge variant="secondary" className="mb-4">{skill.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{skill.name}</h1>
          {skill.description && (
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl">
              {skill.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            {tutorsWithRatings.length} {tutorsWithRatings.length === 1 ? 'tutor' : 'tutors'} available
          </p>
        </div>

        {/* Tutors Grid */}
        {tutorsWithRatings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorsWithRatings.map((tutor) => (
              <Card key={tutor.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 rounded-full bg-foreground flex items-center justify-center text-background font-semibold text-xl flex-shrink-0">
                      {tutor.profile.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{tutor.profile.full_name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {tutor.reviewCount > 0 ? (
                          <>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-foreground text-foreground" />
                              <span className="text-sm font-medium">{tutor.averageRating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({tutor.reviewCount} {tutor.reviewCount === 1 ? 'review' : 'reviews'})
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">New tutor</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tutor.profile.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{tutor.profile.bio}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary" className="capitalize">
                      {tutor.proficiency_level}
                    </Badge>
                    {tutor.profile.hourly_rate && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {tutor.profile.hourly_rate}/hr
                      </span>
                    )}
                  </div>
                  {user && user.id !== tutor.profile.id ? (
                    <BookSessionButton
                      tutorId={tutor.profile.id}
                      skillId={skill.id}
                      tutorName={tutor.profile.full_name || 'Tutor'}
                      skillName={skill.name}
                      hourlyRate={tutor.profile.hourly_rate}
                    />
                  ) : !user ? (
                    <Button className="w-full" asChild>
                      <Link href="/auth/login">Sign in to Book</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No tutors available for this skill yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to offer tutoring!
            </p>
            <Button className="mt-4" asChild>
              <Link href="/auth/sign-up">Become a Tutor</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
